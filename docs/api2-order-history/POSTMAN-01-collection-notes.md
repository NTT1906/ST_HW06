# POSTMAN-01 — Postman Collection Design & Validation: GET /api/orders/my-orders

**Skill:** POSTMAN-01  
**Stage:** 13  
**API:** API 2 — FR-11 Order History View (User)  
**Endpoint:** `GET /api/orders/my-orders`  
**Student ID:** 23127255  
**Date/Time:** 2026-08-20T13:00 +07:00  
**Artifacts Generated / Updated:**
- Collection: [`postman/EShop-HW06.postman_collection.json`](file:///c:/Users/nttis\Downloads\SUT_HW06\postman\EShop-HW06.postman_collection.json)
- Environment: [`postman/EShop-HW06.postman_environment.json`](file:///c:/Users/nttis\Downloads\SUT_HW06\postman\EShop-HW06.postman_environment.json)
**Executor:** AI (Antigravity / Gemini Flash)

---

## 1. Collection Architecture & Organization (API 2 Suite)

The API 2 test suite has been integrated under the unified collection structure:

```
EShop-HW06 API Testing
├── API 1 - POST /api/register (Account Registration) [43 requests]
└── API 2 - GET /api/orders/my-orders (Order History) [43 requests]
    ├── 1. Happy Path & Domain Valid Tests (TC-ORD-01, 02, 03, 07, 09, 10, 11)
    ├── 2. Boundary Value Analysis (BVA) (TC-ORD-13, 14, 15, 16, 18, 19, 20)
    ├── 3. State Transition Tests (ST) (TC-ORD-21, 22, 23, 24, 25, 26)
    ├── 4. Security Tests (SEC) (TC-ORD-27, 28, 29, 30, 31, 32, 33)
    ├── 5. Schema Validation (SCHEMA) (TC-ORD-34, 35, 36, 37, 38)
    ├── 6. Corrected & Routing Edge Tests (TC-ORD-04, 05, 06, 08, 12, 17)
    └── 7. Human Extension Tests (EXTEND) (TC-HUM-ORD-01, 02, 03, 04, 05)
```

Total requests in API 2 suite: **43 requests** (38 audited AI cases + 5 human extensions).

---

## 2. Mandatory Student ID Header Implementation

The `X-Student-Id: 23127255` header is injected automatically into every API 2 request via the collection-level pre-request script.

---

## 3. Automated Assertion Scripts Highlights

1. **Chronological Ordering Verification (`TC-HUM-ORD-01`):**
   ```javascript
   pm.test('Orders returned in descending chronological order (created_at)', function () {
       const arr = pm.response.json();
       if (arr.length >= 2) {
           for (let i = 0; i < arr.length - 1; i++) {
               const dateA = new Date(arr[i].created_at).getTime();
               const dateB = new Date(arr[i + 1].created_at).getTime();
               pm.expect(dateA).to.be.at.least(dateB);
           }
       }
   });
   ```
2. **Order ID Uniqueness Verification (`TC-HUM-ORD-02`):**
   ```javascript
   pm.test('No duplicate order IDs in history list', function () {
       const arr = pm.response.json();
       const ids = arr.map(o => o.id);
       const uniqueIds = new Set(ids);
       pm.expect(ids.length).to.eql(uniqueIds.size);
   });
   ```
3. **Horizontal Resource Isolation / IDOR Protection (`TC-ORD-29`):**
   ```javascript
   pm.test('User A receives ONLY User A orders (no cross-contamination)', function () {
       const arr = pm.response.json();
       arr.forEach(o => { pm.expect(o.user_id).to.eql(2); });
   });
   ```

---

## 4. POSTMAN-01 Validation Checklist (API 2)

- [x] All 43 test cases mapped into Postman Collection JSON
- [x] Header `X-Student-Id: 23127255` verified on all requests
- [x] Multi-step dynamic seeding (`pm.sendRequest`) implemented for state progression tests
- [x] Collection tested and verified executable via Newman CLI

---

*Artifact owner: AI (Stage 13 — POSTMAN-01, API 2)*  
*→ **HARD STOP — awaiting human review and approval. Next is Stage 15 (NEWMAN-01 Execution Summary for API 2).***
