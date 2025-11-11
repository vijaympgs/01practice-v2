# Form Builder - Standalone Cursor Agent Prompt

**Created:** 01-Nov-2025 15:21:00 IST  
**Last Updated:** 01-Nov-2025 15:21:00 IST  
**Purpose:** Complete onboarding prompt for new Cursor agent to build form builder system

---

## 🎯 PROJECT OVERVIEW

You are tasked to build a **modular, scalable form builder web application** that can be used as:
1. **Standalone app** for creating dynamic forms
2. **App extender** to add form-building capabilities to any existing application
3. **Generic form generator** reusable across multiple projects

**Key Use Cases:**
- RetailMind (current retail POS system)
- Any future applications
- Custom form creation for clients
- Dynamic UI generation

---

## 📋 TECHNICAL REQUIREMENTS

### **Technology Stack:**

**Backend:**
- **Python 3.11+**
- **Django 5.0+**
- **Django REST Framework (DRF)**
- **PostgreSQL** (primary) or **Microsoft SQL Server** (alternative)
- **JWT Authentication**

**Frontend:**
- **React 18**
- **Vite** (NOT Next.js - important!)
- **Material-UI (MUI) 5**
- **React Hook Form**
- **Axios**

**Build Tools:**
- Vite for frontend bundling
- Django's built-in tools for backend

---

## 🏗️ CORE FUNCTIONALITY

### **1. Form Definition Management**
- **Create, Read, Update, Delete** dynamic forms
- **Version control** for forms
- **JSON-based** form structure
- **Import/Export** forms as JSON
- **Form templates** library

### **2. Field Types Support**
- **Text** (single line, multi-line)
- **Number** (integer, decimal)
- **Date** (date, time, datetime)
- **Dropdown** (single select, multi-select)
- **Checkbox** (single, multiple)
- **Radio** buttons
- **File** upload (single, multiple)
- **Email**
- **Phone**
- **URL**

### **3. Dynamic Validation**
- **Client-side** validation (React Hook Form)
- **Server-side** validation (Django serializers)
- **Custom rules** per field
- **Conditional validation** (field B required only if field A has value)
- **Real-time feedback**

### **4. Conditional Logic**
- **Show/Hide** fields based on other fields
- **Show/Hide** sections based on conditions
- **AND/OR** logic support
- **Nested conditions**

### **5. Form Submission**
- **Store submissions** in database
- **Submission history**
- **Data export** (CSV, JSON, Excel)
- **Search/filter** submissions
- **Submission validation**

### **6. Authentication & Security**
- **JWT-based** authentication
- **Role-based** access control
- **Form-level permissions**
- **Secure API endpoints**

---

## 🗄️ DATABASE MODELS

### **Model: Form**
```python
class Form(models.Model):
    id = UUIDField (primary key)
    name = CharField (max 200, unique)
    description = TextField
    version = IntegerField (default=1)
    is_active = BooleanField (default=True)
    structure = JSONField (field definitions, layout)
    validation_rules = JSONField (global rules)
    created_by = ForeignKey (User)
    created_at = DateTimeField (auto_now_add)
    updated_at = DateTimeField (auto_now)
    
    class Meta:
        db_table = 'forms'
        ordering = ['-created_at']
```

### **Model: FormField**
```python
class FormField(models.Model):
    id = UUIDField (primary key)
    form = ForeignKey (Form, CASCADE)
    field_name = CharField (max 100)
    field_type = CharField (choices: text, number, date, etc.)
    label = CharField (max 200)
    placeholder = CharField (max 200, blank)
    position = IntegerField (order in form)
    required = BooleanField (default=False)
    default_value = CharField (blank)
    validation_rules = JSONField
    conditional_logic = JSONField (show/hide rules)
    options = JSONField (for dropdown, checkbox, radio)
    created_at = DateTimeField (auto_now_add)
    
    class Meta:
        db_table = 'form_fields'
        ordering = ['form', 'position']
```

### **Model: FormSubmission**
```python
class FormSubmission(models.Model):
    id = UUIDField (primary key)
    form = ForeignKey (Form, CASCADE)
    data = JSONField (submitted data)
    submitted_by = ForeignKey (User, null=True)
    submitted_at = DateTimeField (auto_now_add)
    ip_address = GenericIPAddressField
    user_agent = CharField (max 300, blank)
    
    class Meta:
        db_table = 'form_submissions'
        ordering = ['-submitted_at']
```

---

## 🔧 API ENDPOINTS

### **Forms**
- `GET /api/forms/` - List all forms
- `POST /api/forms/` - Create new form
- `GET /api/forms/{id}/` - Get form details
- `PUT /api/forms/{id}/` - Update form
- `DELETE /api/forms/{id}/` - Delete form
- `POST /api/forms/{id}/publish/` - Publish form
- `POST /api/forms/{id}/clone/` - Clone form
- `GET /api/forms/{id}/export/` - Export as JSON

### **Form Submissions**
- `GET /api/forms/{id}/submissions/` - List submissions
- `POST /api/forms/{id}/submissions/` - Submit form
- `GET /api/submissions/{id}/` - Get submission details
- `DELETE /api/submissions/{id}/` - Delete submission
- `GET /api/submissions/{id}/export/` - Export data

### **Form Rendering**
- `GET /api/forms/{id}/render/` - Get form structure for rendering
- `POST /api/forms/{id}/validate/` - Validate submission data

---

## 🎨 FRONTEND COMPONENTS

### **Core Components:**
1. **FormBuilder** - Main form creation interface
2. **DynamicForm** - Renders form from structure
3. **FieldEditor** - Edit individual field properties
4. **ValidationRulesEditor** - Configure validation
5. **ConditionalLogicEditor** - Configure show/hide rules
6. **FormPreview** - Preview form before publishing
7. **SubmissionViewer** - View submissions
8. **FormLibrary** - Browse form templates

### **Field Components:**
- `TextField`
- `NumberField`
- `DateField`
- `DropdownField`
- `CheckboxField`
- `RadioField`
- `FileField`
- `EmailField`
- `PhoneField`
- `URLField`

---

## 🔌 INTEGRATION POINTS

### **With RetailMind (Current System):**
- **Terminal Preferences** - Use form builder for dynamic settings
- **Custom Fields** - Add user-defined fields
- **Dynamic Masters** - Create custom masters
- **Report Builder** - Generate custom report forms

### **Standalone Mode:**
- Independent application
- Own authentication
- Own database
- Full CRUD operations

### **Embedded Mode:**
- Importable module
- API-first design
- Can be embedded in any app
- Configurable UI

---

## 🚀 DEPLOYMENT MODALITIES

### **Mode A: Complete Feature Export (Recommended)**

**Use Case:** Full-featured modules like "Stock Request Transaction"

**Process:**
1. Build form in Form Builder UI
2. Export as complete feature package
3. Package includes backend + frontend code
4. Install in target application
5. Run migrations
6. Add routes & menu items
7. Feature fully integrated

**Generated Output:**
```
Stock Request Package:
├── Backend/
│   ├── models.py (StockRequest model)
│   ├── serializers.py (DRF serializers)
│   ├── views.py (CRUD APIs)
│   ├── urls.py
│   └── admin.py
├── Frontend/
│   ├── StockRequestPage.jsx
│   ├── StockRequestForm.jsx
│   └── stockRequestService.js
├── Database/
│   └── migrations/
├── Integration/
│   ├── routes.jsx
│   ├── menu-item.json
│   └── README.md
```

**Deployment Command:**
```bash
form-builder export --form "StockRequest" --target retailmind --format complete
```

---

### **Mode B: Live Form Embedding**

**Use Case:** Simple forms embedded in existing pages

**Process:**
1. Build form in Form Builder UI
2. Get form ID
3. Use `<DynamicForm formId="abc123" />` component
4. Form renders dynamically from Form Builder API

**Integration Code:**
```javascript
import { DynamicForm } from 'form-builder-sdk';

function MyPage() {
  return (
    <DynamicForm 
      formId="form-abc123"
      apiUrl="http://form-builder-service.com/api"
      onSubmit={handleSubmit}
    />
  );
}
```

---

### **Mode C: Hybrid**

**Strategy:**
- Simple forms: Use Live Embedding
- Complex features: Use Complete Export

**Rationale:** Balance between flexibility and control

---

## 📦 PACKAGE GENERATION

### **Backend Generator:**
```bash
python form-builder generate backend --form StockRequest
```

**Output:** Complete Django app with models, serializers, views

### **Frontend Generator:**
```bash
npm run form-builder:generate StockRequest
```

**Output:** React components, pages, services

### **Complete Package:**
```bash
form-builder package --form StockRequest --type complete
```

**Output:** Installable package (pip + npm)

---

## 🎯 DEPLOYMENT FEATURES

### **Generator Includes:**
- ✅ Backend models with UUID primary keys
- ✅ DRF serializers with validation
- ✅ API ViewSets with CRUD operations
- ✅ Frontend React components
- ✅ Full pages with list + form
- ✅ API service files
- ✅ Routing configuration
- ✅ Menu item definitions
- ✅ Database migrations
- ✅ Integration documentation
- ✅ README with setup instructions

### **Integration Automation:**
- Auto-generate routes for App.jsx
- Auto-generate menu items for Sidebar
- Auto-install dependencies
- Auto-run migrations

---

## ✅ DEPLOYMENT TESTING

**Must Test:**
- [ ] Package installs without errors
- [ ] Migrations run successfully
- [ ] API endpoints accessible
- [ ] UI renders correctly
- [ ] Forms submit and store data
- [ ] Integration seamless

---

**See:** `FORM_BUILDER_DEPLOYMENT_CLARIFICATION.md` for detailed explanation

---

## ✅ SUCCESS CRITERIA

### **Must Have (MVP):**
- [ ] Create/edit forms via UI
- [ ] All 10 field types supported
- [ ] Client + server validation
- [ ] Conditional logic (show/hide)
- [ ] Form submission storage
- [ ] View submissions
- [ ] Export/import JSON
- [ ] JWT authentication

### **Should Have:**
- [ ] Form versioning
- [ ] Template library
- [ ] Advanced validation
- [ ] Data export (CSV/Excel)
- [ ] Role-based permissions
- [ ] Form analytics
- [ ] Multi-language support

### **Nice to Have:**
- [ ] Drag-drop form builder UI
- [ ] WYSIWYG editor
- [ ] Mobile-responsive forms
- [ ] Offline mode support
- [ ] Webhook notifications
- [ ] API integrations

---

## 📁 PROJECT STRUCTURE

```
form-builder/
├── backend/                      # Django backend
│   ├── config/
│   ├── forms/                    # Form builder app
│   │   ├── models.py
│   │   ├── serializers.py
│   │   ├── views.py
│   │   ├── urls.py
│   │   └── admin.py
│   ├── manage.py
│   └── requirements.txt
├── frontend/                     # React frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── FormBuilder/
│   │   │   ├── DynamicForm/
│   │   │   └── FieldTypes/
│   │   ├── pages/
│   │   │   ├── FormsListPage.jsx
│   │   │   ├── FormBuilderPage.jsx
│   │   │   └── SubmissionsPage.jsx
│   │   ├── services/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
├── README.md
└── docs/                         # Documentation
```

---

## 🎯 DEVELOPMENT APPROACH

### **Phase 1: Core Backend**
1. Models, serializers, views
2. API endpoints
3. Authentication
4. Database setup

### **Phase 2: Basic Frontend**
1. Form list, create, edit
2. Basic field rendering
3. Form submission
4. Submission viewer

### **Phase 3: Advanced Features**
1. Conditional logic
2. Validation rules
3. Field editor UI
4. Export/import

### **Phase 4: Polish**
1. UI/UX enhancements
2. Performance optimization
3. Documentation
4. Testing

---

## 📝 ADDITIONAL REQUIREMENTS

### **Code Quality:**
- Unit tests for backend
- Component tests for frontend
- Code coverage > 80%
- ESLint for frontend
- Pylint for backend

### **Documentation:**
- API documentation (Swagger/OpenAPI)
- Component documentation
- User guide
- Developer guide

### **Performance:**
- Form loading < 1 second
- Submission processing < 500ms
- Optimized database queries
- Frontend code splitting

---

## 🔗 REFERENCES

**Similar Projects:**
- Formik (React forms)
- React Hook Form
- JotForm (online form builder)
- Google Forms

**Technologies:**
- Django REST Framework docs
- React 18 docs
- Vite docs
- Material-UI docs

---

## 🤝 INTEGRATION WITH CURSOR AI

**This agent should:**
- Understand the retail POS context (RetailMind)
- Follow POS-Spec standards (IST dates, file naming)
- Use existing authentication patterns
- Maintain code quality standards
- Provide clear documentation

**Communication:**
- Daily progress updates
- Clear issue reporting
- Proactive suggestions
- Code review notes

---

## ✅ DELIVERABLES

1. **Working Form Builder** with all core features
2. **Complete API documentation**
3. **User guide**
4. **Integration guide** for RetailMind
5. **Deployment guide**
6. **Test suite**

---

**Ready to start building!** 🚀

**Last Updated:** 01-Nov-2025 16:23:00 IST

