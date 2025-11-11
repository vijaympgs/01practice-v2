# Form Builder Development Standards

**Created:** 01-Nov-2025 18:10:00 IST  
**Last Updated:** 01-Nov-2025 18:10:00 IST  
**Purpose:** Complete standards reference for Form Builder development

---

## 📅 **DATE & TIME FORMAT**

**Standard:** `dd-MMM-yyyy HH:mm:ss IST`

**PowerShell Command (IST):**
```powershell
[System.TimeZoneInfo]::ConvertTimeBySystemTimeZoneId([System.DateTime]::UtcNow, 'India Standard Time').ToString('dd-MMM-yyyy HH:mm:ss')
```

**All markdown files MUST have:**
```markdown
**Created:** dd-MMM-yyyy HH:mm:ss IST
**Last Updated:** dd-MMM-yyyy HH:mm:ss IST
```

---

## 📁 **PROJECT STRUCTURE**

```
form-builder/
├── backend/
│   ├── config/
│   ├── forms/                    # Main Django app
│   │   ├── models.py
│   │   ├── serializers.py
│   │   ├── views.py
│   │   ├── urls.py
│   │   └── admin.py
│   ├── manage.py
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── FormBuilder/
│   │   │   ├── DynamicForm/
│   │   │   └── FieldTypes/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── contexts/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
├── docs/
└── README.md
```

---

## 🎨 **UI STANDARDS**

### **1. Master Form Pattern**

Based on `02DOCUMENTS/MASTER_SCREEN_UI_PATTERN.md`

#### **Card Header:**
- Text: "List"
- Background: `themeColor` (NO gradient)
- Text color: White
- `borderRadius: 0`

#### **Theme Loading:**
```javascript
const [themeColor, setThemeColor] = useState('#1976d2');

useEffect(() => {
  api.get('/theme/active-theme/')
    .then(res => setThemeColor(res.data.primary_color))
    .catch(() => {/* fallback */});
}, []);
```

#### **Dialog Title:**
- Background: `themeColor`
- Text: White
- NO icons

#### **Dialog Content:**
- Padding: `p: 1`
- `maxHeight: 'calc(100vh - 200px)'`
- `overflow: 'auto'`
- Grid `spacing={1}`

#### **Form Fields:**
- First field: `mt: 1`
- `variant="outlined"`
- `fullWidth`
- `borderRadius: 0`
- Labels: Theme color

#### **Status Toggle:**
- Theme color (NOT blue)
- Label: "Active" text included
- `FormControlLabel` wrapper

---

## 💻 **CODE STANDARDS**

### **Naming Conventions**

**Files:**
- Components: `PascalCase.jsx` (e.g., `FormBuilder.jsx`)
- Services: `camelCase.js` (e.g., `formService.js`)
- Pages: `PascalCase.jsx` (e.g., `FormsPage.jsx`)

**Variables:**
- React: `camelCase`
- Django Models: `PascalCase`
- API endpoints: `kebab-case`

### **Component Structure**

```javascript
// 1. Imports
import React, { useState, useEffect } from 'react';
import { Box, Button } from '@mui/material';

// 2. Component definition
function MyComponent() {
  // 3. State
  const [data, setData] = useState(null);
  
  // 4. Effects
  useEffect(() => {
    // ...
  }, []);
  
  // 5. Handlers
  const handleSubmit = () => {
    // ...
  };
  
  // 6. Render
  return (
    <Box>
      {/* UI */}
    </Box>
  );
}

export default MyComponent;
```

---

## ✅ **FUNCTIONAL CHECKLIST (ALL SCREENS)**

### **Loading States**
- [ ] Loading skeleton/spinner
- [ ] Error handling with user-friendly messages
- [ ] Empty state handling

### **Validation**
- [ ] Client-side validation
- [ ] Server-side validation feedback
- [ ] Required field indicators
- [ ] Format validation (email, phone, etc.)

### **Actions**
- [ ] Create/Add button visible and functional
- [ ] Edit action updates existing record
- [ ] Delete with confirmation
- [ ] Save/Cancel buttons clear

### **Notifications**
- [ ] Success message (pale green `#E8F5E9`)
- [ ] Error message (pale red `#FFE5E5`)
- [ ] Positioned next to sidebar start
- [ ] Auto-dismiss after timeout

### **Permissions**
- [ ] Role-based access control
- [ ] Proper authentication checks
- [ ] Error handling for 403/401

---

## 🗄️ **DATABASE STANDARDS**

### **Primary Keys**
- Use UUID (`uuid.uuid4()`) for all models
- Never use auto-incrementing integers

### **Model Structure**
```python
class MyModel(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=200)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'my_models'
        ordering = ['-created_at']
```

---

## 🔧 **API STANDARDS**

### **Endpoints**
- Use `kebab-case` for URLs
- Version: `/api/v1/` (optional)
- Nest resources properly

### **Serializers**
- Use `ModelSerializer` for DRF
- `read_only_fields` for auto-generated data
- Validation in serializer, not views

### **Views**
- Use `ModelViewSet` for CRUD
- `permission_classes = [IsAuthenticated]`
- `filter_backends` for filtering
- `pagination_class` for large datasets

---

## 🧪 **TESTING STANDARDS**

### **Backend**
- Unit tests for models
- API endpoint tests
- Serializer validation tests
- Permission tests

### **Frontend**
- Component tests
- Integration tests
- E2E tests for critical flows

### **Coverage**
- Minimum 80% code coverage
- Critical paths: 100%

---

## 📚 **DOCUMENTATION STANDARDS**

### **API Docs**
- Swagger/OpenAPI integration
- Example requests/responses
- Error codes documented

### **Code Comments**
- Complex logic explained
- TODO items tracked
- Public APIs documented

### **User Guides**
- Clear step-by-step instructions
- Screenshots where helpful
- Common issues troubleshooting

---

## 🚀 **DEPLOYMENT**

### **Environment Variables**
```env
DEBUG=True
SECRET_KEY=your-secret-key
DATABASE_URL=postgresql://user:pass@host:port/db
ALLOWED_HOSTS=localhost,127.0.0.1
CORS_ALLOWED_ORIGINS=http://localhost:5173
```

### **Build Process**
```bash
# Backend
cd backend
pip install -r requirements.txt
python manage.py migrate
python manage.py collectstatic

# Frontend
cd frontend
npm install
npm run build
```

---

## 🎯 **INTEGRATION WITH RETAILMIND**

### **Authentication**
- Use JWT tokens
- Token refresh mechanism
- Logout handling

### **Theme**
- Load from `/api/theme/active-theme/`
- Apply to all UI elements
- Fallback to default

### **Notifications**
- Use global notification system
- Position next to sidebar
- Color codes for success/error

### **Permissions**
- RBAC integrated
- Menu-level permissions
- Feature flags

---

## 📊 **TRACKING & MONITORING**

### **Logging**
- Structured logging
- Error tracking
- Performance metrics

### **Analytics**
- User actions tracked
- Form usage metrics
- Error rates monitored

---

## 🔗 **REFERENCES**

**Main App Standards:**
- POS: `../08pos-spec/02_POS_STANDARDS.md`
- Backoffice: `../05backoffice-spec/02_BACKOFFICE_STANDARDS.md`

**UI Pattern:**
- Master Form: `../02DOCUMENTS/MASTER_SCREEN_UI_PATTERN.md`

**Date Format:**
- Standard: `../07next-session/BACKUP/12_DATE_FORMAT_STANDARD.md`

---

## ✅ **QUALITY GATES**

### **Before Push**
- [ ] All tests passing
- [ ] Code coverage > 80%
- [ ] No console errors
- [ ] Proper error handling
- [ ] Documentation updated

### **Code Review**
- [ ] Follows naming conventions
- [ ] Uses established patterns
- [ ] Secure (no SQL injection, XSS)
- [ ] Performant (no N+1 queries)
- [ ] Accessible (WCAG 2.1 AA)

---

**Last Updated:** 01-Nov-2025 18:18:34 IST

