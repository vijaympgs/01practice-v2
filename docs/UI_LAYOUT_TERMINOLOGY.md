# UI Layout Terminology Reference

## 🎯 **Purpose**

This document establishes standardized terminology for all application UI sections. Use this reference when communicating about UI modifications, improvements, or issues to ensure clear and precise communication.

---

## 🔐 **Login Screen Sections**

### **Login > Sign-in Message Area**
- **Location**: Top section of the login screen
- **Purpose**: Welcome messages, system notifications, alerts
- **Content**: Welcome text, system status, important announcements
- **Reference**: "Update the sign-in message area with a new welcome message"

### **Login > Credentials Capture Section**
- **Location**: Central form area of the login screen
- **Purpose**: User authentication input fields
- **Content**: Username/email field, password field, input validation
- **Reference**: "Add validation to the credentials capture section"

### **Login > Theme Selection Area**
- **Location**: Typically right side or bottom of login form
- **Purpose**: Theme customization and appearance settings
- **Content**: Theme switcher, color scheme options, display preferences
- **Reference**: "Enhance the theme selection area with more options"

### **Login > Sign-in Buttons**
- **Location**: Bottom of the login form
- **Purpose**: Authentication action triggers
- **Content**: Login button, forgot password link, sign-up option
- **Reference**: "Modify the sign-in buttons styling and behavior"

---

## 🖥️ **Main Application Layout (Post-Login)**

### **Section A: Sidebar Structure (Left)**
- **Location**: Left side of the main application screen
- **Purpose**: Primary navigation and menu system
- **Content**: Navigation menu items, user profile, quick actions, collapsible sections
- **Reference**: "Add new menu items to Section A: Sidebar Structure"
- **Components**: 
  - Main navigation menu
  - User profile section
  - Quick action buttons
  - Collapse/expand functionality

### **Section B: Application Header (Top)**
- **Location**: Top horizontal bar of the main application
- **Purpose**: Global navigation, user info, and system controls
- **Content**: Application title, user account menu, notifications, global search, logout
- **Reference**: "Update Section B: Application Header with new user menu"
- **Components**:
  - Application branding/logo
  - User account dropdown
  - Notification center
  - Global search bar
  - System settings access

### **Section C: Primary Workspace**
- **Location**: Central/main content area of the application
- **Purpose**: Main content rendering and form display area
- **Content**: Dynamic forms, data tables, dashboards, detailed views
- **Reference**: "Render the new form in Section C: Primary Workspace"
- **Components**:
  - Dynamic content area
  - Form containers
  - Data display tables
  - Interactive components
  - Content-specific toolbars

### **Section D: Status Bar**
- **Location**: Bottom horizontal bar of the application
- **Purpose**: System status, connection info, and contextual help
- **Content**: Connection status, user session info, help links, system messages
- **Reference**: "Update Section D: Status Bar with real-time connection info"
- **Components**:
  - Connection status indicator
  - Session information
  - Help/documentation links
  - System messages
  - Version information

---

## 📐 **Visual Layout Diagram**

```
┌─────────────────────────────────────────────────────────────┐
│                    Section B: Application Header              │
│  [Logo] [Search] [Notifications] [User Menu] [Settings]       │
├─────────────┬───────────────────────────────────────────────┤
│             │                                               │
│  Section A: │              Section C: Primary Workspace      │
│   Sidebar   │                                               │
│   Structure │         [Dynamic Content Area]                │
│             │                                               │
│  [Menu]     │         [Forms/Tables/Dashboards]             │
│  [Profile]  │                                               │
│  [Actions]  │                                               │
│             │                                               │
├─────────────┴───────────────────────────────────────────────┤
│                    Section D: Status Bar                     │
│  [Connection] [Session] [Help] [System Messages] [Version]   │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔗 **Additional UI Components**

### **Primary Workspace Bottom Basestrip**
- **Location**: Bottom area within Section C (Primary Workspace)
- **Purpose**: Secondary navigation and action controls for the active content
- **Content**: Tab navigation, action buttons, pagination, context-specific tools
- **Reference**: "Add pagination controls to the primary workspace bottom basestrip"

### **Component Interactions**
- **Sidebar → Primary Workspace**: Menu selection triggers content rendering
- **Header → Primary Workspace**: Global actions affect workspace content
- **Status Bar → All Sections**: System status affects entire application
- **Theme Selection → All Sections**: Theme changes apply globally

---

## 💬 **Usage Examples**

### **Clear Communication Examples**

#### **✅ Good Examples**
- "Update the sign-in message area with a new welcome message"
- "Add validation to the credentials capture section"
- "Enhance Section A: Sidebar Structure with collapsible menu items"
- "Modify Section B: Application Header to include a global search bar"
- "Render the new user form in Section C: Primary Workspace"
- "Update Section D: Status Bar with real-time connection status"
- "Add action buttons to the primary workspace bottom basestrip"

#### **❌ Ambiguous Examples**
- "Fix the login screen" (Which part?)
- "Update the menu" (Which menu?)
- "Change the header" (What specifically?)
- "Modify the main area" (Which area?)

### **Common Modification Scenarios**

#### **Login Screen Modifications**
- "Update the sign-in message area with promotional content"
- "Add two-factor authentication to the credentials capture section"
- "Include dark/light theme toggle in the theme selection area"
- "Add social login options to the sign-in buttons"

#### **Main Application Modifications**
- "Add new menu category to Section A: Sidebar Structure"
- "Implement notification center in Section B: Application Header"
- "Create new dashboard view in Section C: Primary Workspace"
- "Add real-time status indicators to Section D: Status Bar"

#### **Content-Specific Modifications**
- "Render the inventory management form in Section C: Primary Workspace"
- "Add export functionality to the primary workspace bottom basestrip"
- "Update the theme selection area to include custom themes"

---

## 📋 **Communication Best Practices**

### **When Requesting Changes**
1. **Always specify the section** using the established terminology
2. **Be specific about the component** within the section
3. **Describe the desired behavior** clearly
4. **Mention any interactions** with other sections

### **Example Template**
