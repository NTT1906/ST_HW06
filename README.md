# EShop-HW06 — AI-Assisted Backend API Testing Suite

**Course:** Software Testing (ST_HW06)  
**Student ID:** 23127255  
**Submission Date:** 2026-08-20  
**Target System Under Test (SUT):** EShop Backend (`eshop-sut/`)  
**Base URL:** `http://localhost:3000`  

---

## 1. Project Overview

This repository contains the complete deliverables for **HW06 — AI-Assisted Backend API Testing**. Applying a 24-stage human-in-the-loop engineering methodology, we designed, audited, automated, and executed an enterprise-grade backend test suite of **129 test cases** across 3 selected functional pools:

- 🔹 **Pool A (Auth & User):** `POST /api/register` (FR-01 User Registration) — 43 test cases
- 🔹 **Pool B (Cart & Orders):** `GET /api/orders/my-orders` (FR-11 Order History View) — 43 test cases
- 🔹 **Pool C (Catalog & Admin):** `GET /api/categories` (FR-14 Product Categories & Lifecycle) — 43 test cases

The test suite is automated via **Postman Collection v2.1.0**, executed headlessly using **Newman CLI** with **HTML Extra** visual reporting, integrated into **GitHub Actions CI/CD**, and cataloged in a **5-sheet Master Excel Workbook**.

---

## 2. Repository Directory Structure

```
.
├── .github/
│   └── workflows/
│       └── api-tests.yml                       # Stage 17: GitHub Actions CI/CD Automated Workflow
├── docs/
│   ├── ENV-01-environment-verification.md      # Stage 1: Environment & Tooling Verification
│   ├── SELECT-01-api-selection.md              # Stage 2: 3-Pool API Selection Validation
│   ├── BUG-01-bug-report.md                    # Stage 16: Master 8-Defect Report with Root Cause
│   ├── CICD-01-pipeline-notes.md               # Stage 17: CI/CD Architecture & Pipeline Notes
│   ├── EXCEL-01-spreadsheet-notes.md           # Stage 18: Master Excel Catalog Documentation
│   ├── CRITIQUE-01-collaboration-critique.md   # Stage 20: Human-AI Collaboration Reflection
│   ├── REPORT-01-final-report.md               # Stage 22: Final Comprehensive Assignment Report
│   ├── api1-register/                          # API 1 Pipeline Artifacts (Stages 3–15)
│   ├── api2-order-history/                     # API 2 Pipeline Artifacts (Stages 3–15)
│   └── api3-categories/                        # API 3 Pipeline Artifacts (Stages 3–15)
├── excel/
│   └── EShop-HW06-TestCases.xlsx               # Stage 18: Master 5-Sheet Excel Test Catalog
├── newman/
│   ├── newman-report.html                      # Stage 15: Interactive HTML Extra Visual Report
│   └── newman-console.txt                      # Stage 15: Newman CLI Raw Console Execution Log
├── postman/
│   ├── EShop-HW06.postman_collection.json      # Stage 13: Unified 129-item Postman Collection
│   ├── EShop-HW06.postman_environment.json     # Stage 13: Postman Environment Configuration
│   └── features-used.md                        # Stage 14: 14 Advanced Postman Features Used
├── skills/
│   └── api-test-toolkit/
│       └── SKILL.md                            # Stage 21: Reusable Antigravity Testing Skill
├── eshop-sut/                                  # SUT Backend Source (Unmodified)
├── AI_AUDIT_LOG.md                             # Stage 19: Structured Stage-by-Stage AI Audit Trail
├── RAW_AUDIT_LOG.jsonl                         # Stage 19: Untruncated Full Raw System Transcript
├── RAW_AUDIT_LOG_compact.jsonl                 # Stage 19: Compact Raw System Transcript
└── README.md                                   # Stage 23: Root Submission README
```

---

## 3. Quick Start & Reproduction Guide

### Prerequisites
- **Node.js:** v18+ (tested on Node v22.17.0)
- **npm:** v10+ (tested on npm 11.6.4)
- **Newman & Reporter:** `npm install -g newman newman-reporter-htmlextra`

### Step 1: Start the SUT Backend Server
Open a terminal, navigate to `eshop-sut/`, install dependencies, and start the server:

```bash
cd eshop-sut
npm install
npm start
```
The server will start at `http://localhost:3000` (SQLite database initialized automatically).

### Step 2: Run the Complete Newman Test Suite
In a separate terminal at the repository root, execute:

```bash
newman run postman/EShop-HW06.postman_collection.json \
  -e postman/EShop-HW06.postman_environment.json \
  --reporters "cli,htmlextra" \
  --reporter-htmlextra-export newman/newman-report.html | tee newman/newman-console.txt
```

### Step 3: View Interactive Visual Reports
Open `newman/newman-report.html` in any web browser to inspect detailed request/response payloads, timing graphs, assertion results, and defect logs.

---

## 4. Key Execution Results & Summary Telemetry

| Metric | API 1 (`/register`) | API 2 (`/my-orders`) | API 3 (`/categories`) | **Full 3-API Master Suite** |
|---|---|---|---|---|
| **Audited AI Candidates** | 38 | 38 | 38 | **114** |
| **Human Extension Invariants** | 5 | 5 | 5 | **15** |
| **Total Test Suite Items** | **43** | **43** | **43** | **129 Test Cases** |
| **Total HTTP Requests Executed** | 50 | 56 | 53 | **159** |
| **Total Assertions Executed** | 49 | 53 | 55 | **157** |
| **Passed Assertions** | 46 (93.9%) | 53 (100%) | 55 (100%) | **154 (98.1%)** |
| **Failed Assertions (SUT Bugs)** | 3 | 0 | 0 | **3 Confirmed SUT Bugs** |
| **Mandatory Student ID Header** | 100% Verified | 100% Verified | 100% Verified | **100% (`23127255`)** |
| **Average Response Time** | 11 ms | 11 ms | 12 ms | **12 ms** |

---

## 5. Summary of Discovered SUT Defects

Our test execution uncovered **8 confirmed defects** in the SUT, documented in [`docs/BUG-01-bug-report.md`](file:///c:/Users/nttis\Downloads\SUT_HW06\docs\BUG-01-bug-report.md):

1. 🚨 **BUG-01 (Critical — SEC-01):** Plaintext password storage and credential leak in `POST /api/login`.
2. ⚠️ **BUG-02 (Medium — Validation):** Ghost user record created with `null` fields on `POST /api/register` with `{}`.
3. ⚠️ **BUG-03 (Medium — Info Disclosure):** Non-JSON request bodies crash server returning HTTP 500 HTML leaking `/mnt/c/...` paths.
4. 🚨 **BUG-04 (High — Data Integrity):** Duplicate email registration allowed, causing permanent account shadowing lockout.
5. 🚨 **BUG-05 (Critical — SEC-03):** Broken Role-Based Access Control allowing customer role (`role: "user"`) to create, edit, and delete catalog categories.
6. 🚨 **BUG-06 (High — SEC-04):** Stored Cross-Site Scripting (XSS) in category names reflected unescaped in public `GET /api/categories`.
7. ⚠️ **BUG-07 (Medium — Validation):** Ghost category record created with `name: null` on `POST /api/categories` with `{}`.
8. ℹ️ **BUG-08 (Low — REST Contract):** Silent success (`HTTP 200`) returned when updating or deleting non-existent category IDs.

---

## 6. AI Interaction & Compliance Audit Trail

In compliance with the AI assignment audit policy:
- **Structured Audit Report:** [`AI_AUDIT_LOG.md`](file:///c:/Users/nttis\Downloads\SUT_HW06\AI_AUDIT_LOG.md) documents every stage, prompt, AI tool, human oversight decision, and rejected proposal.
- **Untruncated Raw System Log:** [`RAW_AUDIT_LOG.jsonl`](file:///c:/Users/nttis\Downloads\SUT_HW06\RAW_AUDIT_LOG.jsonl) (1.22 MB) contains the unmodified, bit-for-bit runtime transcript exported directly from Antigravity agent logs.
- **Human-AI Collaboration Reflection:** [`docs/CRITIQUE-01-collaboration-critique.md`](file:///c:/Users/nttis\Downloads\SUT_HW06\docs\CRITIQUE-01-collaboration-critique.md) provides an in-depth critique of productivity gains (5.7x velocity), AI failure modes, and human value-add.

---

## 7. Submission Checklist Verification

- [x] Environment and tooling verified (`docs/ENV-01-environment-verification.md`)
- [x] 3 distinct APIs selected across Pool A, B, and C without overlap (`docs/SELECT-01-api-selection.md`)
- [x] 5 formal test design techniques + human extension applied per API (DT, BVA, ST, SEC, SCHEMA, EXTEND)
- [x] ≥ 35 candidate test cases generated per API (Total = 114 candidates)
- [x] Human audit gate completed classifying 100% of candidates (93 Valid, 21 Corrected/Invalid/Incomplete)
- [x] ≥ 5 human extension invariant test cases authored per API (Total = 15 human extensions)
- [x] Master Postman collection created with 129 test items (`postman/EShop-HW06.postman_collection.json`)
- [x] Mandatory `X-Student-Id: 23127255` header injected into 100% of requests
- [x] ≥ 10 advanced Postman features used and tracked (`postman/features-used.md` — 14 features)
- [x] Headless Newman execution verified with HTML Extra report (`newman/newman-report.html`)
- [x] Master 5-sheet Excel spreadsheet generated (`excel/EShop-HW06-TestCases.xlsx`)
- [x] Automated GitHub Actions CI/CD workflow implemented (`.github/workflows/api-tests.yml`)
- [x] Master bug report table compiled (`docs/BUG-01-bug-report.md` — 8 defects)
- [x] Raw conversation logs exported (`RAW_AUDIT_LOG.jsonl`) and structured audit report authored (`AI_AUDIT_LOG.md`)
- [x] Custom Antigravity testing skill created (`skills/api-test-toolkit/SKILL.md`)
- [x] Comprehensive final assignment report compiled (`docs/REPORT-01-final-report.md`)
- [x] Source code of SUT, `WORKFLOW.md`, and `SKILLS.md` left completely unmodified

---

*Author: Student 23127255*  
*Verified: 2026-08-20*
