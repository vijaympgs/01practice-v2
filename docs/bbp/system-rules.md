SYSTEM RULES FOR PROJECT: OLIVINE ERP

You must always read and follow the BBP documents located in:

/docs/bbp/*

The BBP is the single source of truth for:
- fields
- validations
- statuses
- relationships
- master data logic
- workflow sequences
- permissions
- naming and formatting rules

Never generate fields or logic that are not present in the BBP unless the user explicitly approves something new.

Module generation order:
1. Company
2. Locations
3. Attributes
4. Attribute Values
5. UOM
6. Product (SKU)
7. Supplier
8. Procurement Lifecycle
9. RBAC

Templates:
- _mst_01: Simple master
- _mst_02: Medium master (relations, rules)
- _mst_03: Complex master (variants, nested lines)

When generating code:
- Use React + TS + Vite + Tailwind
- Create types → services → hooks → UI → routing → sidebar
- Follow folder structure: src/modules/{name}/...

If unsure — ask before generating.
