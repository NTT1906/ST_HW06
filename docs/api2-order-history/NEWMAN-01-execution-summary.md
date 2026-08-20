# NEWMAN-01 — Newman Execution Summary: GET /api/orders/my-orders

**Skill:** NEWMAN-01  
**Stage:** 15  
**API:** API 2 — FR-11 Order History View (User)  
**Endpoint:** `GET /api/orders/my-orders`  
**Student ID:** 23127255  
**Execution Date/Time:** 2026-08-20T13:00:22 +07:00  
**Artifacts Generated / Updated:**
- Console Output: [`newman/newman-console.txt`](file:///c:/Users/nttis/Downloads/SUT_HW06/newman/newman-console.txt)
- HTML Extra Report: [`newman/newman-report.html`](file:///c:/Users/nttis/Downloads/SUT_HW06/newman/newman-report.html)
**Executor:** AI (Antigravity / Gemini Flash)

---

## 1. Execution Overview

```bash
newman run postman/EShop-HW06.postman_collection.json \
  -e postman/EShop-HW06.postman_environment.json \
  --reporters "cli,htmlextra" \
  --reporter-htmlextra-export newman/newman-report.html
```

- **Target Collection:** Unified `EShop-HW06.postman_collection.json` containing API 1 and API 2 suites
- **Newman Version:** 6.2.2
- **Reporter:** `newman-reporter-htmlextra` v1.23.1
- **Student ID:** `X-Student-Id: 23127255` verified on 100% of requests

---

## 2. Combined Quantitative Execution Results (API 1 + API 2)

| Metric | API 1 Only | Cumulative (API 1 + API 2) | API 2 Specific Count |
|---|---|---|---|
| **Total HTTP Requests** | 50 | **106** | **56** (43 suite items + 13 dynamic sub-requests) |
| **Prerequest Scripts** | 66 | **118** | **52** |
| **Test Scripts** | 43 | **86** | **43** |
| **Total Assertions** | 49 | **102** | **53** |
| **Passed Assertions** | 46 | **99** | **53 (100% of API 2 assertions passed)** |
| **Failed Assertions** | 3 | **3** | **0 (No defects identified in API 2 itself)** |
| **Total Run Duration** | 2.1s | **3.8s** | Average response time: 11 ms |
| **Total Data Received** | 7.15 kB | **35.22 kB** | — |

---

## 3. Analysis of API 2 Execution Findings

1. **Authentication & Authorization Integrity (100% Pass):**
   - All token gates (missing token, forged JWT `alg: "none"`, invalid signatures, non-Bearer schemes, empty tokens) correctly returned `401 Unauthorized` or `403 Forbidden`.
2. **Horizontal Access Control (IDOR Protection):**
   - User A received strictly their own orders.
   - User B's orders and Admin's orders were completely isolated and never leaked to other users.
   - Query parameter pollution (`?user_id=1`) was ignored safely.
3. **State Reflection & Immutability:**
   - Real-time status transitions across the order lifecycle (`pending → confirmed → shipping → delivered`, and `canceled`) were reflected in history queries without latency or corruption.
   - Order IDs and creation timestamps remained immutable across state transitions.
4. **Chronological Ordering & Uniqueness:**
   - Orders returned in exact descending chronological order (newest first).
   - Zero duplicate order records were returned.

---

## 4. NEWMAN-01 Validation Checklist (API 2)

- [x] Newman executed the combined collection (API 1 + API 2) successfully
- [x] All 56 API 2 requests carried `X-Student-Id: 23127255`
- [x] Console log preserved in `newman/newman-console.txt`
- [x] HTML Extra report updated at `newman/newman-report.html`
- [x] Execution metrics truthfully captured and recorded

---

*Artifact owner: AI (Stage 15 — NEWMAN-01, API 2)*  
*This closes the per-API pipeline for API 2: `GET /api/orders/my-orders`.*  
*→ **HARD STOP — awaiting human review and approval before proceeding to API 3: FR-14 Product Categories (`GET /api/categories`).***
