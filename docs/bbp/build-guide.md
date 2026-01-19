# BUILD EXECUTION FLOW (ELOBS Framework)

E = Extract fields and dependencies from BBP
L = Layout UI structure based on template type (_mst_01 / _mst_02 / _mst_03)
O = Organize folders and file scaffolding
B = Build Types → Validation → Service → Hook → UI → Routing → Sidebar
S = Sync module with naming and dependency rules

Always run steps in order.
If unsure, ask before proceeding.


Use the Company definition from:
"/docs/bbp/RetailBBP_Master_v0.4.md", section "1.1 Company".

If a dedicated file "/docs/bbp/company.md" exists later, use that instead.

Always use the BBP as the single source of truth.
Never infer or auto-create fields unless explicitly stated.
Ask before introducing new rules.
