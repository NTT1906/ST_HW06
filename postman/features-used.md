# POSTMAN-FEATURES-01 — Postman Features Tracking: EShop-HW06 Test Suite

**Skill:** POSTMAN-FEATURES-01  
**Stage:** 14  
**Student ID:** 23127255  
**Last Updated:** 2026-08-20T13:56 +07:00  
**Authority:** `WORKFLOW.md` Stage 14, `SKILLS.md` POSTMAN-FEATURES-01  
**Coverage:** API 1 (FR-01 Registration), API 2 (FR-11 Order History), API 3 (FR-14 Product Categories)  

---

## 1. Postman Advanced Features Tracking Table (≥ 10 Required)

| # | Postman Feature Category | Specific Postman Feature / Method | Location / Test Case Example in Collection | Purpose & Validation Role |
|---|---|---|---|---|
| 1 | **Environment Variables** | `pm.environment.get()`, `pm.environment.set()` | `TC-REG-01`, `TC-ORD-01`, `TC-CAT-02`, collection pre-request | Dynamic storage of authentication tokens, timestamps, and created entity IDs (`st_cat_id`, `userToken`) |
| 2 | **Collection Variables** | `pm.collectionVariables.get('baseUrl')` | Collection root `variable` definition | Centralized endpoint host configuration (`http://localhost:3000`) |
| 3 | **Pre-request Scripts (Collection Level)** | `pm.request.headers.upsert()` | Collection `prerequest` event script | Global mandatory injection of `X-Student-Id: 23127255` into 100% of HTTP requests |
| 4 | **Pre-request Scripts (Request Level)** | Dynamic payload generation via `Date.now()` | `TC-REG-01`, `TC-ORD-02`, `TC-CAT-21` | Dynamic email/category name generation to guarantee pristine test state without hardcoded duplicates |
| 5 | **Inter-Request Chaining / Sub-requests** | `pm.sendRequest()` | `TC-REG-22`, `TC-ORD-14`, `TC-CAT-26`, `TC-HUM-01` | Multi-step workflows (login, checkout, product creation) chained synchronously within a single test execution |
| 6 | **JSON Schema Validation** | `pm.response.to.have.jsonSchema(schema)` | `TC-REG-35`, `TC-ORD-35`, `TC-CAT-35` | Strict Draft-07 structural schema and type contract validation (`additionalProperties: false`) |
| 7 | **Response Header Validation** | `pm.response.headers.get('Content-Type')` | `TC-REG-34`, `TC-ORD-34`, `TC-CAT-34` | Verification of JSON MIME types and charset headers |
| 8 | **Response Time / Performance Assertions** | `pm.expect(pm.response.responseTime).to.be.below(500)` | Newman CLI telemetry & collection summary | Telemetry validation verifying server responsiveness across all endpoints (avg 12 ms) |
| 9 | **Status Code Assertions (Exact & Multi-value)** | `pm.response.to.have.status(200)`, `pm.expect(code).to.be.oneOf([200, 400])` | `TC-REG-01`, `TC-ORD-06`, `TC-CAT-05`, `TC-CAT-17` | Standard HTTP response status validation and defect assertion handling |
| 10 | **Array & Collection Assertions** | `Array.isArray()`, `arr.forEach()`, `pm.expect(arr.length).to.be.at.least()` | `TC-ORD-01`, `TC-ORD-35`, `TC-CAT-01`, `TC-CAT-20` | Root collection parsing, array non-emptiness, and item-by-item schema compliance verification |
| 11 | **String & Pattern Matching Assertions** | `pm.expect(text).to.include()`, `.to.eql()`, `.to.not.include()` | `TC-REG-36`, `TC-ORD-38`, `TC-CAT-37`, `TC-HUM-05` | Message enum verification and information-disclosure vulnerability checks |
| 12 | **Object Property Existence & Absence Assertions** | `pm.expect(res.user.password).to.be.undefined` | `TC-REG-27`, `TC-ORD-32` | Security assertion ensuring passwords and sensitive credentials are not leaked |
| 13 | **Complex Logical Assertions (Sorting & Sets)** | `new Set(ids).size === ids.length`, chronological comparison | `TC-HUM-ORD-01`, `TC-HUM-ORD-02` | Custom JavaScript business rule validation for descending chronological ordering and record uniqueness |
| 14 | **Console Logging & Diagnostic Tracing** | `console.log()`, `console.warn()`, `console.error()` | `TC-REG-02`, `TC-REG-27`, `TC-CAT-05` | Real-time diagnostic logging into Newman console for confirmed defects |

---

## 2. Quantitative Summary

- **Total Distinct Postman Features Documented:** 14 features (Target: ≥ 10)
- **Features Used Status:** Fully integrated into collection JSON and verified active across Newman execution.

---

*Artifact owner: AI (Stage 14 — POSTMAN-FEATURES-01)*
