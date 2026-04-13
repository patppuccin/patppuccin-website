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

```powershell
#Requires -Version 5.0
# QuickLauncher - Spotlight-style script launcher

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
    [DllImport("dwmapi.dll")]
    public static extern int DwmSetWindowAttribute(IntPtr hwnd, int attr, ref int val, int size);
}
"@

Add-Type -ReferencedAssemblies "System.Windows.Forms" @"
using System;
using System.Windows.Forms;
public class HotkeyWindow : NativeWindow {
    public event EventHandler HotkeyPressed;
    public HotkeyWindow() { CreateHandle(new CreateParams()); }
    protected override void WndProc(ref Message m) {
        if (m.Msg == 0x0312 && HotkeyPressed != null)
            HotkeyPressed(this, EventArgs.Empty);
        base.WndProc(ref m);
    }
}
"@

# ---- Scripts registry ----
# Drop your script paths here. Display name is derived from filename.
$scripts = @(
    "D:\scripts\toggle-proxy.ps1",
    "D:\scripts\work-log.ps1",
    "D:\scripts\flush-dns.ps1",
    "D:\scripts\open-obsidian.ps1",
    "D:\scripts\ip-info.ps1"
)

# Build entries: extract display name from filename
$entries = $scripts | ForEach-Object {
    @{
        Name = [System.IO.Path]::GetFileNameWithoutExtension($_) -replace '[-_]', ' '
        Path = $_
    }
}

$script:filtered = [System.Collections.ArrayList]@($entries)

# ---- Colors ----
$bg      = [System.Drawing.Color]::FromArgb(30, 30, 30)
$bgInput = [System.Drawing.Color]::FromArgb(42, 42, 42)
$fg      = [System.Drawing.Color]::White
$fgDim   = [System.Drawing.Color]::FromArgb(160, 160, 160)
$accent  = [System.Drawing.Color]::FromArgb(60, 60, 60)
$selBg   = [System.Drawing.Color]::FromArgb(55, 55, 55)

# ---- Form ----
$form = New-Object System.Windows.Forms.Form
$form.Text = "QuickLauncher"
$form.Size = New-Object System.Drawing.Size(520, 360)
$form.StartPosition = "CenterScreen"
$form.FormBorderStyle = "None"
$form.BackColor = $bg
$form.ShowInTaskbar = $false
$form.TopMost = $true
$form.KeyPreview = $true
$form.Padding = New-Object System.Windows.Forms.Padding(1)

# rounded corners on win11
try {
    $r = 2; [WinAPI]::DwmSetWindowAttribute($form.Handle, 33, [ref]$r, 4) | Out-Null
} catch {}

# ---- Search box ----
$search = New-Object System.Windows.Forms.TextBox
$search.Location = New-Object System.Drawing.Point(16, 16)
$search.Size = New-Object System.Drawing.Size(488, 32)
$search.Font = New-Object System.Drawing.Font("Segoe UI", 14)
$search.BackColor = $bgInput
$search.ForeColor = $fg
$search.BorderStyle = "None"
$form.Controls.Add($search)

# subtle line under search
$sep = New-Object System.Windows.Forms.Panel
$sep.Location = New-Object System.Drawing.Point(16, 52)
$sep.Size = New-Object System.Drawing.Size(488, 1)
$sep.BackColor = $accent
$form.Controls.Add($sep)

# ---- Results list (owner-drawn) ----
$list = New-Object System.Windows.Forms.ListBox
$list.Location = New-Object System.Drawing.Point(8, 58)
$list.Size = New-Object System.Drawing.Size(504, 292)
$list.BackColor = $bg
$list.ForeColor = $fg
$list.BorderStyle = "None"
$list.DrawMode = "OwnerDrawFixed"
$list.ItemHeight = 36
$list.Font = New-Object System.Drawing.Font("Segoe UI", 11)

$list.Add_DrawItem({
    param($s, $e)
    if ($e.Index -lt 0) { return }

    $selected = ($e.State -band [System.Windows.Forms.DrawItemState]::Selected)
    $item = $script:filtered[$e.Index]

    # background
    $bgc = if ($selected) { $selBg } else { $bg }
    $brush = New-Object System.Drawing.SolidBrush($bgc)
    $e.Graphics.FillRectangle($brush, $e.Bounds)
    $brush.Dispose()

    # name
    $nColor = if ($selected) { $fg } else { $fgDim }
    $nBrush = New-Object System.Drawing.SolidBrush($nColor)
    $e.Graphics.DrawString(
        $item.Name,
        $list.Font,
        $nBrush,
        ($e.Bounds.X + 12),
        ($e.Bounds.Y + 7)
    )
    $nBrush.Dispose()

    # path hint on the right
    $pathText = $item.Path
    $pFont = New-Object System.Drawing.Font("Segoe UI", 8)
    $pSize = $e.Graphics.MeasureString($pathText, $pFont)
    $pBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(90, 90, 90))
    $e.Graphics.DrawString(
        $pathText,
        $pFont,
        $pBrush,
        ($e.Bounds.Right - $pSize.Width - 12),
        ($e.Bounds.Y + 10)
    )
    $pBrush.Dispose()
    $pFont.Dispose()
})

$form.Controls.Add($list)

# ---- Filter logic ----
function Update-List {
    param([string]$q)
    $list.BeginUpdate()
    $list.Items.Clear()
    $script:filtered.Clear()
    foreach ($entry in $entries) {
        if ([string]::IsNullOrEmpty($q) -or $entry.Name.ToLower().Contains($q.ToLower())) {
            [void]$script:filtered.Add($entry)
            [void]$list.Items.Add($entry.Name)
        }
    }
    $list.EndUpdate()
    if ($list.Items.Count -gt 0) { $list.SelectedIndex = 0 }
}

function Invoke-Selected {
    if ($list.SelectedIndex -lt 0 -or $list.SelectedIndex -ge $script:filtered.Count) { return }
    $sel = $script:filtered[$list.SelectedIndex]
    $form.Hide()
    $search.Text = ""
    try {
        & powershell.exe -ExecutionPolicy Bypass -File $sel.Path
    } catch {
        [System.Windows.Forms.MessageBox]::Show($_.Exception.Message, "QuickLauncher")
    }
}

$search.Add_TextChanged({ Update-List $search.Text })

$search.Add_KeyDown({
    param($s, $e)
    switch ($e.KeyCode) {
        "Down" {
            if ($list.Items.Count -gt 0) {
                $list.SelectedIndex = [Math]::Min($list.SelectedIndex + 1, $list.Items.Count - 1)
            }
            $e.Handled = $true
        }
        "Up" {
            if ($list.Items.Count -gt 0) {
                $list.SelectedIndex = [Math]::Max($list.SelectedIndex - 1, 0)
            }
            $e.Handled = $true
        }
        "Return" {
            Invoke-Selected
            $e.Handled = $true
        }
        "Escape" {
            $form.Hide()
            $search.Text = ""
            $e.Handled = $true
        }
    }
})

$list.Add_DoubleClick({ Invoke-Selected })

$form.Add_FormClosing({
    param($s, $e)
    if ($e.CloseReason -eq "UserClosing") {
        $e.Cancel = $true
        $form.Hide()
        $search.Text = ""
    }
})

$form.Add_VisibleChanged({
    if ($form.Visible) { $search.Focus() }
})

# ---- Hotkey: Ctrl+Shift+K ----
$hotkeyWin = New-Object HotkeyWindow
$registered = [WinAPI]::RegisterHotKey($hotkeyWin.Handle, 9000, 0x0006, 0x4B)
if (-not $registered) { Write-Warning "Could not register Ctrl+Shift+K" }

$hotkeyWin.Add_HotkeyPressed({
    if ($form.Visible) {
        $form.Hide()
        $search.Text = ""
    } else {
        Update-List ""
        $form.Show()
        [WinAPI]::SetForegroundWindow($form.Handle) | Out-Null
        $search.Focus()
    }
})

# ---- Tray ----
$tray = New-Object System.Windows.Forms.NotifyIcon
$tray.Text = "QuickLauncher"
$tray.Visible = $true
$tray.Icon = [System.Drawing.SystemIcons]::Application

$menu = New-Object System.Windows.Forms.ContextMenuStrip
$showItem = New-Object System.Windows.Forms.ToolStripMenuItem("Open")
$showItem.Add_Click({
    Update-List ""
    $form.Show()
    [WinAPI]::SetForegroundWindow($form.Handle) | Out-Null
    $search.Focus()
})
$menu.Items.Add($showItem)

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
    Update-List ""
    $form.Show()
    [WinAPI]::SetForegroundWindow($form.Handle) | Out-Null
    $search.Focus()
})

# ---- Run ----
Update-List ""
Write-Host "QuickLauncher running - Ctrl+Shift+K to toggle"
[System.Windows.Forms.Application]::Run()
[WinAPI]::UnregisterHotKey($hotkeyWin.Handle, 9000) | Out-Null
$tray.Visible = $false
$tray.Dispose()
```

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