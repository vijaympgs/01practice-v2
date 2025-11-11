# Project Structure

This document provides an overview of the project organization and how to navigate the codebase.

## 📁 Project Structure

```
d:/Python/01practice/
├── 📁 backend/                 # Django backend application
│   ├── 📁 business_rules/       # Business logic modules
│   ├── 📁 categories/           # Product categories
│   ├── 📁 code_settings/        # System configuration
│   ├── 📁 config/              # Django settings and URLs
│   ├── 📁 customers/           # Customer management
│   ├── 📁 db_client/           # Database client utilities
│   ├── 📁 geographical_data/   # Geographical data models
│   ├── 📁 geography/           # Geography modules
│   ├── 📁 inventory/           # Inventory management
│   ├── 📁 locations/           # Location management
│   ├── 📁 merchandise/         # Merchandise handling
│   ├── 📁 organization/        # Company and location models
│   ├── 📁 pay_modes/           # Payment modes
│   ├── 📁 payments/            # Payment processing
│   ├── 📁 pos_masters/         # POS master data
│   ├── 📁 pos_programs/        # POS programs
│   ├── 📁 procurement/         # Procurement management
│   ├── 📁 products/            # Product management
│   ├── 📁 reports/             # Reporting modules
│   ├── 📁 sales/               # Sales management
│   ├── 📁 seed_data/           # Seed data for geographical regions
│   ├── 📁 suppliers/           # Supplier management
│   ├── 📁 tax_management/      # Tax management
│   ├── 📁 taxes/               # Tax configuration
│   ├── 📁 theme_management/    # Theme management
│   ├── 📁 users/               # User management and authentication
│   ├── 📁 utils/               # Utility functions
│   ├── 🐍 manage.py            # Django management script
│   ├── 📄 requirements.txt     # Python dependencies
│   └── 📄 db.sqlite3           # SQLite database
│
├── 📁 frontend/                # React frontend application
│   ├── 📁 public/              # Static assets
│   ├── 📁 src/                 # React source code
│   │   ├── 📁 components/      # Reusable React components
│   │   ├── 📁 pages/           # Page components
│   │   ├── 📁 services/        # API services
│   │   └── 📄 App.jsx          # Main React component
│   ├── 📄 package.json         # Node.js dependencies
│   └── 📄 vite.config.js       # Vite configuration
│
├── 📁 docs/                    # 📚 Project documentation
│   ├── 📄 README.md            # Documentation index and guide
│   ├── 📄 DEMO_SETUP.md        # Demo data setup instructions
│   ├── 📄 GIT_SETUP_INSTRUCTIONS.md # Git configuration guide
│   ├── 📄 API_FIXES_SUMMARY.md # API fixes documentation
│   ├── 📄 CONSOLE_LOGS_ANALYSIS_AND_FIXES.md # Debugging guide
│   ├── 📄 ROLE_BASED_LOCATION_ACCESS_IMPLEMENTATION.md # Location access system
│   ├── 📄 LOCATION_SELECTOR_IMPLEMENTATION_SUMMARY.md # Location selector component
│   ├── 📄 GEOGRAPHICAL_DATA_IMPLEMENTATION_SUMMARY.md # Geographical data system
│   └── 📄 folder-structure.md  # Detailed folder structure
│
├── 📁 scripts/                 # 🚀 Development and utility scripts
│   ├── 📄 README.md            # Scripts documentation and usage guide
│   ├── 🦇 START_BACKEND.bat    # Start Django backend server
│   ├── 🦇 START_FRONTEND.bat   # Start React frontend server
│   ├── 🦇 START_BOTH.bat       # Start both servers simultaneously
│   ├── 🦇 00-DAILY_GIT_PUSH.bat # Automated daily git push
│   └── 🦇 01-git-config.template.bat # Git configuration template
│
└── 📄 README.md                # This file - Project overview
```

---

## 🚀 Quick Start

### **1. Development Environment**
```bash
# Start both backend and frontend
cd scripts
START_BOTH.bat

# Or start individually
START_BACKEND.bat    # Backend on http://localhost:8000
START_FRONTEND.bat   # Frontend on http://localhost:3003
```

### **2. Demo Data Setup**
```bash
# Read the demo setup guide
cat docs/DEMO_SETUP.md

# Run demo data creation
cd backend
python create_demo_data.py
python seed_data/populate_geographical_data.py
```

### **3. Git Configuration**
```bash
# Initial git setup
cd scripts
01-git-config.template.bat

# Daily backup
00-DAILY_GIT_PUSH.bat
```

---

## 📚 Documentation

### **📖 User Guides**
- **[DEMO_SETUP.md](docs/DEMO_SETUP.md)** - Complete demo setup instructions
- **[GIT_SETUP_INSTRUCTIONS.md](docs/GIT_SETUP_INSTRUCTIONS.md)** - Git configuration guide

### **🛠️ Technical Documentation**
- **[API_FIXES_SUMMARY.md](docs/API_FIXES_SUMMARY.md)** - API changes and fixes
- **[ROLE_BASED_LOCATION_ACCESS_IMPLEMENTATION.md](docs/ROLE_BASED_LOCATION_ACCESS_IMPLEMENTATION.md)** - Location access control
- **[LOCATION_SELECTOR_IMPLEMENTATION_SUMMARY.md](docs/LOCATION_SELECTOR_IMPLEMENTATION_SUMMARY.md)** - Frontend components
- **[GEOGRAPHICAL_DATA_IMPLEMENTATION_SUMMARY.md](docs/GEOGRAPHICAL_DATA_IMPLEMENTATION_SUMMARY.md)** - Geographical data system

### **🔧 Reference**
- **[folder-structure.md](docs/folder-structure.md)** - Detailed project structure
- **[scripts/README.md](scripts/README.md)** - Scripts documentation and usage

---

## 🎯 Key Features

### **🏢 Location Management**
- Role-based location access control
- 6 location types (store, headquarters, warehouse, distribution, factory, showroom)
- User-location mapping system
- Location selection interface

### **🌍 Geographical Data**
- Comprehensive data for 11 countries
- 50 states/provinces across multiple regions
- 314 cities with complete information
- Middle East, Africa, Asia, Americas, Europe coverage

### **👥 User Management**
- 5 user roles with different access levels
- Demo users for testing all scenarios
- Authentication and authorization system
- Session-based location selection

### **🛒 POS System**
- Point of Sale functionality
- Inventory management
- Sales tracking
- Multi-location support

---

## 🔧 Technology Stack

### **Backend**
- **Framework**: Django 4.x
- **Database**: SQLite (development)
- **API**: Django REST Framework
- **Authentication**: Django's built-in auth system

### **Frontend**
- **Framework**: React 18
- **Build Tool**: Vite
- **UI Library**: Material-UI
- **State Management**: React Context API

### **Development Tools**
- **Version Control**: Git
- **Package Management**: pip (Python), npm (Node.js)
- **Code Quality**: ESLint, Prettier
- **Automation**: Custom batch scripts

---

## 📋 Development Workflow

### **1. Setup**
```bash
# Clone repository
git clone <repository-url>
cd 01practice

# Setup Git configuration
cd scripts
01-git-config.template.bat

# Setup backend
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt

# Setup frontend
cd ../frontend
npm install
```

### **2. Development**
```bash
# Start development servers
cd ../scripts
START_BOTH.bat
```

### **3. Testing**
```bash
# Setup demo data
cd ../backend
python create_demo_data.py
python verify_demo_data.py
```

### **4. Deployment**
```bash
# Daily backup
cd ../scripts
00-DAILY_GIT_PUSH.bat
```

---

## 🤝 Support

### **Documentation**
- **Primary**: [docs/README.md](docs/README.md) - Complete documentation index
- **Setup**: [docs/DEMO_SETUP.md](docs/DEMO_SETUP.md) - Environment setup
- **Scripts**: [scripts/README.md](scripts/README.md) - Automation scripts

### **Troubleshooting**
- Check [docs/CONSOLE_LOGS_ANALYSIS_AND_FIXES.md](docs/CONSOLE_LOGS_ANALYSIS_AND_FIXES.md) for debugging
- Review [scripts/README.md](scripts/README.md) for script issues
- Refer to individual implementation summaries for feature-specific problems

---

## 📝 Project Organization

This project follows a clean, organized structure:

- **📁 `backend/`** - Django application with modular app structure
- **📁 `frontend/`** - React application with component-based architecture
- **📁 `docs/`** - Comprehensive documentation organized by purpose
- **📁 `scripts/`** - Automation scripts for development and deployment
- **📄 `README.md`** - Project overview and quick start guide

Each folder has its own README with detailed information specific to that component.

---

*Last updated: Project organization completed*
