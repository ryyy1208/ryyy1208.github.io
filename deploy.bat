@echo off
chcp 65001 >nul
cd /d "%~dp0"

echo [1/3] Building...
call npm run build

echo [2/3] Committing...
git add -A
git diff --cached --quiet && echo No changes to commit. && goto :push
git commit -m "vault backup: %date:~0,4%-%date:~5,2%-%date:~8,2% %time:~0,2%:%time:~3,2%"

:push
echo [3/3] Pushing to GitHub...
git push origin main

echo.
echo Done!
pause
