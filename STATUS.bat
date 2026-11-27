@echo off
setlocal
cd /d "%~dp0"

echo ==========================================
echo GIT STATUS
echo ==========================================

where git >nul 2>nul
if errorlevel 1 (
    echo ERROR: Git was not found in PATH.
    goto :end
)

echo.
echo Folder:
cd
echo.
echo Branch:
git branch --show-current
echo.
echo Working tree:
git status
echo.
echo Latest commit:
git log -1 --oneline
:end
echo.
pause
endlocal
