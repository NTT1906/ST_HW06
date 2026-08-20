# EXCEL-01 — Master Test Case Spreadsheet Documentation

**Skill:** EXCEL-01  
**Stage:** 18  
**Assignment:** HW06 — AI-Assisted Backend API Testing  
**Student ID:** 23127255  
**Date Generated:** 2026-08-20T14:01 +07:00  
**Generated Artifact:** [`excel/EShop-HW06-TestCases.xlsx`](file:///c:/Users/nttis/Downloads/SUT_HW06/excel/EShop-HW06-TestCases.xlsx)  
**Authority:** `WORKFLOW.md` Stage 18, `SKILLS.md` EXCEL-01, `2026.HW06.API Testing_En.md` §6.4  
**Executor:** AI (Antigravity / Gemini Flash)

---

## 1. Master Spreadsheet Architecture

The generated Excel workbook contains **5 comprehensive worksheets** structuring all 129 test cases and 8 confirmed defects:

```
excel/EShop-HW06-TestCases.xlsx
├── 1. Overview & Summary (Metadata, Scope, Technique Matrix, Bug Overview)
├── 2. API 1 - Register (43 test cases for POST /api/register)
├── 3. API 2 - Order History (43 test cases for GET /api/orders/my-orders)
├── 4. API 3 - Categories (43 test cases for GET /api/categories & Lifecycle)
└── 5. Bugs & Defects (8 SUT defects with root-cause and code remediation)
```

---

## 2. Test Case Distribution Summary

| Worksheet | Endpoint Tested | Technique Breakdown | Total Test Cases |
|---|---|---|---|
| **API 1 - Register** | `POST /api/register` | DT: 12, BVA: 8, ST: 6, SEC: 7, SCHEMA: 5, EXTEND: 5 | **43** |
| **API 2 - Order History** | `GET /api/orders/my-orders` | DT: 12, BVA: 8, ST: 6, SEC: 7, SCHEMA: 5, EXTEND: 5 | **43** |
| **API 3 - Categories** | `GET /api/categories` & CRUD | DT: 12, BVA: 8, ST: 6, SEC: 7, SCHEMA: 5, EXTEND: 5 | **43** |
| **TOTAL** | **3 Backend APIs** | **DT: 36, BVA: 24, ST: 18, SEC: 21, SCHEMA: 15, EXTEND: 15** | **129 Test Cases** |

---

## 3. Standardized Column Schema per Test Sheet

Every test case row contains complete attributes across 13 columns:
1. `TC ID` — Unique test case identifier (`TC-REG-xx`, `TC-ORD-xx`, `TC-CAT-xx`, `TC-HUM-xx`)
2. `Technique` — Testing technique category (`DT`, `BVA`, `ST`, `SEC`, `SCHEMA`, `EXTEND`)
3. `Scenario Title` — Concise human-readable description
4. `Preconditions` — Prerequisite system state or dynamic seeding setup
5. `HTTP Method` — Request method (`GET`, `POST`, `PUT`, `DELETE`)
6. `Path` — Full endpoint path
7. `Authorization` — Auth header type and token role
8. `Request Body / Query` — Exact JSON payload or query parameters
9. `Expected HTTP` — Target HTTP status code
10. `Expected Response Body / Assertion` — Validation assertion criteria
11. `Audit Classification` — Human audit classification (`VALID`, `INVALID`, `INCOMPLETE`, `HUMAN EXTENSION`)
12. `Execution Verdict` — Automated Newman outcome (`PASS`, `FAIL (Defect)`)
13. `Defect / Traceability Notes` — Links to Bug IDs, SEC rules, and SUT behaviors

---

## 4. EXCEL-01 Validation Checklist

- [x] Spreadsheet generated at `excel/EShop-HW06-TestCases.xlsx`
- [x] Contains 5 structured worksheets
- [x] All 129 test cases cataloged with 13-column schema
- [x] Complete defect catalog (8 bugs) documented in dedicated sheet
- [x] Student ID (`23127255`) and course metadata verified

---

*Artifact owner: AI (Stage 18 — EXCEL-01)*  
*→ **HARD STOP — awaiting human review and approval before Stage 19 (AUDIT-01 — AI Conversation Export & Audit Report).***
