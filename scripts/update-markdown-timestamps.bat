@echo off
echo ========================================
echo    Retail System Markdown Timestamp Updater
echo ========================================
echo.

REM Load timestamp configuration from external file
if exist timestamp-config.bat (
    echo Loading timestamp configuration...
    call timestamp-config.bat
) else (
    echo.
    echo ========================================
    echo    ERROR: Timestamp Configuration Not Found!
    echo ========================================
    echo.
    echo Please follow these steps to set up timestamp configuration:
    echo.
    echo 1. Copy the configuration template:
    echo    copy "02-timestamp-config.template.bat" "timestamp-config.bat"
    echo.
    echo 2. Edit timestamp-config.bat with your actual values:
    echo    - Project name and description
    echo    - Author information
    echo    - File processing settings
    echo    - Frontmatter preferences
    echo    - Advanced options
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
echo - Project: %PROJECT_NAME%
echo - Author: %DEFAULT_AUTHOR%
echo - Base Directory: %BASE_DIRECTORY%
echo - Timestamp Format: %TIMESTAMP_FORMAT%
echo.

REM Get current timestamp based on format setting
for /f "tokens=2 delims==" %%a in ('wmic OS Get localdatetime /value') do set "datetime=%%a"

if "%TIMESTAMP_FORMAT%"=="FORMAT1" (
    set "currentTime=%datetime:~0,4%-%datetime:~4,2%-%datetime:~6,2% %datetime:~8,2%:%datetime:~10,2%:%datetime:~12,2%"
) else if "%TIMESTAMP_FORMAT%"=="FORMAT2" (
    set "currentTime=%datetime:~0,4%-%datetime:~4,2%-%datetime:~6,2%T%datetime:~8,2%:%datetime:~10,2%:%datetime:~12,2%Z"
) else if "%TIMESTAMP_FORMAT%"=="FORMAT3" (
    set "currentTime=%datetime:~0,4%-%datetime:~4,2%-%datetime:~6,2% %datetime:~8,2%:%datetime:~10,2%:%datetime:~12,2%+05:30"
) else (
    set "currentTime=%datetime:~0,4%-%datetime:~4,2%-%datetime:~6,2% %datetime:~8,2%:%datetime:~10,2%:%datetime:~12,2%"
)

echo Current Time: %currentTime%
echo Scanning for markdown files in %BASE_DIRECTORY%...
echo.

REM Create backup directory if needed
if "%CREATE_BACKUP%"=="true" (
    if not exist "%BACKUP_DIRECTORY%" mkdir "%BACKUP_DIRECTORY%"
    echo Backup directory: %BACKUP_DIRECTORY%
)

REM Initialize counters
set count=0
set skipped=0
set errors=0

REM Process markdown files
for /r %BASE_DIRECTORY% %%f in (%INCLUDE_PATTERNS%) do (
    REM Check if file should be excluded
    set "shouldSkip=false"
    
    REM Check excluded directories
    for %%d in ("%EXCLUDE_DIRECTORIES:,=" "%") do (
        echo %%f | findstr /i "%%~d" >nul
        if not errorlevel 1 set "shouldSkip=true"
    )
    
    REM Check excluded files
    for %%e in ("%EXCLUDE_FILES:,=" "%") do (
        echo "%%~nxf" | findstr /i "%%~e" >nul
        if not errorlevel 1 set "shouldSkip=true"
    )
    
    if "%shouldSkip%"=="false" (
        set /a count+=1
        
        if "%VERBOSE_OUTPUT%"=="true" echo Processing: %%f
        
        REM Create backup if enabled
        if "%CREATE_BACKUP%"=="true" (
            copy "%%f" "%BACKUP_DIRECTORY%\%%~nxf.bak" >nul 2>&1
        )
        
        REM Generate frontmatter based on configuration
        call :GenerateFrontmatter "%%f" "%%~nxf"
        
        if errorlevel 1 (
            set /a errors+=1
            if "%VERBOSE_OUTPUT%"=="true" echo   ❌ Error processing file
        ) else (
            if "%VERBOSE_OUTPUT%"=="true" echo   ✅ Updated with timestamp
        )
    ) else (
        set /a skipped+=1
        if "%VERBOSE_OUTPUT%"=="true" echo Skipping: %%f
    )
)

echo.
echo 📊 Processing Summary:
echo   Processed: %count% files
echo   Skipped: %skipped% files
echo   Errors: %errors% files
echo.

if "%GENERATE_REPORT%"=="true" (
    echo Generating report...
    call :GenerateReport %count% %skipped% %errors%
)

echo 🎉 Markdown timestamp update completed!
pause
exit /b 0

:GenerateFrontmatter
set "filePath=%~1"
set "fileName=%~2"

REM Extract title from filename
set "title=%fileName%"
set "title=%title:.md=%"

REM Create temporary file with frontmatter
set "tempFile=%filePath%.tmp"

echo --- > "%tempFile%"

if "%INCLUDE_TITLE%"=="true" (
    echo title: "%title%" >> "%tempFile%"
)

if "%INCLUDE_DESCRIPTION%"=="true" (
    echo description: "Documentation file: %title%" >> "%tempFile%"
)

if "%INCLUDE_DATE%"=="true" (
    echo date: "%currentTime%" >> "%tempFile%"
)

if "%INCLUDE_MODIFIED%"=="true" (
    echo modified: "%currentTime%" >> "%tempFile%"
)

if "%INCLUDE_AUTHOR%"=="true" (
    echo author: "%DEFAULT_AUTHOR%" >> "%tempFile%"
)

if "%INCLUDE_VERSION%"=="true" (
    echo version: "%PROJECT_VERSION%" >> "%tempFile%"
)

if "%INCLUDE_CATEGORY%"=="true" (
    echo category: "%DEFAULT_CATEGORY%" >> "%tempFile%"
)

if "%INCLUDE_TAGS%"=="true" (
    echo tags: [%DEFAULT_TAGS%] >> "%tempFile%"
)

if "%INCLUDE_PROJECT%"=="true" (
    echo project: "%PROJECT_NAME%" >> "%tempFile%"
)

if "%INCLUDE_PATH%"=="true" (
    REM Get relative path
    set "relativePath=%filePath%"
    set "relativePath=%relativePath:*scripts\=%"
    echo path: "%relativePath%" >> "%tempFile%"
)

if "%INCLUDE_REVIEW_STATUS%"=="true" (
    echo last_reviewed: "%currentTime%" >> "%tempFile%"
    echo review_status: "%DEFAULT_REVIEW_STATUS%" >> "%tempFile%"
)

echo --- >> "%tempFile%"
echo. >> "%tempFile%"

REM Append original content
type "%filePath%" >> "%tempFile%"

REM Replace original file
move "%tempFile%" "%filePath%" >nul

exit /b 0

:GenerateReport
set "processed=%~1"
set "skipped=%~2"
set "errors=%~3"

echo { > "%REPORT_FILE%"
echo   "timestamp": "%currentTime%", >> "%REPORT_FILE%"
echo   "project": "%PROJECT_NAME%", >> "%REPORT_FILE%"
echo   "version": "%PROJECT_VERSION%", >> "%REPORT_FILE%"
echo   "summary": { >> "%REPORT_FILE%"
echo     "processed": %processed%, >> "%REPORT_FILE%"
echo     "skipped": %skipped%, >> "%REPORT_FILE%"
echo     "errors": %errors% >> "%REPORT_FILE%"
echo   }, >> "%REPORT_FILE%"
echo   "configuration": { >> "%REPORT_FILE%"
echo     "base_directory": "%BASE_DIRECTORY%", >> "%REPORT_FILE%"
echo     "include_patterns": "%INCLUDE_PATTERNS%", >> "%REPORT_FILE%"
echo     "exclude_directories": "%EXCLUDE_DIRECTORIES%", >> "%REPORT_FILE%"
echo     "timestamp_format": "%TIMESTAMP_FORMAT%" >> "%REPORT_FILE%"
echo   } >> "%REPORT_FILE%"
echo } >> "%REPORT_FILE%"

exit /b 0
