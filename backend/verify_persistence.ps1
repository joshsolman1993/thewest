$ErrorActionPreference = "Stop"

try {
    Write-Host "Logging in..."
    $loginResponse = Invoke-RestMethod -Uri 'http://localhost:3000/auth/login' -Method Post -ContentType 'application/json' -Body (@{username='pt4'; password='password'} | ConvertTo-Json)
    $token = $loginResponse.access_token
    Write-Host "Token received."

    $headers = @{Authorization=("Bearer " + $token)}

    Write-Host "Creating Character..."
    try {
        $char = Invoke-RestMethod -Uri 'http://localhost:3000/character' -Method Post -ContentType 'application/json' -Headers $headers -Body (@{name='SlingerScript'} | ConvertTo-Json)
        Write-Host "Character Created: $($char.name)"
    } catch {
        Write-Host "Character creation failed (maybe already exists?): $($_.Exception.Message)"
    }

    Write-Host "Fetching Character..."
    $fetched = Invoke-RestMethod -Uri 'http://localhost:3000/character' -Method Get -Headers $headers
    Write-Host "Fetched Character: Name=$($fetched.name), Level=$($fetched.level), Gold=$($fetched.gold)"

    if ($fetched.name -eq 'Slinger' -or $fetched.name -eq 'SlingerScript') {
        Write-Host "VERIFICATION SUCCESS"
    } else {
        Write-Host "VERIFICATION FAILED: Name mismatch"
    }
} catch {
    Write-Host "Error: $($_.Exception.Message)"
    exit 1
}
