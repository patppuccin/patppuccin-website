---
title: Expeditions
description:
tags:
aliases:
publish: true
---
# Expeditions

Map of content for Expeditions

This is a ==Highlight==

<dfn data-term="DevOps">DevOps</dfn>

<<< @/snippets/latest-pwsh-profile.ps1

```pwsh
#Requires -Version 5.0
# palaunch - minimal POC

Add-Type -AssemblyName System.Windows.Forms
Add-Type -AssemblyName System.Drawing

Add-Type @"
using System;
using System.Runtime.InteropServices;
public static class WinAPI {
    [DllImport("user32.dll")]
    public static extern bool RegisterHotKey(IntPtr hWnd, int id, uint fsModifiers, uint vk);
    [DllImport("user32.dll")]
    public static extern bool UnregisterHotKey(IntPtr hWnd, int id);
    [DllImport("user32.dll")]
    public static extern bool SetForegroundWindow(IntPtr hWnd);
}
"@

Add-Type -ReferencedAssemblies "System.Windows.Forms" @"
using System;
using System.Windows.Forms;
public class HotkeyWindow : NativeWindow {
    public event EventHandler HotkeyPressed;
    private const int WM_HOTKEY = 0x0312;
    public HotkeyWindow() { CreateHandle(new CreateParams()); }
    protected override void WndProc(ref Message m) {
        if (m.Msg == WM_HOTKEY && HotkeyPressed != null)
            HotkeyPressed(this, EventArgs.Empty);
        base.WndProc(ref m);
    }
}
"@

# ---- Form ----
$form = New-Object System.Windows.Forms.Form
$form.Text = "palaunch"
$form.Size = New-Object System.Drawing.Size(480, 320)
$form.StartPosition = "CenterScreen"
$form.FormBorderStyle = "None"
$form.BackColor = [System.Drawing.Color]::FromArgb(32, 32, 32)
$form.ShowInTaskbar = $false
$form.TopMost = $true
$form.KeyPreview = $true

$label = New-Object System.Windows.Forms.Label
$label.Text = "palaunch"
$label.Font = New-Object System.Drawing.Font("Segoe UI", 16)
$label.ForeColor = [System.Drawing.Color]::White
$label.AutoSize = $true
$label.Location = New-Object System.Drawing.Point(20, 20)
$form.Controls.Add($label)

# Escape to hide
$form.Add_KeyDown({
    if ($_.KeyCode -eq "Escape") {
        $form.Hide()
    }
})

# Hide instead of close
$form.Add_FormClosing({
    param($s, $e)
    if ($e.CloseReason -eq "UserClosing") {
        $e.Cancel = $true
        $form.Hide()
    }
})

# ---- Hotkey: Ctrl+Shift+K ----
$hotkeyWin = New-Object HotkeyWindow
$registered = [WinAPI]::RegisterHotKey($hotkeyWin.Handle, 9000, 0x0006, 0x4B)

if (-not $registered) {
    Write-Warning "Could not register Ctrl+Shift+K"
}

$hotkeyWin.Add_HotkeyPressed({
    if ($form.Visible) {
        $form.Hide()
    } else {
        $form.Show()
        [WinAPI]::SetForegroundWindow($form.Handle) | Out-Null
    }
})

# ---- Tray icon ----
$tray = New-Object System.Windows.Forms.NotifyIcon
$tray.Text = "palaunch"
$tray.Visible = $true

$bmp = New-Object System.Drawing.Bitmap(16, 16)
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.Clear([System.Drawing.Color]::DodgerBlue)
$g.Dispose()
$tray.Icon = [System.Drawing.Icon]::FromHandle($bmp.GetHicon())

$menu = New-Object System.Windows.Forms.ContextMenuStrip
$exitItem = New-Object System.Windows.Forms.ToolStripMenuItem("Exit")
$exitItem.Add_Click({
    [WinAPI]::UnregisterHotKey($hotkeyWin.Handle, 9000) | Out-Null
    $tray.Visible = $false
    $tray.Dispose()
    [System.Windows.Forms.Application]::Exit()
})
$menu.Items.Add($exitItem)
$tray.ContextMenuStrip = $menu

$tray.Add_DoubleClick({
    $form.Show()
    [WinAPI]::SetForegroundWindow($form.Handle) | Out-Null
})

# ---- Run ----
Write-Host "palaunch running - Ctrl+Shift+K to toggle - tray to exit"
[System.Windows.Forms.Application]::Run()

# cleanup
[WinAPI]::UnregisterHotKey($hotkeyWin.Handle, 9000) | Out-Null
$tray.Visible = $false
$tray.Dispose()
```