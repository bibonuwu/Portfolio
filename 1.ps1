# Proverka prav administratora
if (-not ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)) {
    Start-Process powershell -ArgumentList "-ExecutionPolicy Bypass -File `"$PSCommandPath`"" -Verb RunAs
    exit
}

Set-ExecutionPolicy Bypass -Scope Process -Force
chcp 65001 > $null
Clear-Host
Write-Host ""
Write-Host "  ================================" -ForegroundColor Cyan
Write-Host "       Activation Tool" -ForegroundColor Yellow
Write-Host "  ================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "  [1] Aktivaciya Windows" -ForegroundColor Green
Write-Host "  [0] Vyhod" -ForegroundColor Red
Write-Host ""
$choice = Read-Host "  Vybor"

if ($choice -eq "1") {
    Write-Host ""
    Write-Host "  Zapusk aktivacii..." -ForegroundColor Yellow
    Write-Host ""
    & ([ScriptBlock]::Create((irm https://get.activated.win | iex)))
    Write-Host ""
    Read-Host "  Nazhmi Enter dlya vyhoda"
}
else {
    exit
}
