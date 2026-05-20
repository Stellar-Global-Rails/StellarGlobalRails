param(
  [string]$ApiUrl = $env:VITE_KIVO_API_URL,
  [string]$EnvFile = "apps/kivo/.env"
)

$ErrorActionPreference = "Continue"

function Write-Check {
  param(
    [string]$Name,
    [bool]$Ok,
    [string]$Detail = ""
  )

  $status = if ($Ok) { "OK" } else { "FAIL" }
  if ($Detail) {
    Write-Output "$status`t$Name`t$Detail"
  } else {
    Write-Output "$status`t$Name"
  }
}

function Get-EnvValue {
  param([string]$Key)

  if (!(Test-Path $EnvFile)) {
    return ""
  }

  $line = Get-Content $EnvFile | Where-Object { $_ -like "$Key=*" } | Select-Object -First 1
  if (!$line) {
    return ""
  }

  return ($line -split "=", 2)[1].Trim()
}

if (!$ApiUrl) {
  $supabaseUrl = Get-EnvValue "SUPABASE_URL"
  if ($supabaseUrl) {
    $ApiUrl = "$($supabaseUrl.TrimEnd('/'))/functions/v1/kivo-api"
  } else {
    $ApiUrl = "http://127.0.0.1:54321/functions/v1/kivo-api"
  }
}

$ApiUrl = $ApiUrl.TrimEnd("/")
if ($null -eq (Get-Variable -Name headers -ErrorAction SilentlyContinue)) {
  $headers = @{}
}

Write-Output "Kivo delivery preflight"
Write-Output "API: $ApiUrl"
Write-Output "Runtime: Supabase Edge Function"
Write-Output ""

$isLocal = $ApiUrl -like "http://127.0.0.1*" -or $ApiUrl -like "http://localhost*"
$requiredLocalEnv = @("SUPABASE_URL", "SUPABASE_SERVICE_ROLE_KEY", "X402_PLATFORM_KEY", "ETHERFUSE_API_KEY", "ETHERFUSE_WEBHOOK_URL")
if ($isLocal) {
  $requiredLocalEnv += "ETHERFUSE_WEBHOOK_SECRET"
  foreach ($key in $requiredLocalEnv) {
    $value = Get-EnvValue $key
    Write-Check "env:$key" ([bool]$value) $(if ($value) { "set" } else { "missing" })
  }
} else {
  Write-Check "env:remote-secrets" $true "checked by /v1/deploy/checks"
}

if ($isLocal) {
  try {
    $docker = docker ps --format "{{.Names}}" 2>$null
    Write-Check "docker" ($LASTEXITCODE -eq 0) $(if ($LASTEXITCODE -eq 0) { "reachable" } else { "not reachable" })
  } catch {
    Write-Check "docker" $false "not reachable"
  }

  foreach ($port in @(54321, 54322)) {
    $connection = Test-NetConnection -ComputerName 127.0.0.1 -Port $port -InformationLevel Quiet
    Write-Check "local-port:$port" $connection
  }
}

foreach ($path in @("/v1/health", "/v1/etherfuse/status")) {
  try {
    $response = Invoke-WebRequest -Uri "$ApiUrl$path" -TimeoutSec 20 -UseBasicParsing
    Write-Check "api:$path" ($response.StatusCode -ge 200 -and $response.StatusCode -lt 300) "HTTP $($response.StatusCode)"
  } catch {
    $status = if ($_.Exception.Response) { [int]$_.Exception.Response.StatusCode } else { "n/a" }
    Write-Check "api:$path" $false "HTTP $status"
  }
}

try {
  $response = Invoke-WebRequest -Uri "$ApiUrl/v1/deploy/checks" -TimeoutSec 20 -UseBasicParsing
  Write-Check "api:/v1/deploy/checks" ($response.StatusCode -ge 200 -and $response.StatusCode -lt 300) "HTTP $($response.StatusCode)"
  $checks = $response.Content | ConvertFrom-Json
  foreach ($check in $checks) {
    Write-Check "deploy:$($check.id)" ($check.status -eq "ready") "$($check.status) $($check.value)"
  }
} catch {
  $status = if ($_.Exception.Response) { [int]$_.Exception.Response.StatusCode } else { "n/a" }
  Write-Check "api:/v1/deploy/checks" $false "HTTP $status"
}

Write-Output "Checking Power Totem health..."
$totemsUrl = "$ApiUrl/v1/power-totems"
try {
  $response = Invoke-WebRequest -Uri $totemsUrl -Headers $headers -Method GET -TimeoutSec 20 -UseBasicParsing -ErrorAction Stop
  Write-Check "api:/v1/power-totems" ($response.StatusCode -ge 200 -and $response.StatusCode -lt 300) "HTTP $($response.StatusCode)"
} catch {
  $status = if ($_.Exception.Response) { [int]$_.Exception.Response.StatusCode } else { "n/a" }
  $reachable = $status -eq 401 -or $status -eq 403
  $detail = if ($reachable) { "HTTP $status auth required; route reachable" } else { "HTTP $status" }
  Write-Check "api:/v1/power-totems" $reachable $detail
}

if ($isLocal) {
  $platformKey = Get-EnvValue "X402_PLATFORM_KEY"
  if ($platformKey -and $platformKey.StartsWith("G") -and $platformKey.Length -gt 50) {
    try {
      $account = Invoke-WebRequest -Uri "https://horizon-testnet.stellar.org/accounts/$platformKey" -TimeoutSec 20 -UseBasicParsing
      Write-Check "stellar:X402_PLATFORM_KEY" ($account.StatusCode -eq 200) "funded on testnet"
    } catch {
      $status = if ($_.Exception.Response) { [int]$_.Exception.Response.StatusCode } else { "n/a" }
      Write-Check "stellar:X402_PLATFORM_KEY" $false "HTTP $status"
    }
  } else {
    Write-Check "stellar:X402_PLATFORM_KEY" $false "missing or placeholder"
  }
} else {
  Write-Check "stellar:X402_PLATFORM_KEY" $true "checked by remote deploy checks"
}
