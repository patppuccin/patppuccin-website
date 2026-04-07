---
title: Tooling & Utilities
description:
tags:
aliases:
publish: true
order: 10
---
# Tooling & Utilities

```pwsh

# ~\Documents\WindowsPowerShell\Modules\Stash\Stash.psm1

Add-Type -AssemblyName System.Security

$script:StashDir = "$env:USERPROFILE\.stash"

function Initialize-Stash {
    if (-not (Test-Path $script:StashDir)) {
        New-Item -Path $script:StashDir -ItemType Directory | Out-Null
    }
}

function Get-KeyPath {
    param([string]$Key)
    # Support / grouping by replacing with __
    $safeName = $Key -replace "/", "__"
    Join-Path $script:StashDir "$safeName.secret"
}

function Invoke-StashSet {
    param(
        [Parameter(Position=0, Mandatory)][string]$Key,
        [Parameter(Position=1)][string]$Value
    )
    Initialize-Stash

    if (-not $Value) {
        $secure = Read-Host "  Enter secret for '$Key'" -AsSecureString
        $Value = [Runtime.InteropServices.Marshal]::PtrToStringAuto(
            [Runtime.InteropServices.Marshal]::SecureStringToBSTR($secure)
        )
    }

    $bytes = [Text.Encoding]::UTF8.GetBytes($Value)
    $encrypted = [Security.Cryptography.ProtectedData]::Protect(
        $bytes, $null, [Security.Cryptography.DataProtectionScope]::CurrentUser
    )

    [IO.File]::WriteAllBytes((Get-KeyPath $Key), $encrypted)
    Write-Host "  Stored: " -ForegroundColor Green -NoNewline
    Write-Host $Key -ForegroundColor Cyan
}

function Invoke-StashGet {
    param(
        [Parameter(Position=0, Mandatory)][string]$Key,
        [switch]$Print
    )
    $path = Get-KeyPath $Key
    if (-not (Test-Path $path)) {
        Write-Host "  Key '$Key' not found" -ForegroundColor Red
        return
    }

    $encrypted = [IO.File]::ReadAllBytes($path)
    $decrypted = [Security.Cryptography.ProtectedData]::Unprotect(
        $encrypted, $null, [Security.Cryptography.DataProtectionScope]::CurrentUser
    )
    $value = [Text.Encoding]::UTF8.GetString($decrypted)

    if ($Print) {
        Write-Host "  $Key = " -ForegroundColor DarkGray -NoNewline
        Write-Host $value -ForegroundColor Yellow
    } else {
        Set-Clipboard $value
        Write-Host "  Copied to clipboard" -ForegroundColor Green -NoNewline
        Write-Host " (clears in 30s)" -ForegroundColor DarkGray

        Start-Job -ScriptBlock {
            Start-Sleep -Seconds 30
            Set-Clipboard ""
        } | Out-Null
    }
}

function Invoke-StashList {
    param([Parameter(Position=0)][string]$Prefix)
    Initialize-Stash

    $files = Get-ChildItem $script:StashDir -Filter "*.secret"
    if (-not $files) { Write-Host "  No secrets stored" -ForegroundColor Yellow; return }

    $keys = $files | ForEach-Object { $_.BaseName -replace "__", "/" }

    if ($Prefix) {
        $keys = $keys | Where-Object { $_ -match "^$([regex]::Escape($Prefix))" }
    }

    if (-not $keys) { Write-Host "  No matches for '$Prefix'" -ForegroundColor Yellow; return }

    Write-Host ""
    foreach ($k in $keys) {
        Write-Host "  $k" -ForegroundColor Cyan
    }
    Write-Host ""
}

function Invoke-StashRemove {
    param([Parameter(Position=0, Mandatory)][string]$Key)
    $path = Get-KeyPath $Key
    if (-not (Test-Path $path)) {
        Write-Host "  Key '$Key' not found" -ForegroundColor Red
        return
    }

    $confirm = Read-Host "  Delete '$Key'? (y/N)"
    if ($confirm -eq "y") {
        Remove-Item $path -Force
        Write-Host "  Deleted: $Key" -ForegroundColor Green
    }
}

function Invoke-StashExport {
    param([Parameter(Position=0, Mandatory)][string]$File)
    Initialize-Stash

    $files = Get-ChildItem $script:StashDir -Filter "*.secret"
    if (-not $files) { Write-Host "  Nothing to export" -ForegroundColor Yellow; return }

    # Decrypt all secrets into a hashtable
    $bundle = @{}
    foreach ($f in $files) {
        $key = $f.BaseName -replace "__", "/"
        $encrypted = [IO.File]::ReadAllBytes($f.FullName)
        $decrypted = [Security.Cryptography.ProtectedData]::Unprotect(
            $encrypted, $null, [Security.Cryptography.DataProtectionScope]::CurrentUser
        )
        $bundle[$key] = [Convert]::ToBase64String($decrypted)
    }

    $json = $bundle | ConvertTo-Json
    $plainBytes = [Text.Encoding]::UTF8.GetBytes($json)

    # Passphrase
    $secure = Read-Host "  Export passphrase" -AsSecureString
    $passphrase = [Runtime.InteropServices.Marshal]::PtrToStringAuto(
        [Runtime.InteropServices.Marshal]::SecureStringToBSTR($secure)
    )

    # Derive AES key
    $salt = New-Object byte[] 32
    [Security.Cryptography.RNGCryptoServiceProvider]::new().GetBytes($salt)

    $derived = New-Object Security.Cryptography.Rfc2898DeriveBytes($passphrase, $salt, 100000)
    $key = $derived.GetBytes(32)
    $iv  = $derived.GetBytes(16)

    # AES encrypt
    $aes = [Security.Cryptography.Aes]::Create()
    $aes.Key = $key
    $aes.IV  = $iv
    $encryptor = $aes.CreateEncryptor()
    $encryptedBlob = $encryptor.TransformFinalBlock($plainBytes, 0, $plainBytes.Length)

    # Write: salt + encrypted
    $output = New-Object byte[] ($salt.Length + $encryptedBlob.Length)
    [Array]::Copy($salt, 0, $output, 0, $salt.Length)
    [Array]::Copy($encryptedBlob, 0, $output, $salt.Length, $encryptedBlob.Length)

    [IO.File]::WriteAllBytes($File, $output)
    Write-Host "  Exported $($files.Count) secrets to $File" -ForegroundColor Green
}

function Invoke-StashImport {
    param([Parameter(Position=0, Mandatory)][string]$File)
    if (-not (Test-Path $File)) {
        Write-Host "  File not found: $File" -ForegroundColor Red
        return
    }
    Initialize-Stash

    $raw = [IO.File]::ReadAllBytes($File)

    # Split salt and encrypted blob
    $salt = $raw[0..31]
    $encryptedBlob = $raw[32..($raw.Length - 1)]

    # Passphrase
    $secure = Read-Host "  Import passphrase" -AsSecureString
    $passphrase = [Runtime.InteropServices.Marshal]::PtrToStringAuto(
        [Runtime.InteropServices.Marshal]::SecureStringToBSTR($secure)
    )

    # Derive key
    $derived = New-Object Security.Cryptography.Rfc2898DeriveBytes($passphrase, [byte[]]$salt, 100000)
    $key = $derived.GetBytes(32)
    $iv  = $derived.GetBytes(16)

    # AES decrypt
    try {
        $aes = [Security.Cryptography.Aes]::Create()
        $aes.Key = $key
        $aes.IV  = $iv
        $decryptor = $aes.CreateDecryptor()
        $decryptedBytes = $decryptor.TransformFinalBlock([byte[]]$encryptedBlob, 0, $encryptedBlob.Length)
    } catch {
        Write-Host "  Wrong passphrase or corrupted file" -ForegroundColor Red
        return
    }

    $json = [Text.Encoding]::UTF8.GetString($decryptedBytes)
    $bundle = $json | ConvertFrom-Json

    $count = 0
    $bundle.PSObject.Properties | ForEach-Object {
        $plainBytes = [Convert]::FromBase64String($_.Value)
        $reEncrypted = [Security.Cryptography.ProtectedData]::Protect(
            $plainBytes, $null, [Security.Cryptography.DataProtectionScope]::CurrentUser
        )
        [IO.File]::WriteAllBytes((Get-KeyPath $_.Name), $reEncrypted)
        $count++
    }

    Write-Host "  Imported $count secrets" -ForegroundColor Green
}

function stash {
    param(
        [Parameter(Position=0)][string]$Command,
        [Parameter(ValueFromRemainingArguments)][object[]]$Args
    )

    switch ($Command) {
        'set'    { Invoke-StashSet @Args }
        'get'    { Invoke-StashGet @Args }
        'list'   { Invoke-StashList @Args }
        'ls'     { Invoke-StashList @Args }
        'rm'     { Invoke-StashRemove @Args }
        'export' { Invoke-StashExport @Args }
        'import' { Invoke-StashImport @Args }
        default  {
            Write-Host ""
            Write-Host "  stash" -ForegroundColor Cyan -NoNewline
            Write-Host " - secrets manager" -ForegroundColor DarkGray
            Write-Host ""
            Write-Host "  set <key> [value]" -ForegroundColor Yellow -NoNewline
            Write-Host "   Store a secret (prompts if no value)"
            Write-Host "  get <key> [-Print]" -ForegroundColor Yellow -NoNewline
            Write-Host "  Decrypt to clipboard (or screen)"
            Write-Host "  list [prefix]    " -ForegroundColor Yellow -NoNewline
            Write-Host "  List stored keys"
            Write-Host "  rm <key>         " -ForegroundColor Yellow -NoNewline
            Write-Host "  Delete a secret"
            Write-Host "  export <file>    " -ForegroundColor Yellow -NoNewline
            Write-Host "  AES-encrypted backup"
            Write-Host "  import <file>    " -ForegroundColor Yellow -NoNewline
            Write-Host "  Restore from backup"
            Write-Host ""
        }
    }
}

Export-ModuleMember -Function stash
```