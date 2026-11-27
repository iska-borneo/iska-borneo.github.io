@echo off
setlocal
cd /d "%~dp0"

echo ==========================================
echo SAVE: Commit and push sandbox changes
echo ==========================================

where git >nul 2>nul
if errorlevel 1 (
    echo ERROR: Git was not found in PATH.
    goto :end
)

for /f %%B in ('git branch --show-current') do set "BRANCH=%%B"
if not "%BRANCH%"=="sandbox" (
    echo ERROR: This file must be run from the sandbox branch.
    echo Current branch: %BRANCH%
    goto :end
)

echo.
set /p "TITLE=Enter a commit title: "
if not defined TITLE (
    echo No title entered. Nothing was committed.
    goto :end
)

echo.
echo Staging changes...
git add -A
if errorlevel 1 (
    echo ERROR: Could not stage changes.
    goto :end
)

git diff --cached --quiet
if errorlevel 2 (
    echo ERROR: Could not inspect staged changes.
    goto :end
)
if not errorlevel 1 (
    echo There are no changes to commit.
    goto :end
)

echo.
git commit -m "%TITLE%"
if errorlevel 1 (
    echo ERROR: Commit failed. Check the message above.
    goto :end
)

echo.
echo Pushing sandbox branch to GitHub...
git push -u origin sandbox
if errorlevel 1 (
    echo.
    echo The commit was saved locally, but the push failed.
    echo Your commit is not yet backed up on GitHub.
    goto :end
)

echo.
echo SUCCESS: Changes committed locally and pushed to GitHub.
:end
echo.
pause
endlocal
