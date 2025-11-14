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
path: "d:\Python\01practice\backend\users\DEFAULT_USER_PASSWORDS.md" 
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
path: "d:\Python\01practice\backend\users\DEFAULT_USER_PASSWORDS.md" 
last_reviewed: "2025-11-14 10:12:37" 
review_status: "draft" 
--- 
 
# Default User Passwords

**Created:** 07-Nov-2025  
**Last Updated:** 07-Nov-2025  
**Purpose:** Reference for default user credentials

---

## 🔐 Default User Credentials

| Username | Password | Role | Description |
|----------|----------|------|-------------|
| `admin` | `admin` | admin | System Administrator - Full access |
| `boadmin` | `boadmin` | backofficemanager | Back Office Manager - Back office administration |
| `bouser` | `bouser` | backofficeuser | Back Office User - Back office operations |
| `posadmin` | `posadmin` | posmanager | POS Manager - Terminal setup, Day operations |
| `posuser` | `posuser` | posuser | POS User - Billing and transactions |

---

## 🚀 How to Create/Update Users

### **Create or Update Default Users:**

```bash
cd backend
python manage.py create_default_users
```

**What it does:**
- Creates users if they don't exist
- Updates passwords if users already exist
- Sets all required fields (role, email, permissions)

**Output:**
```
Created user: admin
Created user: posadmin
Created user: posuser

Completed: 3 created, 0 updated
```

---

## ✅ Verify Users

### **Check User Status and Passwords:**

```bash
cd backend
python manage.py verify_users
```

**What it shows:**
- All users in the system
- Their roles and permissions
- Password verification (checks if password matches expected value)
- Active/Inactive status

**Example Output:**
```
Total users: 3

Username: admin
  Role: admin
  Active: True
  Staff: True
  Superuser: True
  Email: admin@flowretail.com
  [PASS] Password check: PASSED
  [PASS] Role is valid

Username: posadmin
  Role: posmanager
  Active: True
  Staff: True
  Superuser: False
  Email: posadmin@flowretail.com
  [PASS] Password check: PASSED
  [PASS] Role is valid

Username: posuser
  Role: posuser
  Active: True
  Staff: False
  Superuser: False
  Email: posuser@flowretail.com
  [PASS] Password check: PASSED
  [PASS] Role is valid
```

---

## 🔄 Reset Passwords

If you need to reset passwords for existing users:

```bash
cd backend
python manage.py create_default_users
```

This command will:
- ✅ Update passwords for existing users
- ✅ Create users if they don't exist
- ✅ Preserve other user data

---

## 📝 Notes

1. **Security Warning:** These are default passwords for development/testing. Change them in production!

2. **Password Format:** All passwords match the username for easy testing:
   - `admin` → `admin`
   - `posadmin` → `posadmin`
   - `posuser` → `posuser`

3. **User Roles:**
   - `admin`: Full system access, can manage everything
   - `posmanager` (posadmin): Can manage POS terminals, day operations
   - `posuser`: Can perform POS billing and transactions

4. **Active Status:** All default users are created as `is_active=True` so they can login immediately.

---

## 🛠️ Troubleshooting

### **User Can't Login:**

1. **Check if user exists:**
   ```bash
   python manage.py verify_users
   ```

2. **Reset password:**
   ```bash
   python manage.py create_default_users
   ```

3. **Check user is active:**
   - Look for `Active: True` in verify_users output
   - If `Active: False`, user cannot login

### **Password Not Working:**

1. **Run verify command** to check if password matches:
   ```bash
   python manage.py verify_users
   ```

2. **Reset password** using create_default_users command

3. **Check Django admin** to manually verify user settings:
   - Go to: http://localhost:8000/admin
   - Navigate to Users section
   - Check user details

---

## 📞 Quick Reference

**Create/Update Users:**
```bash
python manage.py create_default_users
```

**Verify Users:**
```bash
python manage.py verify_users
```

**Login Credentials:**
- Admin: `admin` / `admin`
- Back Office Admin: `boadmin` / `boadmin`
- Back Office User: `bouser` / `bouser`
- POS Admin: `posadmin` / `posadmin`
- POS User: `posuser` / `posuser`

