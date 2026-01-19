# 🏪 01PRACTICE POS - VERSION 1.0 (BASE VERSION)
**Practice Point of Sale System**

**Version**: 1.0.0 (Base)
**Release Date**: January 2026
**Architecture**: React + Django
**Status**: Development / Practice

---

## 🎯 **PLATFORM OVERVIEW**

A focused Point of Sale (POS) system designed for retail practice and learning. This is the **Base Version** serving as the foundation for future enhancements.

### **Core Philosophy**
- **Simplicity**: Streamlined POS operations
- **Learning**: Reference implementation for React/Django integration
- **Base Architecture**: Foundation for scalability

---

## 🏗️ **ARCHITECTURAL HIGHLIGHTS**

### **1. Application Structure**

```
┌─────────────────────────────────────────────────┐
│         PRACTICE POS V2                         │
├─────────────────────────────────────────────────┤
│  Frontend: Port 3003 (React + Vite)            │
│  Backend:  Port 8000 (Django REST Framework)   │
│  Database: SQLite (Dev)                        │
└─────────────────────────────────────────────────┘
```

### **3. Module Architecture**

- **POS**: Point of Sale interface (Primary focus)
- **Inventory**: Basic stock tracking
- **Products**: Simple product management
- **Settings**: Basic configuration

---

## 🎯 **KEY FEATURE HIGHLIGHTS**

### **1. 🎨 Theme Customization**
- **Dynamic Themes**: Toggle between **Blue** (Professional) and **Black** (High Contrast) themes directly from the Login form.
- **Visual Comfort**: Optimized for different lighting conditions.

### **2. 🚀 Quick Setup Shortcuts**
- **Database Setup**: Press **Ctrl+Shift+S** on the login screen for quick setup.
- **Command Palette**: **Ctrl+K** (Coming soon).

### **3. 📊 Dashboard**
- **Simplified Dashboard**: Focused key metrics.
- **Fixed Layout**: Consistent navigation.

### **4. 🏢 Location Management**
- Role-based location access control.
- Support for multiple location types (Store, Warehouse, HQ).

---

## 🗄️ **DATA ARCHITECTURE**

### **Database Models**:

| Model | Purpose |
|-------|---------|
| **Product** | Product master data |
| **Category** | Product categorization |
| **Location** | Store/Warehouse setup |
| **User** | System users and roles |

---

## 🚀 **GETTING STARTED**

### **Quick Start**:

#### **1. Backend Setup**:
```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python manage.py runserver 8000
```

#### **2. Frontend Setup**:
```bash
cd frontend
npm install
npm run dev  # Runs on port 3003
```

#### **3. Access**:
- **Frontend**: http://localhost:3003
- **Backend API**: http://localhost:8000/api/

---

## 📞 **SUPPORT**

### **Repository**: 
https://github.com/vijaympgs/01practice-v2

### **Documentation**:
- Check `docs/` folder for detailed guides.
- Review `README.md` for project structure.

---

**🎉 Practice POS - Base Version**
**Version**: 1.0.0
**Copyright**: © 2026 Practice V2
