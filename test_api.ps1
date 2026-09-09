$summary = Invoke-RestMethod -Uri 'http://127.0.0.1:5050/api/dashboard/summary'
Write-Host "=== DASHBOARD SUMMARY ==="
Write-Host ("Today Actual Hours: " + $summary.consistency.todayActualHours)
Write-Host ("Streak: " + $summary.consistency.currentStreak + " days")
Write-Host ("Week Hours: " + $summary.consistency.weekTotalHours)
Write-Host ("Red Alert: " + $summary.consistency.isRedAlert)
Write-Host ("Next Actions Count: " + $summary.recommendations.Count)

$dsa = Invoke-RestMethod -Uri 'http://127.0.0.1:5050/api/dsa/questions'
Write-Host "`n=== DSA OVERVIEW ==="
Write-Host ("Total Questions: " + $dsa.overview.total)
Write-Host ("Solved: " + $dsa.overview.solved)
Write-Host ("Topics count: " + $dsa.topicStats.Count)

$parking = Invoke-RestMethod -Uri 'http://127.0.0.1:5050/api/parking-lot'
Write-Host "`n=== PARKING LOT ==="
Write-Host ("Active Parked Ideas: " + $parking.activeCount)

$projects = Invoke-RestMethod -Uri 'http://127.0.0.1:5050/api/projects'
Write-Host "`n=== PROJECTS ==="
Write-Host ("Projects count: " + $projects.Count)
Write-Host ("Flagship: " + $projects[0].name + " - Features: " + $projects[0].features.Count)

$growth = Invoke-RestMethod -Uri 'http://127.0.0.1:5050/api/growth/heatmap'
Write-Host "`n=== HEATMAP ==="
Write-Host ("Heatmap Days Count: " + $growth.Count)
