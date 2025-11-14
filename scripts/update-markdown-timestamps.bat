@echo off
echo 🕐 Markdown Timestamp Updater
echo.

REM Get current timestamp
for /f "tokens=2 delims==" %%a in ('wmic OS Get localdatetime /value') do set "datetime=%%a"
set "currentTime=%datetime:~0,4%-%datetime:~4,2%-%datetime:~6,2% %datetime:~8,2%:%datetime:~10,2%:%datetime:~12,2%"

echo Current Time: %currentTime%
echo Scanning for markdown files...
echo.

REM Count and process markdown files
set count=0
for /r .. %%f in (*.md) do (
    REM Skip node_modules and venv directories
    echo %%f | findstr /i "node_modules" >nul
    if errorlevel 1 echo %%f | findstr /i "venv" >nul
    if errorlevel 1 (
        set /a count+=1
        echo Processing: %%f
        
        REM Read the file and add timestamp
        echo --- > "%%f.tmp"
        echo title: "Documentation File" >> "%%f.tmp"
        echo description: "Documentation file with automatic timestamp" >> "%%f.tmp"
        echo date: "%currentTime%" >> "%%f.tmp"
        echo modified: "%currentTime%" >> "%%f.tmp"
        echo author: "Development Team" >> "%%f.tmp"
        echo version: "1.0.0" >> "%%f.tmp"
        echo category: "documentation" >> "%%f.tmp"
        echo tags: [docs, timestamp] >> "%%f.tmp"
        echo project: "Django POS System" >> "%%f.tmp"
        echo path: "%%f" >> "%%f.tmp"
        echo last_reviewed: "%currentTime%" >> "%%f.tmp"
        echo review_status: "draft" >> "%%f.tmp"
        echo --- >> "%%f.tmp"
        echo. >> "%%f.tmp"
        
        REM Append original content
        type "%%f" >> "%%f.tmp"
        
        REM Replace original file
        move "%%f.tmp" "%%f" >nul
        echo   ✅ Updated with timestamp
    )
)

echo.
echo 📊 Summary:
echo   Processed: %count% files
echo.
echo 🎉 Markdown timestamp update completed!
pause
