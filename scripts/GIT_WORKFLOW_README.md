# Retail System Git Workflow

This directory contains batch files for managing Git operations for the Retail System project, following a configuration-first approach for better security and maintainability.

## 🚀 Quick Start

### **First Time Setup**
1. **Copy Configuration Template:**
   ```batch
   copy "01-git-config.template.bat" "git-config.bat"
   ```

2. **Edit Configuration:**
   - Open `git-config.bat` in a text editor
   - Update with your personal Git credentials
   - Set your repository URL and branch name
   - Configure optional settings as needed

3. **Run Daily Git Push:**
   ```batch
   00-DAILY_GIT_PUSH.bat
   ```

## 📁 Available Scripts

### **Git Workflow Scripts**

| Script | Purpose | Description |
|--------|---------|-------------|
| `01-git-config.template.bat` | Configuration template | Template for Git settings |
| `git-config.bat` | Personal configuration | Your actual Git credentials |
| `00-DAILY_GIT_PUSH.bat` | Daily Git operations | Add, commit, push changes |

### **Development Scripts**
| Script | Purpose | Description |
|--------|---------|-------------|
| `START_BACKEND.bat` | Start Django server | Backend development server |
| `START_FRONTEND.bat` | Start React server | Frontend development server |
| `START_BOTH.bat` | Start both servers | Full development environment |

## ⚙️ Configuration Setup

### **Required Configuration**
Edit `git-config.bat` with these minimum settings:

```batch
REM Personal Information
SET GIT_NAME=Your Full Name
SET GIT_EMAIL=your.email@example.com

REM Repository Information
SET REPO_PATH=d:\Python\01practice
SET REMOTE_URL=https://github.com/yourusername/retail-system.git
SET BRANCH_NAME=main
```

### **Optional Configuration**
Enhance your Git workflow with these settings:

```batch
REM Editor Configuration
SET GIT_EDITOR=code

REM Git Behavior
SET GIT_MERGE_STRATEGY=simple
SET AUTO_PUSH=false
SET AUTO_PULL=true
SET SKIP_SSL_VERIFY=false
```

## 🔧 Git Workflow Process

### **Daily Development Workflow**
1. **Configuration Check**: Script validates git-config.bat exists
2. **Load Settings**: Personal Git configuration is loaded
3. **Repository Operations**: Add, commit, push changes
4. **Status Reporting**: Shows final Git status

### **Configuration First Approach**
- ✅ **Security**: Credentials separated from main script
- ✅ **Maintainability**: Easy to update without touching main logic
- ✅ **Validation**: Script checks for configuration before proceeding
- ✅ **Guidance**: Clear setup instructions for new users

## 📋 Script Features

### **00-DAILY_GIT_PUSH.bat Features**
- **Configuration Validation**: Checks for git-config.bat before proceeding
- **Error Handling**: Clear error messages and setup guidance
- **Automatic Repository Setup**: Initializes Git if needed
- **Timestamp Commits**: Automatic commit messages with timestamps
- **Pull Before Push**: Syncs with remote before pushing
- **Status Reporting**: Shows before/after Git status

### **Configuration Template Features**
- **Step-by-Step Guide**: Organized configuration sections
- **Examples Included**: Real-world examples for different platforms
- **Optional Settings**: Advanced Git configuration options
- **Documentation**: Clear explanations for each setting

## 🛠️ Troubleshooting

### **Common Issues & Solutions**

**"git-config.bat not found"**
```batch
copy "01-git-config.template.bat" "git-config.bat"
```
Then edit the copied file with your credentials.

**"Failed to push to remote"**
1. Check internet connection
2. Verify remote URL in git-config.bat
3. Check authentication (SSH key or personal access token)
4. Try: `git push -u origin main` (for first push)

**"No changes to commit"**
- Repository is up to date
- Make changes to your code first
- Run the script again

**"Failed to configure Git user"**
- Check that name and email are set in git-config.bat
- Ensure you have write permissions to the repository
- Try running Git commands manually to diagnose

### **Configuration Issues**

**Invalid Repository URL**
- Ensure URL follows Git format (https://github.com/user/repo.git)
- Check that you have access to the repository
- Verify the repository exists on the Git platform

**Branch Name Issues**
- Use common branch names: main, master, develop
- Ensure branch exists on remote repository
- Check spelling and case sensitivity

## 📝 Best Practices

### **Security**
- Never commit git-config.bat with credentials to version control
- Add git-config.bat to .gitignore if needed
- Use HTTPS URLs for repositories (easier authentication)
- Consider using SSH keys for enhanced security

### **Workflow**
- Run daily Git push at the end of each workday
- Commit frequently with descriptive messages
- Pull latest changes before starting work
- Review changes before pushing

### **Configuration**
- Keep git-config.bat backed up
- Update configuration when repository details change
- Test configuration after making changes
- Document any custom settings for team members

## 🔄 Integration with Development Workflow

### **Before Starting Work**
1. Run `00-DAILY_GIT_PUSH.bat` to sync latest changes
2. Start development servers with `START_BOTH.bat`
3. Work on your features and fixes

### **During Development**
- Make regular commits for important milestones
- Test changes before committing
- Use descriptive commit messages

### **End of Day**
- Run `00-DAILY_GIT_PUSH.bat` to save work
- Review pushed changes
- Plan next day's work

## 🌐 Repository Examples

### **GitHub Setup**
```batch
SET REMOTE_URL=https://github.com/yourusername/retail-system.git
SET BRANCH_NAME=main
```

### **GitLab Setup**
```batch
SET REMOTE_URL=https://gitlab.com/yourusername/retail-system.git
SET BRANCH_NAME=main
```

### **Bitbucket Setup**
```batch
SET REMOTE_URL=https://bitbucket.org/yourusername/retail-system.git
SET BRANCH_NAME=main
```

## 📚 Additional Resources

### **Git Documentation**
- [Pro Git Book](https://git-scm.com/book)
- [GitHub Docs](https://docs.github.com/)
- [GitLab Docs](https://docs.gitlab.com/ee/)

### **Git Best Practices**
- Use conventional commit messages
- Keep commits small and focused
- Write clear pull request descriptions
- Review code before merging

### **Windows Git Tools**
- [Git for Windows](https://git-scm.com/download/win)
- [GitHub Desktop](https://desktop.github.com/)
- [GitKraken](https://www.gitkraken.com/)

## 📞 Support

For issues with the Git workflow scripts:
1. Check this README for troubleshooting steps
2. Verify your configuration in git-config.bat
3. Test Git commands manually if needed
4. Consult your Git platform documentation

For issues with the Retail System itself:
- Check the main project README
- Review development documentation
- Contact your development team

---

**Last Updated**: November 14, 2025  
**Version**: 2.0 - Configuration-First Approach  
**Compatible**: Windows 10/11, Git for Windows
