$ErrorActionPreference = "Stop"

function Test-QuestSystem {
    try {
        # 1. Register/Login
        $username = "quest_tester_$(Get-Random)"
        Write-Host "Registering user: $username"
        
        try {
            $regResponse = Invoke-RestMethod -Uri 'http://localhost:3000/auth/register' -Method Post -ContentType 'application/json' -Body (@{username = $username; email = "$username@test.com"; password = 'password' } | ConvertTo-Json)
        }
        catch {
            Write-Host "Registration failed (user might exist), trying login..."
        }

        $loginResponse = Invoke-RestMethod -Uri 'http://localhost:3000/auth/login' -Method Post -ContentType 'application/json' -Body (@{username = $username; password = 'password' } | ConvertTo-Json)
        $token = $loginResponse.access_token
        $headers = @{Authorization = ("Bearer " + $token) }
        Write-Host "Logged in. Token received."

        # 2. Fetch Quests
        Write-Host "Fetching available quests..."
        $quests = Invoke-RestMethod -Uri 'http://localhost:3000/quest' -Method Get -Headers $headers
        if ($quests.Count -eq 0) {
            Write-Error "No quests found! Seeding might have failed."
        }
        $questId = $quests[0].id
        Write-Host "Found quest: $($quests[0].title) (ID: $questId)"

        # 3. Accept Quest
        Write-Host "Accepting quest..."
        $accepted = Invoke-RestMethod -Uri "http://localhost:3000/quest/$questId/accept" -Method Post -Headers $headers
        Write-Host "Quest accepted. Status: $($accepted.status)"

        # 4. Verify Active
        $myQuests = Invoke-RestMethod -Uri 'http://localhost:3000/quest/my' -Method Get -Headers $headers
        $activeQuest = $myQuests | Where-Object { $_.quest.id -eq $questId }
        if ($activeQuest.status -ne 'ACTIVE') {
            Write-Error "Quest verification failed: Expected ACTIVE, got $($activeQuest.status)"
        }
        Write-Host "Verified quest is ACTIVE."

        # 5. Complete Quest
        Write-Host "Completing quest..."
        $completed = Invoke-RestMethod -Uri "http://localhost:3000/quest/$questId/complete" -Method Post -Headers $headers
        Write-Host "Quest completed. Status: $($completed.status)"

        if ($completed.status -ne 'COMPLETED') {
            Write-Error "Quest completion failed: Expected COMPLETED, got $($completed.status)"
        }
        Write-Host "VERIFICATION SUCCESS"

    }
    catch {
        Write-Error "Test failed: $($_.Exception.Message)"
    }
}

Test-QuestSystem
