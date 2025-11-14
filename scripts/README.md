# Scripts Directory

This directory contains batch files for automating development workflow automation for the Retail System project.

## 📁 Available Scripts

### 🚀 **Development Scripts**
- **`START_BACKEND.bat`** - Start Django backend server
- **`START_FRONTEND.bat` - Start React frontend development server
- **START_BOTH.bat` - Start both backend and frontend servers simultaneously

### 🔧 **Git Scripts**
- **`00-DAILY_GIT_PUSH.bat` - Automated daily git push routine
- **`01-git-config.template.bat` - Git configuration template for new setups

### 📚 **Documentation**
- **`GIT_WORKFLOW_README.md` - Comprehensive Git workflow guide

---

## 🎯 **Usage Instructions**

### **Development Environment**

#### Start Backend Only
```bash
cd scripts
START_BACKEND.bat
```
- Starts Django development server on `http://localhost:8000`
- Opens backend API in browser

#### Start Frontend Only
```bash
cd scripts
START_FRONTEND.bat
```
- Starts React development server on `http://localhost:3003`
- Opens frontend application in browser

#### Start Both Servers
```bash
cd scripts
START_BOTH.bat
```
- Starts both backend and frontend servers
- Opens both applications in separate browser windows
- Recommended for full development environment

### **Git Management**

#### **Configuration-First Git Workflow**
1. **Initial Setup** (one-time):
   ```batch
   copy "01-git-config.template.bat" "git-config.bat"
   ```
2. **Edit Configuration**:
   - Open `git-config.bat` in a text editor
   - Update with your personal Git credentials
   - Set your repository URL and branch name
   - Configure optional settings as needed

3. **Daily Git Operations**:
   ```batch
   cd scripts
   00-DAILY_GIT_PUSH.bat
   ```

#### **Enhanced Git Features**
- **Configuration Validation**: Checks for git-config.bat before proceeding
- **Error Handling**: Clear error messages and setup guidance
- **Automatic Repository Setup**: Initializes Git if needed
- **Timestamp Commits**: Automatic commit messages with timestamps
- **Pull Before Push**: Syncs with remote before pushing
- **Status Reporting**: Shows before/after Git status

---

## 📋 **Script Details**

### **Development Scripts**

#### `START_BACKEND.bat`
- **Purpose**: Launch Django backend server
- **Port**: 8000
- **URL**: http://localhost:8000
- **Features**: Auto-reload on code changes

#### `START_FRONTEND.bat`
- **Purpose**: Launch React frontend server
- **Port**: 3003
- **URL**: http://localhost:3003
- **Features**: Hot module replacement

#### `START_BOTH.bat`
- **Purpose**: Launch both servers simultaneously
- **Windows**: Opens two command prompt windows
- **Browsers**: Opens both applications automatically

### **Git Scripts**

#### `00-DAILY_GIT_PUSH.bat` (Enhanced)
- **Purpose**: Automated daily backup with configuration validation
- **Features**:
  - Configuration validation before proceeding
  - Clear error messages and setup guidance
  - Automatic repository initialization if needed
  - Timestamp-based commit messages
  - Pull before pushing to remote
  - Comprehensive status reporting

#### `01-git-config.template.bat` (Enhanced)
- **Purpose**: Comprehensive Git configuration template
- **Sections**:
  - Personal information setup
  - Repository configuration
  - Optional advanced settings
  - Platform-specific examples
  - Clear documentation

---

## 🔧 **Prerequisites**

### **For Development Scripts**
- Python 3.8+ installed
- Node.js 16+ installed
- Virtual environment activated
- Dependencies installed (`pip install -r requirements.txt`)
- Frontend dependencies installed (`npm install`)

### **For Git Scripts**
- Git installed and configured
- Git repository initialized
- Remote origin configured

---

## 🚨 **Important Notes**

### **Development Scripts**
- **Order**: Start backend before frontend if running separately
- **Ports**: Ensure ports 8000 and 3003 are available
- **Virtual Environment**: Backend scripts require activated virtual environment

### **Git Scripts**
- **Configuration-First**: Validates configuration before operations
- **Security**: Credentials separated from main script
- **Maintainability**: Easy updates without touching main logic
- **User-Friendly**: Clear setup instructions for new users

---

## 🛠️ **Troubleshooting**

### **Common Issues & Solutions**

#### Backend Won't Start
- Check if virtual environment is activated
- Verify dependencies are installed
- Check if port 8000 is available

#### Frontend Won't Start
- Verify Node.js is installed
- Check if `npm install` has been run
- Check if port 3003 is available

#### Git Push Fails
- Check internet connection
- Verify remote repository exists
- Check git configuration in git-config.bat

#### Configuration Issues
- **"git-config.bat not found"**: Copy template and edit with your credentials
- **Invalid repository URL**: Ensure URL follows Git format and you have access
- **Authentication issues**: Check SSH keys or personal access tokens

---

## 📝 **Best Practices**

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

---

## 🔄 **Integration with Development Workflow**

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

---

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

---

## 📚 **Additional Resources**

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

---

## 📞 **Support**

For issues with scripts:
1. Check `GIT_WORKFLOW_README.md` for comprehensive troubleshooting
2. Verify your configuration in git-config.bat
3. Test Git commands manually if needed
4. Consult your Git platform documentation

For issues with the Retail System itself:
- Check the main project README
- Review development documentation
- Contact your development team

---

*Last updated: Enhanced with configuration-first Git workflow approach*
</content>
</replace_in_file>
