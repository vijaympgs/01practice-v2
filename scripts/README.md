# Scripts

This folder contains all batch files for automating common development tasks.

## 📁 Available Scripts

### 🚀 **Development Scripts**
- **`START_BACKEND.bat`** - Start the Django backend server
- **`START_FRONTEND.bat`** - Start the React frontend development server
- **`START_BOTH.bat`** - Start both backend and frontend servers simultaneously

### 🔧 **Git Scripts**
- **`00-DAILY_GIT_PUSH.bat`** - Automated daily git push routine
- **`01-git-config.template.bat`** - Git configuration template for new setups

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

#### Daily Git Push
```bash
cd scripts
00-DAILY_GIT_PUSH.bat
```
- Adds all changes to git
- Creates commit with timestamp
- Pushes to remote repository
- **Note**: Run this at the end of each workday

#### Initial Git Configuration
```bash
cd scripts
01-git-config.template.bat
```
- Sets up git user configuration
- Configures default editor
- **Note**: Run this once when setting up new development machine

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

#### `00-DAILY_GIT_PUSH.bat`
- **Purpose**: Automated daily backup
- **Commit Message**: Auto-generated with timestamp
- **Safety**: Asks for confirmation before pushing

#### `01-git-config.template.bat`
- **Purpose**: Initial git setup
- **Configuration**: User name, email, editor
- **One-time**: Only needs to be run once per machine

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
- **Backup**: Daily git push creates automatic backups
- **Configuration**: Git config template needs manual editing for user details
- **Permissions**: Ensure you have push access to remote repository

---

## 🛠️ **Troubleshooting**

### **Common Issues**

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
- Check git configuration

### **Solutions**

#### Port Conflicts
```bash
# Check what's using ports
netstat -ano | findstr :8000
netstat -ano | findstr :3003

# Kill processes if needed
taskkill /PID <PROCESS_ID> /F
```

#### Virtual Environment Issues
```bash
# Activate virtual environment
cd backend
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

#### Frontend Dependencies
```bash
cd frontend
npm install
```

---

## 📝 **Customization**

### **Adding New Scripts**
1. Create new `.bat` file in `scripts/` folder
2. Add descriptive comment at top of file
3. Update this README with new script information
4. Follow existing naming conventions

### **Modifying Existing Scripts**
- Test changes thoroughly
- Update documentation accordingly
- Maintain backward compatibility when possible

---

## 🤝 **Support**

For issues with scripts:
1. Check troubleshooting section above
2. Verify all prerequisites are met
3. Ask for clarification on specific script functionality

---

*Last updated: Scripts organization completed*
