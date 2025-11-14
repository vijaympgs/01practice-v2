--- 
title: "Documentation File" 
description: "Documentation file with automatic timestamp" 
date: "2025-11-14 10:28:50" 
modified: "2025-11-14 10:28:50" 
author: "Development Team" 
version: "1.0.0" 
category: "documentation" 
tags: [docs, timestamp] 
project: "Django POS System" 
path: "d:\Python\01practice\docs\PROJECT_STRUCTURE\folder-structure.md" 
last_reviewed: "2025-11-14 10:28:50" 
review_status: "draft" 
--- 
 
--- 
title: "Documentation File" 
description: "Documentation file with automatic timestamp" 
date: "2025-11-14 10:12:37" 
modified: "2025-11-14 10:12:37" 
author: "Development Team" 
version: "1.0.0" 
category: "documentation" 
tags: [docs, timestamp] 
project: "Django POS System" 
path: "d:\Python\01practice\docs\PROJECT_STRUCTURE\folder-structure.md" 
last_reviewed: "2025-11-14 10:12:37" 
review_status: "draft" 
--- 
 
# Practice System - Complete Folder Structure Documentation

### Core Django Structure:

- `config/` (Django project configuration)
- `users/` (Custom user management)

### Django Apps (each with standard structure):

- `business_rules/`
- `categories/`
- `code_settings/`
- `customers/`
- `geographical_data/`
- `geography/`
- `inventory/`
- `locations/`
- `merchandise/`
- `organization/`
- `pay_modes/`
- `payments/`
- `pos_masters/`
- `pos_programs/`
- `procurement/`
- `products/`
- `reports/`
- `sales/`
- `suppliers/`
- `tax_management/`
- `taxes/`
- `theme_management/`

### Each Django app should have these standard subfolders:

- `migrations/` (for Django migration files)

### Core Frontend Structure:

- `public/` (static assets)
- `src/` (source code)

### Source Code Structure (`src/`):

- `components/` (React components)

  - `archive/`
  - `categories/`
  - `chat/`
  - `common/`
  - `crm/`
  - `customers/`
  - `dashboard/`
  - `inventory/`
  - `layout/`
  - `orders/`
  - `POS/`
  - `products/`
  - `purchase/`
  - `reports/`
  - `sales/`
  - `settings/`
  - `suppliers/`
  - `templates/`
  - `Terminal/`
  - `test/`

- `pages/` (Page components)

  - `Archive/`
  - `Auth/`
  - `BusinessRules/`
  - `CodeSettings/`
  - `CRM/`
  - `Dashboard/`
  - `Inventory/`
  - `Item/`
  - `MasterData/`
  - `Organization/`
  - `PayModes/`
  - `POS/`
  - `POSMasters/`
  - `Procurement/`
  - `Security/`
  - `Settings/`
  - `StockNexus/`
  - `Users/`

- `services/` (API and business logic services)
- `store/` (Redux state management)
  - `slices/`
- `tests/` (Test files)
- `utils/` (Utility functions)
- `constants/` (Application constants)
- `contexts/` (React contexts)


## Complete Documentation Contents:

### 1. __Project Overview & Architecture__

- Technology stack details
- Project purpose and scope
- Development workflow

### 2. __Backend Structure (Django)__

- __Complete directory tree__ with every single folder and file
- __Django app breakdown__ with purpose, models, views, serializers, URLs for each app
- __Configuration details__ for settings, URLs, WSGI, ASGI
- __Database structure__ and migration patterns
- __File naming conventions__ and standards

### 3. __Frontend Structure (React + Vite)__

- __Complete directory tree__ with every component, page, service, utility
- __Component hierarchy__ and relationships
- __State management__ structure (Redux slices)
- __Routing structure__ and page organization
- __Service layer architecture__ and API integration patterns
- __Asset management__ and build configuration

### 4. __Changes Directory Structure__

- __Exact replica__ of main project structure
- __Purpose and usage__ of the changes directory
- __Version control integration__ patterns

### 5. __Creation Commands__

- __Cross-platform commands__ (Windows, Linux, Mac)
- __Batch scripts__ for automated setup
- __Verification commands__ to ensure structure integrity

### 6. __Development Guidelines__

- __File organization standards__
- __Naming conventions__
- __Import/export patterns__
- __Code placement rules__

### 7. __Maintenance & Scaling__

- __Adding new apps/components__
- __Restructuring guidelines__
- __Best practices__


## Table of Contents
1. [Project Overview](#project-overview)
2. [Technology Stack](#technology-stack)
3. [Root Directory Structure](#root-directory-structure)
4. [Backend Structure (Django)](#backend-structure-django)
5. [Frontend Structure (React + Vite)](#frontend-structure-react--vite)
6. [Changes Directory Structure](#changes-directory-structure)
7. [Creation Commands](#creation-commands)
8. [Development Guidelines](#development-guidelines)
9. [Maintenance & Scaling](#maintenance--scaling)

---

## Project Overview

**Project Name:** Practice System  
**Type:** AI-Powered Enterprise ERP System  
**Architecture:** Full-stack web application with Django REST API backend and React frontend  
**Purpose:** Complete Point of Sale, Inventory, and Master Data Management System

---

## Technology Stack

### Backend
- **Framework:** Django 5.0.1
- **API:** Django REST Framework 3.14.0
- **Authentication:** Django REST Framework Simple JWT
- **Database:** SQLite3 (development), PostgreSQL (production ready)
- **Documentation:** drf-spectacular (OpenAPI/Swagger)
- **CORS:** django-cors-headers
- **Filtering:** django-filter
- **Environment:** python-decouple

### Frontend
- **Framework:** React 18.2.0
- **Build Tool:** Vite 7.1.9
- **UI Library:** Material-UI (MUI) 5.15.0
- **State Management:** Redux Toolkit 2.0.0
- **Routing:** React Router DOM 6.21.0
- **HTTP Client:** Axios 1.6.0
- **Forms:** React Hook Form 7.49.0
- **Charts:** Recharts 2.10.0
- **Maps:** Leaflet 1.9.4 + React Leaflet 4.2.1

---

## Root Directory Structure

```
practice/
├── backend/                    # Django REST API backend
├── frontend/                   # React frontend application
├── changes/                    # Directory for tracking changes
│   ├── backend/               # Backend changes mirror
│   └── frontend/              # Frontend changes mirror
├── folder-structure.md        # This documentation file
└── README.md                   # Project overview (if exists)
```

---

## Backend Structure (Django)

### Complete Backend Directory Tree

```
backend/
├── manage.py                   # Django management script
├── requirements.txt            # Python dependencies
├── package.json               # Node.js dependencies (if any)
├── package-lock.json          # Node.js dependency lock file
├── setup.sh                   # Linux/Mac setup script
├── README.md                  # Backend documentation
├── db.sqlite3                 # SQLite database file (development)
├── check_companies.py         # Utility script for company verification
├── test_*.py                  # Test files for various functionalities
│
├── config/                     # Django project configuration
│   ├── __init__.py
│   ├── settings.py            # Main Django settings
│   ├── urls.py                # Root URL configuration
│   ├── wsgi.py                # WSGI deployment interface
│   ├── asgi.py                # ASGI deployment interface
│   └── uwsgi.ini               # uWSGI configuration (if exists)
│
├── users/                      # Custom user management app
│   ├── __init__.py
│   ├── admin.py                # Django admin configuration
│   ├── apps.py                 # Django app configuration
│   ├── models.py               # User models
│   ├── serializers.py          # API serializers
│   ├── views.py                # API views
│   ├── urls.py                 # App URL patterns
│   ├── permissions.py          # Custom permissions (if exists)
│   ├── managers.py             # Custom user manager (if exists)
│   └── migrations/             # Database migrations
│       └── *.py
│
├── organization/               # Company and location management
│   ├── __init__.py
│   ├── admin.py
│   ├── apps.py
│   ├── models.py               # Company, Location, OperatingHours models
│   ├── serializers.py          # Company and location serializers
│   ├── views.py                # Company and location API views
│   ├── urls.py                 # Organization URL patterns
│   ├── tests.py                # Test cases
│   └── migrations/             # Database migrations
│       └── *.py
│
├── geographical_data/          # Geographical data management
│   ├── __init__.py
│   ├── admin.py
│   ├── apps.py
│   ├── models.py               # Country, State, City models
│   ├── serializers.py
│   ├── views.py
│   ├── urls.py
│   └── migrations/
│       └── *.py
│
├── taxes/                      # Tax management
│   ├── __init__.py
│   ├── admin.py
│   ├── apps.py
│   ├── models.py               # Tax models
│   ├── serializers.py
│   ├── views.py
│   ├── urls.py
│   └── migrations/
│       └── *.py
│
├── categories/                 # Product categories
│   ├── __init__.py
│   ├── admin.py
│   ├── apps.py
│   ├── models.py               # Category models
│   ├── serializers.py
│   ├── views.py
│   ├── urls.py
│   └── migrations/
│       └── *.py
│
├── products/                   # Product management
│   ├── __init__.py
│   ├── admin.py
│   ├── apps.py
│   ├── models.py               # Product models
│   ├── serializers.py
│   ├── views.py
│   ├── urls.py
│   └── migrations/
│       └── *.py
│
├── customers/                  # Customer management
│   ├── __init__.py
│   ├── admin.py
│   ├── apps.py
│   ├── models.py               # Customer models
│   ├── serializers.py
│   ├── views.py
│   ├── urls.py
│   └── migrations/
│       └── *.py
│
├── suppliers/                  # Supplier management
│   ├── __init__.py
│   ├── admin.py
│   ├── apps.py
│   ├── models.py               # Supplier models
│   ├── serializers.py
│   ├── views.py
│   ├── urls.py
│   └── migrations/
│       └── *.py
│
├── inventory/                  # Inventory management
│   ├── __init__.py
│   ├── admin.py
│   ├── apps.py
│   ├── models.py               # Inventory models
│   ├── serializers.py
│   ├── views.py
│   ├── urls.py
│   └── migrations/
│       └── *.py
│
├── sales/                      # Sales management
│   ├── __init__.py
│   ├── admin.py
│   ├── apps.py
│   ├── models.py               # Sales, Payment, Transaction models
│   ├── serializers.py
│   ├── views.py
│   ├── urls.py
│   └── migrations/
│       └── *.py
│
├── pos_programs/               # POS program management
│   ├── __init__.py
│   ├── admin.py
│   ├── apps.py
│   ├── models.py               # POS program models
│   ├── serializers.py
│   ├── views.py
│   ├── urls.py
│   └── migrations/
│       └── *.py
│
├── business_rules/             # Business rules engine
│   ├── __init__.py
│   ├── admin.py
│   ├── apps.py
│   ├── models.py               # Business rule models
│   ├── serializers.py
│   ├── views.py
│   ├── urls.py
│   └── migrations/
│       └── *.py
│
├── pay_modes/                  # Payment modes management
│   ├── __init__.py
│   ├── admin.py
│   ├── apps.py
│   ├── models.py               # Payment mode models
│   ├── serializers.py
│   ├── views.py
│   ├── urls.py
│   └── migrations/
│       └── *.py
│
├── pos_masters/                # POS master data
│   ├── __init__.py
│   ├── admin.py
│   ├── apps.py
│   ├── models.py               # POS master models
│   ├── serializers.py
│   ├── views.py
│   ├── urls.py
│   └── migrations/
│       └── *.py
│
├── code_settings/              # Code settings management
│   ├── __init__.py
│   ├── admin.py
│   ├── apps.py
│   ├── models.py               # Code setting models
│   ├── serializers.py
│   ├── views.py
│   ├── urls.py
│   ├── tests.py                # Test cases
│   └── migrations/
│       └── *.py
│
├── theme_management/           # Theme management
│   ├── __init__.py
│   ├── admin.py
│   ├── apps.py
│   ├── models.py               # Theme models
│   ├── serializers.py
│   ├── views.py
│   ├── urls.py
│   └── migrations/
│       └── *.py
│
├── procurement/                # Procurement management
│   ├── __init__.py
│   ├── admin.py
│   ├── apps.py
│   ├── models.py               # Procurement models
│   ├── serializers.py
│   ├── views.py
│   ├── urls.py
│   └── migrations/
│       └── *.py
│
├── reports/                    # Reports management
│   ├── __init__.py
│   ├── admin.py
│   ├── apps.py
│   ├── models.py               # Report models
│   └── migrations/
│       └── *.py
│
├── payments/                   # Payment processing
│   ├── __init__.py
│   ├── admin.py
│   ├── apps.py
│   ├── models.py               # Payment models
│   └── migrations/
│       └── *.py
│
├── tax_management/             # Tax management (alternative)
│   └── taxes/                  # Tax implementation
│       ├── __init__.py
│       ├── admin.py
│       ├── apps.py
│       └── migrations/
│           └── *.py
│
├── geography/                  # Geography (alternative implementation)
│   ├── __init__.py
│   ├── admin.py
│   ├── apps.py
│   ├── models.py
│   ├── tests.py
│   ├── views.py
│   └── migrations/
│       └── *.py
│
├── locations/                  # Location management (alternative)
│   ├── __init__.py
│   ├── admin.py
│   ├── apps.py
│   ├── models.py
│   ├── tests.py
│   ├── views.py
│   └── migrations/
│       └── *.py
│
└── merchandise/                # Merchandise management
    ├── __init__.py
    ├── admin.py
    ├── apps.py
    ├── models.py
    ├── tests.py
    ├── views.py
    └── migrations/
        └── *.py
```

### Backend App Details

#### 1. **config/** - Django Project Configuration
- **settings.py**: Main Django settings including database, installed apps, middleware, REST framework configuration
- **urls.py**: Root URL configuration with API endpoints and admin interface
- **wsgi.py**: WSGI deployment interface for production servers
- **asgi.py**: ASGI deployment interface for async support

#### 2. **users/** - Custom User Management
- **models.py**: Custom User model extending Django's AbstractUser
- **serializers.py**: User registration, login, profile serializers
- **views.py**: Authentication endpoints, user management APIs
- **permissions.py**: Custom permission classes

#### 3. **organization/** - Company & Location Management
- **models.py**: Company, Location, OperatingHours models
- **Purpose**: Multi-tenant support with company and location hierarchy
- **Key Features**: Company branding, location-based operations, operating hours

#### 4. **products/** - Product Management
- **models.py**: Product, ProductCategory, ProductVariant models
- **Purpose**: Complete product catalog management
- **Key Features**: Product variants, pricing, inventory tracking

#### 5. **sales/** - Sales & Transactions
- **models.py**: Sale, SaleItem, Payment, Transaction models
- **Purpose**: Complete sales workflow management
- **Key Features**: POS transactions, payment processing, receipts

#### 6. **inventory/** - Inventory Management
- **models.py**: Stock, StockMovement, StockAdjustment models
- **Purpose**: Real-time inventory tracking
- **Key Features**: Stock levels, movements, adjustments, low stock alerts

---

## Frontend Structure (React + Vite)

### Complete Frontend Directory Tree

```
frontend/
├── package.json                # Node.js dependencies and scripts
├── package-lock.json           # Dependency lock file
├── vite.config.js              # Vite build configuration
├── .eslintrc.cjs               # ESLint configuration
├── .gitignore                  # Git ignore file
├── index.html                  # Main HTML template
├── README.md                   # Frontend documentation
├── login_current_standalone.html  # Current login page (standalone)
├── login_new_standalone.html   # New login page (standalone)
├── chat_backup_01-10-2025.md   # Chat backup documentation
├── cloudflared-linux-amd64.deb # Cloudflare tunnel binary
├── ngrok                       # Ngrok tunnel binary
│
└── src/                        # Source code directory
    ├── main.jsx                # React application entry point
    ├── App.jsx                 # Main App component
    ├── index.css               # Global styles
    │
    ├── components/             # Reusable React components
    │   ├── ErrorBoundary.jsx   # Error boundary component
    │   ├── SidebarSettings.jsx  # Sidebar settings component
    │   ├── SimpleLayout.jsx     # Simple layout component
    │   │
    │   ├── archive/             # Archived components
    │   │   ├── ARCHIVE_README.md
    │   │   └── POS/             # Archived POS components
    │   │       └── [POS component files]
    │   │
    │   ├── categories/          # Category management components
    │   │   ├── CategoryDetail.jsx
    │   │   ├── CategoryForm.jsx
    │   │   └── CategoryList.jsx
    │   │
    │   ├── chat/                # Chat components
    │   │   └── ChatBot.jsx
    │   │
    │   ├── common/              # Common utility components
    │   │   ├── ActionButton.jsx
    │   │   ├── BuildInfo.jsx
    │   │   ├── CardHeader.jsx
    │   │   ├── DialogHeader.jsx
    │   │   ├── Loader.jsx
    │   │   ├── LocationGuard.jsx
    │   │   ├── LocationMap.jsx
    │   │   ├── NotificationBanner.jsx
    │   │   ├── PageTitle.jsx
    │   │   ├── PrivateRoute.jsx
    │   │   ├── ProfileDialog.jsx
    │   │   └── StatusBar.jsx
    │   │
    │   ├── crm/                 # CRM components
    │   │   ├── CustomerSegmentation.jsx
    │   │   └── LoyaltyProgramManager.jsx
    │   │
    │   ├── customers/           # Customer management components
    │   │   ├── CustomerListEnhanced.jsx
    │   │   ├── CustomerListSimple.jsx
    │   │   ├── QuickCustomerDialog.jsx
    │   │   └── SimpleCustomerForm.jsx
    │   │
    │   ├── dashboard/           # Dashboard components
    │   │   ├── CustomerWidget.jsx
    │   │   ├── FinancialWidget.jsx
    │   │   ├── InventoryWidget.jsx
    │   │   ├── RealTimeAnalytics.jsx
    │   │   ├── RoleBasedDashboard.jsx
    │   │   └── SalesWidget.jsx
    │   │
    │   ├── inventory/           # Inventory management components
    │   │   ├── InventoryAnalytics.jsx
    │   │   ├── InventoryList.jsx
    │   │   ├── InventoryStats.jsx
    │   │   ├── PhysicalCount.jsx
    │   │   ├── PurchaseOrderDialog.jsx
    │   │   ├── StockAdjustmentDialog.jsx
    │   │   ├── StockMovements.jsx
    │   │   ├── StockOverview.jsx
    │   │   └── WarehouseManagement.jsx
    │   │
    │   ├── layout/              # Layout components
    │   │   ├── AppLayout.jsx
    │   │   ├── Header.jsx
    │   │   ├── RoleSwitcher.jsx
    │   │   ├── Sidebar.jsx
    │   │   └── SimplifiedSidebar.jsx
    │   │
    │   ├── orders/              # Order management components
    │   │   ├── OrderAnalyticsTab.jsx
    │   │   ├── PurchaseOrdersTab.jsx
    │   │   └── SalesOrdersTab.jsx
    │   │
    │   ├── POS/                 # Point of Sale components
    │   │   └── CounterSettlementDialog.jsx
    │   │
    │   ├── products/            # Product management components
    │   │   ├── DigitalProductsManager.jsx
    │   │   ├── ProductBundlesManager.jsx
    │   │   ├── ProductDetail.jsx
    │   │   ├── ProductForm.jsx
    │   │   ├── ProductFormEnhanced.jsx
    │   │   ├── ProductFormSimple.jsx
    │   │   ├── ProductList.jsx
    │   │   ├── ProductListEnhanced.jsx
    │   │   ├── ProductListSimple.jsx
    │   │   └── ProductVariantsManager.jsx
    │   │
    │   ├── purchase/            # Purchase management components
    │   │   └── PurchaseOrderDetailsDialog.jsx
    │   │
    │   ├── reports/             # Report components
    │   │   ├── CustomerReportsTab.jsx
    │   │   ├── FinancialReportsTab.jsx
    │   │   ├── InventoryReportsTab.jsx
    │   │   └── SalesReportsTab.jsx
    │   │
    │   ├── sales/               # Sales management components
    │   │   ├── QuickSalesOrder.jsx
    │   │   ├── SalesDetailsDialog.jsx
    │   │   ├── SalesOrderAnalytics.jsx
    │   │   ├── SalesOrderApproval.jsx
    │   │   ├── SalesOrderDetails.jsx
    │   │   ├── SalesOrderEntry.jsx
    │   │   └── SalesOrderFulfillment.jsx
    │   │
    │   ├── settings/            # Settings components
    │   │   └── [Settings component files]
    │   │
    │   ├── suppliers/           # Supplier management components
    │   │   └── [Supplier component files]
    │   │
    │   ├── templates/           # Template components
    │   │   └── [Template component files]
    │   │
    │   └── Terminal/            # Terminal components
    │       └── [Terminal component files]
    │
    ├── pages/                   # Page components
    │   ├── Auth/                # Authentication pages
    │   │   ├── Login.jsx         # Main login component
    │   │   └── LoginNew.jsx      # New login component
    │   │
    │   ├── Dashboard/           # Dashboard pages
    │   │   ├── Dashboard.jsx     # Main dashboard
    │   │   └── DashboardEnhanced.jsx
    │   │
    │   ├── BusinessRules/       # Business rules pages
    │   ├── CodeSettings/        # Code settings pages
    │   ├── CRM/                 # CRM pages
    │   ├── Inventory/           # Inventory pages
    │   ├── Item/                # Item pages
    │   ├── MasterData/          # Master data pages
    │   ├── Organization/        # Organization pages
    │   ├── PayModes/            # Payment mode pages
    │   ├── POS/                 # POS pages
    │   ├── POSMasters/          # POS master pages
    │   ├── Procurement/         # Procurement pages
    │   ├── Security/            # Security pages
    │   ├── Settings/            # Settings pages
    │   ├── StockNexus/          # Stock nexus pages
    │   ├── Users/               # User management pages
    │   │
    │   ├── Archive/             # Archived pages
    │   │
    │   ├── CustomersPage.jsx    # Customer management page
    │   ├── InventoryPage.jsx    # Inventory management page
    │   ├── OrdersPage.jsx       # Order management page
    │   ├── ProductsBasic.jsx    # Basic products page
    │   ├── ProductsDebug.jsx    # Products debug page
    │   ├── ProductsPage.jsx     # Main products page
    │   ├── ProductsPageDebugFixed.jsx
    │   ├── ProductsPageFixed.jsx
    │   ├── ProductsPageMinimal.jsx
    │   ├── ProductsPageSimple.jsx
    │   ├── ProductsPageWithSimpleList.jsx
    │   ├── ProductsTest.jsx     # Products test page
    │   ├── ProfilePage.jsx      # User profile page
    │   ├── PurchaseOrdersPage.jsx
    │   ├── ReportsPage.jsx      # Reports page
    │   ├── SalesOrderManagementPage.jsx
    │   ├── SalesPage.jsx        # Sales page
    │   ├── SettingsPage.jsx     # Settings page
    │   ├── SimpleCustomerPage.jsx
    │   ├── SimpleVendorPage.jsx
    │   ├── SuppliersPage.jsx    # Suppliers page
    │   ├── UnderConstruction.jsx
    │   └── UsersPage.jsx        # Users page
    │
    ├── services/                # API and business logic services
    │   ├── AccessControlManager.js
    │   ├── AnalyticsEngine.js
    │   ├── api.js               # Main API service
    │   ├── authService.js       # Authentication service
    │   ├── businessRulesService.js
    │   ├── CashDrawerManager.js
    │   ├── categoryService.js
    │   ├── clearIndexedDB.js
    │   ├── codeSettingsService.js
    │   ├── ConsolidationEngine.js
    │   ├── currencyDenominationService.js
    │   ├── currencyService.js
    │   ├── customerService.js
    │   ├── EmbeddedDBManager.js
    │   ├── IndexedDBManager.js
    │   ├── inventoryService.js
    │   ├── MasterDataManager.js
    │   ├── payModeService.js
    │   ├── populateSampleData.js
    │   ├── posMasterService.js
    │   ├── POSServiceManager.js
    │   ├── procurementService.js
    │   ├── ProductManager.js
    │   ├── productService.js
    │   ├── ReceiptManager.js
    │   ├── ReportingManager.js
    │   ├── roleService.js
    │   ├── salesManagementService.js
    │   ├── salesService.js
    │   ├── sampleData.js
    │   ├── SecurityManager.js
    │   ├── securityService.js
    │   ├── SessionManager.js
    │   ├── ShiftManager.js
    │   ├── store/               # Redux store
    │   │   └── slices/          # Redux slices
    │   │       └── [slice files]
    │   ├── supplierService.js
    │   ├── SyncEngine.js
    │   ├── TerminalManager.js
    │   ├── terminalService.js
    │   ├── themeService.js
    │   ├── TransactionManager.js
    │   ├── userPermissionService.js
    │   └── userService.js
    │
    ├── store/                   # Redux state management
    │   ├── index.js             # Store configuration
    │   └── slices/              # Redux slices
    │       ├── authSlice.js     # Authentication slice
    │       ├── [other slices]
    │
    ├── tests/                   # Test files
    │   ├── POSBasicTest.js
    │   ├── POSIntegrationTest.js
    │   ├── POSRealFunctionalityTest.js
    │   └── POSSimpleTest.js
    │
    ├── utils/                   # Utility functions
    │   ├── formatters.js        # Data formatting utilities
    │   ├── menuStructure.js     # Menu structure utilities
    │   └── notifications.js     # Notification utilities
    │
    ├── constants/               # Application constants
    │   └── formTypes.js         # Form type constants
    │
    └── contexts/                # React contexts
        ├── LayoutContext.jsx    # Layout context
        ├── NotificationContext.jsx
        └── UserRoleContext.jsx
```

### Frontend Component Details

#### 1. **components/common/** - Common Components
- **PageTitle.jsx**: Standardized page title component
- **Loader.jsx**: Loading spinner component
- **ErrorBoundary.jsx**: Error boundary for error handling
- **PrivateRoute.jsx**: Authentication wrapper for protected routes

#### 2. **components/layout/** - Layout Components
- **AppLayout.jsx**: Main application layout wrapper
- **Header.jsx**: Application header with navigation and user info
- **Sidebar.jsx**: Navigation sidebar with menu items
- **SimplifiedSidebar.jsx**: Simplified version of sidebar

#### 3. **services/** - API Services
- **api.js**: Main API client with axios configuration
- **authService.js**: Authentication and authorization services
- **productService.js**: Product management API calls
- **inventoryService.js**: Inventory management API calls
- **ReceiptManager.js**: Receipt generation and management

#### 4. **store/slices/** - Redux State Management
- **authSlice.js**: Authentication state management
- **[other slices]**: Feature-specific state management

---

## Changes Directory Structure

The `changes/` directory should mirror the complete project structure for tracking changes:

```
changes/
├── backend/                    # Mirror of backend structure
│   ├── [All backend directories and files]
│   └── [Same structure as main backend]
│
└── frontend/                   # Mirror of frontend structure
    ├── [All frontend directories and files]
    └── [Same structure as main frontend]
```

### Purpose of Changes Directory
1. **Version Control**: Track changes separately from main codebase
2. **Testing**: Safe environment for testing modifications
3. **Backup**: Maintain backup of original structure
4. **Development**: Parallel development without affecting main code

---

## Creation Commands

### Cross-Platform Backend Structure Creation

#### Windows (Command Prompt)
```batch
@echo off
echo Creating backend folder structure in changes/backend...

REM Create main directories
mkdir changes\backend
mkdir changes\backend\config
mkdir changes\backend\users
mkdir changes\backend\organization
mkdir changes\backend\geographical_data
mkdir changes\backend\taxes
mkdir changes\backend\categories
mkdir changes\backend\products
mkdir changes\backend\customers
mkdir changes\backend\suppliers
mkdir changes\backend\inventory
mkdir changes\backend\sales
mkdir changes\backend\pos_programs
mkdir changes\backend\business_rules
mkdir changes\backend\pay_modes
mkdir changes\backend\pos_masters
mkdir changes\backend\code_settings
mkdir changes\backend\theme_management
mkdir changes\backend\procurement
mkdir changes\backend\reports
mkdir changes\backend\payments
mkdir changes\backend\tax_management
mkdir changes\backend\geography
mkdir changes\backend\locations
mkdir changes\backend\merchandise

REM Create migrations directories for all apps
for /d %%d in (changes\backend\*) do (
    if not "%%d"=="changes\backend\config" (
        mkdir "%%d\migrations"
    )
)

echo Backend structure created successfully!
```

#### Linux/Mac (Bash)
```bash
#!/bin/bash
echo "Creating backend folder structure in changes/backend..."

# Create main directories
mkdir -p changes/backend/{config,users,organization,geographical_data,taxes,categories,products,customers,suppliers,inventory,sales,pos_programs,business_rules,pay_modes,pos_masters,code_settings,theme_management,procurement,reports,payments,tax_management,geography,locations,merchandise}

# Create migrations directories for all apps
find changes/backend -maxdepth 1 -type d ! -name "backend" ! -name "config" -exec mkdir -p {}/migrations \;

echo "Backend structure created successfully!"
```

### Cross-Platform Frontend Structure Creation

#### Windows (Command Prompt)
```batch
@echo off
echo Creating frontend folder structure in changes/frontend...

REM Create main directories
mkdir changes\frontend
mkdir changes\frontend\public
mkdir changes\frontend\src

REM Create component directories
mkdir changes\frontend\src\components
mkdir changes\frontend\src\components\archive
mkdir changes\frontend\src\components\archive\POS
mkdir changes\frontend\src\components\categories
mkdir changes\frontend\src\components\chat
mkdir changes\frontend\src\components\common
mkdir changes\frontend\src\components\crm
mkdir changes\frontend\src\components\customers
mkdir changes\frontend\src\components\dashboard
mkdir changes\frontend\src\components\inventory
mkdir changes\frontend\src\components\layout
mkdir changes\frontend\src\components\orders
mkdir changes\frontend\src\components\POS
mkdir changes\frontend\src\components\products
mkdir changes\frontend\src\components\purchase
mkdir changes\frontend\src\components\reports
mkdir changes\frontend\src\components\sales
mkdir changes\frontend\src\components\settings
mkdir changes\frontend\src\components\suppliers
mkdir changes\frontend\src\components\templates
mkdir changes\frontend\src\components\Terminal
mkdir changes\frontend\src\components\test

REM Create page directories
mkdir changes\frontend\src\pages
mkdir changes\frontend\src\pages\Archive
mkdir changes\frontend\src\pages\Auth
mkdir changes\frontend\src\pages\BusinessRules
mkdir changes\frontend\src\pages\CodeSettings
mkdir changes\frontend\src\pages\CRM
mkdir changes\frontend\src\pages\Dashboard
mkdir changes\frontend\src\pages\Inventory
mkdir changes\frontend\src\pages\Item
mkdir changes\frontend\src\pages\MasterData
mkdir changes\frontend\src\pages\Organization
mkdir changes\frontend\src\pages\PayModes
mkdir changes\frontend\src\pages\POS
mkdir changes\frontend\src\pages\POSMasters
mkdir changes\frontend\src\pages\Procurement
mkdir changes\frontend\src\pages\Security
mkdir changes\frontend\src\pages\Settings
mkdir changes\frontend\src\pages\StockNexus
mkdir changes\frontend\src\pages\Users

REM Create service directories
mkdir changes\frontend\src\services
mkdir changes\frontend\src\services\store
mkdir changes\frontend\src\services\store\slices

REM Create utility directories
mkdir changes\frontend\src\tests
mkdir changes\frontend\src\utils
mkdir changes\frontend\src\constants
mkdir changes\frontend\src\contexts

echo Frontend structure created successfully!
```

#### Linux/Mac (Bash)
```bash
#!/bin/bash
echo "Creating frontend folder structure in changes/frontend..."

# Create main directories
mkdir -p changes/frontend/{public,src}

# Create component directories
mkdir -p changes/frontend/src/components/{archive/POS,categories,chat,common,crm,customers,dashboard,inventory,layout,orders,POS,products,purchase,reports,sales,settings,suppliers,templates,Terminal,test}

# Create page directories
mkdir -p changes/frontend/src/pages/{Archive,Auth,BusinessRules,CodeSettings,CRM,Dashboard,Inventory,Item,MasterData,Organization,PayModes,POS,POSMasters,Procurement,Security,Settings,StockNexus,Users}

# Create service directories
mkdir -p changes/frontend/src/services/{store/slices}

# Create utility directories
mkdir -p changes/frontend/src/{tests,utils,constants,contexts}

echo "Frontend structure created successfully!"
```

### Verification Commands

#### Verify Backend Structure
```bash
# List all directories (cross-platform)
find changes/backend -type d | sort
```

#### Verify Frontend Structure
```bash
# List all directories (cross-platform)
find changes/frontend -type d | sort
```

#### Count Directories
```bash
# Count backend directories
find changes/backend -type d | wc -l

# Count frontend directories  
find changes/frontend -type d | wc -l
```

---

## Development Guidelines

### File Naming Conventions

#### Backend (Django)
- **Models**: PascalCase (e.g., `ProductCategory`, `SalesOrder`)
- **Views**: PascalCase (e.g., `ProductViewSet`, `SalesListView`)
- **Serializers**: PascalCase (e.g., `ProductSerializer`, `SalesOrderSerializer`)
- **URL files**: lowercase with underscores (e.g., `product_urls.py`)
- **Templates**: lowercase with underscores (e.g., `product_list.html`)
- **Migration files**: Auto-generated by Django

#### Frontend (React)
- **Components**: PascalCase (e.g., `ProductList.jsx`, `CustomerForm.jsx`)
- **Pages**: PascalCase (e.g., `ProductsPage.jsx`, `Dashboard.jsx`)
- **Services**: camelCase (e.g., `productService.js`, `authService.js`)
- **Utilities**: camelCase (e.g., `formatters.js`, `notifications.js`)
- **Constants**: camelCase (e.g., `formTypes.js`)
- **Hooks**: camelCase starting with 'use' (e.g., `useAuth.js`)

### Import/Export Patterns

#### Backend
```python
# Standard library imports first
import os
from datetime import datetime

# Django imports
from django.db import models
from rest_framework import serializers
from rest_framework.views import APIView

# Local imports
from .models import Product
from ..serializers import ProductSerializer
```

#### Frontend
```javascript
// React imports first
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

// Third-party imports
import axios from 'axios';
import { Button, TextField } from '@mui/material';

// Local imports
import productService from '../services/productService';
import { ProductList } from '../components/products';
```

### Code Organization Rules

#### Backend
1. **Models**: Define all database models with proper relationships
2. **Serializers**: Create serializers for all models with proper validation
3. **Views**: Implement API views with proper permissions and filtering
4. **URLs**: Organize URL patterns logically with versioning
5. **Admin**: Register all models in Django admin with proper configuration

#### Frontend
1. **Components**: Keep components small and focused on single responsibility
2. **Pages**: Use pages for route-level components
3. **Services**: Centralize API calls and business logic
4. **State Management**: Use Redux for global state, local state for component-specific data
5. **Styling**: Use Material-UI components with consistent theming

---

## Maintenance & Scaling

### Adding New Django Apps

1. **Create App Structure**:
   ```bash
   python manage.py startapp new_app
   mkdir new_app/migrations
   ```

2. **Add Required Files**:
   - `__init__.py`
   - `admin.py`
   - `apps.py`
   - `models.py`
   - `serializers.py`
   - `views.py`
   - `urls.py`

3. **Update Configuration**:
   - Add to `INSTALLED_APPS` in `settings.py`
   - Include URLs in main `urls.py`

### Adding New React Components

1. **Create Component File**:
   ```javascript
   // src/components/feature/NewComponent.jsx
   import React from 'react';
   
   const NewComponent = () => {
     return <div>New Component</div>;
   };
   
   export default NewComponent;
   ```

2. **Add Tests**:
   ```javascript
   // src/components/feature/NewComponent.test.jsx
   import { render, screen } from '@testing-library/react';
   import NewComponent from './NewComponent';
   
   test('renders new component', () => {
     render(<NewComponent />);
     expect(screen.getByText('New Component')).toBeInTheDocument();
   });
   ```

3. **Update Exports**:
   - Add to index files if using barrel exports
   - Update documentation

### Restructuring Guidelines

1. **Plan Changes**: Document the restructuring plan before implementation
2. **Update Imports**: Ensure all import paths are updated consistently
3. **Test Thoroughly**: Run all tests after restructuring
4. **Update Documentation**: Keep this documentation current with changes
5. **Communicate**: Inform team members about structural changes

### Best Practices

#### Backend
- Use Django's built-in features whenever possible
- Implement proper database indexing for performance
- Use Django signals sparingly and document their usage
- Keep business logic in services, not in views
- Use proper error handling and logging

#### Frontend
- Follow React best practices and hooks patterns
- Use TypeScript for type safety (when applicable)
- Implement proper error boundaries
- Use lazy loading for code splitting
- Optimize bundle size and performance

---

## Conclusion

This documentation provides a complete reference for the Practice System project structure. The folder organization follows industry best practices for both Django and React applications, ensuring maintainability, scalability, and developer productivity.

For any questions or clarifications about the structure, refer to this documentation or contact the development team.

---

*Last Updated: January 2025*  
*Version: 1.0*  
*Project: Practice System*
