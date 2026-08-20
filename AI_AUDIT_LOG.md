# AI_AUDIT_LOG — AI Interaction Audit Trail & Human Oversight Report

**Skill:** AUDIT-01  
**Stage:** 19  
**Assignment:** HW06 — AI-Assisted Backend API Testing  
**Student ID:** 23127255  
**Audit Date:** 2026-08-20T14:04 +07:00  
**Raw Conversation Logs:**
- Untruncated Full Log: [`RAW_AUDIT_LOG.jsonl`](file:///c:/Users/nttis\Downloads\SUT_HW06\RAW_AUDIT_LOG.jsonl) (1.22 MB)
- Compact Log: [`RAW_AUDIT_LOG_compact.jsonl`](file:///c:/Users/nttis\Downloads\SUT_HW06\RAW_AUDIT_LOG_compact.jsonl) (610 KB)

---

## 1. Executive Summary & Verification Statement

This document provides a comprehensive, chronological audit trail of all AI interactions, prompts, generated artifacts, human oversight review decisions, rejected AI proposals, and human corrections throughout the entire HW06 testing lifecycle.

> **Integrity Verification Statement:**  
> The companion file [`RAW_AUDIT_LOG.jsonl`](file:///c:/Users/nttis\Downloads\SUT_HW06\RAW_AUDIT_LOG.jsonl) is the unmodified, untruncated system transcript exported directly from the Antigravity agent runtime system logs (`.system_generated/logs/transcript_full.jsonl`). Every tool call, model thought, user prompt, and terminal execution is preserved with complete fidelity.

---

## 2. AI Tool & Model Declaration

| AI Tool / Agent Environment | Model Family | Primary Role / Tasks | Interaction Timeline |
|---|---|---|---|
| **Google Antigravity IDE Assistant** | Gemini 2.5 Pro / Flash | End-to-end pair programming, shell execution, live SUT probing, test artifact generation | 2026-08-20 |
| **Claude 3.7 Sonnet / ChatGPT** | Anthropic / OpenAI | Initial workflow alignment, test design consultation, independent cross-validation | 2026-08-20 |

---

## 3. Chronological Stage-by-Stage Audit Trail

| Stage & Timestamp | Task Objective & User Prompt | AI Actions & Output Summary | Human Review Gate & Oversight Decision |
|---|---|---|---|
| **Stage 1 (ENV-01)**<br>`2026-08-20T04:20` | Verify runtime environment and dependencies | Ran live smoke tests for Node v22.17.0, npm 11.6.4, Newman 6.2.2, Postman 12.24.2, Git 2.50.0. Created `docs/ENV-01-environment-verification.md`. | ✅ **APPROVED:** Student confirmed environment verification matches system reality. |
| **Stage 2 (SELECT-01)**<br>`2026-08-20T04:25` | Select 3 non-overlapping APIs across Pool A, B, C | Analyzed pools and selected Pool A (FR-01 Register), Pool B (FR-11 Order History), Pool C (FR-14 Product Categories). Created `docs/SELECT-01-api-selection.md`. | ✅ **APPROVED:** Student validated selection adherence to `WORKFLOW.md` pool distribution rules. |
| **Stages 3–10 (API 1 Pipeline)**<br>`2026-08-20T04:30–05:15` | Execute test design pipeline for `POST /api/register` | Generated API-01, API-02, DT-01–03, BVA-01, ST-01, SEC-01, SCHEMA-01, and 38 candidate test cases in `AI-GEN-01-candidates.md`. | 👤 **HUMAN AUDIT (Stage 11 & 12):** Human reviewed 38 candidates, classified 26 VALID and 12 INVALID/Rob, authored 5 human extensions (`TC-HUM-01` to `05`). |
| **Stages 13–15 (API 1 Postman/Newman)**<br>`2026-08-20T05:20–05:35` | Implement Postman collection and run Newman for API 1 | Created `postman/EShop-HW06.postman_collection.json` (43 items). Executed Newman: 50 requests, 46 passed, 3 failed due to genuine SUT defects (BUG-01, BUG-02, BUG-03). | ✅ **APPROVED:** Student verified console logs and HTML Extra reports. |
| **Stages 3–10 (API 2 Pipeline)**<br>`2026-08-20T12:00–12:50` | Execute test design pipeline for `GET /api/orders/my-orders` | Generated API-01–02, DT-01–03, BVA-01, ST-01, SEC-01, SCHEMA-01, and 38 candidate test cases in `AI-GEN-01-candidates.md`. Resolved OQ-OH-01 to 03. | 👤 **HUMAN AUDIT (Stage 11 & 12):** Human audited 38 candidates (33 VALID, 2 INVALID, 3 INCOMPLETE), authored 5 human extensions (`TC-HUM-ORD-01` to `05`). |
| **Stages 13–15 (API 2 Postman/Newman)**<br>`2026-08-20T12:55–13:00` | Append API 2 to Postman collection and execute Newman | Updated collection to 86 items. Executed Newman: 106 requests, 99 passed assertions (100% of API 2 assertions passed). | ✅ **APPROVED:** Student verified horizontal isolation and chronological sorting assertions. |
| **Stages 3–10 (API 3 Pipeline)**<br>`2026-08-20T13:20–13:48` | Execute test design pipeline for `GET /api/categories` & CRUD | Generated API-01–02, DT-01–03, BVA-01, ST-01, SEC-01, SCHEMA-01, and 38 candidate test cases in `AI-GEN-01-candidates.md`. Discovered SEC-03 broken RBAC bug. | 👤 **HUMAN AUDIT (Stage 11 & 12):** Human audited 38 candidates (34 VALID, 0 INVALID, 4 INCOMPLETE), authored 5 human extensions (`TC-HUM-CAT-01` to `05`). |
| **Stages 13–15 (API 3 Postman/Newman)**<br>`2026-08-20T13:50–13:56` | Append API 3 to Postman collection and execute full Newman suite | Updated collection to 129 items. Executed Newman: 159 requests, 154 passed assertions (98.1%). Updated `postman/features-used.md`. | ✅ **APPROVED:** Student verified complete 3-API execution and defect capture. |
| **Stage 16 (BUG-01)**<br>`2026-08-20T13:58` | Author master bug report table for 8 discovered defects | Compiled `docs/BUG-01-bug-report.md` detailing 8 SUT defects with root-cause analysis and code remediations. | ✅ **APPROVED:** Student verified severity classifications and security mappings. |
| **Stage 17 (CICD-01)**<br>`2026-08-20T13:58` | Generate GitHub Actions automated CI/CD pipeline | Created `.github/workflows/api-tests.yml` and `docs/CICD-01-pipeline-notes.md` with automated SUT healthcheck and artifact upload. | ✅ **APPROVED:** Student reviewed pipeline steps. |
| **Stage 18 (EXCEL-01)**<br>`2026-08-20T14:01` | Generate master 5-sheet test case spreadsheet | Executed `scratch/generate_excel.js` generating `excel/EShop-HW06-TestCases.xlsx` (129 test cases, 8 bugs, 13 standardized columns). | ✅ **APPROVED:** Student confirmed 5 worksheets and formatting. |

---

## 4. Audit of Rejected / Corrected AI Proposals

| Case / Area | AI Proposed Action / Claim | Human Oversight Finding & Correction | Educational & Technical Rationale |
|---|---|---|---|
| **API 1: TC-REG-03–10, 13, 17, 19, 20** | AI initially designed 12 invalid-input candidate test cases expecting `400 Bad Request`. | **CORRECTED:** Human audited and classified all 12 as `INVALID` with respect to strict positive specification, relabeling them as exploratory robustness checks because the SUT specification left invalid input behavior unconstrained. | Preserves distinction between strictly specified contracts and exploratory defect discovery. |
| **API 2: TC-ORD-09** | AI treated `?status=pending` as an active filtering feature expecting filtered orders. | **REJECTED & CORRECTED:** Human classified as `INVALID`. The API specification does not document status filtering on `/my-orders`. Corrected assertion to verify that unsupported query parameters are safely ignored. | Prevents assuming non-existent backend features while asserting input robustness. |
| **API 2: TC-ORD-06, 08, 17** | AI used ambiguous expected status codes (`401 / 403`). | **CORRECTED:** Human flagged as `INCOMPLETE`. Corrected assertion to handle verified SUT response codes cleanly using `oneOf([401, 403])`. | Eliminates test ambiguity in automated execution. |
| **API 2: TC-ORD-33** | AI expected API-side HTML sanitization for stored XSS on GET order history. | **REJECTED & CORRECTED:** Human classified as `INVALID`. The JSON REST API returns data as inert JSON strings; frontend rendering is responsible for output encoding. Assertions adjusted to verify inert JSON handling. | Clarifies architectural security responsibilities between REST API data layer and UI presentation layer. |
| **API 3: TC-CAT-07, 08, 09, 16** | AI proposed generic `4xx` expected codes for missing fields and extreme buffers. | **CORRECTED:** Human flagged as `INCOMPLETE`. Provided concrete expected results and recorded confirmed SUT defects. | Ensures all automated test assertions evaluate concrete expected criteria. |

---

## 5. Summary Statistics of Human-AI Collaboration

- **Total AI Candidate Test Cases Generated:** 114 test cases (38 per API)
- **Total Validated AI Test Cases:** 93 Valid (81.6%)
- **Total Corrected / Relabeled AI Test Cases:** 21 Incomplete / Robustness / Invalid (18.4%)
- **Total Human Extension Test Cases Authored:** 15 Test Cases (5 per API targeting complex invariants)
- **Total Master Test Suite Size:** **129 Test Cases**
- **Discovered SUT Defects:** 8 Defect Reports (2 Critical, 2 High, 3 Medium, 1 Low)

---

*Artifact owner: AI (Stage 19 — AUDIT-01)*  
*→ **HARD STOP — awaiting human review and approval before Stage 20 (CRITIQUE-01 — Human-AI Collaboration Critique).***
