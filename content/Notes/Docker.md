---
title: Docker
description:
tags:
aliases:
publish: true
---
**Docker** is a platform for developing, shipping, and running applications inside _containers_. Containers package an application with its dependencies, configuration, and runtime environment into a single, portable unit that runs consistently across development, staging, and production.

Before containers, deploying software meant managing dependency conflicts, inconsistent environments, and the classic "*it works on my machine*" problem. Docker changed this by making applications self-contained and environment-agnostic.

Docker was released in **2013** by the company **dotCloud** (later renamed to Docker, Inc.). It built on existing Linux kernel features such as `namespaces`, `cgroups`, and `union filesystems`, but made them accessible through a simple CLI and image format. By 2015, Docker helped establish the **Open Container Initiative (OCI)**, which standardized container image and runtime specifications across the industry.

Today, Docker is foundational to modern Cloud Native practices:

- **Development parity** - The same container runs identically on a developer laptop and in production.
- **CI/CD pipelines** - Containers provide consistent, reproducible build and test environments.
- **Microservices** - Containers enable deploying and scaling services independently.
- **Infrastructure as Code** - `Dockerfiles` define application environments declaratively.

Docker was the pioneer in making the process of building and running computers, but it is not the only way:

- **Podman** - A daemonless, rootless container engine developed by *Red Hat*. Its CLI is compatible with Docker as `podman` commands (mostly) mirror `docker` commands. It is usually shipped by default on RHEL, CentOS Stream, and Fedora (Red Hat based Distros). Podman emphasizes security through rootless operation and `systemd` integration.
- **containerd** - The container runtime extracted from Docker, now a standalone CNCF project. It is used directly by Kubernetes and other orchestration platforms.
- **nerdctl** - A Docker-compatible CLI for containerd, useful when working with containerd directly.
- **Buildah** - A daemonless image builder, often paired with Podman. Supports building OCI images without requiring root privileges.


> [!Info] Docker and Friends
> This document primarily focuses on Docker because it remains the industry standard for local development, CI/CD, and learning containers. The concepts transfer directly to alternatives such as Podman with the same Dockerfiles, the same image format, largely the same commands. For most commands, `alias docker=podman` works seamlessly.

## Fundamentals

 Docker, Container Runtimes, and Orchestration

The container ecosystem has multiple layers, and terminology often blurs between them:

- **Docker** is a platform that includes a CLI, daemon, image builder, and container runtime. It is the most common way developers interact with containers.
- **Container runtime** refers to the low-level component that actually runs containers. Docker uses _containerd_ and _runc_ under the hood. Other runtimes include CRI-O and Kata Containers.
- **Container orchestration** manages containers at scale across multiple hosts. Kubernetes, Amazon ECS, and HashiCorp Nomad are orchestration platforms. Docker Swarm is Docker's native orchestration mode.

Docker remains the standard for building images and running containers in development and CI/CD. Orchestration platforms often use different runtimes directly (Kubernetes typically uses containerd or CRI-O), but the OCI standards ensure images built with Docker run anywhere.

### Docker Architecture

Docker uses a client-server architecture with several components working together.

```
┌─────────────────────────────────────────────────────────────┐
│                        Docker Host                          │
│  ┌───────────┐         ┌──────────────────────────────────┐ │
│  │  Docker   │  REST   │         Docker Daemon            │ │
│  │  Client   │───API──▶│           (dockerd)              │ │
│  │           │         │                                  │ │
│  │  docker   │         │  ┌────────────┐  ┌────────────┐  │ │
│  │  build    │         │  │ containerd │  │   Images   │  │ │
│  │  run      │         │  │            │  │            │  │ │
│  │  pull     │         │  │  ┌──────┐  │  │  ┌──────┐  │  │ │
│  │  ...      │         │  │  │ runc │  │  │  │ runc │  │  │ │
│  │           │         │  │  └──┬───┘  │  │  └──┬───┘  │  │ │
│  └───────────┘         │  └─────┼──────┘  └─────┼──────┘  │ │
│                        │        │               │         │ │
│                        │  ┌─────▼───┐     ┌─────▼───┐     │ │
│                        │  │Container│     │Container│     │ │
│                        │  └─────────┘     └─────────┘     │ │
│                        └──────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

**Docker Client (`docker`)** is the command-line interface. It sends commands to the Docker daemon via REST API. The client can connect to local or remote daemons.

**Docker Daemon (`dockerd`)** is the persistent background service that manages Docker objects (images, containers, networks, volumes). It listens for API requests and handles:

- Building images
- Pulling and pushing images to registries
- Creating and managing containers
- Managing networks and volumes

**containerd** is the container runtime that manages the complete container lifecycle — image transfer, storage, container execution, supervision, and networking. Docker delegated these responsibilities to containerd, which is now a standalone CNCF project.

**runc** is the low-level container runtime that actually creates and runs containers. It implements the OCI runtime specification. When a container starts, runc sets up namespaces, cgroups, and the root filesystem, then executes the container process.

#### How `docker run` Works

When you execute `docker run nginx`:

1. **Client** parses the command and sends a request to the daemon
2. **Daemon** checks if the `nginx` image exists locally
3. If not, daemon **pulls** the image from the registry (Docker Hub by default)
4. Daemon instructs **containerd** to create a container
5. containerd prepares the container's filesystem (root filesystem from image layers plus writable layer)
6. containerd calls **runc** to create and start the container process
7. runc sets up namespaces, cgroups, and executes the entrypoint
8. Container process runs, containerd monitors it
9. Daemon returns container ID to client

This layered architecture allows components to be swapped (different runtimes) and is why Docker images work across different container platforms.

> [!NOTE] Podman Architecture 
> Podman eliminates the daemon. Each `podman` command directly invokes the container runtime. This improves security (no privileged daemon) and enables rootless containers by default. The tradeoff is no persistent background service — containers are managed directly or through systemd integration.

### Images

An **image** is a read-only template containing everything needed to run an application: code, runtime, libraries, environment variables, and configuration files.

Images are built from **layers**. Each instruction in a Dockerfile creates a new layer. Layers are stacked, with each layer containing only the differences from the layer below.

```
┌─────────────────────────────┐
│  Layer 4: COPY app.py       │  ← Application code
├─────────────────────────────┤
│  Layer 3: RUN pip install   │  ← Python dependencies
├─────────────────────────────┤
│  Layer 2: RUN apt update    │  ← System packages
├─────────────────────────────┤
│  Layer 1: Ubuntu base       │  ← Base operating system
└─────────────────────────────┘
```

Layers are **immutable** and **shared**. If ten images use the same Ubuntu base layer, that layer is stored once on disk. Shared layers make image distribution efficient — pulling an image only downloads layers not already present locally.

**Copy-on-write** allows containers to share image layers. When a container modifies a file from an image layer, the file is copied to the container's writable layer before modification. The original layer remains unchanged.

#### Image Identifiers

Images are referenced in three ways:

**Image ID** — A content-addressable SHA256 hash of the image's configuration. Immutable and unique. Example: `sha256:a8780b506fa4...`

**Tag** — A human-readable label pointing to an image ID. Mutable — the same tag can point to different image IDs over time. Example: `nginx:1.25.3`

**Digest** — A content-addressable hash of the image manifest. Immutable and verifiable. Example: `nginx@sha256:a8780b506fa4...`

Tags are convenient but not reliable for reproducibility. A `nginx:latest` pull today might differ from one yesterday. For production, use digests or specific version tags and verify digests.

#### Base Images and Scratch

Every image either:

- Builds **FROM** another image (a parent/base image), or
- Builds **FROM scratch** (an empty image with no filesystem)

Common base images:

|Image|Size|Use Case|
|---|---|---|
|`ubuntu`, `debian`|~75-125MB|Full tooling, debugging, familiar environment|
|`alpine`|~5-7MB|Minimal size, musl libc (compatibility caveats)|
|`distroless`|~2-20MB|Minimal runtime, no shell, reduced attack surface|
|`scratch`|0MB|Static binaries only, smallest possible image|

Base image selection affects image size, security surface, and debugging capability. This is covered in detail in the Production section.

#### OCI Image Specification

The **Open Container Initiative (OCI)** image specification defines a standard format for container images. Docker images are OCI-compliant, meaning they work with any OCI-compatible runtime (containerd, Podman, CRI-O).

OCI standardization ensures:

- Images built with Docker run with Podman
- Images pushed to Docker Hub can be pulled by Kubernetes
- Tooling interoperates across the ecosystem

### Containers

A **container** is a running instance of an image. The image provides the filesystem template; the container is the live process.

When a container starts, Docker:

1. Creates a writable **container layer** on top of the image layers
2. Sets up namespaces and cgroups for isolation
3. Configures networking (assigns IP, sets up bridge)
4. Executes the container's entrypoint/command

Multiple containers can run from the same image simultaneously. Each has its own writable layer, network identity, and process space.

#### Container Lifecycle

Containers transition through states:

```
          create         start
(none) ──────────▶ Created ────────▶ Running
                               pause │ │ stop
                            ┌────────┘ │
                            ▼          ▼
                         Paused    Stopped (Exited)
                            │          │
                            │  unpause │ start
                            └────┬─────┘
                                 ▼
                              Running
                                 │ die/kill
                                 ▼
                               Dead ────▶ (removed)
```

- **Created** — Container exists but has not started
- **Running** — Container process is executing
- **Paused** — Process frozen (SIGSTOP), resources retained
- **Stopped/Exited** — Process terminated, filesystem and metadata retained
- **Dead** — Container in error state (removal failed)

A stopped container retains its writable layer. Logs, filesystem changes, and metadata persist until the container is removed. This is useful for debugging but consumes disk space.

#### Ephemeral by Default

Container filesystems are **ephemeral**. When a container is removed, its writable layer is deleted. Any data written inside the container disappears.

This is intentional:

- Containers should be stateless and replaceable
- Data that must persist belongs in volumes
- Treating containers as disposable enables scaling, updates, and recovery

Applications must be designed with this in mind. Configuration comes from environment variables or mounted files. State lives in volumes, databases, or external services.

### Registries

A **registry** is a storage and distribution service for container images. Registries host images and serve them to Docker clients via HTTP.

**Docker Hub** is the default public registry. It hosts official images (maintained by Docker or software vendors) and community images. Docker Hub has rate limits for unauthenticated and free-tier pulls.

**Private registries** store proprietary images:

| Registry                                      | Provider          |
| --------------------------------------------- | ----------------- |
| Amazon ECR                                    | AWS               |
| Google Container Registry / Artifact Registry | GCP               |
| Azure Container Registry                      | Azure             |
| Harbor                                        | Self-hosted, CNCF |
| GitLab Container Registry                     | GitLab            |
| GitHub Container Registry                     | GitHub            |

#### Image Naming

Full image names follow this structure:

```
[registry/][namespace/]repository[:tag][@digest]

Examples:
  nginx                              → docker.io/library/nginx:latest
  nginx:1.25.3                       → docker.io/library/nginx:1.25.3
  mycompany/app:v2                   → docker.io/mycompany/app:v2
  gcr.io/my-project/app:latest       → gcr.io/my-project/app:latest
  ghcr.io/owner/repo:sha-abc123      → ghcr.io/owner/repo:sha-abc123
```

When no registry is specified, Docker defaults to `docker.io` (Docker Hub). When no tag is specified, Docker defaults to `latest`.

### Volumes and Storage

Containers need persistent storage for data that must survive container removal. Docker provides three storage options:

#### Volumes

**Volumes** are Docker-managed storage, the preferred mechanism for persistent data.

- Stored in Docker's storage directory (`/var/lib/docker/volumes/` on Linux)
- Managed entirely by Docker (create, remove, backup)
- Can be named or anonymous
- Work on both Linux and Windows
- Can be shared between containers
- Support volume drivers for remote/cloud storage

Use volumes for databases, application data, and any state that must persist.

#### Bind Mounts

**Bind mounts** map a host directory directly into a container.

- Depend on host filesystem structure
- Full path must exist on host
- Container can modify host files (subject to permissions)
- Performance depends on host filesystem

Use bind mounts for development (mounting source code), configuration files, and when specific host paths must be accessed.

#### tmpfs Mounts

**tmpfs mounts** store data in host memory only.

- Never written to disk
- Lost when container stops
- Fast but limited by available memory

Use tmpfs for sensitive data (secrets, credentials) that should not persist or touch disk, and for scratch space where persistence is unnecessary.

#### Comparison

|Aspect|Volumes|Bind Mounts|tmpfs|
|---|---|---|---|
|Managed by|Docker|User|Docker|
|Location|Docker storage area|Anywhere on host|Memory|
|Persists|Yes|Yes (on host)|No|
|Shareable|Yes|Yes|No|
|Performance|Good|Depends on host|Fastest|
|Use case|Databases, app data|Development, config|Secrets, scratch|

### Networking Concepts

Docker creates and manages networks for container communication.

#### Default Bridge Network

When Docker starts, it creates a default **bridge** network. Containers attached to this network:

- Get an IP address from a private subnet
- Can reach each other by IP (not name, on the default bridge)
- Can reach the external network through NAT
- Are isolated from the host network

The default bridge has limitations — containers cannot resolve each other by name, only by IP. Custom bridge networks enable DNS-based service discovery.

#### Network Drivers

Docker supports multiple network drivers:

|Driver|Description|Use Case|
|---|---|---|
|`bridge`|Isolated network on single host|Default, most containers|
|`host`|No isolation, shares host network|Maximum performance, port conflicts|
|`none`|No networking|Completely isolated containers|
|`overlay`|Multi-host networking|Swarm services, cross-host communication|
|`macvlan`|Assigns MAC address, appears as physical device|Legacy applications needing L2 access|

For single-host deployments, custom bridge networks are the standard choice.

#### Port Mapping

Containers have their own network namespace. To make a container service accessible from outside, ports must be published (mapped) from container to host.

```
Host                          Container
┌────────────────┐           ┌────────────────┐
│                │           │                │
│   Port 8080  ◀─┼───────────┼─▶  Port 80     │
│                │           │    (nginx)     │
└────────────────┘           └────────────────┘

docker run -p 8080:80 nginx
```

The `-p 8080:80` flag maps host port 8080 to container port 80. Traffic to `localhost:8080` reaches nginx on port 80 inside the container.

#### Container DNS

On custom bridge networks, Docker runs an embedded DNS server. Containers can reach each other by container name or network alias:

```bash
# Create network
docker network create mynet

# Run containers on that network
docker run -d --name db --network mynet postgres
docker run -d --name app --network mynet myapp

# 'app' container can reach 'db' container by name
# Inside app: psql -h db -U postgres
```

This enables service discovery without hardcoding IP addresses.

### BuildKit

**BuildKit** is Docker's modern image builder, replacing the legacy builder. It is the default in Docker 23.0+ and Docker Desktop.

BuildKit improves builds in several ways:

- **Parallel execution** — Independent build stages run concurrently
- **Better caching** — More intelligent cache invalidation and remote cache support
- **Build secrets** — Securely pass secrets without leaking to image layers
- **SSH forwarding** — Use host SSH agent during builds
- **Multi-platform builds** — Build images for different architectures from a single machine
- **Improved output** — Progress tracking and build visualization

#### Enabling BuildKit

On Docker 23.0+, BuildKit is enabled by default.

On older versions, enable it via environment variable:

```bash
export DOCKER_BUILDKIT=1
docker build .
```

Or enable permanently in Docker daemon configuration (`/etc/docker/daemon.json`):

```json
{
  "features": {
    "buildkit": true
  }
}
```

BuildKit introduces the `docker buildx` command for advanced features like multi-platform builds. The standard `docker build` uses BuildKit automatically when enabled.

BuildKit-specific Dockerfile features (like `--mount=type=secret`) only work when BuildKit is enabled. This document assumes BuildKit is available.

> [!IMPORTANT] Compose File Versions Modern Docker Compose files no longer require a `version` key at the top. The `version` field (e.g., `version: "3.8"`) was used to indicate Compose file format compatibility but is now deprecated.
> 
> Current Compose files use the specification defined at [compose-spec.io](https://compose-spec.io/). All services, networks, volumes, and other definitions work without a version declaration.
> 
> Legacy Compose files with `version: "2.x"` or `version: "3.x"` still work, but new files should omit the version key entirely. This document uses the modern format exclusively.

---

## Up and Running

### Installing Docker

Docker is available as **Docker Engine** (Linux) and **Docker Desktop** (Windows, macOS, Linux GUI).

**Docker Engine** is the core daemon and CLI, suitable for servers and headless environments. It runs natively on Linux.

**Docker Desktop** bundles Docker Engine with a GUI, Kubernetes, and additional tooling. It runs Docker inside a Linux VM on Windows and macOS.

For DevOps and server environments, Docker Engine is the standard choice.

#### Linux Installation

Install Docker Engine using the official repository method. This example uses Ubuntu/Debian:

```bash
# Remove old versions
sudo apt remove docker docker-engine docker.io containerd runc

# Install prerequisites
sudo apt update
sudo apt install ca-certificates curl gnupg

# Add Docker's GPG key
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
sudo chmod a+r /etc/apt/keyrings/docker.gpg

# Add repository
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Install Docker
sudo apt update
sudo apt install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
```

For other distributions (RHEL, Fedora, CentOS), consult the official Docker documentation for distribution-specific instructions.

#### Post-Installation

By default, Docker commands require root privileges. To run Docker as a non-root user:

```bash
# Add current user to docker group
sudo usermod -aG docker $USER

# Apply group membership (or log out and back in)
newgrp docker
```

> [!WARNING] Security Implication The `docker` group grants root-equivalent privileges. Members can mount the host filesystem, access the Docker socket, and escalate to root. Add only trusted users to this group.

Enable Docker to start on boot:

```bash
sudo systemctl enable docker
sudo systemctl start docker
```

#### Verifying Installation

Confirm Docker is working:

```bash
# Check client and server versions
docker version

# View system-wide information
docker info

# Run test container
docker run hello-world
```

The `hello-world` container confirms that Docker can pull images and run containers.

#### Storage Driver

Docker uses storage drivers for the layered filesystem. The default on modern Linux is **overlay2**, which is recommended for most workloads.

Check the current storage driver:

```bash
docker info | grep "Storage Driver"
```

Unless there is a specific reason to change it, use overlay2.

> [!NOTE] Podman on RHEL/Fedora Podman is pre-installed on RHEL 8+, CentOS Stream, and Fedora. No additional installation is required. Verify with `podman version`. Most Docker commands work identically: `podman run`, `podman build`, `podman ps`.

### Running Containers

#### Basic `docker run`

The `docker run` command creates and starts a container:

```bash
docker run nginx
```

This command:

1. Checks if the `nginx` image exists locally
2. Pulls the image from Docker Hub if not present
3. Creates a container from the image
4. Starts the container
5. Attaches to the container's stdout/stderr

The container runs in the foreground. Press `Ctrl+C` to stop it.

#### What Happens During `docker run hello-world`

The `hello-world` image demonstrates the complete flow:

```
$ docker run hello-world
Unable to find image 'hello-world:latest' locally
latest: Pulling from library/hello-world
c1ec31eb5944: Pull complete
Digest: sha256:d58e752213a5...
Status: Downloaded newer image for hello-world:latest

Hello from Docker!
This message shows that your installation appears to be working correctly.
...
```

Docker pulled the image (one layer), created a container, ran the entrypoint (which prints a message), and exited.

#### Interactive Containers

Some containers need an interactive terminal:

```bash
# -i keeps stdin open
# -t allocates a pseudo-TTY
docker run -it ubuntu bash
```

Inside the container, you have a shell in an isolated Ubuntu environment. Type `exit` to leave (and stop the container).

#### Foreground vs Detached Mode

By default, `docker run` attaches to the container and blocks. For long-running services, use detached mode:

```bash
# -d runs the container in background
docker run -d nginx
```

Docker prints the container ID and returns immediately. The container runs in the background.

#### Naming Containers

Docker assigns random names to containers. Specify a name for easier reference:

```bash
docker run -d --name webserver nginx
```

Container names must be unique. Attempting to create a container with an existing name fails.

#### Automatic Cleanup

Stopped containers consume disk space. Remove containers automatically when they exit:

```bash
# --rm removes container after it exits
docker run --rm ubuntu echo "Hello"
```

Use `--rm` for ephemeral tasks, testing, and one-off commands. Do not use it for containers you might need to inspect after failure.

#### Common Flag Combinations

```bash
# Interactive one-off command with cleanup
docker run --rm -it ubuntu bash

# Detached service with name
docker run -d --name redis redis

# Detached service with port mapping
docker run -d --name web -p 8080:80 nginx

# Interactive with environment variable
docker run --rm -it -e MY_VAR=value alpine sh
```

### Container Lifecycle Management

#### Listing Containers

```bash
# Running containers
docker ps

# All containers (including stopped)
docker ps -a

# Only container IDs (for scripting)
docker ps -q

# All IDs
docker ps -aq

# Filter by status
docker ps -f status=exited
```

The `docker ps` output shows container ID, image, command, status, ports, and names.

#### Starting and Stopping

```bash
# Stop a running container (sends SIGTERM, then SIGKILL after timeout)
docker stop webserver

# Stop with custom timeout (seconds)
docker stop -t 30 webserver

# Start a stopped container
docker start webserver

# Restart (stop then start)
docker restart webserver

# Kill immediately (SIGKILL, no graceful shutdown)
docker kill webserver
```

Prefer `docker stop` over `docker kill`. It allows the application to shut down gracefully.

#### Removing Containers

```bash
# Remove a stopped container
docker rm webserver

# Force remove a running container
docker rm -f webserver

# Remove multiple containers
docker rm container1 container2

# Remove all stopped containers
docker container prune

# Remove all stopped containers (alternative)
docker rm $(docker ps -aq -f status=exited)
```

Removing a container deletes its writable layer. Any data not in a volume is lost.

### Inspecting Containers

#### Viewing Logs

```bash
# View container logs
docker logs webserver

# Follow log output (like tail -f)
docker logs -f webserver

# Show timestamps
docker logs -t webserver

# Last N lines
docker logs --tail 100 webserver

# Logs since timestamp or duration
docker logs --since 2024-01-01T00:00:00 webserver
docker logs --since 10m webserver
```

Docker captures stdout and stderr from the container's main process. Applications should log to stdout/stderr for Docker to capture.

#### Inspecting Container Details

```bash
# Full container metadata (JSON)
docker inspect webserver

# Specific field using Go template
docker inspect --format='{{.State.Status}}' webserver
docker inspect --format='{{.NetworkSettings.IPAddress}}' webserver
docker inspect --format='{{.State.ExitCode}}' webserver
```

`docker inspect` returns comprehensive information: configuration, state, network settings, mounts, and more.

#### Resource Usage

```bash
# Live resource usage
docker stats

# Specific container
docker stats webserver

# One-shot (no streaming)
docker stats --no-stream
```

Shows CPU, memory, network I/O, and disk I/O per container.

#### Running Processes

```bash
# List processes inside container
docker top webserver
```

### Interacting with Running Containers

#### Executing Commands

`docker exec` runs a command inside an already-running container:

```bash
# Run a single command
docker exec webserver cat /etc/nginx/nginx.conf

# Interactive shell
docker exec -it webserver bash

# As a specific user
docker exec -u root webserver whoami

# With environment variable
docker exec -e DEBUG=1 webserver printenv
```

`docker exec` is essential for debugging and administration. It starts a new process inside the container's namespaces.

#### Attaching to Containers

`docker attach` connects to the container's main process (PID 1):

```bash
docker attach webserver
```

Use `Ctrl+P Ctrl+Q` to detach without stopping the container. `Ctrl+C` sends SIGINT to the main process, which may stop the container.

**Difference between exec and attach:**

- `exec` starts a new process — multiple exec sessions are independent
- `attach` connects to the existing main process — there is only one

#### Copying Files

```bash
# Copy from container to host
docker cp webserver:/etc/nginx/nginx.conf ./nginx.conf

# Copy from host to container
docker cp ./app.conf webserver:/etc/app/app.conf

# Copy directory
docker cp webserver:/var/log/nginx ./nginx-logs
```

`docker cp` works with running or stopped containers.

### Working with Images

#### Pulling Images

```bash
# Pull latest tag (implicit)
docker pull nginx

# Pull specific tag
docker pull nginx:1.25.3

# Pull by digest (immutable)
docker pull nginx@sha256:a8780b506fa4...

# Pull from different registry
docker pull gcr.io/my-project/myapp:v1
```

#### Listing Local Images

```bash
# List images
docker images

# Alternative
docker image ls

# Show all images (including intermediate layers)
docker images -a

# Show image IDs only
docker images -q

# Filter by reference
docker images nginx
```

#### Image Disk Usage

```bash
# Show Docker disk usage
docker system df

# Detailed breakdown
docker system df -v
```

#### Removing Images

```bash
# Remove an image
docker rmi nginx:1.25.3

# Remove by ID
docker rmi a8780b506fa4

# Force remove (even if containers exist)
docker rmi -f nginx

# Remove unused images (dangling)
docker image prune

# Remove all unused images (not just dangling)
docker image prune -a
```

An image cannot be removed if a container (running or stopped) references it, unless forced.

#### Searching Registries

```bash
# Search Docker Hub
docker search nginx

# Limit results
docker search --limit 5 nginx

# Filter official images
docker search --filter is-official=true nginx
```

#### Inspecting Images

```bash
# Full image metadata
docker image inspect nginx

# View layers and history
docker history nginx

# Show layer commands and sizes
docker history --no-trunc nginx
```

### Writing Dockerfiles

A **Dockerfile** is a text file containing instructions to build an image.

#### Basic Structure

```dockerfile
# Base image
FROM ubuntu:22.04

# Metadata
LABEL maintainer="team@example.com"
LABEL version="1.0"

# Install dependencies
RUN apt-get update && apt-get install -y \
    python3 \
    python3-pip \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy application files
COPY requirements.txt .
RUN pip3 install --no-cache-dir -r requirements.txt

COPY . .

# Environment variables
ENV APP_ENV=production

# Expose port (documentation)
EXPOSE 8000

# Create non-root user
RUN useradd -m appuser
USER appuser

# Default command
CMD ["python3", "app.py"]
```

#### Instruction Reference

**FROM** — Sets the base image. Every Dockerfile starts with FROM (except multi-stage builds which have multiple FROM instructions).

```dockerfile
FROM ubuntu:22.04
FROM python:3.11-slim
FROM scratch
```

**RUN** — Executes commands during build, creating a new layer.

```dockerfile
# Shell form (runs in /bin/sh -c)
RUN apt-get update && apt-get install -y curl

# Exec form (no shell)
RUN ["apt-get", "update"]
```

Combine related commands in a single RUN to reduce layers:

```dockerfile
RUN apt-get update && apt-get install -y \
    package1 \
    package2 \
    && rm -rf /var/lib/apt/lists/*
```

**COPY** — Copies files from build context to image.

```dockerfile
COPY src/ /app/src/
COPY package.json package-lock.json ./
```

**ADD** — Like COPY, but also extracts tar archives and supports URLs. Prefer COPY unless tar extraction is needed.

```dockerfile
ADD archive.tar.gz /app/
```

**WORKDIR** — Sets the working directory for subsequent instructions.

```dockerfile
WORKDIR /app
RUN pwd  # outputs /app
```

**ENV** — Sets environment variables (persist in the image and running containers).

```dockerfile
ENV NODE_ENV=production
ENV PATH="/app/bin:${PATH}"
```

**ARG** — Defines build-time variables (not available in running containers).

```dockerfile
ARG VERSION=latest
FROM node:${VERSION}

ARG BUILD_DATE
LABEL build-date=${BUILD_DATE}
```

Build args are passed with `--build-arg`:

```bash
docker build --build-arg VERSION=18 --build-arg BUILD_DATE=$(date -I) .
```

**EXPOSE** — Documents which ports the container listens on. Does not actually publish ports.

```dockerfile
EXPOSE 80
EXPOSE 443
```

**USER** — Sets the user for subsequent instructions and the running container.

```dockerfile
RUN useradd -m appuser
USER appuser
```

**ENTRYPOINT** — Configures the container to run as an executable.

```dockerfile
ENTRYPOINT ["python3", "app.py"]
```

**CMD** — Provides default arguments to ENTRYPOINT, or the default command if no ENTRYPOINT is set.

```dockerfile
CMD ["--help"]
```

**LABEL** — Adds metadata to the image.

```dockerfile
LABEL version="1.0"
LABEL description="My application"
```

**SHELL** — Changes the default shell for shell-form RUN commands.

```dockerfile
SHELL ["/bin/bash", "-c"]
RUN echo $SHELL
```

#### ENTRYPOINT vs CMD

Both define what runs when the container starts, but they serve different purposes:

|Aspect|ENTRYPOINT|CMD|
|---|---|---|
|Purpose|The executable|Default arguments|
|Override|`--entrypoint` flag|Arguments to `docker run`|
|Combined|ENTRYPOINT + CMD = full command||

**CMD only:**

```dockerfile
CMD ["python3", "app.py"]
```

```bash
docker run myimage                    # runs: python3 app.py
docker run myimage python3 other.py   # runs: python3 other.py (CMD replaced)
```

**ENTRYPOINT only:**

```dockerfile
ENTRYPOINT ["python3", "app.py"]
```

```bash
docker run myimage                    # runs: python3 app.py
docker run myimage --debug            # runs: python3 app.py --debug (appended)
```

**ENTRYPOINT + CMD:**

```dockerfile
ENTRYPOINT ["python3"]
CMD ["app.py"]
```

```bash
docker run myimage                    # runs: python3 app.py
docker run myimage other.py           # runs: python3 other.py (CMD replaced)
```

Use ENTRYPOINT when the container should always run a specific executable. Use CMD for default arguments that users might override.

#### Build Context and .dockerignore

The **build context** is the directory sent to the Docker daemon during build. The Dockerfile's COPY and ADD instructions can only access files in this context.

```bash
# Current directory is the context
docker build .

# Specify different context
docker build -f Dockerfile.prod /path/to/context
```

The `.dockerignore` file excludes files from the build context:

```
# .dockerignore
.git
.gitignore
node_modules
*.md
!README.md
Dockerfile
.dockerignore
.env
*.log
tmp/
```

A good `.dockerignore`:

- Reduces context size (faster builds)
- Prevents accidentally copying secrets or credentials
- Avoids cache invalidation from irrelevant file changes
- Keeps images smaller

### Building Images

#### Basic Build

```bash
# Build with tag
docker build -t myapp:1.0 .

# Build with multiple tags
docker build -t myapp:1.0 -t myapp:latest .

# Build from different Dockerfile
docker build -f Dockerfile.prod -t myapp:prod .

# Build with build arguments
docker build --build-arg VERSION=1.0 -t myapp .
```

#### Build Cache

Docker caches each layer. If an instruction hasn't changed (and no prior instruction changed), Docker reuses the cached layer.

Cache invalidation rules:

- If a layer changes, all subsequent layers are rebuilt
- COPY/ADD invalidate cache if files changed
- RUN instructions invalidate cache if the command string changes (not command output)

Order instructions from least to most frequently changing:

```dockerfile
# Good: Dependencies change less often than code
FROM python:3.11-slim
WORKDIR /app

COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .  # This layer rebuilds when code changes, but dependencies are cached
```

```dockerfile
# Bad: Any code change rebuilds dependencies
FROM python:3.11-slim
WORKDIR /app
COPY . .
RUN pip install -r requirements.txt
```

#### Skipping Cache

```bash
# Rebuild without cache
docker build --no-cache -t myapp .
```

#### Build Output

Docker shows build progress. With BuildKit, use `--progress` to control output:

```bash
# Plain output (good for CI logs)
docker build --progress=plain -t myapp .

# Auto (default)
docker build --progress=auto -t myapp .
```

### Tagging and Pushing Images

#### Tagging

Tags are references to image IDs. An image can have multiple tags.

```bash
# Tag during build
docker build -t myapp:v1.0.0 .

# Tag existing image
docker tag myapp:v1.0.0 myapp:latest
docker tag myapp:v1.0.0 registry.example.com/myapp:v1.0.0
```

#### Tagging Strategies

Consistent tagging enables reproducible deployments:

|Strategy|Example|Use Case|
|---|---|---|
|Semantic version|`myapp:1.2.3`|Releases|
|Git SHA|`myapp:abc1234`|CI builds, traceability|
|Branch + SHA|`myapp:main-abc1234`|Development|
|Environment|`myapp:production`|Mutable, current production|
|Timestamp|`myapp:20240115`|Daily builds|

Production should use immutable tags (semver, SHA). Avoid deploying `latest` — it provides no traceability.

#### Registry Authentication

```bash
# Login to Docker Hub
docker login

# Login to specific registry
docker login registry.example.com

# Login with credentials (for scripts — prefer credential helpers)
echo $PASSWORD | docker login -u $USERNAME --password-stdin
```

Credentials are stored in `~/.docker/config.json`. Use credential helpers for secure storage.

#### Pushing Images

```bash
# Push to Docker Hub
docker push mycompany/myapp:v1.0.0

# Push to private registry
docker push registry.example.com/myapp:v1.0.0

# Push all tags of an image
docker push --all-tags mycompany/myapp
```

The registry must match the image tag. Pushing `myapp:v1` goes to Docker Hub; pushing `gcr.io/project/myapp:v1` goes to Google Container Registry.

### Managing Volumes

#### Creating and Listing Volumes

```bash
# Create a named volume
docker volume create mydata

# List volumes
docker volume ls

# Inspect volume
docker volume inspect mydata
```

#### Using Volumes

```bash
# Mount named volume
docker run -d -v mydata:/var/lib/data myapp

# Mount with explicit syntax (clearer)
docker run -d --mount source=mydata,target=/var/lib/data myapp

# Anonymous volume (Docker generates name)
docker run -d -v /var/lib/data myapp

# Read-only volume
docker run -d -v mydata:/var/lib/data:ro myapp
```

#### Bind Mounts

```bash
# Bind mount current directory
docker run -v $(pwd):/app myapp

# Explicit mount syntax
docker run --mount type=bind,source=$(pwd),target=/app myapp

# Read-only bind mount
docker run -v $(pwd)/config:/etc/app/config:ro myapp
```

On macOS and Windows, bind mount performance can be slow for large directories. Docker Desktop provides options to improve this (gRPC FUSE, VirtioFS).

#### tmpfs Mounts

```bash
# tmpfs mount
docker run --tmpfs /tmp myapp

# With options
docker run --mount type=tmpfs,target=/tmp,tmpfs-size=100m myapp
```

#### Volume Lifecycle

```bash
# Remove specific volume
docker volume rm mydata

# Remove all unused volumes
docker volume prune

# Force remove (no confirmation)
docker volume prune -f
```

Volumes persist until explicitly removed. Removing a container does not remove its volumes unless `docker run --rm -v` or `docker rm -v` is used.

#### Volume Permissions

Volume contents are owned by whatever UID/GID creates or accesses them. Common issues:

- Container runs as non-root but volume was created by root
- Host bind mount has different UID than container process

Solutions:

- Ensure the Dockerfile creates files with correct ownership
- Use `chown` in entrypoint scripts
- Match container user UID to host user UID
- On Linux with SELinux, add `:z` or `:Z` suffix to bind mounts

### Container Networking

#### Listing Networks

```bash
# List networks
docker network ls

# Inspect network
docker network inspect bridge
```

Default networks:

- `bridge` — Default network for containers
- `host` — Shares host network stack
- `none` — No networking

#### Creating Custom Networks

```bash
# Create bridge network
docker network create mynet

# Create with subnet
docker network create --subnet=172.20.0.0/16 mynet

# Create with options
docker network create --driver bridge --attachable mynet
```

#### Connecting Containers

```bash
# Run container on specific network
docker run -d --name db --network mynet postgres

# Connect running container to network
docker network connect mynet webserver

# Disconnect from network
docker network disconnect mynet webserver
```

#### Container DNS on Custom Networks

Containers on the same custom network can reach each other by name:

```bash
# Create network
docker network create app-net

# Start database
docker run -d --name postgres --network app-net postgres

# Start application (can reach postgres by name)
docker run -d --name app --network app-net \
  -e DATABASE_HOST=postgres \
  myapp
```

This only works on custom networks, not the default bridge.

#### Publishing Ports

```bash
# Map host port to container port
docker run -d -p 8080:80 nginx
# Access at localhost:8080

# Map to specific interface
docker run -d -p 127.0.0.1:8080:80 nginx

# Map multiple ports
docker run -d -p 8080:80 -p 8443:443 nginx

# Random host port
docker run -d -p 80 nginx
# Check assigned port with: docker port <container>

# Publish all exposed ports to random host ports
docker run -d -P nginx
```

#### Host Networking

Host networking removes network isolation. The container shares the host's network namespace:

```bash
docker run --network host nginx
# nginx listens directly on host's port 80
```

Use cases:

- Maximum network performance
- Applications that need to bind to many ports
- Network monitoring tools

Drawbacks:

- Port conflicts with host services
- No network isolation
- Not available on Docker Desktop (Windows/Mac)

#### Network Troubleshooting

```bash
# Inspect network
docker network inspect mynet

# Check container IP
docker inspect -f '{{range.NetworkSettings.Networks}}{{.IPAddress}}{{end}}' container

# Test connectivity from inside container
docker exec -it container ping other-container
docker exec -it container curl http://other-container:8080
```

### Docker Compose

Docker Compose manages multi-container applications using a declarative YAML file.

#### Compose File Structure

```yaml
# compose.yaml

services:
  web:
    build: .
    ports:
      - "8080:80"
    environment:
      - DATABASE_URL=postgres://db:5432/app
    depends_on:
      - db
    volumes:
      - ./app:/app

  db:
    image: postgres:15
    environment:
      POSTGRES_PASSWORD: secret
    volumes:
      - pgdata:/var/lib/postgresql/data

volumes:
  pgdata:

networks:
  default:
    driver: bridge
```

#### Services

Services define containers:

```yaml
services:
  app:
    # Use existing image
    image: nginx:latest

    # Or build from Dockerfile
    build:
      context: .
      dockerfile: Dockerfile.prod
      args:
        VERSION: "1.0"

    # Port mapping
    ports:
      - "8080:80"
      - "127.0.0.1:8443:443"

    # Environment variables
    environment:
      NODE_ENV: production
      DATABASE_URL: postgres://db/app

    # Or from file
    env_file:
      - .env

    # Volumes
    volumes:
      - ./data:/app/data           # Bind mount
      - appdata:/app/data          # Named volume
      - /app/node_modules          # Anonymous volume

    # Dependencies
    depends_on:
      - db
      - redis

    # Restart policy
    restart: unless-stopped

    # Resource limits
    deploy:
      resources:
        limits:
          cpus: '0.5'
          memory: 512M

    # Health check
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s
```

#### Environment Variables

Multiple ways to set environment variables:

```yaml
services:
  app:
    # Inline
    environment:
      - NODE_ENV=production
      - DEBUG=false

    # Or map syntax
    environment:
      NODE_ENV: production
      DEBUG: "false"

    # From .env file
    env_file:
      - .env
      - .env.local
```

The `.env` file in the same directory as `compose.yaml` is loaded automatically for variable substitution in the Compose file itself:

```yaml
# compose.yaml
services:
  app:
    image: myapp:${VERSION:-latest}
```

```
# .env
VERSION=1.2.3
```

#### Networks and Volumes

```yaml
services:
  app:
    networks:
      - frontend
      - backend

  db:
    networks:
      - backend

networks:
  frontend:
  backend:
    driver: bridge

volumes:
  dbdata:
    driver: local
```

Compose creates a default network for all services if none is specified.

#### Running Compose Applications

```bash
# Start all services (foreground)
docker compose up

# Start in background
docker compose up -d

# Start specific services
docker compose up -d web db

# Rebuild images before starting
docker compose up --build

# Stop and remove containers, networks
docker compose down

# Also remove volumes
docker compose down -v

# Also remove images
docker compose down --rmi all
```

#### Managing Services

```bash
# View running services
docker compose ps

# View logs
docker compose logs

# Follow logs
docker compose logs -f

# Logs for specific service
docker compose logs -f web

# Execute command in service
docker compose exec web bash

# Run one-off command
docker compose run --rm web npm test

# Stop services
docker compose stop

# Start stopped services
docker compose start

# Restart services
docker compose restart

# Scale service (if no host port conflicts)
docker compose up -d --scale worker=3
```

#### Building with Compose

```bash
# Build all images
docker compose build

# Build specific service
docker compose build web

# Build without cache
docker compose build --no-cache

# Build with build args
docker compose build --build-arg VERSION=1.0
```

#### Profiles

Profiles allow optional services:

```yaml
services:
  web:
    image: nginx

  debug:
    image: busybox
    profiles:
      - debug

  monitoring:
    image: prometheus
    profiles:
      - monitoring
      - debug
```

```bash
# Start default services only
docker compose up -d

# Start with specific profile
docker compose --profile debug up -d

# Multiple profiles
docker compose --profile debug --profile monitoring up -d
```

#### Override Files

Compose merges multiple files. The default order is:

1. `compose.yaml`
2. `compose.override.yaml` (if exists)

```yaml
# compose.yaml (base)
services:
  web:
    image: myapp
    ports:
      - "80:80"
```

```yaml
# compose.override.yaml (development overrides)
services:
  web:
    build: .
    volumes:
      - ./src:/app/src
    environment:
      DEBUG: "true"
```

For production, use explicit files:

```bash
docker compose -f compose.yaml -f compose.prod.yaml up -d
```

#### Compose Watch

Compose Watch enables automatic updates during development:

```yaml
services:
  web:
    build: .
    develop:
      watch:
        - action: sync
          path: ./src
          target: /app/src
        - action: rebuild
          path: package.json
```

```bash
docker compose watch
```

File changes in `./src` sync to the container. Changes to `package.json` trigger a rebuild.

> [!NOTE] Podman Compose `podman-compose` provides Compose compatibility for Podman. Install via pip: `pip install podman-compose`. Most Compose commands work identically.
> 
> For Podman-native workflows, consider `podman kube generate` to export a pod as Kubernetes YAML, and `podman kube play` to run Kubernetes YAML directly.

---

## Getting Production Ready

Running containers in development is one thing. Running them in production requires attention to security, reliability, observability, and operational concerns.

### Image Optimization

Image size affects pull time, storage costs, and attack surface. Smaller images deploy faster and have fewer vulnerabilities.

#### Multi-Stage Builds

Multi-stage builds separate build-time dependencies from the runtime image:

```dockerfile
# Stage 1: Build
FROM golang:1.21 AS builder
WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download
COPY . .
RUN CGO_ENABLED=0 go build -o /app/server

# Stage 2: Runtime
FROM alpine:3.19
RUN apk --no-cache add ca-certificates
COPY --from=builder /app/server /server
USER nobody
ENTRYPOINT ["/server"]
```

The build stage contains Go toolchain (~800MB). The runtime stage contains only the binary (~15MB with Alpine, even smaller with `scratch`).

Benefits:

- Dramatically smaller images
- No build tools in production (smaller attack surface)
- Secrets used during build don't appear in final image

#### Base Image Selection

|Base|Size|Shell|Package Manager|Use Case|
|---|---|---|---|---|
|`ubuntu`, `debian`|75-125MB|Yes|apt|Full tooling, debugging ease|
|`alpine`|5-7MB|Yes|apk|Minimal size, musl libc|
|`distroless`|2-20MB|No|No|Minimal runtime, security|
|`scratch`|0MB|No|No|Static binaries only|

**Alpine** uses musl libc instead of glibc. Most applications work fine, but some (especially with native extensions) may have issues. Test thoroughly.

**Distroless** images contain only the runtime (e.g., just the JRE, Python interpreter). No shell means no interactive debugging, but also no shell-based attacks.

**Scratch** is completely empty. Only use for statically-linked binaries that need no filesystem.

```dockerfile
# Distroless example (Python)
FROM python:3.11-slim AS builder
WORKDIR /app
COPY requirements.txt .
RUN pip install --user -r requirements.txt
COPY . .

FROM gcr.io/distroless/python3-debian12
COPY --from=builder /root/.local /root/.local
COPY --from=builder /app /app
WORKDIR /app
ENV PATH=/root/.local/bin:$PATH
CMD ["app.py"]
```

```dockerfile
# Scratch example (Go static binary)
FROM golang:1.21 AS builder
WORKDIR /app
COPY . .
RUN CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -o server .

FROM scratch
COPY --from=builder /app/server /server
COPY --from=builder /etc/ssl/certs/ca-certificates.crt /etc/ssl/certs/
ENTRYPOINT ["/server"]
```

#### Layer Optimization

Each instruction creates a layer. Minimize layers and clean up in the same layer:

```dockerfile
# Bad: Multiple layers, leftover cache
RUN apt-get update
RUN apt-get install -y curl
RUN apt-get install -y vim
RUN apt-get clean

# Good: Single layer, cleaned up
RUN apt-get update && apt-get install -y \
    curl \
    vim \
    && rm -rf /var/lib/apt/lists/*
```

#### Instruction Ordering

Order instructions from least to most frequently changing:

```dockerfile
FROM node:20-slim

# Rarely changes
WORKDIR /app

# Changes when dependencies change
COPY package.json package-lock.json ./
RUN npm ci --only=production

# Changes frequently
COPY . .

CMD ["node", "server.js"]
```

Changing application code doesn't invalidate the dependency cache.

#### Removing Unnecessary Files

```dockerfile
# Remove package manager cache
RUN apt-get update && apt-get install -y curl \
    && rm -rf /var/lib/apt/lists/*

# Remove pip cache
RUN pip install --no-cache-dir -r requirements.txt

# Remove build dependencies after use
RUN apt-get update && apt-get install -y \
    build-essential \
    && pip install --no-cache-dir -r requirements.txt \
    && apt-get purge -y build-essential \
    && apt-get autoremove -y \
    && rm -rf /var/lib/apt/lists/*
```

Multi-stage builds are cleaner than manual cleanup for build dependencies.

#### .dockerignore

A comprehensive `.dockerignore` reduces context size:

```
.git
.gitignore
.github
.vscode
.idea

node_modules
__pycache__
*.pyc
.pytest_cache
.coverage

Dockerfile*
docker-compose*.yml
compose*.yaml
.dockerignore

*.md
!README.md
LICENSE

.env*
*.log
tmp/
coverage/
dist/
build/
```

### Security Hardening

Defense in depth: apply multiple security controls so that a single failure doesn't compromise the system.

#### Running as Non-Root

By default, containers run as root. A container escape as root means host root access.

```dockerfile
FROM node:20-slim

WORKDIR /app

# Install dependencies as root
COPY package*.json ./
RUN npm ci --only=production

# Copy application
COPY . .

# Create non-root user
RUN useradd -r -u 1001 appuser

# Change ownership
RUN chown -R appuser:appuser /app

# Switch to non-root user
USER appuser

CMD ["node", "server.js"]
```

Or use numeric UID for reproducibility:

```dockerfile
USER 1001
```

Many base images include non-root users:

```dockerfile
FROM node:20-slim
USER node
```

Verify at runtime:

```bash
docker run --rm myimage whoami
# Should not print "root"
```

#### Read-Only Root Filesystem

Prevent filesystem modifications:

```bash
docker run --read-only myimage
```

Most applications need some writable locations. Use tmpfs for those:

```bash
docker run --read-only \
  --tmpfs /tmp \
  --tmpfs /var/run \
  myimage
```

In Compose:

```yaml
services:
  app:
    image: myapp
    read_only: true
    tmpfs:
      - /tmp
      - /var/run
```

#### Dropping Capabilities

Linux capabilities grant specific privileges. Drop all and add back only what's needed:

```bash
docker run --cap-drop=ALL --cap-add=NET_BIND_SERVICE myimage
```

Common capabilities:

|Capability|Allows|
|---|---|
|`NET_BIND_SERVICE`|Bind to ports below 1024|
|`CHOWN`|Change file ownership|
|`SETUID`, `SETGID`|Change user/group IDs|
|`DAC_OVERRIDE`|Bypass file permission checks|

Most applications need zero capabilities. Web servers binding to port 80 need `NET_BIND_SERVICE` (or bind to a high port instead).

#### No New Privileges

Prevent privilege escalation through setuid binaries:

```bash
docker run --security-opt=no-new-privileges myimage
```

This should be enabled for all production containers.

#### Seccomp and AppArmor

Docker applies default seccomp profiles that block dangerous syscalls. Custom profiles can be more restrictive:

```bash
docker run --security-opt seccomp=/path/to/profile.json myimage
```

AppArmor (on supported systems) provides mandatory access control:

```bash
docker run --security-opt apparmor=docker-default myimage
```

The defaults are reasonable for most workloads. Custom profiles require understanding syscall and file access patterns.

#### Image Scanning

Scan images for known vulnerabilities:

```bash
# Docker Scout (built into Docker)
docker scout cves myimage

# Trivy
trivy image myimage

# Grype
grype myimage
```

Integrate scanning into CI pipelines. Fail builds on critical vulnerabilities.

Scanning finds known CVEs in packages. It doesn't find:

- Application-level vulnerabilities
- Misconfigurations
- Logic bugs

Scanning is one layer of defense, not a complete solution.

#### Image Signing

Sign images to verify provenance:

```bash
# Enable Docker Content Trust
export DOCKER_CONTENT_TRUST=1

# Push (automatically signs)
docker push myregistry/myimage:v1
```

For Sigstore/cosign:

```bash
# Sign
cosign sign myregistry/myimage@sha256:abc123...

# Verify
cosign verify myregistry/myimage@sha256:abc123...
```

#### Avoiding Secrets in Images

**Build args are visible in image history:**

```dockerfile
ARG API_KEY  # Bad: visible in `docker history`
```

**Files deleted in later layers still exist in earlier layers:**

```dockerfile
COPY secrets.txt /app/secrets.txt
RUN do-something && rm /app/secrets.txt  # Bad: file exists in layer history
```

**Use BuildKit secrets:**

```dockerfile
# syntax=docker/dockerfile:1
FROM alpine
RUN --mount=type=secret,id=mysecret \
    cat /run/secrets/mysecret > /dev/null
```

```bash
docker build --secret id=mysecret,src=./secret.txt .
```

The secret is available during build but never written to a layer.

> [!NOTE] Podman Rootless Podman runs rootless by default, providing user namespace isolation without additional configuration. The container's root user maps to an unprivileged host user, significantly reducing the impact of container escapes.

### Secrets Management

Environment variables are the most common way to pass configuration, but they're visible in `docker inspect`, process listings, and logs.

#### Why Environment Variables Are Not Secrets

```bash
# Visible in inspect
docker inspect container | grep -A5 Env

# Visible in process list (on some systems)
cat /proc/<pid>/environ

# Often logged accidentally
echo "Connecting to $DATABASE_URL"
```

#### BuildKit Secrets

For build-time secrets (private repo access, API keys for downloading):

```dockerfile
# syntax=docker/dockerfile:1
FROM node:20
RUN --mount=type=secret,id=npmrc,target=/root/.npmrc \
    npm ci
```

```bash
docker build --secret id=npmrc,src=$HOME/.npmrc .
```

#### Runtime Secrets

Mount secrets as files rather than environment variables:

```bash
docker run -v /path/to/secret:/run/secrets/api_key:ro myimage
```

Application reads `/run/secrets/api_key` instead of `$API_KEY`.

Benefits:

- Not visible in `docker inspect`
- Not in process environment
- Can be mounted read-only
- Can set restrictive file permissions

#### Docker Swarm Secrets

If using Swarm mode:

```bash
# Create secret
echo "mysecretpassword" | docker secret create db_password -

# Use in service
docker service create --secret db_password myimage
```

Secrets appear at `/run/secrets/<secret_name>` inside the container.

#### External Secrets Management

For production, use dedicated secrets management:

- **HashiCorp Vault** — Full-featured secrets management
- **AWS Secrets Manager / Parameter Store** — AWS-native
- **GCP Secret Manager** — GCP-native
- **Azure Key Vault** — Azure-native

Applications retrieve secrets at runtime. Containers need only credentials to access the secrets manager (which can be provided via instance roles, workload identity, etc.).

### Resource Constraints

Without limits, a single container can consume all host resources, affecting other containers and the host itself.

#### Memory Limits

```bash
# Hard limit (container killed if exceeded)
docker run --memory=512m myimage

# Memory + swap (set equal to disable swap)
docker run --memory=512m --memory-swap=512m myimage

# Soft limit (kernel tries to keep below this)
docker run --memory-reservation=256m myimage
```

When a container exceeds its memory limit, the OOM killer terminates it. This appears as exit code 137.

#### CPU Limits

```bash
# Limit to 1.5 CPUs
docker run --cpus=1.5 myimage

# Relative weight (default 1024)
docker run --cpu-shares=512 myimage

# Pin to specific cores
docker run --cpuset-cpus="0,1" myimage
```

`--cpus` is a hard limit. `--cpu-shares` is relative weight when CPUs are contended.

#### Process Limits

Prevent fork bombs:

```bash
docker run --pids-limit=100 myimage
```

#### Compose Resource Limits

```yaml
services:
  app:
    image: myapp
    deploy:
      resources:
        limits:
          cpus: '1.0'
          memory: 512M
        reservations:
          cpus: '0.5'
          memory: 256M
```

Note: `deploy.resources` requires `docker compose` (v2) and may not be honored in all contexts outside Swarm.

#### Monitoring Resources

```bash
# Live stats
docker stats

# One-shot
docker stats --no-stream

# JSON format
docker stats --format json
```

### Health Checks

Health checks let Docker (and orchestrators) know if a container is functioning correctly, not just running.

#### Dockerfile Health Check

```dockerfile
HEALTHCHECK --interval=30s --timeout=10s --retries=3 --start-period=60s \
  CMD curl -f http://localhost:8080/health || exit 1
```

Parameters:

- `--interval` — Time between checks (default 30s)
- `--timeout` — Maximum time for check to complete (default 30s)
- `--retries` — Consecutive failures before unhealthy (default 3)
- `--start-period` — Grace period for startup (default 0s)
- `--start-interval` — Interval during start period (Docker 25+)

The check command must exit 0 for healthy, 1 for unhealthy.

#### Health Check Commands

```dockerfile
# HTTP endpoint
HEALTHCHECK CMD curl -f http://localhost:8080/health || exit 1

# TCP port check
HEALTHCHECK CMD nc -z localhost 5432 || exit 1

# Custom script
HEALTHCHECK CMD /app/healthcheck.sh

# Database connection
HEALTHCHECK CMD pg_isready -U postgres || exit 1
```

#### Runtime Override

```bash
# Override health check
docker run --health-cmd="curl -f http://localhost/" myimage

# Disable health check
docker run --no-healthcheck myimage
```

#### Viewing Health Status

```bash
# In docker ps
docker ps
# CONTAINER ID   IMAGE   ...   STATUS
# abc123         myapp   ...   Up 5 minutes (healthy)

# Detailed health info
docker inspect --format='{{json .State.Health}}' container
```

States: `starting`, `healthy`, `unhealthy`.

#### Compose Health Checks

```yaml
services:
  web:
    image: myapp
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 60s

  db:
    image: postgres:15
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 10s
      timeout: 5s
      retries: 5

  app:
    image: myapp
    depends_on:
      db:
        condition: service_healthy
```

`depends_on` with `condition: service_healthy` waits for dependency health checks to pass.

### Logging

Docker captures stdout and stderr from the container's main process.

#### Default Logging

By default, Docker uses the `json-file` driver, storing logs at `/var/lib/docker/containers/<id>/<id>-json.log`.

#### Log Rotation

Without rotation, logs grow unbounded:

```bash
# Per-container
docker run --log-opt max-size=10m --log-opt max-file=3 myimage
```

Or configure daemon-wide in `/etc/docker/daemon.json`:

```json
{
  "log-driver": "json-file",
  "log-opts": {
    "max-size": "10m",
    "max-file": "3"
  }
}
```

#### Logging Drivers

```bash
# Syslog
docker run --log-driver=syslog myimage

# Journald
docker run --log-driver=journald myimage

# Send to Fluentd
docker run --log-driver=fluentd --log-opt fluentd-address=localhost:24224 myimage

# AWS CloudWatch
docker run --log-driver=awslogs --log-opt awslogs-region=us-east-1 --log-opt awslogs-group=myapp myimage

# Disable logging
docker run --log-driver=none myimage
```

#### Application Logging

Applications should log to stdout/stderr, not files:

```python
# Good
import logging
logging.basicConfig(stream=sys.stdout, level=logging.INFO)

# Bad
logging.basicConfig(filename='/var/log/app.log')
```

This lets Docker capture logs, enables log driver flexibility, and follows twelve-factor app principles.

#### Structured Logging

JSON-formatted logs enable parsing and analysis:

```python
import json
import sys

def log(level, message, **kwargs):
    entry = {"level": level, "message": message, **kwargs}
    print(json.dumps(entry), file=sys.stdout)

log("info", "Request processed", path="/api/users", duration_ms=45)
```

```
{"level": "info", "message": "Request processed", "path": "/api/users", "duration_ms": 45}
```

#### Compose Logging

```yaml
services:
  app:
    image: myapp
    logging:
      driver: json-file
      options:
        max-size: "10m"
        max-file: "3"
```

### Graceful Shutdown

When Docker stops a container, it sends SIGTERM, waits for a grace period, then sends SIGKILL.

#### Default Behavior

```
docker stop container
  │
  ├─► SIGTERM sent to PID 1
  │
  ├─► Wait 10 seconds (default)
  │
  └─► SIGKILL sent (immediate termination)
```

#### Custom Stop Timeout

```bash
# Wait longer for graceful shutdown
docker stop --time=30 container
```

#### STOPSIGNAL

Some applications expect different signals:

```dockerfile
# nginx expects SIGQUIT for graceful shutdown
STOPSIGNAL SIGQUIT
```

#### Application Signal Handling

Applications must handle SIGTERM to shut down gracefully:

```python
import signal
import sys

def shutdown_handler(signum, frame):
    print("Shutting down gracefully...")
    # Close connections, flush buffers, etc.
    sys.exit(0)

signal.signal(signal.SIGTERM, shutdown_handler)
```

```javascript
process.on('SIGTERM', () => {
  console.log('Received SIGTERM, shutting down...');
  server.close(() => {
    process.exit(0);
  });
});
```

#### Entrypoint and Signals

If using a shell entrypoint, signals may not reach the application:

```dockerfile
# Bad: shell doesn't forward signals
ENTRYPOINT /app/start.sh

# Good: exec form, app is PID 1
ENTRYPOINT ["/app/start.sh"]

# Or use exec in shell script
#!/bin/bash
# start.sh
setup_something
exec /app/server  # replaces shell, app becomes PID 1
```

### Restart Policies

Restart policies control what happens when a container exits.

#### Available Policies

|Policy|Behavior|
|---|---|
|`no`|Never restart (default)|
|`on-failure[:max]`|Restart only on non-zero exit code|
|`always`|Always restart, including on daemon startup|
|`unless-stopped`|Like `always`, but not if manually stopped|

```bash
# Restart on failure, max 5 attempts
docker run --restart=on-failure:5 myimage

# Always restart
docker run --restart=always myimage

# Unless manually stopped
docker run --restart=unless-stopped myimage
```

#### Compose Restart Policies

```yaml
services:
  app:
    image: myapp
    restart: unless-stopped

  worker:
    image: myworker
    restart: on-failure
```

#### Choosing a Policy

- **Development:** `no` (default) — debug exit reasons
- **Daemon/service:** `unless-stopped` — survive crashes and reboots
- **One-shot tasks:** `on-failure` — retry on errors only
- **Critical services:** `always` — maximum availability

Restart policies are for single-host Docker. Orchestrators (Kubernetes, ECS) have their own restart and rescheduling logic.

### Preparing for Orchestration

Single-host Docker is sufficient for small deployments, but scaling requires orchestration.

#### Signs You Need Orchestration

- Multiple hosts required for capacity or availability
- Services need automatic failover
- Complex deployment patterns (rolling updates, canary)
- Service discovery across hosts
- Centralized configuration and secrets management

#### Orchestration Options

**Kubernetes** — The industry standard for container orchestration. Complex but powerful. Managed options (EKS, GKE, AKS) reduce operational burden.

**Amazon ECS** — AWS-native orchestration. Simpler than Kubernetes for AWS-only deployments.

**HashiCorp Nomad** — Multi-workload orchestrator (containers, VMs, bare metal). Simpler than Kubernetes.

> [!NOTE] Docker Swarm Docker Swarm is Docker's native orchestration mode, built into Docker Engine. It provides multi-host networking, service scaling, rolling updates, and secrets management with simpler operations than Kubernetes.
> 
> Swarm remains functional and receives maintenance updates, but industry adoption has shifted heavily toward Kubernetes. For greenfield production deployments, evaluate Kubernetes or managed container services first. Swarm may still be appropriate for simpler deployments where Kubernetes complexity is unwarranted.

#### Keeping Containers Orchestration-Agnostic

Design containers to work across orchestration platforms:

**Health checks** — Define in Dockerfile. Orchestrators use them for readiness/liveness.

**Signal handling** — Handle SIGTERM gracefully. Orchestrators send SIGTERM before rescheduling.

**Environment-based configuration** — Read settings from environment variables or mounted config files. Don't hardcode.

**No host dependencies** — Don't rely on specific host paths, IP addresses, or local state.

**Stateless where possible** — External storage for persistent state. Containers can be replaced at any time.

**Logs to stdout/stderr** — Orchestrators capture and aggregate stdout/stderr.

**Labels and metadata** — Use labels for service discovery, filtering, and monitoring:

```dockerfile
LABEL app="myapp"
LABEL team="platform"
LABEL version="1.2.3"
```

```yaml
# Compose
services:
  web:
    labels:
      app: myapp
      tier: frontend
```

---

## Guides and Recipes

### Dockerfile Patterns by Language

#### Go (Static Binary)

Go produces static binaries ideal for minimal images:

```dockerfile
FROM golang:1.22 AS builder

WORKDIR /app

# Cache dependencies
COPY go.mod go.sum ./
RUN go mod download

# Build
COPY . .
RUN CGO_ENABLED=0 GOOS=linux go build -ldflags="-w -s" -o /server .

# Runtime
FROM scratch

# SSL certificates for HTTPS
COPY --from=builder /etc/ssl/certs/ca-certificates.crt /etc/ssl/certs/

# Binary
COPY --from=builder /server /server

EXPOSE 8080
ENTRYPOINT ["/server"]
```

Notes:

- `CGO_ENABLED=0` produces static binary
- `-ldflags="-w -s"` strips debug info for smaller binary
- `scratch` has no shell, no debugging tools
- Include CA certificates if making HTTPS requests

#### Rust (Static Binary)

Similar pattern to Go:

```dockerfile
FROM rust:1.75 AS builder

WORKDIR /app
COPY Cargo.toml Cargo.lock ./
COPY src ./src

RUN cargo build --release

# Runtime
FROM debian:bookworm-slim

RUN apt-get update && apt-get install -y ca-certificates && rm -rf /var/lib/apt/lists/*

COPY --from=builder /app/target/release/myapp /usr/local/bin/myapp

USER nobody
ENTRYPOINT ["myapp"]
```

For fully static builds with musl:

```dockerfile
FROM rust:1.75-alpine AS builder

RUN apk add --no-cache musl-dev
WORKDIR /app
COPY . .
RUN cargo build --release --target x86_64-unknown-linux-musl

FROM scratch
COPY --from=builder /app/target/x86_64-unknown-linux-musl/release/myapp /myapp
ENTRYPOINT ["/myapp"]
```

#### Python

```dockerfile
FROM python:3.12-slim AS builder

WORKDIR /app

# Install build dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY requirements.txt .
RUN pip install --user --no-cache-dir -r requirements.txt

# Runtime
FROM python:3.12-slim

WORKDIR /app

# Copy installed packages
COPY --from=builder /root/.local /root/.local
ENV PATH=/root/.local/bin:$PATH

# Copy application
COPY . .

# Create non-root user
RUN useradd -r -u 1001 appuser && chown -R appuser:appuser /app
USER appuser

EXPOSE 8000
CMD ["python", "app.py"]
```

For production, consider:

```dockerfile
# Using gunicorn
CMD ["gunicorn", "--bind", "0.0.0.0:8000", "--workers", "4", "app:app"]

# Using uvicorn (async)
CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8000", "--workers", "4"]
```

#### Node.js

```dockerfile
FROM node:20-slim AS builder

WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# Install all dependencies (including dev)
RUN npm ci

# Copy source and build
COPY . .
RUN npm run build

# Runtime
FROM node:20-slim

WORKDIR /app

ENV NODE_ENV=production

# Production dependencies only
COPY package.json package-lock.json ./
RUN npm ci --only=production && npm cache clean --force

# Copy built application
COPY --from=builder /app/dist ./dist

# Use node user (included in node images)
USER node

EXPOSE 3000
CMD ["node", "dist/server.js"]
```

Notes:

- `npm ci` is faster and deterministic (uses lockfile exactly)
- Separate build stage if using TypeScript or bundlers
- `npm cache clean --force` reduces image size
- Node images include a `node` user

#### Java (Spring Boot)

```dockerfile
FROM eclipse-temurin:21-jdk AS builder

WORKDIR /app

# Copy gradle/maven files for dependency caching
COPY gradle gradle
COPY gradlew build.gradle settings.gradle ./
RUN ./gradlew dependencies --no-daemon

# Build
COPY src src
RUN ./gradlew bootJar --no-daemon

# Runtime
FROM eclipse-temurin:21-jre

WORKDIR /app

# Copy JAR
COPY --from=builder /app/build/libs/*.jar app.jar

# Create non-root user
RUN useradd -r -u 1001 appuser
USER appuser

EXPOSE 8080

# JVM tuning for containers
ENV JAVA_OPTS="-XX:+UseContainerSupport -XX:MaxRAMPercentage=75.0"

ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]
```

Notes:

- Use JRE, not JDK, for runtime
- `-XX:+UseContainerSupport` respects container memory limits
- Consider layered JAR for better caching

#### Java (Layered JAR)

Spring Boot supports layered JARs for improved Docker caching:

```dockerfile
FROM eclipse-temurin:21-jdk AS builder

WORKDIR /app
COPY . .
RUN ./gradlew bootJar --no-daemon

# Extract layers
RUN java -Djarmode=layertools -jar build/libs/*.jar extract

FROM eclipse-temurin:21-jre

WORKDIR /app

# Copy layers (least to most changing)
COPY --from=builder /app/dependencies/ ./
COPY --from=builder /app/spring-boot-loader/ ./
COPY --from=builder /app/snapshot-dependencies/ ./
COPY --from=builder /app/application/ ./

RUN useradd -r -u 1001 appuser
USER appuser

EXPOSE 8080
ENTRYPOINT ["java", "org.springframework.boot.loader.JarLauncher"]
```

### Development Workflows

#### Bind Mounts for Live Reloading

Mount source code for instant feedback during development:

```yaml
# compose.yaml
services:
  app:
    build: .
    volumes:
      - ./src:/app/src        # Source code
      - /app/node_modules     # Don't mount node_modules
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=development
```

For languages requiring compilation, use tools with watch mode:

```yaml
services:
  go-app:
    build: .
    volumes:
      - .:/app
    command: air  # Go live reload tool
```

#### Compose for Local Development

Full development stack with Compose:

```yaml
# compose.yaml
services:
  app:
    build:
      context: .
      target: development    # Multi-stage target
    volumes:
      - ./src:/app/src
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=postgres://postgres:password@db:5432/app_dev
      - REDIS_URL=redis://redis:6379
    depends_on:
      - db
      - redis

  db:
    image: postgres:16
    environment:
      POSTGRES_PASSWORD: password
      POSTGRES_DB: app_dev
    volumes:
      - pgdata:/var/lib/postgresql/data
      - ./init.sql:/docker-entrypoint-initdb.d/init.sql
    ports:
      - "5432:5432"  # Expose for local tools

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

  mailhog:
    image: mailhog/mailhog
    ports:
      - "8025:8025"   # Web UI
      - "1025:1025"   # SMTP

volumes:
  pgdata:
```

#### Debugging Containers

**Access running container:**

```bash
docker exec -it myapp bash

# If no bash, try sh
docker exec -it myapp sh

# As root (if running as non-root user)
docker exec -u 0 myapp bash
```

**Start container with different entrypoint:**

```bash
# Override entrypoint for debugging
docker run -it --entrypoint bash myimage

# Override command
docker run -it myimage sh
```

**Debug networking:**

```bash
# Using netshoot image
docker run -it --network container:myapp nicolaka/netshoot

# Inside netshoot, full networking tools available
curl localhost:8080
netstat -tlnp
tcpdump -i any port 8080
```

**Inspect filesystem:**

```bash
# Create container without starting
docker create --name temp myimage

# Copy files out
docker cp temp:/app/config.json ./config.json

# Clean up
docker rm temp
```

#### IDE Integration

VS Code Dev Containers (`.devcontainer/devcontainer.json`):

```json
{
  "name": "My Project",
  "dockerComposeFile": "../compose.yaml",
  "service": "app",
  "workspaceFolder": "/app",
  "customizations": {
    "vscode": {
      "extensions": [
        "ms-python.python",
        "ms-python.vscode-pylance"
      ],
      "settings": {
        "python.defaultInterpreterPath": "/usr/local/bin/python"
      }
    }
  },
  "forwardPorts": [3000, 5432],
  "postCreateCommand": "pip install -r requirements-dev.txt"
}
```

### CI/CD Integration

#### Building Images in CI

**GitHub Actions:**

```yaml
name: Build and Push

on:
  push:
    branches: [main]
    tags: ['v*']

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v3

      - name: Login to Registry
        uses: docker/login-action@v3
        with:
          registry: ghcr.io
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}

      - name: Extract metadata
        id: meta
        uses: docker/metadata-action@v5
        with:
          images: ghcr.io/${{ github.repository }}
          tags: |
            type=sha,prefix=
            type=ref,event=branch
            type=semver,pattern={{version}}
            type=semver,pattern={{major}}.{{minor}}

      - name: Build and push
        uses: docker/build-push-action@v5
        with:
          context: .
          push: true
          tags: ${{ steps.meta.outputs.tags }}
          cache-from: type=gha
          cache-to: type=gha,mode=max
```

**GitLab CI:**

```yaml
build:
  stage: build
  image: docker:24
  services:
    - docker:24-dind
  variables:
    DOCKER_TLS_CERTDIR: "/certs"
  before_script:
    - docker login -u $CI_REGISTRY_USER -p $CI_REGISTRY_PASSWORD $CI_REGISTRY
  script:
    - docker build -t $CI_REGISTRY_IMAGE:$CI_COMMIT_SHA .
    - docker push $CI_REGISTRY_IMAGE:$CI_COMMIT_SHA
  only:
    - main
```

#### Layer Caching in CI

Caching dramatically speeds up builds:

**Registry cache (works everywhere):**

```bash
docker build \
  --cache-from=registry.example.com/myapp:cache \
  --cache-to=type=registry,ref=registry.example.com/myapp:cache,mode=max \
  -t myapp .
```

**GitHub Actions cache:**

```yaml
- uses: docker/build-push-action@v5
  with:
    cache-from: type=gha
    cache-to: type=gha,mode=max
```

**Local cache mount (BuildKit):**

```dockerfile
# syntax=docker/dockerfile:1
FROM node:20

WORKDIR /app
COPY package*.json ./

RUN --mount=type=cache,target=/root/.npm \
    npm ci

COPY . .
RUN npm run build
```

#### Tagging Strategies

```yaml
# Example tag matrix
tags: |
  # Git SHA for traceability
  myapp:abc1234

  # Branch name for environments
  myapp:main
  myapp:develop

  # Semantic version for releases
  myapp:1.2.3
  myapp:1.2
  myapp:1

  # Latest for convenience (not for production)
  myapp:latest
```

Production deployments should use immutable tags (SHA or semver), never `latest`.

#### Scanning in CI

```yaml
# GitHub Actions with Trivy
- name: Scan image
  uses: aquasecurity/trivy-action@master
  with:
    image-ref: myimage:${{ github.sha }}
    format: 'sarif'
    output: 'trivy-results.sarif'
    severity: 'CRITICAL,HIGH'
    exit-code: '1'  # Fail on findings

- name: Upload scan results
  uses: github/codeql-action/upload-sarif@v2
  with:
    sarif_file: 'trivy-results.sarif'
```

### Building Images in CI (Docker-in-Docker and Alternatives)

Building container images inside CI requires careful consideration.

#### Docker-in-Docker (dind)

Runs a Docker daemon inside a container:

```yaml
# GitLab CI example
build:
  image: docker:24
  services:
    - docker:24-dind
  variables:
    DOCKER_TLS_CERTDIR: "/certs"
  script:
    - docker build -t myimage .
```

Pros:

- Full Docker functionality
- Isolated from host

Cons:

- Requires privileged mode (security risk)
- Slower (nested virtualization)
- Cache doesn't persist between builds

#### Docker Socket Mounting

Mount host Docker socket into container:

```yaml
build:
  image: docker:24
  volumes:
    - /var/run/docker.sock:/var/run/docker.sock
  script:
    - docker build -t myimage .
```

Pros:

- Uses host Docker, full performance
- Host cache available

Cons:

- **Security risk** — container has root-equivalent access to host
- Side effects on host
- Only safe in trusted environments

#### Kaniko (Kubernetes-Native)

Builds images without Docker daemon:

```yaml
# Kubernetes pod
apiVersion: v1
kind: Pod
spec:
  containers:
    - name: kaniko
      image: gcr.io/kaniko-project/executor:latest
      args:
        - --dockerfile=Dockerfile
        - --destination=registry/myimage:tag
        - --context=git://github.com/org/repo.git
```

Pros:

- No privileged mode
- Kubernetes-native
- Builds in unprivileged containers

Cons:

- No Docker CLI compatibility
- Different caching behavior

#### Buildah

OCI-compliant builder, companion to Podman:

```bash
buildah bud -t myimage .
buildah push myimage registry/myimage:tag
```

Pros:

- Daemonless
- Rootless capable
- Script-friendly (can build without Dockerfile)

Cons:

- Linux only
- Different CLI from Docker

> [!NOTE] Podman in CI Podman with Buildah is increasingly popular for CI:
> 
> ```yaml
> build:
>   image: quay.io/podman/stable
>   script:
>     - podman build -t myimage .
>     - podman push myimage
> ```
> 
> Rootless and daemonless operation simplifies security in shared CI environments.

### Multi-Platform Builds

Building images for multiple CPU architectures (amd64, arm64) from a single machine.

#### Docker Buildx

Buildx is Docker's multi-platform build tool:

```bash
# Create builder with multi-platform support
docker buildx create --name mybuilder --use

# Inspect available platforms
docker buildx inspect --bootstrap
```

#### Building Multi-Platform Images

```bash
# Build for multiple platforms
docker buildx build \
  --platform linux/amd64,linux/arm64 \
  -t myregistry/myapp:v1 \
  --push \
  .
```

The `--push` is required because multi-platform images are stored as manifest lists, which must be in a registry.

#### How It Works

Buildx uses QEMU emulation for non-native architectures:

- Native architecture: full speed
- Emulated architecture: slower, but functional

For faster builds, use remote builders on native hardware:

```bash
# Add remote arm64 builder
docker buildx create --name mybuilder \
  --node arm64-node \
  --platform linux/arm64 \
  ssh://user@arm64-host

# Use combined builder
docker buildx use mybuilder
```

#### Platform-Specific Instructions

Handle architecture differences in Dockerfile:

```dockerfile
FROM --platform=$BUILDPLATFORM golang:1.22 AS builder

ARG TARGETOS
ARG TARGETARCH

WORKDIR /app
COPY . .
RUN GOOS=$TARGETOS GOARCH=$TARGETARCH go build -o /server .

FROM alpine:3.19
COPY --from=builder /server /server
ENTRYPOINT ["/server"]
```

`BUILDPLATFORM` is the build machine's platform. `TARGETOS` and `TARGETARCH` are the target platform.

### Private Registry Operations

#### Authentication

```bash
# Login interactively
docker login registry.example.com

# Login non-interactively (CI)
echo $PASSWORD | docker login -u $USER --password-stdin registry.example.com
```

#### Credential Helpers

Credential helpers securely store credentials:

```json
// ~/.docker/config.json
{
  "credHelpers": {
    "gcr.io": "gcloud",
    "us-docker.pkg.dev": "gcloud",
    "123456789.dkr.ecr.us-east-1.amazonaws.com": "ecr-login"
  }
}
```

Common helpers:

- `docker-credential-ecr-login` — AWS ECR
- `docker-credential-gcloud` — Google Artifact Registry
- `docker-credential-acr-env` — Azure Container Registry

#### Running a Private Registry

Deploy the official registry image:

```yaml
# compose.yaml
services:
  registry:
    image: registry:2
    ports:
      - "5000:5000"
    volumes:
      - registry-data:/var/lib/registry
    environment:
      REGISTRY_STORAGE_DELETE_ENABLED: "true"

volumes:
  registry-data:
```

With TLS:

```yaml
services:
  registry:
    image: registry:2
    ports:
      - "443:443"
    volumes:
      - registry-data:/var/lib/registry
      - ./certs:/certs
    environment:
      REGISTRY_HTTP_ADDR: 0.0.0.0:443
      REGISTRY_HTTP_TLS_CERTIFICATE: /certs/domain.crt
      REGISTRY_HTTP_TLS_KEY: /certs/domain.key
```

#### Air-Gapped Environments

Transfer images without network access:

```bash
# Save image to tar
docker save -o myapp.tar myapp:v1

# Transfer file (USB, scp, etc.)

# Load on target machine
docker load -i myapp.tar
```

Save multiple images:

```bash
docker save -o images.tar image1:tag image2:tag image3:tag
```

### Container Debugging and Troubleshooting

#### Container Won't Start

**Check logs:**

```bash
docker logs container_name
docker logs --tail 50 container_name
```

**Inspect container state:**

```bash
docker inspect container_name | jq '.[0].State'
```

**Common causes:**

- Entrypoint/CMD error
- Missing environment variables
- Missing dependencies in image
- Permission issues
- Port already in use

**Debug by overriding entrypoint:**

```bash
docker run -it --entrypoint sh myimage
```

#### Container Exits Immediately

**Check exit code:**

```bash
docker inspect --format='{{.State.ExitCode}}' container_name
```

|Exit Code|Meaning|
|---|---|
|0|Normal exit|
|1|Application error|
|137|Killed (OOM or docker kill)|
|139|Segmentation fault|
|143|SIGTERM (docker stop)|

**Common causes of immediate exit:**

- No foreground process (CMD runs and exits)
- Script exits without exec
- Missing configuration

```dockerfile
# Bad: shell exits, container stops
CMD ./start.sh

# Good: exec replaces shell, app is PID 1
CMD ["./start.sh"]

# Or in script:
#!/bin/bash
setup_something
exec ./myapp  # exec is key
```

#### Networking Problems

**Container cannot reach external network:**

```bash
# Check DNS
docker exec container cat /etc/resolv.conf
docker exec container nslookup google.com

# Check connectivity
docker exec container ping 8.8.8.8

# Verify network mode
docker inspect --format='{{.HostConfig.NetworkMode}}' container
```

**Containers cannot reach each other:**

```bash
# Verify same network
docker network inspect mynetwork

# Test connectivity by name (custom network only)
docker exec container1 ping container2
```

**Port not accessible:**

```bash
# Check published ports
docker port container_name

# Verify nothing else using port
ss -tlnp | grep 8080

# Check firewall/iptables
sudo iptables -L -n
```

#### Permission Denied Errors

**Volume permissions:**

```bash
# Check ownership inside container
docker exec container ls -la /app

# Run as root to debug
docker exec -u 0 container ls -la /app
```

**SELinux (RHEL/Fedora):**

```bash
# Add :z for shared volumes
docker run -v ./data:/data:z myimage

# Add :Z for private volumes
docker run -v ./data:/data:Z myimage
```

**Fix ownership:**

```dockerfile
# In Dockerfile
RUN chown -R appuser:appuser /app

# Or at runtime
docker run -v ./data:/data myimage chown -R 1001:1001 /data
```

#### Resource Issues

**Out of memory:**

```bash
# Check if OOM killed
docker inspect --format='{{.State.OOMKilled}}' container

# Check memory usage
docker stats container --no-stream

# View system events
docker events --filter event=oom
```

**Out of disk space:**

```bash
# Check Docker disk usage
docker system df

# Detailed breakdown
docker system df -v

# Clean up
docker system prune -a --volumes
```

**Slow builds:**

```bash
# Check context size
du -sh .

# Review .dockerignore
cat .dockerignore

# Build with progress output
docker build --progress=plain .
```

#### Debugging Tools

**Interactive debugging:**

```bash
# Shell into running container
docker exec -it container bash

# Shell with different user
docker exec -it -u root container bash
```

**Network debugging container:**

```bash
# nicolaka/netshoot has all network tools
docker run -it --network container:mycontainer nicolaka/netshoot

# Available tools: curl, dig, nslookup, netstat, tcpdump, etc.
```

**Inspect image layers:**

```bash
# View layer history
docker history myimage

# Full commands (untruncated)
docker history --no-trunc myimage

# Using dive tool
dive myimage
```

**Daemon logs:**

```bash
# systemd
sudo journalctl -u docker

# Follow
sudo journalctl -fu docker
```

---

## Resources

### Official Documentation

- [Docker Documentation](https://docs.docker.com/) — Comprehensive official documentation
- [Dockerfile Reference](https://docs.docker.com/reference/dockerfile/) — Complete instruction reference
- [Compose Specification](https://docs.docker.com/compose/compose-file/) — Compose file format
- [Docker CLI Reference](https://docs.docker.com/reference/cli/docker/) — All CLI commands

### OCI Specifications

- [OCI Image Specification](https://github.com/opencontainers/image-spec) — Container image format
- [OCI Runtime Specification](https://github.com/opencontainers/runtime-spec) — Container runtime interface
- [OCI Distribution Specification](https://github.com/opencontainers/distribution-spec) — Registry API

### Alternative Tools

- [Podman Documentation](https://docs.podman.io/) — Docker-compatible, daemonless
- [Buildah Documentation](https://buildah.io/) — OCI image builder
- [containerd Documentation](https://containerd.io/docs/) — Container runtime
- [nerdctl Documentation](https://github.com/containerd/nerdctl) — Docker-compatible CLI for containerd

### Security Resources

- [CIS Docker Benchmark](https://www.cisecurity.org/benchmark/docker) — Security configuration guidelines
- [NIST Container Security Guide](https://csrc.nist.gov/publications/detail/sp/800-190/final) — SP 800-190
- [Docker Security Best Practices](https://docs.docker.com/develop/security-best-practices/) — Official security guide
- [Trivy](https://trivy.dev/) — Vulnerability scanner
- [Grype](https://github.com/anchore/grype) — Vulnerability scanner
- [Cosign](https://docs.sigstore.dev/cosign/overview/) — Container signing

### Learning Resources

- [Docker Labs](https://github.com/docker/labs) — Hands-on tutorials
- [Play with Docker](https://labs.play-with-docker.com/) — Browser-based Docker environment
- [Awesome Docker](https://github.com/veggiemonk/awesome-docker) — Curated list of Docker resources

### Community

- [Docker Community Forums](https://forums.docker.com/)
- [Docker Community Slack](https://dockr.ly/slack)
- [r/docker](https://www.reddit.com/r/docker/) — Reddit community
- [Stack Overflow — Docker](https://stackoverflow.com/questions/tagged/docker)