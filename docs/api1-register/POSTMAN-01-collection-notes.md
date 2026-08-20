# POSTMAN-01 — Postman Collection Design & Validation: POST /api/register

**Skill:** POSTMAN-01  
**Stage:** 13  
**API:** API 1 — FR-01 Account Registration  
**Endpoint:** `POST /api/register`  
**Student ID:** 23127255  
**Date/Time:** 2026-08-20T12:38 +07:00  
**Artifacts Generated:**
- Collection: [`postman/EShop-HW06.postman_collection.json`](file:///c:/Users/nttis/Downloads/SUT_HW06/postman/EShop-HW06.postman_collection.json)
- Environment: [`postman/EShop-HW06.postman_environment.json`](file:///c:/Users/nttis/Downloads/SUT_HW06/postman/EShop-HW06.postman_environment.json)
**Executor:** AI (Antigravity / Gemini Flash)

---

## 1. Collection Architecture & Organization

The Postman collection is organized systematically into hierarchical folders representing the testing techniques and human extensions for API 1:

```
EShop-HW06 API Testing
└── API 1 - POST /api/register (Account Registration)
    ├── 1. Happy Path & Domain Valid Tests (TC-REG-01, 02, 11, 12)
    ├── 2. Boundary Value Analysis (BVA) (TC-REG-14, 15, 16, 18)
    ├── 3. State Transition Tests (ST) (TC-REG-21, 22, 23, 24, 25)
    ├── 4. Security Tests (SEC) (TC-REG-26, 27, 28, 29, 30, 31, 32)
    ├── 5. Schema Validation (SCHEMA) (TC-REG-33, 34, 35, 36, 37, 38)
    ├── 6. Robustness & Defect Exploratory Tests (TC-REG-03 to 10, 13, 17, 19, 20)
    └── 7. Human Extension Tests (EXTEND) (TC-HUM-01, 02, 03, 04, 05)
```

Total requests in API 1 suite: **43 requests** (38 audited AI candidates + 5 human extensions).

---

## 2. Mandatory Student ID Header Implementation

Per HW06 requirements and anti-cheat constraints, the `X-Student-Id: 23127255` header is injected dynamically via collection-level Pre-request script (not hard-coded into individual requests):

```javascript
// Collection-level pre-request script
const studentId = pm.environment.get('studentId') || '23127255';
pm.request.headers.upsert({ key: 'X-Student-Id', value: studentId });
console.log('[Pre-request] Applied X-Student-Id: ' + studentId + ' to ' + pm.request.method + ' ' + pm.request.url.getPath());
```

**Verification:** Newman execution logs confirm `[Pre-request] Applied X-Student-Id: 23127255` is output on every executed request.

---

## 3. Environment Variables Configuration

File: `postman/EShop-HW06.postman_environment.json`

| Variable Key | Initial / Current Value | Type | Purpose |
|---|---|---|---|
| `baseUrl` | `http://localhost:3000` | default | SUT Backend endpoint |
| `studentId` | `23127255` | default | Student ID for assignment attribution |
| `adminEmail` | `admin@eshop.com` | default | Seeded admin credential (Stage 1 confirmed) |
| `adminPassword` | `Admin123!` | secret | Seeded admin credential |
| `userEmail` | `test@eshop.com` | default | Seeded test user credential |
| `userPassword` | `Test1234!` | secret | Seeded test user credential |
| `userToken` | `""` | secret | Dynamically populated JWT |
| `adminToken` | `""` | secret | Dynamically populated admin JWT |

---

## 4. Key Automated Test Scripts Implemented

1. **JSON Schema Draft-07 Validation:**
   ```javascript
   const schema = {
       "type": "object",
       "required": ["message", "id"],
       "properties": {
           "message": { "type": "string", "enum": ["User registered successfully"] },
           "id": { "type": "integer", "minimum": 1 }
       },
       "additionalProperties": false
   };
   pm.response.to.have.jsonSchema(schema);
   ```
2. **Defect-Detecting Security Assertion (SEC-01 Plaintext Password Leak):**
   ```javascript
   const res = pm.response.json();
   pm.expect(res.user.password).to.be.undefined;
   ```
3. **Dynamic Pre-request Seeding & Multi-Step Workflows:**
   Uses `pm.sendRequest()` to seed prerequisites (e.g. creating original user before testing duplicate re-registration and verifying token login).

---

## 5. POSTMAN-01 Validation Checklist

- [x] Collection `.json` generated and validated
- [x] Environment `.json` generated with all required variables
- [x] All 43 test cases (38 audited AI + 5 human extensions) mapped
- [x] Mandatory `X-Student-Id: 23127255` header dynamically configured and verified in pre-request logs
- [x] Pre-request scripts and test assertion scripts tested via Newman dry-run
- [x] Collection ready for automated execution (`NEWMAN-01`) and feature tracking (`POSTMAN-FEATURES-01`)

---

*Artifact owner: AI (Stage 13 — POSTMAN-01, API 1)*  
*→ **HARD STOP — awaiting human review and approval before Stage 14 (POSTMAN-FEATURES-01) and Stage 15 (NEWMAN-01 Execution).***
