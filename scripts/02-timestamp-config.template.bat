@echo off
REM ========================================
REM Retail System Markdown Timestamp Configuration
REM ========================================
REM 
REM Copy this file to timestamp-config.bat and update with your actual values
REM Then run update-markdown-timestamps.bat which will use this configuration
REM
REM This configuration approach separates your timestamp settings
REM from the main script, making it more customizable and maintainable.
REM

REM ========================================
REM   STEP 1: PROJECT INFORMATION
REM ========================================

REM Project name and details
SET PROJECT_NAME=Retail System
SET PROJECT_DESCRIPTION=Django-based Retail Management System
SET PROJECT_VERSION=2.0.0

REM Default author information
SET DEFAULT_AUTHOR=Development Team
SET DEFAULT_EMAIL=dev@retailsystem.com

REM ========================================
REM   STEP 2: TIMESTAMP SETTINGS
REM ========================================

REM Timestamp format options:
REM FORMAT1: 2025-11-14 16:40:00 (Standard)
REM FORMAT2: 2025-11-14T16:40:00Z (ISO)
REM FORMAT3: 2025-11-14 16:40:00+05:30 (With timezone)
SET TIMESTAMP_FORMAT=FORMAT1

REM Timezone handling
SET TIMEZONE=UTC
SET INCLUDE_TIMEZONE=false

REM ========================================
REM   STEP 3: FILE PROCESSING SETTINGS
REM ========================================

REM Base directory for processing (relative to scripts folder)
SET BASE_DIRECTORY=..

REM File patterns to include
SET INCLUDE_PATTERNS=*.md

REM Directories to exclude (comma-separated)
SET EXCLUDE_DIRECTORIES=node_modules,venv,__pycache__,.git,dist,build

REM Files to exclude (comma-separated, wildcards allowed)
SET EXCLUDE_FILES=*.tmp.md,*~.md

REM ========================================
REM   STEP 4: FRONTMATTER SETTINGS
REM ========================================

REM Default frontmatter fields to include
SET INCLUDE_TITLE=true
SET INCLUDE_DESCRIPTION=true
SET INCLUDE_DATE=true
SET INCLUDE_MODIFIED=true
SET INCLUDE_AUTHOR=true
SET INCLUDE_VERSION=true
SET INCLUDE_CATEGORY=true
SET INCLUDE_TAGS=true
SET INCLUDE_PROJECT=true
SET INCLUDE_PATH=true
SET INCLUDE_REVIEW_STATUS=true

REM Default values
SET DEFAULT_CATEGORY=documentation
SET DEFAULT_REVIEW_STATUS=draft
SET DEFAULT_TAGS=docs,timestamp

REM ========================================
REM   STEP 5: ADVANCED OPTIONS
REM ========================================

REM Backup settings
SET CREATE_BACKUP=true
SET BACKUP_DIRECTORY=timestamp_backups
SET MAX_BACKUP_FILES=10

REM Processing options
SET DRY_RUN=false
SET VERBOSE_OUTPUT=true
SET SHOW_PROGRESS=true
SET CONFIRM_BEFORE_PROCESSING=false

REM File handling
SET PRESERVE_EXISTING_FRONTMATTER=true
SET_UPDATE_EXISTING_ONLY=false
SET SKIP_FILES_WITHOUT_CHANGES=false

REM ========================================
REM   STEP 6: CUSTOMIZATION OPTIONS
REM ========================================

REM Custom metadata fields (comma-separated)
REM Format: field_name:field_value
SET CUSTOM_FIELDS=

REM Category mapping (path:category)
REM Format: backend/docs:api-docs,frontend:ui-docs
SET CATEGORY_MAPPING=

REM Tag generation rules
SET AUTO_GENERATE_TAGS=true
SET TAG_FROM_PATH=true
SET TAG_FROM_CONTENT=true

REM ========================================
REM   STEP 7: LOGGING AND REPORTING
REM ========================================

REM Logging settings
SET ENABLE_LOGGING=true
SET LOG_FILE=timestamp_processing.log
SET LOG_LEVEL=INFO

REM Reporting settings
SET_GENERATE_REPORT=true
SET REPORT_FILE=timestamp_report.json
SET_INCLUDE_FILE_LISTS=true

REM ========================================
REM   END OF CONFIGURATION
REM ========================================

echo.
echo ========================================
echo   Retail System Timestamp Configuration
echo ========================================
echo.
echo Project Information:
echo - Name: %PROJECT_NAME%
echo - Description: %PROJECT_DESCRIPTION%
echo - Version: %PROJECT_VERSION%
echo - Author: %DEFAULT_AUTHOR%
echo.
echo Timestamp Settings:
echo - Format: %TIMESTAMP_FORMAT%
echo - Timezone: %TIMEZONE%
echo - Include Timezone: %INCLUDE_TIMEZONE%
echo.
echo File Processing:
echo - Base Directory: %BASE_DIRECTORY%
echo - Include Patterns: %INCLUDE_PATTERNS%
echo - Exclude Directories: %EXCLUDE_DIRECTORIES%
echo - Exclude Files: %EXCLUDE_FILES%
echo.
echo Frontmatter Settings:
echo - Include Title: %INCLUDE_TITLE%
echo - Include Description: %INCLUDE_DESCRIPTION%
echo - Include Date: %INCLUDE_DATE%
echo - Include Modified: %INCLUDE_MODIFIED%
echo - Include Author: %INCLUDE_AUTHOR%
echo - Include Version: %INCLUDE_VERSION%
echo - Include Category: %INCLUDE_CATEGORY%
echo - Include Tags: %INCLUDE_TAGS%
echo - Include Project: %INCLUDE_PROJECT%
echo - Include Path: %INCLUDE_PATH%
echo - Include Review Status: %INCLUDE_REVIEW_STATUS%
echo.
echo Advanced Options:
echo - Create Backup: %CREATE_BACKUP%
echo - Backup Directory: %BACKUP_DIRECTORY%
echo - Max Backup Files: %MAX_BACKUP_FILES%
echo - Dry Run: %DRY_RUN%
echo - Verbose Output: %VERBOSE_OUTPUT%
echo - Show Progress: %SHOW_PROGRESS%
echo - Confirm Before Processing: %CONFIRM_BEFORE_PROCESSING%
echo.
echo Customization:
echo - Custom Fields: %CUSTOM_FIELDS%
echo - Category Mapping: %CATEGORY_MAPPING%
echo - Auto Generate Tags: %AUTO_GENERATE_TAGS%
echo - Tag From Path: %TAG_FROM_PATH%
echo - Tag From Content: %TAG_FROM_CONTENT%
echo.
echo Logging and Reporting:
echo - Enable Logging: %ENABLE_LOGGING%
echo - Log File: %LOG_FILE%
echo - Log Level: %LOG_LEVEL%
echo - Generate Report: %GENERATE_REPORT%
echo - Report File: %REPORT_FILE%
echo - Include File Lists: %INCLUDE_FILE_LISTS%
echo.
echo Configuration loaded successfully!
echo.
