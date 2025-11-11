# ⚠️ CRITICAL WORK RULE FOR ALL FORM BUILDER AGENTS

**Created:** 01-Nov-2025 19:30:00 IST  
**Last Updated:** 01-Nov-2025 19:30:00 IST

---

```
===========================================================================
🚨 ABSOLUTE RULE: READ THIS BEFORE DOING ANYTHING! 🚨
===========================================================================

WORK LOCATION:  C:\01FORM-BUILDER\  ← ALL SOURCE CODE HERE!
NEVER MODIFY:   C:\00RetailPWA\     ← PROTECT RETAILPWA!

Form Builder is STANDALONE - completely separate from RetailPWA.
Integration happens via API calls or package export.

===========================================================================
PROTECT RETAILPWA SOURCE CODE - IT'S PRODUCTION!
===========================================================================
```

---

## 🎯 **WHAT YOU NEED TO KNOW**

### **Two Separate Projects:**

**C:\01FORM-BUILDER\** (Form Builder)
- ✅ ALL source code goes here
- ✅ Standalone Django + React application
- ✅ Independent database
- ✅ Runs on ports 8001 (backend) and 5174 (frontend)
- ✅ Can be packaged and deployed independently

**C:\00RetailPWA\** (NewBorn Retail™)
- ❌ DO NOT MODIFY any source code here
- ✅ Contains existing production system
- ✅ Read documentation in `01NEWBORN-IDE\` folder
- ✅ Integration via API only

---

## ✅ **CORRECT WORKFLOW**

### **Step 1: Read Documentation**
```
Location: C:\00RetailPWA\01NEWBORN-IDE\
Files to read:
1. START_HERE.md
2. FORM_BUILDER_STANDARDS.md ⭐
3. FORM_BUILDER_AGENT_PROMPT.md
4. FORM_BUILDER_DEPLOYMENT_CLARIFICATION.md
5. FORM_BUILDER_ARCHITECTURE.md
```

### **Step 2: Navigate to Form Builder**
```bash
cd C:\01FORM-BUILDER
```

### **Step 3: Verify Location**
```bash
Get-Location  # Should show: C:\01FORM-BUILDER
```

### **Step 4: Work ONLY in Form Builder**
- Create files: `C:\01FORM-BUILDER\backend\`
- Create files: `C:\01FORM-BUILDER\frontend\`
- Create files: `C:\01FORM-BUILDER\docs\`

---

## ❌ **NEVER DO THIS**

### **Forbidden Actions:**
1. ❌ Create `forms` app in `C:\00RetailPWA\backend\`
2. ❌ Modify any Python files in RetailPWA
3. ❌ Modify any React files in RetailPWA
4. ❌ Add dependencies to RetailPWA
5. ❌ Run migrations in RetailPWA for Form Builder
6. ❌ Touch RetailPWA's database
7. ❌ Install packages in RetailPWA for Form Builder

---

## 🔍 **VERIFICATION**

Before you start working:

```bash
# Check you're in the right place
cd C:\01FORM-BUILDER
Get-Location  # Should be C:\01FORM-BUILDER

# List files
Get-ChildItem

# Should show:
# - backend/
# - frontend/
# - docs/
# - README.md
# - CRITICAL_WORK_RULE.md
```

---

## 📋 **INTEGRATION PATHS**

### **How Form Builder Integrates with RetailPWA:**

**Option 1: API Calls**
```javascript
// In RetailPWA frontend
fetch('http://localhost:8001/api/forms/forms/1/render/')
  .then(res => res.json())
  .then(form => displayForm(form))
```

**Option 2: Package Export**
```bash
# Generate package from Form Builder
cd C:\01FORM-BUILDER
form-builder export --form "StockRequest" --target retailmind

# Output can be imported into RetailPWA
```

**Option 3: Component Embedding**
```javascript
// In RetailPWA frontend
import { DynamicForm } from '@form-builder/react';

<DynamicForm formId="abc123" apiUrl="http://localhost:8001/api" />
```

---

## 🚨 **EMERGENCY PROCEDURE**

If you accidentally tried to modify RetailPWA:

1. **STOP IMMEDIATELY**
2. Navigate to: `cd C:\01FORM-BUILDER`
3. Check what you were trying to do
4. Figure out how to do it in Form Builder instead
5. Re-read this document
6. Proceed with caution

---

## ✅ **SUCCESS CRITERIA**

You're on the right track if:
- ✅ All Python files in: `C:\01FORM-BUILDER\backend\`
- ✅ All React files in: `C:\01FORM-BUILDER\frontend\`
- ✅ No new files in `C:\00RetailPWA\backend\`
- ✅ No modifications to RetailPWA
- ✅ Form Builder runs independently
- ✅ Integration works via API

---

## 📚 **REFERENCES**

**Form Builder:**
- Project: `C:\01FORM-BUILDER\README.md`
- Source: `C:\01FORM-BUILDER\backend\forms\`
- Docs: `C:\01FORM-BUILDER\docs\`

**NewBorn Retail:**
- Project: `C:\00RetailPWA\README.md`
- Form Builder Docs: `C:\00RetailPWA\01NEWBORN-IDE\`
- Main Backend: `C:\00RetailPWA\backend\` (DO NOT MODIFY!)
- Main Frontend: `C:\00RetailPWA\frontend\` (DO NOT MODIFY!)

---

**Remember: One project, one location, no overlaps!** 🔒

---

**Last Updated:** 01-Nov-2025 19:30:00 IST

