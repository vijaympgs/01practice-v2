@echo off
REM ========================================
REM Retail System Git Configuration Template
REM ========================================
REM 
REM Copy this file to git-config.bat and update with your actual values
REM Then run 00-DAILY_GIT_PUSH.bat which will use this configuration
REM
REM This configuration approach separates your personal Git credentials
REM from the main script, making it more secure and maintainable.
REM

REM ========================================
REM   STEP 1: PERSONAL INFORMATION
REM ========================================

REM Your Git user information (required)
SET GIT_NAME=practice01
SET GIT_EMAIL=vijaymgs@gmail.com

REM ========================================
REM   STEP 2: REPOSITORY INFORMATION
REM ========================================

REM Repository local path (usually no change needed)
SET REPO_PATH=d:\Python\01practice

REM Remote repository URL (required)
REM Examples:
REM - GitHub: https://github.com/yourusername/retail-system.git
REM - GitLab: https://gitlab.com/yourusername/retail-system.git
REM - Bitbucket: https://bitbucket.org/yourusername/retail-system.git
SET REMOTE_URL=https://github.com/vijaympgs/01practice.git

REM Branch name (common: main, master, develop)
SET BRANCH_NAME=main

REM ========================================
REM   STEP 3: OPTIONAL CONFIGURATIONS
REM ========================================

REM Default editor for Git commits (optional)
REM Examples: code, notepad++, vscode, sublime
SET GIT_EDITOR=code

REM Default branch strategy (optional)
REM Options: simple, ours, theirs
SET GIT_MERGE_STRATEGY=simple

REM ========================================
REM   STEP 4: ADVANCED OPTIONS
REM ========================================

REM Auto-push after commits (true/false)
SET AUTO_PUSH=false

REM Pull before pushing (true/false)
SET AUTO_PULL=true

REM Skip SSL verification for private repos (true/false)
SET SKIP_SSL_VERIFY=false

REM ========================================
REM   END OF CONFIGURATION
REM ========================================

echo.
echo ========================================
echo   Retail System Git Configuration
echo ========================================
echo.
echo Personal Information:
echo - Name: %GIT_NAME%
echo - Email: %GIT_EMAIL%
echo.
echo Repository Information:
echo - Local Path: %REPO_PATH%
echo - Remote URL: %REMOTE_URL%
echo - Branch: %BRANCH_NAME%
echo.
echo Optional Settings:
echo - Editor: %GIT_EDITOR%
echo - Merge Strategy: %GIT_MERGE_STRATEGY%
echo - Auto Push: %AUTO_PUSH%
echo - Auto Pull: %AUTO_PULL%
echo - Skip SSL Verify: %SKIP_SSL_VERIFY%
echo.
echo Configuration loaded successfully!
echo.
