@echo off
echo ========================================
echo    Retail System Daily Git Push
echo ========================================
echo.

REM Load Git configuration from external file
if exist git-config.bat (
    echo Loading Git configuration...
    call git-config.bat
) else (
    echo.
    echo ========================================
    echo    ERROR: Git Configuration Not Found!
    echo ========================================
    echo.
    echo Please follow these steps to set up Git configuration:
    echo.
    echo 1. Copy the configuration template:
    echo    copy "01-git-config.template.bat" "git-config.bat"
    echo.
    echo 2. Edit git-config.bat with your actual values:
    echo    - Your name and email
    echo    - Repository URL (GitHub, GitLab, etc.)
    echo    - Branch name (main, master, develop, etc.)
    echo.
    echo 3. Run this script again
    echo.
    echo ========================================
    echo.
    pause
    exit /b 1
)

echo.
echo Configuration loaded successfully:
echo - Name: %GIT_NAME%
echo - Email: %GIT_EMAIL%
echo - Repository: %REPO_PATH%
echo - Remote: %REMOTE_URL%
echo - Branch: %BRANCH_NAME%
echo.

echo.
echo Starting Git operations...
echo.

REM Change to repository directory
cd /d "%REPO_PATH%"
if %errorlevel% neq 0 (
    echo ERROR: Could not change to repository directory: %REPO_PATH%
    pause
    exit /b 1
)

echo Current directory: %CD%
echo.

REM Configure Git user if not already configured
echo Configuring Git user...
git config user.name "%GIT_NAME%"
git config user.email "%GIT_EMAIL%"
if %errorlevel% neq 0 (
    echo ERROR: Failed to configure Git user
    pause
    exit /b 1
)
echo Git user configured successfully.
echo.

REM Check if this is a Git repository
if not exist ".git" (
    echo Initializing Git repository...
    git init
    if %errorlevel% neq 0 (
        echo ERROR: Failed to initialize Git repository
        pause
        exit /b 1
    )
    
    echo Adding remote origin...
    git remote add origin %REMOTE_URL%
    if %errorlevel% neq 0 (
        echo WARNING: Failed to add remote origin (may already exist)
    )
)
echo.

REM Get current date and time for commit message
for /f "tokens=2 delims==" %%a in ('wmic OS Get localdatetime /value') do set "dt=%%a"
set "YYYY=%dt:~0,4%"
set "MM=%dt:~4,2%"
set "DD=%dt:~6,2%"
set "HH=%dt:~8,2%"
set "Min=%dt:~10,2%"
set "Sec=%dt:~12,2%"

set "TIMESTAMP=%YYYY%-%MM%-%DD% %HH%:%Min%:%Sec%"

echo ========================================
echo Git Status and Operations
echo ========================================
echo.

REM Show current status
echo Current Git status:
git status
echo.

REM Add all changes
echo Adding all changes...
git add .
if %errorlevel% neq 0 (
    echo ERROR: Failed to add changes
    pause
    exit /b 1
)
echo Changes added successfully.
echo.

REM Check if there are changes to commit
git diff --cached --quiet
if %errorlevel% equ 0 (
    echo No changes to commit. Repository is up to date.
    pause
    exit /b 0
)

REM Create commit with timestamp
echo Creating commit...
git commit -m "Daily update - 2025-11-14 10:48:11"
if %errorlevel% neq 0 (
    echo ERROR: Failed to create commit
    pause
    exit /b 1
)
echo Commit created successfully.
echo.

REM Pull latest changes from remote
echo Pulling latest changes from remote...
git pull origin %BRANCH_NAME%
if %errorlevel% neq 0 (
    echo WARNING: Failed to pull from remote (may be first push or network issue)
)
echo.

REM Push changes to remote
echo Pushing changes to remote...
git push origin %BRANCH_NAME%
if %errorlevel% neq 0 (
    echo ERROR: Failed to push to remote
    echo.
    echo Possible solutions:
    echo 1. Check your internet connection
    echo 2. Verify remote URL: %REMOTE_URL%
    echo 3. Check if you have authentication set up (SSH key or personal access token)
    echo 4. Try running: git push -u origin %BRANCH_NAME% (for first push)
    pause
    exit /b 1
)
echo Changes pushed successfully!
echo.

REM Show final status
echo ========================================
echo Final Git Status
echo ========================================
git status
echo.

echo ========================================
echo Daily Git Push Completed Successfully!
echo ========================================
echo.
echo Commit details:
echo - Timestamp: %TIMESTAMP%
echo - Branch: %BRANCH_NAME%
echo - Remote: %REMOTE_URL%
echo.

pause
