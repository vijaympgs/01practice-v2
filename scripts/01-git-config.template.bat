@echo off
REM ========================================
REM Git Configuration Template
REM ========================================
REM 
REM Copy this file to git-config.bat and update with your actual values
REM Then run DAILY_GIT_PUSH.bat which will use this configuration
REM

REM === UPDATE THESE VALUES WITH YOUR ACTUAL CREDENTIALS ===

REM Your Git user information
SET GIT_NAME=Your Full Name
SET GIT_EMAIL=your.email@example.com

REM Your repository information
SET REPO_PATH=d:\Python\01practice
SET REMOTE_URL=https://github.com/yourusername/your-repo.git
SET BRANCH_NAME=main

REM === END OF CONFIGURATION ===

echo Git configuration loaded:
echo - Name: %GIT_NAME%
echo - Email: %GIT_EMAIL%
echo - Repository: %REPO_PATH%
echo - Remote: %REMOTE_URL%
echo - Branch: %BRANCH_NAME%
