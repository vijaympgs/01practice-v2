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
path: "d:\Python\01practice\docs\SETUP_GUIDES\DEMO_SETUP.md" 
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
path: "d:\Python\01practice\docs\SETUP_GUIDES\DEMO_SETUP.md" 
last_reviewed: "2025-11-14 10:12:37" 
review_status: "draft" 
--- 
 
# Demo Setup Guide

## Overview

This document provides instructions for setting up demo data for testing and development purposes.

## Available Demo Scripts

### 1. Location Mapping Demo
**File**: `create_demo_data.py`

Creates demo locations and users for testing location-based access control.

#### What it creates:
- **6 Location Types**: store, headquarters, warehouse, distribution, factory, showroom
- **5 Demo Users**: admin, backofficemanager, backofficeuser, posmanager, posuser
- **User-Location Mappings**: Proper role-based access assignments

#### Usage:
```bash
cd backend
python create_demo_data.py
```

#### Login Credentials:
- `admin_demo:admin123` (Admin - All locations)
- `bomanager_demo:bomanager123` (Back Office Manager - All except HQ)
- `bouser_demo:bouser123` (Back Office User - All except HQ)
- `posadmin_demo:posadmin123` (POS Manager - Store + Showroom)
- `posuser_demo:posuser123` (POS User - Single store)

### 2. Geographical Data Demo
**File**: `seed_data/populate_geographical_data.py`

Populates comprehensive geographical data for multiple regions.

#### What it creates:
- **11 Countries**: Across Middle East, Africa, Asia, Americas, Europe
- **50 States/Provinces**: Administrative divisions
- **314 Cities**: Major urban centers

#### Usage:
```bash
cd backend
python seed_data/populate_geographical_data.py
```

#### Clear and Repopulate:
```bash
python seed_data/populate_geographical_data.py --clear
```

## Quick Start

### 1. Setup Location Mapping Demo
```bash
cd backend
python create_demo_data.py
```

### 2. Setup Geographical Data
```bash
python seed_data/populate_geographical_data.py
```

### 3. Verify Setup
```bash
python verify_demo_data.py
```

## Data Structure

### Location Types Created
- **store**: Retail locations for POS operations
- **headquarters**: Corporate headquarters
- **warehouse**: Storage and distribution facilities
- **distribution**: Distribution centers
- **factory**: Manufacturing plants
- **showroom**: Product display locations

### User Roles and Access
| Role | Access Pattern | Location Types |
|------|---------------|--------------|
| admin | All locations | back_office |
| backofficemanager | All except headquarters | back_office |
| backofficeuser | All except headquarters | back_office |
| posmanager | Store + Showroom | both |
| posuser | Single assigned store | pos |

## Testing Scenarios

### 1. Location Selection Testing
1. Login with `admin_demo`
2. Should see location selection page
3. Select any location and continue
4. Verify session location is set

### 2. Role-Based Access Testing
1. Test each demo user login
2. Verify accessible locations via API endpoints
3. Confirm proper role-based restrictions

### 3. Django Admin Testing
1. Access `http://localhost:8000/admin/`
2. Navigate to "User location mappings"
3. Verify all mappings are visible and editable

## Troubleshooting

### Common Issues

#### Script Execution Errors
- Ensure Django environment is properly set up
- Check database connectivity
- Verify model migrations are applied

#### Data Not Populating
- Run with `--clear` flag to start fresh
- Check for data conflicts in database
- Verify file permissions

#### Login Issues
- Verify user creation was successful
- Check user is active
- Confirm password is correct

### Verification Commands

```bash
# Check database state
python manage.py shell
```

```python
from organization.models import Location
from users.models import User, UserLocationMapping

print(f"Locations: {Location.objects.count()}")
print(f"Users: {User.objects.count()}")
print(f"Mappings: {UserLocationMapping.objects.count()}")
```

## Support

For any issues or clarifications, please refer to the implementation documentation or ask for assistance.
