# --- Configuration ---
$instruction = "Create two python agents: one for drawing right-angled triangles and one for equilateral triangles."
$model = "gpt-5-mini" # Assumes support for this model name
$branchName = "feat/triangle-agents-$(Get-Date -Format 'yyyyMMddHHmm')"

# --- 1. Perform Summary Task on Main Thread ---
Write-Host "--- Main Thread: Starting Project Summary ---" -ForegroundColor Cyan
# Simulation of a summary task
$fileCount = (Get-ChildItem -Recurse | Measure-Object).Count
Write-Host "Summary: Analyzing $fileCount files in current directory..." -ForegroundColor DarkCyan
Start-Sleep -Seconds 2
Write-Host "--- Main Thread: Summary Complete ---" -ForegroundColor Cyan

# --- 2. Delegate Task to GitHub Copilot CLI in Background ---
Write-Host "`n--- Delegating Task to Copilot CLI ($model) ---" -ForegroundColor Yellow

# git checkout -b $branchName # Optional: Ensure new branch

# The delegation command:
# - 'gh copilot delegate' sends the current context
# - '--model' specifies the model
# - The trailing string is the instruction
copilot -i "delegate --model gpt-5-mini --prompt $instruction "

Write-Host "--- Background Delegation Submitted ---" -ForegroundColor Yellow
Write-Host "Copilot will create a PR in the background." -ForegroundColor Gray
