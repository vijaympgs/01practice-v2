# Gap Analysis: Attribute Management & Item Master

**Date:** 2025-12-12
**Reference Document:** `docs\bbp\bbp\masters_bbp_v1`
**Scope:** Attribute Management (BBP 2.1 - 2.3) and Item Master (BBP 2.5)

## Executive Summary
**Status Update (2025-12-12):** Significant refactoring has been completed. The "Flat Item" architecture has been replaced with the BBP-compliant **"Parent Item + Variant SKU"** architecture. The Attribute system has been fully implemented in the `categories` app, including Attribute Templates. Multi-tenancy (`company` field) has been added across `products`, `categories`, `inventory`, and `sales` apps. References in `procurement` have been updated.

**Current State:** Codebase refactoring is **Completed**. Database migration and runtime verification are **Pending**.

---

## 1. Attribute Management (BBP 2.1 - 2.3)

The BBP requires a robust attribute system to drive variant generation and search facets.

| Feature | BBP Requirement | Status | Implementation Details |
| :--- | :--- | :--- | :--- |
| **Attribute Master** | **Model:** `Attribute`<br>**Fields:** `company_id`, `attribute_code`, `input_type`, `value_source`, `is_variant_dimension`, `is_search_facet`. | **COMPLETED** | Refactored `categories.Attribute` to include all BBP fields, including `company` and `attribute_code`. |
| **Attribute Values** | **Model:** `AttributeValue`<br>**Fields:** `company_id`, `value_code`, `value_label`, `is_default`. | **COMPLETED** | Updated `categories.AttributeValue` with all required fields. |
| **Attribute Template** | **Model:** `ProductAttributeTemplate`<br>**Purpose:** Define sets of attributes (e.g., "T-Shirt Attributes") and identify which ones create variants. | **COMPLETED** | Created `ProductAttributeTemplate` and `ProductAttributeTemplateLine` models in `categories`. |
| **Item Integration** | Items should link to `AttributeValue` (for strict validation). | **COMPLETED** | Created `VariantAttribute` model in `products` linking `ItemVariant` to `AttributeValue`. |

---

## 2. Item Master (BBP 2.5)

The BBP specifies a structure to handle complex merchandise (e.g., a Shirt available in Red/Blue and S/M/L).

| Feature | BBP Requirement | Status | Implementation Details |
| :--- | :--- | :--- | :--- |
| **Architecture** | **Parent-Child:**<br>1. **Parent Item:** Common data (Brand, Category, Description).<br>2. **Variant (SKU):** Specifics (Barcode, Price, Stock). | **COMPLETED** | Implemented `Item` (Parent) and `ItemVariant` (SKU) models in `products/models.py`. |
| **Variant Model** | **Model:** `ItemVariant`<br>**Fields:** `sku_code`, `item_id` (FK), `variant_attributes`, `uom_mappings`. | **COMPLETED** | `ItemVariant` model created with `sku_code`, `attributes`, and UOM fields. |
| **Variant Generation** | Variants generated automatically based on `ProductAttributeTemplate` dimensions. | **PENDING** | Logical implementation (Service layer) to auto-generate variants from templates is pending (currently models exist but generation logic is needed). |
| **UOM Mapping** | **Per Variant:** Each variant can have its own Sales/Purchase UOMs. | **COMPLETED** | `ItemVariant` includes `sales_uom`, `purchase_uom`, and `stock_uom` FKs. |
| **Multi-Tenancy** | **Field:** `company_id` (FK) on all master tables. | **COMPLETED** | Added `company` ForeignKey to all updated models in `products`, `categories`, `inventory`, `sales`, and `pos_masters`. |

---

## 3. Downstream Integrations (Refactoring)

| Module | Action Taken | Status |
| :--- | :--- | :--- |
| **Inventory** | Updated `Inventory` to link `ItemVariant` (OneToOne). Updated `StockMovement`, `StockAlert` to link `ItemVariant`. | **COMPLETED** |
| **Sales** | Updated `SaleItem` to link `ItemVariant`. Updated Serializers (`SaleSerializer`, `SaleItemSerializer`) to use variant fields. | **COMPLETED** |
| **Procurement** | Replaced `products.Product` references with `products.ItemVariant` in `PurchaseOrder`, `PurchaseRequest`, `PurchaseQuotation`. | **COMPLETED** |
| **POS Masters** | Added `company` field and verified logical links. | **COMPLETED** |

---

## 4. Pending Actions (Next Session)

1.  **Database Migration:**
    *   **Action:** Release lock on `db.sqlite3` (restart environment) and run `python manage.py migrate`.
    *   **Fallback:** If migration conflicts persist due to drastic model changes, reset database (`rm db.sqlite3`) and re-initialize.

2.  **Data Seeding:**
    *   Create `Company` and generic `User`.
    *   Create basic `Attribute` (e.g., Color, Size) and `AttributeValue`.
    *   Create `Item` and `ItemVariant` to verify the structure.

3.  **Variant Generation Logic:**
    *   Implement service method to take an `Item` and `ProductAttributeTemplate` and generate `ItemVariant` records.

4.  **Frontend Alignment:**
    *   Update calls in React to use `variant_name` and `sku_code` instead of old `product_name`.

## 5. Technical Note for Next Session

**Database Lock & Reset:**
*   The `makemigrations` step was successful, but `migrate` failed due to a file lock on `db.sqlite3`.
*   **Action:** Ensure all python processes are stopped.
*   **Recommended:** Given the deep refactoring (table renames, key changes), it is cleaner to reset the development database:
    ```bash
    rm backend/db.sqlite3
    python manage.py migrate
    python manage.py createsuperuser
    ```
