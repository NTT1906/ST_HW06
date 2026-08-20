# POSTMAN-01 — Postman Collection Design & Validation: Product Categories (FR-14)

**Skill:** POSTMAN-01  
**Stage:** 13  
**API:** API 3 — FR-14 Product Categories  
**Endpoints:** `GET /api/categories`, `POST /api/categories`, `PUT /api/categories/:id`, `DELETE /api/categories/:id`  
**Student ID:** 23127255  
**Date/Time:** 2026-08-20T13:56 +07:00  
**Artifacts Generated / Updated:**
- Collection: [`postman/EShop-HW06.postman_collection.json`](file:///c:/Users/nttis\Downloads\SUT_HW06\postman\EShop-HW06.postman_collection.json)
- Environment: [`postman/EShop-HW06.postman_environment.json`](file:///c:/Users/nttis\Downloads\SUT_HW06\postman\EShop-HW06.postman_environment.json)
**Executor:** AI (Antigravity / Gemini Flash)

---

## 1. Collection Architecture & Structure (API 3 Suite)

The unified Postman collection contains all three selected APIs in distinct top-level folders:

```
EShop-HW06 API Testing (129 test items total)
├── API 1 - POST /api/register (Account Registration) [43 items]
├── API 2 - GET /api/orders/my-orders (Order History) [43 items]
└── API 3 - GET /api/categories (Product Categories) [43 items]
    ├── 1. Happy Path & Domain Valid Tests (TC-CAT-01, 02, 03, 04, 10, 11, 12)
    ├── 2. Boundary Value Analysis (BVA) (TC-CAT-14, 15, 17, 18, 19, 20)
    ├── 3. State Transition Tests (ST) (TC-CAT-21, 22, 23, 24, 25, 26)
    ├── 4. Security Tests (SEC) (TC-CAT-05, 06, 27, 28, 29, 30, 31, 32, 33)
    ├── 5. Schema Validation (SCHEMA) (TC-CAT-34, 35, 36, 37, 38)
    ├── 6. Incomplete & Corrected Validation Tests (TC-CAT-07, 08, 09, 13, 16)
    └── 7. Human Extension Tests (EXTEND) (TC-HUM-CAT-01, 02, 03, 04, 05)
```

Total requests in API 3 folder: **43 requests** (38 audited AI cases + 5 human extensions).

---

## 2. Mandatory Student ID Header Implementation

The required `X-Student-Id: 23127255` header is injected automatically via collection pre-request script into every API 3 request.

---

## 3. Dynamic Workflow & Chaining Scripts

1. **State Transition Chain (`TC-CAT-21` to `TC-CAT-23`):**
   - Automatically provisions unique category names (`'ST Active Cat ' + Date.now()`).
   - Captures generated `id` via `pm.environment.set('st_cat_id', res.id)` and asserts catalog presence, rename, and deletion.
2. **Orphan Product Integrity Test (`TC-CAT-26`):**
   - Creates a parent category, attaches a child product, deletes the parent category, and verifies the child product's foreign key reference remains intact.
3. **Broken RBAC Defect Detection (`TC-CAT-05`, `27`, `28`, `29`):**
   - Injects user token (`role: "user"`) to verify that the SUT's improper grant of admin privileges is captured and recorded.

---

## 4. POSTMAN-01 Validation Checklist (API 3)

- [x] All 43 test cases mapped into Postman Collection JSON
- [x] Header `X-Student-Id: 23127255` verified on all requests
- [x] Multi-step dynamic seeding (`pm.sendRequest`) implemented for state progression tests
- [x] Collection tested and verified executable via Newman CLI

---

*Artifact owner: AI (Stage 13 — POSTMAN-01, API 3)*  
*→ Next is Stage 14 (features-used.md update) and Stage 15 (NEWMAN-01 Summary for API 3).*
