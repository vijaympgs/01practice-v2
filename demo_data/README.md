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
path: "d:\Python\01practice\demo_data\README.md" 
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
path: "d:\Python\01practice\demo_data\README.md" 
last_reviewed: "2025-11-14 10:12:37" 
review_status: "draft" 
--- 
 
# Demo Data Scripts

This folder contains all the demo data creation and testing scripts for the NewBorn Retail ERP system.

## 📁 **Files Overview**

### **🎯 Item Categories Demo Scripts**
- `create_item_categories_demo.py` - Main script to create Item Categories and Sub-Categories with demo items
- `setup_item_categories.py` - Setup script that runs the demo data creation
- `test_item_categories_api.py` - Test script to verify the API endpoints

### **🎯 General Demo Scripts**
- `create_demo_data.py` - General demo data creation script
- `check_and_setup_demo_data.py` - Check and setup existing demo data
- `verify_demo_data.py` - Verify demo data was created correctly

## 🚀 **Usage**

### **1. Item Categories Demo Data**
```bash
# Navigate to project root
cd d:/Python/01practice

# Run the setup script (recommended)
python demo_data/setup_item_categories.py

# Or run the main script directly
python demo_data/create_item_categories_demo.py

# Test the API endpoints
python demo_data/test_item_categories_api.py
```

### **2. General Demo Data**
```bash
# Check and setup existing demo data
python demo_data/check_and_setup_demo_data.py

# Create general demo data
python demo_data/create_demo_data.py

# Verify demo data
python demo_data/verify_demo_data.py
```

## 📊 **Demo Data Created**

### **Item Categories System**
- **5 Main Categories**: Electronics, Apparels, Home & Kitchen, Sports & Fitness, Books & Media
- **25 Sub-Categories**: 5 sub-categories per main category
- **30 Demo Items**: Properly categorized items with realistic data

### **Sample Items Created**
- **Electronics**: iPhone 15 Pro Max, Samsung Galaxy S24 Ultra, Google Pixel 8 Pro, etc.
- **Apparels**: Men's Cotton T-Shirt, Men's Denim Jeans, etc.
- **Home & Kitchen**: Microwave Oven, Electric Kettle, etc.
- **Sports & Fitness**: Yoga Mat Premium, Dumbbells Set, etc.
- **Books & Media**: The Great Gatsby, To Kill a Mockingbird, etc.

## 🔧 **Requirements**

- Python 3.8+
- Django framework
- All dependencies installed (see `backend/requirements.txt`)

## 📝 **Notes**

- These scripts should be run from the project root directory
- The scripts automatically handle Django setup and database connections
- All demo data is created in the SQLite database (`backend/db.sqlite3`)
- Scripts include error handling and progress reporting

## 🎯 **Testing**

After running the demo data scripts, you can:

1. **Access Django Admin**: `http://localhost:8000/admin/`
   - Login with admin credentials
   - Navigate to "Categories" section to manage Item Categories and Sub-Categories
   - View demo items in the "Items" section

2. **Access Frontend**: `http://localhost:3000/item/item-master`
   - View items with proper category and sub-category assignments
   - Test filtering and categorization features

3. **Test API Endpoints**: 
   - Categories: `http://localhost:8000/api/categories/itemcategories/`
   - Sub-categories: `http://localhost:8000/api/categories/itemsubcategories/`

## 🔄 **Reset Demo Data**

To reset all demo data:
```bash
# Delete the database
rm backend/db.sqlite3

# Run migrations
cd backend
python manage.py makemigrations
python manage.py migrate

# Recreate demo data
cd ..
python demo_data/setup_item_categories.py
