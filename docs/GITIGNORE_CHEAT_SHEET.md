# .gitignore Cheat Sheet

## Quick Reference for Common Patterns

### 🚨 Critical Security Patterns
```gitignore
# Environment files (NEVER commit these)
.env
.env.*
*.key
*.pem
secrets/
credentials/

# Database files with sensitive data
*.db
*.sqlite
*.sqlite3
```

### 🐍 Python/Django
```gitignore
# Byte-compiled files
*.py[cod]
__pycache__/
*.pyc

# Virtual environments
venv/
env/
.venv/

# Django specific
*.log
local_settings.py
db.sqlite3
staticfiles/
media/

# Distribution
build/
dist/
*.egg-info/
```

### ⚛️ Node.js/React
```gitignore
# Dependencies
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Build outputs
dist/
build/
.cache/

# Environment files
.env.local
.env.development.local
.env.test.local
.env.production.local
```

### 💻 IDE/Editor Files
```gitignore
# VS Code
.vscode/
!.vscode/settings.json

# JetBrains
.idea/

# Vim/Emacs
*.swp
*.swo
*~
```

### 🖥️ Operating System Files
```gitignore
# macOS
.DS_Store
.AppleDouble
.LSOverride

# Windows
Thumbs.db
ehthumbs.db
Desktop.ini
$RECYCLE.BIN/

# Linux
*~
.fuse_hidden*
```

### 📁 Common Directories
```gitignore
# Logs
logs/
*.log

# Temporary files
tmp/
temp/
*.tmp
*.temp

# Backup files
*.bak
*.backup
*.old
```

## 🎯 Advanced Patterns

### Negation (Include exceptions)
```gitignore
# Ignore all .env files except .env.example
.env*
!.env.example

# Ignore all logs but keep important.log
*.log
!important.log
```

### Directory-Specific
```gitignore
# Ignore entire directory
node_modules/

# Ignore directory contents but keep directory
temp/*
!temp/.gitkeep
```

### Wildcard Patterns
```gitignore
# All files ending with .log
*.log

# All files starting with temp
temp*

# All files containing secret
*secret*
```

## 🔧 Useful Commands

### Check if file is ignored
```bash
git check-ignore path/to/file
```

### List all ignored files
```bash
git status --ignored
```

### Remove already tracked file
```bash
git rm --cached filename
```

### Remove directory from tracking
```bash
git rm -r --cached directory/
```

### Dry run clean
```bash
git clean -fdn
```

## 📋 Project Templates

### Django Project
```gitignore
*.pyc
__pycache__/
*.log
local_settings.py
db.sqlite3
staticfiles/
media/
venv/
.env
```

### React Project
```gitignore
node_modules/
dist/
build/
.env.local
.env.development.local
.env.test.local
.env.production.local
npm-debug.log*
yarn-debug.log*
```

### Full-Stack (Django + React)
```gitignore
# Python
*.pyc
__pycache__/
venv/
*.log
db.sqlite3
staticfiles/
media/

# Node.js
node_modules/
dist/
build/
.env*

# IDE
.vscode/
.idea/

# OS
.DS_Store
Thumbs.db
```

## ⚠️ Common Mistakes to Avoid

### ❌ Don't ignore these in team projects
```gitignore
# Don't ignore lock files in teams
# package-lock.json  # COMMENT THIS OUT
# yarn.lock          # COMMENT THIS OUT
```

### ✅ Do ignore these always
```gitignore
# Always ignore sensitive data
.env
*.key
secrets/
```

### ❌ Don't forget trailing slashes
```gitignore
# Wrong: ignores file named node_modules
node_modules

# Right: ignores directory named node_modules
node_modules/
```

## 🔄 Maintenance Commands

### Check repository size
```bash
git count-objects -vH
```

### Find large files
```bash
git rev-list --objects --all | git cat-file --batch-check='%(objecttype) %(objectname) %(objectsize) %(rest)' | sed -n 's/^blob //p' | sort --numeric-sort --key=2 | tail -10
```

### Clean up history
```bash
# Remove file from history (DANGEROUS!)
git filter-branch --force --index-filter 'git rm --cached --ignore-unmatch path/to/file' --prune-empty --tag-name-filter cat -- --all
```

## 🛡️ Security Checklist

- [ ] `.env` files are ignored
- [ ] API keys and secrets are ignored
- [ ] Database files are ignored
- [ ] Certificate files are ignored
- [ ] No sensitive data in committed files
- [ ] Lock files decision made (track vs ignore)
- [ ] Team alignment on .gitignore strategy

## 📚 Quick Reference Card

| Pattern | What it Ignores | Use Case |
|---------|----------------|----------|
| `*.log` | All .log files | Log files |
| `node_modules/` | Directory | Dependencies |
| `.env*` | Files starting with .env | Environment files |
| `!.env.example` | Exception to .env* | Template file |
| `temp/` | Directory | Temporary files |
| `*.pyc` | All .pyc files | Python bytecode |
| `__pycache__/` | Directory | Python cache |
| `.vscode/` | Directory | VS Code settings |
| `Thumbs.db` | File | Windows thumbnail |

## 🔗 External Resources

- [Git .gitignore Documentation](https://git-scm.com/docs/gitignore)
- [GitHub .gitignore Templates](https://github.com/github/gitignore)
- [GitIgnore.io](https://www.toptal.com/developers/gitignore) - Interactive generator
- [Git Secrets Tool](https://github.com/awslabs/git-secrets)

---

**Pro Tip**: Start with a comprehensive .gitignore and remove patterns you don't need. It's easier to remove exclusions than to add forgotten ones later!
