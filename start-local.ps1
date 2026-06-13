<#
start-local.ps1
Usage:
  From project folder run:
    powershell -ExecutionPolicy Bypass -File .\start-local.ps1
  To specify a port:
    powershell -ExecutionPolicy Bypass -File .\start-local.ps1 9000

What it does:
  - Checks whether the chosen port is free
  - Starts a simple static server using Python (preferred) or npx http-server (fallback)
  - Opens the default browser to http://localhost:PORT
  - Starts the server in a new PowerShell window and keeps it open
#>

param(
    [int]$Port = 8000
)

$root = Get-Location

# Check if port is already listening
$inUse = $null
try {
    $inUse = Get-NetTCPConnection -LocalPort $Port -State Listen -ErrorAction SilentlyContinue
} catch {
    # Get-NetTCPConnection might not be available on some older systems; fall back to netstat
    $netstat = (netstat -ano) -match ":$Port\b"
    if ($netstat) { $inUse = $true }
}

if ($inUse) {
    Write-Host "Port $Port appears to be in use. Please free the port or choose another one." -ForegroundColor Yellow
    Write-Host "Listening processes (if available):"
    try { $inUse | Select-Object -ExpandProperty OwningProcess -Unique | ForEach-Object { Write-Host "  PID: $_" } } catch {}
    exit 1
}

# Decide which server command to use
$serverCmd = $null
if (Get-Command python -ErrorAction SilentlyContinue) {
    $serverCmd = "python -m http.server $Port"
} elseif (Get-Command py -ErrorAction SilentlyContinue) {
    $serverCmd = "py -3 -m http.server $Port"
} elseif (Get-Command npx -ErrorAction SilentlyContinue) {
    $serverCmd = "npx http-server -p $Port"
} else {
    Write-Host "No suitable server found. Install Python (recommended) or Node.js to use npx http-server." -ForegroundColor Red
    exit 1
}

Write-Host "Starting server: $serverCmd" -ForegroundColor Green

# Start server in a new PowerShell window so it keeps running
$escapedPath = $root.Path -replace '"', '""'
$psArgs = "-NoExit -Command \"Set-Location -LiteralPath '$escapedPath'; $serverCmd\""
Start-Process -FilePath powershell -ArgumentList $psArgs

Start-Sleep -Seconds 1

$uri = "http://localhost:$Port"
Write-Host "Opening $uri in default browser..." -ForegroundColor Cyan
Start-Process $uri

Write-Host "Done. Server is starting in a new window. Keep that window open while testing." -ForegroundColor Green
