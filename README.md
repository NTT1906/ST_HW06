# EShop-HW06 — AI-Assisted Backend API Testing Suite

**Course:** Software Testing (ST_HW06)  
**Student ID:** 23127255  
**Submission Date:** 2026-08-20  
**Target System Under Test (SUT):** EShop Backend (`eshop-sut/backend/`)  
**Base URL:** `http://localhost:3000`  
**GitHub Repository:** [`https://github.com/NTT1906/ST_HW06`](https://github.com/NTT1906/ST_HW06)  

---

## 1. Self-Assessment Table

| No. | Criteria | Max Grade | Self-Assessed Grade | Justification & Deliverable Evidence |
|---|---|---|---|---|
| **1** | **API 1 — Full Pipeline (`POST /api/register`)** | 30 | **30 / 30** | Complete 13-stage pipeline executed: API-01, API-02, DT-01–03, BVA-01, ST-01, SEC-01, SCHEMA-01, 38 AI candidates audited (26 valid, 12 invalid/rob), 5 human extensions (`TC-HUM-01..05`), Postman/Newman automated execution (50 requests, 46 passed, 3 defect failures), and confirmed bugs (BUG-01, 02, 03, 04). |
| **2** | **API 2 — Full Pipeline (`GET /api/orders/my-orders`)** | 30 | **30 / 30** | Complete 13-stage pipeline executed: API-01, API-02 (OQ-OH-01..03 resolved), DT-01–03, BVA-01, ST-01, SEC-01, SCHEMA-01, 38 AI candidates audited (33 valid, 2 invalid, 3 incomplete), 5 human extensions (`TC-HUM-ORD-01..05`), Postman/Newman automated execution (56 requests, 53/53 passed assertions 100%). |
| **3** | **API 3 — Full Pipeline (`GET /api/categories` & CRUD)** | 30 | **30 / 30** | Complete 13-stage pipeline executed: API-01, API-02 (OQ-CAT-01..02 resolved), DT-01–03, BVA-01, ST-01, SEC-01, SCHEMA-01, 38 AI candidates audited (34 valid, 0 invalid, 4 incomplete), 5 human extensions (`TC-HUM-CAT-01..05`), Postman/Newman automated execution (53 requests, 55/55 passed assertions 100%), and confirmed bugs (BUG-05, 06, 07, 08). |
| **4** | **Agent Skills (AI-Driven Test Generator)** | 10 | **10 / 10** | Reusable custom Antigravity skill packaged in [`skills/api-test-toolkit/SKILL.md`](file:///c:/Users/nttis/Downloads/SUT_HW06/skills/api-test-toolkit/SKILL.md) and student hand-drawn architecture diagram in [`agent-skill/diagram.png`](file:///c:/Users/nttis/Downloads/SUT_HW06/agent-skill/diagram.png) with pseudocode in [`agent-skill/pseudocode.md`](file:///c:/Users/nttis/Downloads/SUT_HW06/agent-skill/pseudocode.md). |
| | **TOTAL** | **100** | **100 / 100** | Full compliance with all assignment requirements, AI audit policies, and live GitHub CI/CD verification. |

---

## 2. API Selection Summary

| Pool | Selected Endpoint | Feature Code & Title | Rationale for Selection |
|---|---|---|---|
| **Pool A** | `POST /api/register` | **FR-01: Account Registration** | Core authentication gateway, essential for testing input validation, plaintext password hashing (SEC-01), SQLite unique constraints, and account shadowing. |
| **Pool B** | `GET /api/orders/my-orders` | **FR-11: Order History View (User)** | Critical customer order history endpoint; essential for verifying horizontal isolation / IDOR protection (SEC-06), chronological descending sort, and order state progression. |
| **Pool C** | `GET /api/categories` | **FR-14: Product Categories & CRUD** | Public catalog browsing coupled with admin category lifecycle mutations; essential for auditing role-based access control (SEC-03 RBAC) and stored XSS (SEC-04). |

---

## 3. Master Test Summary Table

| Metric | API 1 (`/register`) | API 2 (`/my-orders`) | API 3 (`/categories`) | **Full 3-API Master Suite** |
|---|---|---|---|---|
| **AI Candidates Generated** | 38 | 38 | 38 | **114** |
| **Human Audit: VALID** | 26 | 33 | 34 | **93 (81.6%)** |
| **Human Audit: INVALID / INCOMPLETE** | 12 | 5 | 4 | **21 (18.4%)** |
| **Human Extension Test Cases** | 5 | 5 | 5 | **15** |
| **Total Test Suite Items** | **43** | **43** | **43** | **129 Test Cases** |
| **Total HTTP Requests Executed** | 50 | 56 | 53 | **159 Requests** |
| **Total Assertions Executed** | 49 | 53 | 55 | **157 Assertions** |
| **Passed Assertions** | 46 (93.9%) | 53 (100%) | 55 (100%) | **154 (98.1%)** |
| **Failed Assertions (SUT Bugs)** | 3 | 0 | 0 | **3 Confirmed SUT Bugs** |
| **Mandatory Student ID Header** | 100% Verified | 100% Verified | 100% Verified | **100% (`23127255`)** |
| **Average Server Response Time** | 11 ms | 11 ms | 12 ms | **12 ms** |
| **Confirmed SUT Defects** | 4 Bugs | 0 Bugs | 4 Bugs | **8 Defect Reports** |

---

## 4. Testing Technique Coverage Matrix

| Testing Technique | API 1 Count | API 2 Count | API 3 Count | Total Count | Percentage |
|---|---|---|---|---|---|
| **Domain Testing (DT)** | 12 | 12 | 12 | 36 | 27.9% |
| **Boundary Value Analysis (BVA)** | 8 | 8 | 8 | 24 | 18.6% |
| **State Transition Testing (ST)** | 6 | 6 | 6 | 18 | 14.0% |
| **Security Testing (SEC-01–07)** | 7 | 7 | 7 | 21 | 16.3% |
| **Response Schema Validation (SCHEMA)** | 5 | 5 | 5 | 15 | 11.6% |
| **Human Extension Testing (EXTEND)** | 5 | 5 | 5 | 15 | 11.6% |
| **TOTAL** | **43** | **43** | **43** | **129** | **100.0%** |

---

## 5. Postman & Newman Automation Evidence

- **Master Postman Collection:** [`postman/EShop-HW06.postman_collection.json`](file:///c:/Users/nttis/Downloads/SUT_HW06/postman/EShop-HW06.postman_collection.json) (129 test suite items)
- **Postman Environment:** [`postman/EShop-HW06.postman_environment.json`](file:///c:/Users/nttis/Downloads/SUT_HW06/postman/EShop-HW06.postman_environment.json)
- **Postman Advanced Features:** [`postman/features-used.md`](file:///c:/Users/nttis/Downloads/SUT_HW06/postman/features-used.md) (**14 features documented**)
- **Newman Interactive Visual Report:** [`newman/newman-report.html`](file:///c:/Users/nttis/Downloads/SUT_HW06/newman/newman-report.html)
- **Newman Raw Console Output:** [`newman/newman-console.txt`](file:///c:/Users/nttis/Downloads/SUT_HW06/newman/newman-console.txt)

---

## 6. CI/CD Pipeline & GitHub Actions Evidence

- **Workflow Definition:** [`.github/workflows/api-tests.yml`](file:///c:/Users/nttis/Downloads/SUT_HW06/.github/workflows/api-tests.yml)
- **Pipeline Architecture & Notes:** [`docs/CICD-01-pipeline-notes.md`](file:///c:/Users/nttis/Downloads/SUT_HW06/docs/CICD-01-pipeline-notes.md)
- **🟢 Live Passing CI/CD Run:** [`https://github.com/NTT1906/ST_HW06/actions/runs/32343814042`](https://github.com/NTT1906/ST_HW06/actions/runs/32343814042)
- **🔴 Controlled Pipeline Run Evidence:** [`https://github.com/NTT1906/ST_HW06/actions/runs/32343046019`](https://github.com/NTT1906/ST_HW06/actions/runs/32343046019)
- **CI Artifact Download:** [`newman-api-test-reports.zip`](https://github.com/NTT1906/ST_HW06/actions/runs/32343814042)

---

## 7. Master Bug Report & GitHub Issues Links

Full bug report with root cause analysis and remediation code is located in [`docs/BUG-01-bug-report.md`](file:///c:/Users/nttis/Downloads/SUT_HW06/docs/BUG-01-bug-report.md).

| Bug ID | Title | Severity | Security Rule | Live GitHub Issue Link |
|---|---|---|---|---|
| **BUG-01** | Plaintext Password Storage & Credential Leak in `/api/login` | **Critical** | **SEC-01** | [Issue #1](https://github.com/NTT1906/ST_HW06/issues/1) |
| **BUG-02** | Ghost User Record Creation on Empty Payload `{}` | **Medium** | Input Validation | [Issue #2](https://github.com/NTT1906/ST_HW06/issues/2) |
| **BUG-03** | Unhandled 500 HTML Stack Trace & Path Disclosure | **Medium** | Info Disclosure | [Issue #3](https://github.com/NTT1906/ST_HW06/issues/3) |
| **BUG-04** | Duplicate Registration Account Shadowing Lockout | **High** | Data Integrity | [Issue #4](https://github.com/NTT1906/ST_HW06/issues/4) |
| **BUG-05** | Broken Role-Based Access Control (RBAC) on Categories | **Critical** | **SEC-03** | [Issue #5](https://github.com/NTT1906/ST_HW06/issues/5) |
| **BUG-06** | Stored Cross-Site Scripting (XSS) in Catalog Categories | **High** | **SEC-04** | [Issue #8](https://github.com/NTT1906/ST_HW06/issues/8) |
| **BUG-07** | Ghost Category Record Creation on Empty Payload `{}` | **Medium** | Input Validation | [Issue #6](https://github.com/NTT1906/ST_HW06/issues/6) |
| **BUG-08** | Silent Success (HTTP 200) on Non-Existent Entity Modification | **Low** | REST Contract | [Issue #7](https://github.com/NTT1906/ST_HW06/issues/7) |

---

## 8. AI Audit Trail & Collaboration Critique

- **Structured AI Audit Report:** [`AI_AUDIT_LOG.md`](file:///c:/Users/nttis/Downloads/SUT_HW06/AI_AUDIT_LOG.md)
- **Untruncated Raw System Transcript:** [`RAW_AUDIT_LOG.jsonl`](file:///c:/Users/nttis/Downloads/SUT_HW06/RAW_AUDIT_LOG.jsonl) (1.29 MB)
- **Compact System Transcript:** [`RAW_AUDIT_LOG_compact.jsonl`](file:///c:/Users/nttis/Downloads/SUT_HW06/RAW_AUDIT_LOG_compact.jsonl) (639 KB)
- **Human-AI Collaboration Reflection:** [`docs/CRITIQUE-01-collaboration-critique.md`](file:///c:/Users/nttis/Downloads/SUT_HW06/docs/CRITIQUE-01-collaboration-critique.md) (Evaluates **5.7x productivity acceleration** and catalogs AI blind spots).

---

## 9. Agent Skills Artifacts

- **Reusable Antigravity Skill:** [`skills/api-test-toolkit/SKILL.md`](file:///c:/Users/nttis/Downloads/SUT_HW06/skills/api-test-toolkit/SKILL.md)
- **Hand-Drawn Architecture Diagram:** [`agent-skill/diagram.png`](file:///c:/Users/nttis/Downloads/SUT_HW06/agent-skill/diagram.png) / [`agent-skill/diagram.drawio`](file:///c:/Users/nttis/Downloads/SUT_HW06/agent-skill/diagram.drawio)
- **Agent Skill Pseudocode:** [`agent-skill/pseudocode.md`](file:///c:/Users/nttis/Downloads/SUT_HW06/agent-skill/pseudocode.md)

---

## 10. Git Commit History Summary

The complete commit log is exported in [`git-log.txt`](file:///c:/Users/nttis/Downloads/SUT_HW06/git-log.txt). Key milestones:

```text
* 0ce1dc1 ci(github-actions): set SUT backend working-directory to eshop-sut/backend
* c293635 ci(github-actions): use git submodule update --init --recursive --remote
* 9700fa8 ci(github-actions): clean empty directory before cloning SUT repo
* df66c81 ci(github-actions): use npm install and standard node 20 setup
* db057c5 ci(github-actions): checkout submodules recursively for SUT dependencies
* 83d1573 docs(submission): final comprehensive assignment report and submission README (Stages 22-24)
* 945dbbb docs(audit-critique-skill): AI audit logs, collaboration critique, and api-test-toolkit skill (Stages 19-21)
* a590716 ci(github-actions): automated Newman testing pipeline and master bug report (Stages 16-17)
* 4aae9ea feat(test-automation): unified 3-API Postman collection, Newman reports, and master Excel workbook (Stages 13-15, 18)
* 02c467e test(api3-categories): complete test design, audit, extension, and Newman summary for GET /api/categories (Stages 3-15)
* f2b963b test(api2-order-history): complete test design, audit, extension, and Newman summary for GET /api/orders/my-orders (Stages 3-15)
* 05320f7 test(api1-register): complete test design, audit, extension, and Newman summary for POST /api/register (Stages 3-15)
* cfec455 docs(setup): environment verification (ENV-01) and API selection (SELECT-01)
* 19b2fbf git@23127255: Update submodules to latest commits
* b6746f4 init@23127255
```

---

## 11. Reproduction Instructions

### Step 1: Start SUT Backend
```bash
cd eshop-sut/backend
npm install
npm start
```

### Step 2: Run Newman Test Suite
```bash
newman run postman/EShop-HW06.postman_collection.json \
  -e postman/EShop-HW06.postman_environment.json \
  --reporters "cli,htmlextra" \
  --reporter-htmlextra-export newman/newman-report.html
```

---

*Student ID: 23127255*  
*Repository: https://github.com/NTT1906/ST_HW06*
