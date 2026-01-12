---
title: Secure Shell (SSH)
description: Configure, secure and use SSH across systems
tags:
aliases:
  - SSH
  - SSH Remoting
publish: true
---
# Encrypted Remoting with SSH

**SSH (Secure Shell)** is a *network protocol* that provides *encrypted* and *authenticated* remote access to systems over insecure networks. It’s used to log in, execute commands, transfer files, and manage remote machines safely.

Earlier tools like `telnet` and `rlogin` sent credentials in plaintext, making them easy targets for interception.

SSH was introduced in **1995** by **Tatu Ylönen**, a Finnish researcher, as a secure replacement. By **1999**, the **OpenBSD** team released **OpenSSH**, an open-source implementation emphasizing security and auditability.

Today, **OpenSSH** is the *standard SSH suite* on Linux, macOS, and most Unix systems. It supports secure shell access, file transfers (SCP/SFTP), and port forwarding. The project remains actively maintained and regularly updated for security and reliability.

## Fundamentals of SSH

### Core Characteristics

1. **Encryption** - SSH encrypts all communication between the client and server. This keeps credentials, commands, and file transfers private even when using insecure networks.
2. **Authentication** - Both sides verify identity. The server proves it is genuine, and the user authenticates using a password or a key pair. Public key authentication is the preferred and more secure method.
3. **Data Integrity** - Every message includes a verification code (HMAC) that ensures the data has not been altered. If any packet is modified, the session is terminated.
4. **Versatility** - SSH is not limited to remote shell access. It also supports secure file transfers (SCP and SFTP), remote command execution, and port forwarding.
5. **Open Standards** - SSH follows the open SSH-2 protocol. This ensures compatibility across implementations like OpenSSH, Dropbear, and Microsoft’s OpenSSH.


> [!WARNING] SSH2 is the standard
> SSH-2 is the current and secure version of the protocol.  SSH-1 is obsolete and should never be used in production.

### Client–Server Model

SSH works on a client–server model.

- **SSH Server (`sshd`)** listens for incoming connections on TCP port 22 (by default, can be changed). It authenticates users, negotiates encryption, and manages sessions.
- **SSH Client (`ssh`)** initiates the connection, verifies the server’s identity, and handles encryption and user authentication locally.

Once authentication succeeds, both sides exchange encrypted and integrity-checked messages for commands, shell access, or file transfers.

### SSH Connection Flow

A typical SSH session progresses through these stages:

1. **Connection Start** – The client connects to the server on the designated port (port 22 by default, can be changed if needed).
2. **Protocol Negotiation** – Both sides agree on supported encryption and compression algorithms.
3. **Key Exchange** – A shared secret is generated securely using methods such as Diffie-Hellman or Curve25519.
4. **Authentication** – The client proves identity using a password, key pair, or multi-factor method. The client also verifies the server’s host key.
5. **Secure Session Established** – All data exchanged from this point is encrypted and verified for integrity.
6. **Session Active** – Commands, file transfers, and tunnels run over this encrypted channel until either side closes the connection.

## Up and Running with SSH

### Connecting to a Remote System

SSH allows opening a secure shell on another machine or run remote commands directly. In its basic form, SSH can be done via the command `ssh user@hostname`, where

- **user** is the username of the user on the remote system to connect. 
- **hostname** is the IP address or domain of the target remote host.
- By default, SSH connects on port 22.

So, a standard SSH command in its basic form can be as follows

```sh
ssh root@192.168.1.10
```

Once authenticated, SSH opens to the interactive shell as the user that was connected as into the specific remote host. Some common flags used with the SSH command are listed below.

```sh
# -p to specify a different pot to connect on
ssh -p 2222 admin@192.168.1.10

# -i to use a specific identity/key file
ssh -i ~/.ssh/homelab-key admin@192.168.1.10

# -t to force a pesudo-TTY (for sudo or interactive commands)
ssh -t admin@192.168.1.10 "sudo systemctl restart nginx"

# -v -vv -vvv for varied levels of verbose logging
ssh -vv admin@192.168.1.10 
```

It is also possible to run remote commands without opening to an interactive shell.

```sh
# Executing single remote commands
ssh admin@192.168.1.10 "df -h"

# Chaining multiple remote commands
ssh admin@192.168.1.10 "cd /var/log && tail -n 20 syslog"
```

> [!INFO] What is the `-t` flag and what does it do?
> The `-t` option forces SSH to allocate a pseudo-terminal (PTY) on the remote host, making the session behave as if it’s connected to an actual terminal. This is required for interactive programs like `sudo`, `htop`, or `bash` that expect a TTY for password prompts, colored output, or cursor control. 
> 
> Without `-t`, SSH runs in non-interactive mode which is useful for automation or scripts, but unsuitable for commands needing user input or (actual) terminal behavior. It is also possible to chain multiple `-t` flags for nested SSH sessions like `ssh -t host1 ssh -t host2`. 

To close an active SSH connection, use one of the following methods

- Type `exit` or press `Ctrl + D` to close the SSH session normally.
- Press `~.` to force-terminate the SSH connection if the session becomes unresponsive.

- Use `~#` to list active port forwardings.


> [!INFO] What does `Ctrl + C` (SIGINT) do in an SSH session?
> Pressing `Ctrl + C` sends a SIGINT signal to the process running inside the SSH session, interrupting or stopping that specific command or program. It does **not** close the SSH session itself, and the session remains connected.

### SSH Authentication

SSH verifies both the client and the server before granting access.  The two main methods of authenticating into an SSH session are **password authentication** and **public key authentication**.

#### Password Authentication

This is the simplest way to connect to a remote server, but also the least secure.  To use it, run:

```sh
ssh username@192.168.1.10
```

SSH will prompt for the user’s password and, once verified, will open a shell session on the remote machine. This method is acceptable only for quick access on temporary systems or freshly provisioned servers. It should never be used for internet-facing, long-term, or production setups.

> [!WARNING] Why is SSH password authentication discouraged?  
> The issue isn’t plain text transmission. SSH encrypts passwords. The real problem is that anyone who knows or guesses the password gets full access. Passwords are far easier to steal, brute-force, or reuse than cryptographic keys.

> [!EXAMPLE] How to disable SSH password authentication  
> On the SSH server, set the following in `/etc/ssh/sshd_config`:
> 
> `PasswordAuthentication no`
> 
> This forces key-based authentication, which is significantly safer.

#### Public Key Authentication

This is the preferred and most secure SSH authentication method. It replaces passwords with a **cryptographic key pair** where a private key is stored securely on the local machine, and a public key is stored on the remote server to be connected. Since the private key never leaves the local system, attackers cannot gain access unless they obtain that file. It also blocks brute-force attempts, as keys are far harder to guess than passwords. Public key authentication is also ideal for automation, CI pipelines, and long-term server access.

Setting up SSH key-pair generally involves 3 steps

1. **Generate a key pair** - Use `ssh-keygen`, which comes bundled with OpenSSH.    
2. **Copy the public key to the remote server** - Add the contents of the `.pub` file to the remote `~/.ssh/authorized_keys` file either by using `ssh-copy-id` (POSIX systems) or manually copying the public key through SSH, SFTP, or the editor.
3. **Connect using the private key** - Use the `-i` flag to specify the private key when connecting such as `ssh -i ~/.ssh/remote-key admin@192.168.1.10`

> [!IMPORTANT] **Permissions Matter**  
> SSH is strict about file and directory permissions. Ensure these recommended permissions:
> 
> - `~/.ssh/` directory: `700`
> - `authorized_keys`: `600`
> - Private keys (`id_rsa`, `id_ed25519`, etc.): `600`  
>   
> Incorrect permissions may cause SSH to refuse to connect via key-based authentication.

#### Multi-Factor Authentication

**Multi-Factor Authentication** or **(MFA)** adds an additional layer of security on top of SSH’s existing login methods. Instead of relying only on a password or a private key, MFA requires the user to verify identity through an extra factor such as a one-time password, hardware token, or push-based approval. This makes unauthorized access significantly harder, even if an attacker somehow obtains a password or private key.

MFA is especially valuable for internet-facing servers, production environments, and high-security workloads, where the threat of credential theft or phishing is high.

SSH MFA works by typically combining **two factors**:

- **Something you have** - Such as private key, hardware token, authenticator app
- **Something you know** - Such as a password or OTP code

A common setup is when a user authenticates with SSH public key, the server prompts for a time-based one-time password (TOTP) generated by Google Authenticator, Authy, or other similar services. Only when both succeed does SSH grant access.

> [!INFO] Popular MFA Methods for SSH  
> Here are the most commonly used approaches:
> 
> - **TOTP (Time-based One-Time Passwords)** - Uses apps like Google Authenticator, Authy, Microsoft Authenticator. Server verifies a 6-digit code that changes every 30 seconds.
> - **U2F / FIDO2 Security Keys (YubiKey, SoloKey)** - Hardware keys that require a physical touch. Extremely strong protection.
> - **Duo Push / Okta Verify** - Push-based notifications. Useful for enterprise deployments.
> - **Key + Password Combination** - Server forces the user to supply _both_ a password and a key.  Not as strong as hardware or TOTP, but still far better than password-only access.

### SSH Key Management

The basic syntax for the `ssh-keygen` command is as follows.

```shell
# ssh-keygen command syntax
ssh-keygen -t <algorithm> -b <bits> -C "Comment" -f ~/.ssh/name_of_key -N <passphrase>

# -t & -b flags set they type of algorithm and encryption bits
# -C flag is used to supply a comment
# -f flag is used to supply the file path of the key to be generated
# -N flag is used to pass the [optional] passphrase 
```

Following code snippet showcases the commonly used encryption algorithms and commands used to generate a key-pair.

```bash
# RSA
ssh-keygen -t rsa -b 2048 -C "Comment on Key" -f "~/.ssh/name_of_key"

# DSA (NOT RECOMMENDED)
ssh-keygen -t dsa -b 2048 -C "Comment on Key" -f "~/.ssh/name_of_key"

# ECDSA
ssh-keygen -t ecdsa -b 256 -C "Comment on Key" -f "~/.ssh/name_of_key"

# ED25519
ssh-keygen -t ed25519 -C "Comment on Key" -f "~/.ssh/name_of_key"
```

> [!NOTE] Various SSH Key Types
> SSH keys are created using `ssh-keygen`, with several algorithms available. These are the most common:
> 
> 1. **RSA** *(Rivest-Shamir-Adleman)* - Widely supported, strong security when using 2048 bits or higher. Still common.
> 2. **DSA** *(Digital Signature Algorithm)* - Older and deprecated in many systems (NOT RECOMMENDED).
> 3. **ECDSA** *(Elliptic Curve Digital Signature Algorithm)* - Faster and smaller keys using elliptic curves. Supported in modern systems.
> 4. **Ed25519** - Modern, highly secure, fast, and uses small key sizes. Preferred for new setups.

#### Managing multiple SSH keys

When working with more than one remote machine, it is common to accumulate several SSH key pairs. Choosing whether to use a single key or multiple keys depends entirely on the trust boundaries and environments involved.

- **Using a Single Key**
	- A single key is suitable only when all connected systems share the same level of trust. 
	- A single key keeps personal environments simple and reduces maintenance overhead.
	- This applies when
		- All servers are personally owned (personal machines, homelab nodes, local VMs).
		- There is no shared responsibility with a team.
		- The systems do not belong to different organisations or security domains.
		- The environment is uniform and controlled by the same person.
- **Using Multiple Keys**
	- Separate keys are recommended whenever systems differ in ownership, purpose, or sensitivity.  
	- Using different keys creates proper separation between environments and prevents a compromise in one place from affecting others.
	- This becomes necessary in cases such as
		- Accessing company servers or internal corporate infrastructure.
		- Working with customer environments or third-party systems.
		- Contributing to open-source infrastructure or community systems.
		- Handling production, staging, and development as separate environments.
		- Managing systems with higher security requirements.
		- Migrating to a new laptop or workstation and keeping each device isolated.

#### Naming conventions for keys

Clear naming helps avoid confusion and keeps `~/.ssh/` directory organised. Keys can be named as per scope of usage such as `id_personal` or `id_work` or `id_prod`. Each key should also have a matching comment for easy identification such as `ssh-keygen -t ed25519 -C "patppuccin:work"` where the key can be easily identified for its use and scope.

#### Managing keys with a config file

With such many SSH keys, SSH allows the use of `~/.ssh/config` file to enable clean separation of environments without manual `-i` flags prompted at every SSH connection. An example config file is as follows

```txt
Host work-prod
	HostName 10.0.5.12
	User deploy
	IdentityFile ~/.ssh/id_work
	
Host personal-vps
	HostName 203.0.113.10
	User patppuccin
	IdentityFile ~/.ssh/id_personal
```

This ensures the correct key is selected automatically.  A deep into SSH client config is [explained here](index.md##Managing%2520keys%2520with%2520a%2520config%2520file).

#### Using SSH Agent for Passphrase Management

The `ssh-agent` is a user-level process that stores decrypted SSH keys in memory for the duration of a session. This avoids repeated passphrase prompts while keeping private keys secure.

On Linux desktop environments and macOS, the agent usually starts automatically.  In terminal-only environments, it can be manually started as

```sh
eval "$(ssh-agent -s)"

# common flags
# -s prints the shell compatible vars
# -t sets a lifetime for the agent
```

On Windows, the `ssh-agent` is a system-level service. Follow the instructions below to ensure it is up and running to receive and manage identities.

```powershell
Set-Service -Name ssh-agent -StartupType Automatic
Start-Service ssh-agent
Get-Service ssh-agent
```

The following response is expected:

```txt
Status   Name        DisplayName
------   ----        -----------
Running  ssh-agent   OpenSSH Authentication Agent
```

For unix-based systems, `ssh-agent` can be started on a timed mode using the `-t` option. For Windows, it is not possible as the ssh-agent runs as a system service. However, once the terminal session is closed, the credentials are flushed or some workarounds can be followed.

```sh
# For UNIX systems
ssh-agent -t 3600 # runs for 1 hour
ssh-agent -t 86400 # runs for 1 day

# For Windows

# Close active session & open another one
Start-Job { ssh-add ~\.ssh\id_homelab; Start-Sleep -Seconds 3600; ssh-add -d ~\.ssh\id_homelab }

```


Managing identities with the `ssh-agent`

```sh
ssh-add ~/.ssh/id_homelab    # add a key
ssh-add -l                   # list loaded keys
ssh-add -d ~/.ssh/id_homelab # remove one key
ssh-add -D                   # remove all keys
```

For scripts, CI pipelines, or cron jobs, it is better to use temporary keys with no passphrase, or load keys in a controlled agent session with a defined lifetime using the `-t` flag. 

#### Key Management Best Practices

- **Using SSH Keys**
	- Keep private keys out of repositories, containers and shared folders.
	- Rotate keys periodically and revoke access cleanly when needed.
- **Using multiple SSH keys**
	- Separate personal, work, production and customer environments.
	- Maintain clear naming and comments for quick identification.
	- Use `~/.ssh/config` file to correlate the SSH keys to remote targets easily.
	- Use separate (and unique) keys for each automation & CI environments.
- **Using `ssh-agent`**
	- Avoid loading every key into the agent at once.
	- Securely store the passphrases for critical keys pairs.
	- Use different sessions (or `tmux` panes) for different environments to avoid mix-ups.
	- Load the passphrases for the keys only as long as the keys are needed. Once used, remove the key from the agent.
	- For CI environments, use keys without passphrases or start an agent on a timed environment (Example: `ssh-agent -t 3600` for 1 hour of ssh-agent being active)

## Resources

1. Website - [OpenSSH Website](https://www.openssh.com/)
2. GitHub Account - [OpenSSH on GitHub](https://github.com/openssh)
3. Reddit SSH Community - [r/ssh](https://www.reddit.com/r/ssh/)