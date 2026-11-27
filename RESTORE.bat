@echo off
setlocal
cd /d "%~dp0"

echo ==========================================
echo RESTORE: Discard uncommitted tracked changes
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
git status
echo.
echo WARNING: This permanently discards all uncommitted changes
echo to tracked files in this sandbox.
echo Untracked files are NOT deleted.
echo.
set /p "CONFIRM=Type RESTORE to continue: "
if /i not "%CONFIRM%"=="RESTORE" (
    echo Cancelled. Nothing was changed.
    goto :end
)

git reset --hard HEAD
if errorlevel 1 (
    echo ERROR: Restore failed.
    goto :end
)

echo.
echo Sandbox restored to its latest local commit.
git status
:end
echo.
pause
endlocal
