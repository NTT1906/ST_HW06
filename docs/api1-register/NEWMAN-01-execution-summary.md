# NEWMAN-01 — Newman Execution Summary: POST /api/register

**Skill:** NEWMAN-01  
**Stage:** 15  
**API:** API 1 — FR-01 Account Registration  
**Endpoint:** `POST /api/register`  
**Student ID:** 23127255  
**Execution Date/Time:** 2026-08-20T12:40:53 +07:00  
**Artifacts Generated:**
- Console Output: [`newman/newman-console.txt`](file:///c:/Users/nttis/Downloads/SUT_HW06/newman/newman-console.txt)
- HTML Extra Report: [`newman/newman-report.html`](file:///c:/Users/nttis/Downloads/SUT_HW06/newman/newman-report.html)
**Executor:** AI (Antigravity / Gemini Flash)

---

## 1. Execution Command & Environment

```bash
newman run postman/EShop-HW06.postman_collection.json \
  -e postman/EShop-HW06.postman_environment.json \
  --reporters "cli,htmlextra" \
  --reporter-htmlextra-export newman/newman-report.html
```

- **Target SUT Host:** `http://localhost:3000` (Local Node.js backend with SQLite)
- **Newman Version:** 6.2.2
- **Reporter:** `newman-reporter-htmlextra` v1.23.1
- **Student Attribution:** `X-Student-Id: 23127255` applied on all 50 requests

---

## 2. Quantitative Execution Results

| Metric | Measured Value | Notes |
|---|---|---|
| **Iterations** | 1 | Single full run |
| **Total HTTP Requests** | **50** | 43 test items + 7 dynamic sub-requests (`pm.sendRequest`) |
| **Prerequest Scripts Executed** | **66** | Pre-seeding, UUID generation, headers injection |
| **Test Scripts Executed** | **43** | Post-request test evaluations |
| **Total Assertions** | **49** | Automated `pm.test` assertions |
| **Passed Assertions** | **46** (93.9%) | Valid functional, BVA, schema, and security checks |
| **Failed Assertions** | **3** (6.1%) | **Genuine reproducible SUT defects discovered** |
| **Total Run Duration** | **2.1 seconds** | Average response time: 16 ms |
| **Total Data Received** | 7.15 kB | Localhost traffic |

---

## 3. Detailed Failure Investigation (3 Genuine Defects)

### Failure 1: Plaintext Password Leakage (**SEC-01 Defect**)
- **Test Case:** `TC-REG-27: SEC-01 Credential Disclosure Check via Login Response`
- **Assertion:** `SEC-01: Login response must not expose plaintext password`
- **Error Detail:** `AssertionError: expected 'PlaintextCheckSecret123!' to be undefined`
- **Root Cause & Behavior:** The SUT stores the user's password in plaintext in SQLite and returns `"password": "PlaintextCheckSecret123!"` inside the `user` object upon login.
- **Classification:** **Critical Security Defect (SEC-01 Violation)**.

### Failure 2: Empty Raw HTTP Body Created Account (**Input Handling Defect**)
- **Test Case:** `TC-HUM-04: Empty Raw HTTP Request Body Handling`
- **Assertion:** `expected 200 to be one of [ 400, 500 ]`
- **Error Detail:** The SUT returned `HTTP 200` and created a database record with null fields when an empty raw HTTP body was sent.
- **Classification:** **High Input Validation Defect (Ghost Record Initialization)**.

### Failure 3: Stack Trace & Internal Filesystem Path Leakage (**Information Disclosure Defect**)
- **Test Case:** `TC-REG-HUM-05: Malformed JSON Information Disclosure Check`
- **Assertion:** `expected 3 to deeply equal +0` (Found 3 leaked path signatures)
- **Error Detail:** Sending malformed JSON / non-JSON content caused an unhandled exception returning `HTTP 500` with raw HTML containing internal paths (`/mnt/c/...`, `server.js:21`, `TypeError: Cannot destructure property 'name'`).
- **Classification:** **Medium Security / Error Handling Defect (CWE-209 Information Exposure)**.

---

## 4. NEWMAN-01 Validation Checklist

- [x] Newman executed the exported collection and environment successfully
- [x] All requests carried the mandatory `X-Student-Id: 23127255` header (verified in console logs)
- [x] Console log preserved in `newman/newman-console.txt`
- [x] Interactive HTML report generated at `newman/newman-report.html` (853 kB)
- [x] Execution statistics truthfully recorded without fabricating passes or modifying failures
- [x] Failed assertions investigated and confirmed as genuine SUT defects

---

*Artifact owner: AI (Stage 15 — NEWMAN-01, API 1)*  
*This closes the per-API pipeline for API 1: `POST /api/register`.*  
*→ **HARD STOP — awaiting human review and approval. Next is Stage 16 (Bug Reporting / GitHub Issues for confirmed defects).***
