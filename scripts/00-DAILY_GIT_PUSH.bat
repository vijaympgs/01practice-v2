@echo off
echo ========================================
echo Daily Git Push - NewBorn Retail POS
echo ========================================
echo.

REM === CONFIGURATION - PLEASE UPDATE THESE VALUES ===
REM Set your Git repository path
SET REPO_PATH=d:\Python\01practice

REM Set your Git credentials (update with your actual credentials)
SET GIT_NAME=pratice
SET GIT_EMAIL=vijaymgs@gmail.com

REM Set your remote repository URL
SET REMOTE_URL=https://github.com/vijaympgs/01practice.git

REM Set branch name
SET BRANCH_NAME=main

REM === END OF CONFIGURATION ===

echo Configuration:
echo - Repository Path: %REPO_PATH%
echo - Git User: %GIT_NAME%
echo - Git Email: %GIT_EMAIL%
echo - Remote URL: %REMOTE_URL%
echo - Branch: %BRANCH_NAME%
echo.

REM Ask for confirmation
set /p CONFIRM="Is this configuration correct? (y/n): "
if /i not "%CONFIRM%"=="y" (
    echo Please update the configuration in this batch file.
    pause
    exit /b 1
)

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
git commit -m "Daily update - %TIMESTAMP%

- Backend API fixes and improvements
- Frontend configuration updates
- Database schema changes
- Bug fixes and optimizations

Commit Date: %TIMESTAMP%"
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
