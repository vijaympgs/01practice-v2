# Update Markdown Timestamps Script
# This script updates all markdown files in the project with current timestamps and metadata

param(
    [switch]$All,
    [switch]$Modified,
    [string]$Path = ".",
    [switch]$DryRun
)

# Get current timestamp
$currentTime = Get-Date -Format "yyyy-MM-dd HH:mm:ss zzz"
$shortDate = Get-Date -Format "yyyy-MM-dd"

Write-Host "🕐 Markdown Timestamp Updater" -ForegroundColor Green
Write-Host "Current Time: $currentTime" -ForegroundColor Cyan
Write-Host "Mode: $(if ($All) { 'All Files' } elseif ($Modified) { 'Modified Files Only' } else { 'All Files' })" -ForegroundColor Cyan
Write-Host "Path: $Path" -ForegroundColor Cyan
Write-Host ""

# Function to extract title from markdown content
function Get-MarkdownTitle {
    param([string]$Content)
    
    # Try to extract from first H1
    if ($Content -match '^#\s+(.+)$') {
        return $matches[1]
    }
    
    # Fallback to filename
    return "Untitled Document"
}

# Function to determine category based on path
function Get-DocumentCategory {
    param([string]$FilePath)
    
    $relativePath = $FilePath.Replace((Get-Location).Path, "").TrimStart("\")
    
    if ($relativePath -match "docs") { return "documentation" }
    elseif ($relativePath -match "backend.*test") { return "test" }
    elseif ($relativePath -match "backend.*report") { return "report" }
    elseif ($relativePath -match "backend.*guide") { return "guide" }
    elseif ($relativePath -match "README") { return "readme" }
    elseif ($relativePath -match "demo_data") { return "demo" }
    elseif ($relativePath -match "scripts") { return "script" }
    elseif ($relativePath -match "frontend.*wireframe") { return "wireframe" }
    else { return "documentation" }
}

# Function to generate tags based on content and path
function Get-DocumentTags {
    param([string]$FilePath, [string]$Content)
    
    $tags = @()
    $relativePath = $FilePath.Replace((Get-Location).Path, "").TrimStart("\")
    
    # Path-based tags
    if ($relativePath -match "docs") { $tags += "docs" }
    if ($relativePath -match "backend") { $tags += "backend" }
    if ($relativePath -match "frontend") { $tags += "frontend" }
    if ($relativePath -match "test") { $tags += "test" }
    if ($relativePath -match "api") { $tags += "api" }
    if ($relativePath -match "setup") { $tags += "setup" }
    if ($relativePath -match "guide") { $tags += "guide" }
    if ($relativePath -match "report") { $tags += "report" }
    
    # Content-based tags
    if ($Content -match "#\s+.*API") { $tags += "api" }
    if ($Content -match "#\s+.*Test") { $tags += "test" }
    if ($Content -match "#\s+.*Setup") { $tags += "setup" }
    if ($Content -match "#\s+.*Guide") { $tags += "guide" }
    if ($Content -match "#\s+.*Report") { $tags += "report" }
    if ($Content -match "#\s+.*Implementation") { $tags += "implementation" }
    
    # Remove duplicates and sort
    $tags = $tags | Sort-Object -Unique
    return $tags -join ", "
}

# Function to create frontmatter
function New-FrontMatter {
    param(
        [string]$Title,
        [string]$FilePath,
        [string]$Content
    )
    
    $category = Get-DocumentCategory -FilePath $FilePath
    $tags = Get-DocumentTags -FilePath $FilePath -Content $Content
    $relativePath = $FilePath.Replace((Get-Location).Path, "").TrimStart("\").Replace("\", "/")
    
    $frontmatter = @"
---
title: "$Title"
description: "Documentation file: $Title"
date: "$currentTime"
modified: "$currentTime"
author: "Development Team"
version: "1.0.0"
category: "$category"
tags: [$tags]
project: "Django POS System"
path: "$relativePath"
last_reviewed: "$currentTime"
review_status: "draft"
---

"@
    
    return $frontmatter
}

# Function to check if file has frontmatter
function Has-FrontMatter {
    param([string]$Content)
    
    return $Content.StartsWith("---")
}

# Function to update existing frontmatter
function Update-FrontMatter {
    param(
        [string]$Content,
        [string]$FilePath,
        [string]$Title
    )
    
    # Update modified date
    $updatedContent = $Content -replace '(?m)^modified:\s*.*$', "modified: `"$currentTime`""
    $updatedContent = $updatedContent -replace '(?m)^last_reviewed:\s*.*$', "last_reviewed: `"$currentTime`""
    
    return $updatedContent
}

# Get all markdown files (excluding node_modules and venv)
Write-Host "🔍 Scanning for markdown files..." -ForegroundColor Yellow
$allFiles = Get-ChildItem -Path $Path -Recurse -Filter "*.md" | 
    Where-Object { $_.FullName -notmatch "node_modules|venv" } |
    Sort-Object FullName

Write-Host "Found $($allFiles.Count) markdown files" -ForegroundColor Green
Write-Host ""

# Filter files based on mode
$filesToUpdate = @()
if ($Modified) {
    $filesToUpdate = $allFiles | Where-Object { 
        $_.LastWriteTime -ge (Get-Date).AddDays(-1) 
    }
    Write-Host "📝 Found $($filesToUpdate.Count) recently modified files" -ForegroundColor Yellow
} else {
    $filesToUpdate = $allFiles
    Write-Host "📝 Processing all $($filesToUpdate.Count) files" -ForegroundColor Yellow
}

Write-Host ""

# Process each file
$processedCount = 0
$skippedCount = 0

foreach ($file in $filesToUpdate) {
    $relativePath = $file.FullName.Replace((Get-Location).Path, "").TrimStart("\")
    Write-Host "Processing: $relativePath" -ForegroundColor Cyan
    
    try {
        $content = Get-Content -Path $file.FullName -Raw -Encoding UTF8
        $title = Get-MarkdownTitle -Content $content
        
        if ($DryRun) {
            Write-Host "  📋 DRY RUN - Would update: $title" -ForegroundColor Gray
        } else {
            if (Has-FrontMatter -Content $content) {
                # Update existing frontmatter
                $updatedContent = Update-FrontMatter -Content $content -FilePath $file.FullName -Title $title
                Set-Content -Path $file.FullName -Value $updatedContent -Encoding UTF8 -NoNewline
                Write-Host "  ✅ Updated existing frontmatter" -ForegroundColor Green
            } else {
                # Add new frontmatter
                $frontmatter = New-FrontMatter -Title $title -FilePath $file.FullName -Content $content
                $updatedContent = $frontmatter + $content
                Set-Content -Path $file.FullName -Value $updatedContent -Encoding UTF8 -NoNewline
                Write-Host "  ✅ Added new frontmatter" -ForegroundColor Green
            }
        }
        
        $processedCount++
    }
    catch {
        Write-Host "  ❌ Error: $($_.Exception.Message)" -ForegroundColor Red
        $skippedCount++
    }
}

Write-Host ""
Write-Host "📊 Summary:" -ForegroundColor Green
Write-Host "  Processed: $processedCount files" -ForegroundColor Green
Write-Host "  Skipped: $skippedCount files" -ForegroundColor Red
Write-Host "  Total: $($filesToUpdate.Count) files" -ForegroundColor Cyan

if (-not $DryRun) {
    Write-Host ""
    Write-Host "🎉 Markdown timestamp update completed!" -ForegroundColor Green
} else {
    Write-Host ""
    Write-Host "🔍 DRY RUN completed - No files were modified" -ForegroundColor Yellow
    Write-Host "Run without -DryRun to apply changes" -ForegroundColor Yellow
}
