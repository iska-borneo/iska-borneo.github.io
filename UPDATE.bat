@echo off
setlocal
cd /d "%~dp0"

echo ==========================================
echo UPDATE: Bring GitHub main into sandbox
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

set "HASCHANGES="
for /f "delims=" %%A in ('git status --porcelain') do set "HASCHANGES=1"
if defined HASCHANGES (
    echo ERROR: Your sandbox has uncommitted changes or untracked files.
    echo Save or remove them before updating.
    git status
    goto :end
)

echo.
echo Fetching and merging the latest GitHub main...
git pull origin main --no-edit
if errorlevel 1 (
    echo.
    echo UPDATE DID NOT COMPLETE.
    echo If Git reports merge conflicts, resolve them or run:
    echo git merge --abort
    goto :end
)

echo.
echo SUCCESS: GitHub main has been merged into your sandbox.
git status
:end
echo.
pause
endlocal
