# Olivine ERP Ruleset
### Version: 1.0.0
### Last Updated: 06-Dec-2025 , 16:51PM  
### Source Authority: BBP v0.4 + Project Naming/Architecture 

Purpose: To ensure all AI-assisted development follows the BBP, design language, architecture, templates, and execution workflow — with consistency, traceability, and zero assumptions.

1️⃣ System Rules (Behavior Layer)

These govern HOW the AI behaves.

- The BBP is the single source of truth.
- Never invent fields, statuses, relationships, processes, or logic.
- If information is missing or unclear → ask before generating.
- Follow the defined folder structure, naming conventions, and module patterns.
- All generated code must match the tech stack:
  React 18 + TypeScript + Vite + Tailwind.
- Always follow ELOBS execution flow when building modules.
- Use the correct template (mst01/mst02/mst03/txn01/txn02/txn03).
- Apply validation rules as defined in BBP.
- Generate readable, modular, maintainable code.
- Do not generate delete functionality where the BBP specifies soft-deactivation.

2️⃣ BBP Rules (Domain Layer)
- Located in: /docs/bbp/*
- Treated as the authoritative business rule definition.
- Every module must map:
  • Fields
  • Data Types
  • Relationships
  • Statuses
  • Business Rules
  • Lifecycle Behavior
- Modules must not diverge from BBP definitions.
- If a BBP file exists for a module, it must be referenced before generating code.
- If BBP is updated, code must be updated accordingly.

3️⃣ Template Rules (Module Structure Layer)

Templates define HOW modules are shaped.

Location: /docs/templates/*

Template Mappings:
- mst01 → Simple Master (flat fields, low logic)
- mst02 → Medium Master (relationships + rules)
- mst03 → Complex Master (variants, nested structures)
- txn01 → Simple Transaction
- txn02 → Medium Workflow Transaction
- txn03 → Complex ERP Workflow

Rules:
- All module generation must start by selecting the correct template.
- UI patterns, file names, folder structure, and component boundaries come from the template.
- Templates must NOT be modified without explicit approval.

4️⃣ Build Guide Rules (Execution Process – ELOBS)
E = Extract
    Read BBP fields, relationships, statuses, and rules.

L = Layout
    Apply template (mst or txn) to determine structure.

O = Organize
    Create the correct file/folder scaffolding.

B = Build
    Generate code in the following order:
      1. Types
      2. Validation Schema
      3. Service Layer (mock → live)
      4. Hooks
      5. UI Screens (list → form → filters)
      6. Routing + Sidebar registration

S = Sync
    Cross-check against BBP and template and correct inconsistencies.

5️⃣ Folder & Naming Rules
src/modules/<module>/
    <module>.types.ts
    <module>.schema.ts (Zod when needed)
    <module>.service.ts
    use<Module>.ts
    <Module>Page.tsx


Routing location: src/app/router.tsx
Sidebar entry: src/ui/components/Sidebar.tsx

Naming rules:

- PascalCase for components
- camelCase for variables and hooks
- kebab-case for folders
- Suffixes: .types.ts, .service.ts, .schema.ts, .tsx

6️⃣ Interaction Rules (How to Command Continue)
Future requests should be short execution commands, not full instructions.

Examples:

✔ Generate module "Company" using mst01 and BBP section 1.1. Follow ELOBS.
✔ Update Locations based on new BBP rules. Only modify affected files.
✔ Add validation changes for Company status rule.

Not allowed:

✘ "Create a Company module with random fields"
✘ Long conversational instructions.
✘ New rules unless explicitly approved.

7️⃣ Versioning & Governance Rules
- BBP updates must increment version numbers.
- Code should reflect the latest BBP version.
- Breaking rule changes must be confirmed before applying.
- Template changes must be explicitly approved.


📦 Updated Rule Block to Append to the Ruleset (copy-paste into Olivine_Ruleset.md)
### 🚧 Navigation + Routing Construction Rule (Applies to All Modules)

For every new module generated using mst01, mst02, mst03, txn01, txn02, or txn03:

1. **Routing Registration**
   - The route must be added automatically to the main router file:
     `src/app/router.tsx` (or the current router location).
   - The module page component must be imported.
   - The route must be nested under the protected `AppLayout` block.
   - Example expected format:

   ```tsx
   {
     path: "<module-name>",
     element: <ModuleNamePage />,
   }


2. **Sidebar Registration**

The module must appear in the sidebar automatically.
The sidebar group (section header) must match the BBP module classification:
Organization
Merchandising
Operations
Procurement
Finance
System

Each module must use the same NavLink styling pattern as existing items.
Example expected format:

<NavLink
  to="/<module-name>"
  className={({ isActive }) =>
    `block px-4 py-2 rounded-md transition-colors ${
      isActive ? "bg-emerald-700 text-white" : "text-white/80 hover:bg-emerald-800"
    }`
  }
>
  <ReadableLabel />
</NavLink>


No manual steps should be required.
If automatic placement is ambiguous, Continue must ask before inserting.
Validation Before Completion
Confirm route exists by simulated navigation path: /<module-name>

Confirm sidebar item appears after login.

🧪 Acceptance Test for Continue:

“A newly generated module must always be reachable by both typing the URL path and using the sidebar navigation link.”

