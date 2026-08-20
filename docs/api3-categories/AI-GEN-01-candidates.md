# AI-GEN-01 — Candidate Test Cases: Product Categories (FR-14)

**Skill:** AI-GEN-01  
**Stage:** 10  
**API:** API 3 — FR-14 Product Categories  
**Endpoints:** `GET /api/categories`, `POST /api/categories`, `PUT /api/categories/:id`, `DELETE /api/categories/:id`  
**Student ID:** 23127255  
**Date/Time:** 2026-08-20T13:47 +07:00  
**Inputs:** `api_specification.md` §3.4, Approved DT-01–03, BVA-01, ST-01, SEC-01, SCHEMA-01 artifacts for API 3  
**Total Candidates Generated:** 38 test cases (Target ≥ 35)  
**Executor:** AI (Antigravity / Gemini Flash)

---

## 1. Candidate Test Suite Overview

Every test case carries the required assignment header:  
`X-Student-Id: 23127255`  
Base URL: `http://localhost:3000`

---

## 2. Candidate Test Cases Table (38 Candidates)

### Category 1: Domain Testing (DT) — 12 Cases

| TC ID | Technique | Preconditions | Request (Method, Path, Headers) | Request Body / Query | Expected Result (HTTP & Body) | Traceability / Partition | Rationale |
|---|---|---|---|---|---|---|---|
| **TC-CAT-01** | DT | Standard categories exist | `GET /api/categories`<br>`X-Student-Id: 23127255` | None | `200 OK`<br>Array of category objects | BR-CAT-01, MTH-V1 | Standard happy path category catalog browsing |
| **TC-CAT-02** | DT | Admin logged in | `POST /api/categories`<br>`Authorization: Bearer <admin_token>`<br>`Content-Type: application/json` | `{"name":"Home & Kitchen"}` | `200 OK`<br>`{"message":"Category created","id":<int>}` | CAT-N-V1, CAT-AUTH-V1 | Standard admin category creation happy path |
| **TC-CAT-03** | DT | Admin logged in | `POST /api/categories`<br>`Authorization: Bearer <admin_token>`<br>`Content-Type: application/json` | `{"name":"Thời trang & Phụ kiện"}` | `200 OK`<br>Unicode Vietnamese name stored | CAT-N-V2, CAT-AUTH-V1 | Accented Vietnamese unicode name support |
| **TC-CAT-04** | DT | Admin logged in | `POST /api/categories`<br>`Authorization: Bearer <admin_token>`<br>`Content-Type: application/json` | `{"name":"Z"}` | `200 OK`<br>Single character category created | CAT-N-V3, CAT-AUTH-V1 | Single-character minimal valid category name |
| **TC-CAT-05** | DT | User logged in (`role: "user"`) | `POST /api/categories`<br>`Authorization: Bearer <user_token>`<br>`Content-Type: application/json` | `{"name":"User Hacker Cat"}` | `403 Forbidden`<br>`{"error": "Forbidden"}` | CAT-AUTH-IV1 (SEC-03) | Enforce Admin role gate on category creation |
| **TC-CAT-06** | DT | None (Unauthenticated) | `POST /api/categories`<br>`Content-Type: application/json` | `{"name":"Anon Cat"}` | `401 Unauthorized`<br>`{"error": "Unauthorized"}` | CAT-AUTH-IV2 | Block unauthenticated category creation |
| **TC-CAT-07** | DT | Admin logged in | `POST /api/categories`<br>`Authorization: Bearer <admin_token>`<br>`Content-Type: application/json` | `{}` | `4xx Bad Request`<br>Missing `name` validation error | CAT-N-IV1 (Missing field) | Verify required `name` field validation |
| **TC-CAT-08** | DT | Admin logged in | `POST /api/categories`<br>`Authorization: Bearer <admin_token>`<br>`Content-Type: application/json` | `{"name":""}` | `4xx Bad Request`<br>Empty name validation error | CAT-N-IV2 (Empty string) | Verify non-empty category name validation |
| **TC-CAT-09** | DT | Category exists (`Điện thoại`) | `POST /api/categories`<br>`Authorization: Bearer <admin_token>`<br>`Content-Type: application/json` | `{"name":"Điện thoại"}` | `4xx / 409 Conflict`<br>Duplicate category name rejection | CAT-N-IV3 (OQ-CAT-01) | Verify category name uniqueness invariant |
| **TC-CAT-10** | DT | Target category exists | `PUT /api/categories/1`<br>`Authorization: Bearer <admin_token>`<br>`Content-Type: application/json` | `{"name":"Điện thoại & Tablet"}` | `200 OK`<br>`{"message":"Category updated"}` | CAT-ID-V1, CAT-AUTH-V1 | Standard admin category update |
| **TC-CAT-11** | DT | Target category exists | `DELETE /api/categories/:id`<br>`Authorization: Bearer <admin_token>` | None | `200 OK`<br>`{"message":"Category deleted"}` | CAT-ID-V1, CAT-AUTH-V1 | Standard admin category deletion |
| **TC-CAT-12** | DT | User logged in | `GET /api/categories`<br>`Content-Type: application/json` | Body: `{"extra":"data"}` | `200 OK`<br>Categories returned; body ignored | V5 (GET with body) | Safely ignore unexpected body on GET |

---

### Category 2: Boundary Value Analysis (BVA) — 8 Cases

| TC ID | Technique | Preconditions | Request (Method, Path, Headers) | Test Condition / Value | Expected Result | Traceability / Boundary | Rationale |
|---|---|---|---|---|---|---|---|
| **TC-CAT-13** | BVA | Admin logged in | `POST /api/categories`<br>`Authorization: Bearer <admin_token>` | `name: ""` (0 chars) | `4xx Bad Request` | BVA-CAT-01 (Name Min - 1) | Lower-bound empty string rejection |
| **TC-CAT-14** | BVA | Admin logged in | `POST /api/categories`<br>`Authorization: Bearer <admin_token>` | `name: "A"` (1 char) | `200 OK` | BVA-CAT-02 (Name Min) | Minimal 1-character name boundary |
| **TC-CAT-15** | BVA | Admin logged in | `POST /api/categories`<br>`Authorization: Bearer <admin_token>` | `name: "C" * 255` | `200 OK` | BVA-CAT-04 (Name Max 255) | 255-character standard DB boundary |
| **TC-CAT-16** | BVA | Admin logged in | `POST /api/categories`<br>`Authorization: Bearer <admin_token>` | `name: "C" * 10000` | `4xx / 413 Payload Too Large` | BVA-CAT-05 (Name Extreme 10K) | Extreme buffer / DoS resilience |
| **TC-CAT-17** | BVA | Admin logged in | `PUT /api/categories/-1`<br>`Authorization: Bearer <admin_token>` | Path ID: `-1` | `404 Not Found` | BVA-CAT-07 (Negative Path ID) | Negative numeric path parameter rejection |
| **TC-CAT-18** | BVA | Admin logged in | `PUT /api/categories/0`<br>`Authorization: Bearer <admin_token>` | Path ID: `0` | `404 Not Found` | BVA-CAT-07 (Zero Path ID) | Zero numeric path parameter rejection |
| **TC-CAT-19** | BVA | Admin logged in | `PUT /api/categories/999999`<br>`Authorization: Bearer <admin_token>` | Path ID: `999999` | `404 Not Found` | BVA-CAT-08 (High Non-Existent ID) | Non-existent positive integer path boundary |
| **TC-CAT-20** | BVA | Categories in DB | `GET /api/categories` | Catalog cardinality ≥ 3 | `200 OK` + `Count >= 3` | BVA-CAT-09 (Collection Nominal) | Verify multi-item catalog collection |

---

### Category 3: State Transition Testing (ST) — 6 Cases

| TC ID | Technique | Preconditions | Action Sequence | State Evaluated | Expected Result | Traceability / State | Rationale |
|---|---|---|---|---|---|---|---|
| **TC-CAT-21** | ST | Admin logged in | 1. `POST /api/categories`<br>2. `GET /api/categories` | `NON_EXISTENT` → `ACTIVE` | Created category appears in GET list | ST-CAT-01 (Entity Initialization) | Verify new category becomes immediately active in catalog |
| **TC-CAT-22** | ST | Category active | 1. `PUT /api/categories/:id`<br>2. `GET /api/categories` | `ACTIVE` → `UPDATED` | Category reflects new name in GET list | ST-CAT-02 (Entity Update) | Verify modified name updates catalog snapshot |
| **TC-CAT-23** | ST | Category updated | 1. `DELETE /api/categories/:id`<br>2. `GET /api/categories` | `UPDATED` → `DELETED` | Category purged from GET list | ST-CAT-03 (Entity Deletion) | Verify deleted category disappears from catalog |
| **TC-CAT-24** | ST | Category deleted | `DELETE /api/categories/:id` (Repeated) | `DELETED` → Re-delete | `404 Not Found` (Cannot delete already deleted entity) | ST-CAT-04 (Terminal Deletion) | Prevent repeated deletion on non-existent record |
| **TC-CAT-25** | ST | Category deleted | `PUT /api/categories/:id` on deleted ID | `DELETED` → Update | `404 Not Found` | ST-CAT-05 (Dead State Mutation) | Prevent updating purged category |
| **TC-CAT-26** | ST | Linked product exists | 1. Create linked product<br>2. Delete category<br>3. Inspect product | Orphan Foreign Key Invariant | Product retains `category_id` without DB crash | ST-CAT-03 (OQ-CAT-02 Orphan Invariant) | Verify orphan foreign key behavior |

---

### Category 4: Security Testing (SEC) — 7 Cases

| TC ID | Technique | Preconditions | Request (Method, Path, Headers) | Security Vector | Expected Result | Traceability / SEC Rule | Rationale |
|---|---|---|---|---|---|---|---|
| **TC-CAT-27** | SEC | User logged in (`role: "user"`) | `POST /api/categories`<br>`Authorization: Bearer <user_token>` | Privilege Escalation (POST) | `403 Forbidden` | **SEC-03** (Admin Role Enforcement) | Prevent customer role creating categories |
| **TC-CAT-28** | SEC | User logged in (`role: "user"`) | `PUT /api/categories/1`<br>`Authorization: Bearer <user_token>` | Privilege Escalation (PUT) | `403 Forbidden` | **SEC-03** (Admin Role Enforcement) | Prevent customer role modifying categories |
| **TC-CAT-29** | SEC | User logged in (`role: "user"`) | `DELETE /api/categories/1`<br>`Authorization: Bearer <user_token>` | Privilege Escalation (DELETE) | `403 Forbidden` | **SEC-03** (Admin Role Enforcement) | Prevent customer role deleting categories |
| **TC-CAT-30** | SEC | Admin logged in | `POST /api/categories`<br>`Authorization: Bearer <admin_token>` | Stored XSS via `<script>` tag | Input sanitized / HTML escaped | **SEC-04** (Stored XSS Prevention) | Prevent script execution in public catalog |
| **TC-CAT-31** | SEC | Admin logged in | `POST /api/categories`<br>`Authorization: Bearer <admin_token>` | Stored XSS via `<img onerror>` | Input sanitized / HTML escaped | **SEC-04** (Stored XSS Prevention) | Prevent event handler XSS injection |
| **TC-CAT-32** | SEC | Admin logged in | `POST /api/categories`<br>`Authorization: Bearer <admin_token>` | SQL Injection in `name` (`' OR 1=1--`) | Parameterized query handling | **SEC-05** (SQL Injection Prevention) | Parameterized query integrity |
| **TC-CAT-33** | SEC | None | `POST /api/categories`<br>`Authorization: Bearer <alg_none_jwt>` | Signature Bypass (`alg: "none"`) | `403 Forbidden` | **SEC-02** (JWT Integrity Enforcement) | Reject forged unsigned tokens |

---

### Category 5: Schema Validation (SCHEMA) — 5 Cases

| TC ID | Technique | Preconditions | Request (Method, Path, Headers) | Expected Result | Traceability / Schema Rule | Rationale |
|---|---|---|---|---|---|---|
| **TC-CAT-34** | SCHEMA | Public catalog | `GET /api/categories`<br>`X-Student-Id: 23127255` | Status `200 OK` + `Content-Type: application/json; charset=utf-8` | SCH-CAT-01, 02 (HTTP & Content-Type) | Validate standard HTTP status and MIME |
| **TC-CAT-35** | SCHEMA | Public catalog | `GET /api/categories`<br>`X-Student-Id: 23127255` | Response is JSON Array matching Draft-07 Category Schema | SCH-CAT-03, 04, 05 (Draft-07 Schema) | Validate array structure, field types (`id`, `name`) |
| **TC-CAT-36** | SCHEMA | Public catalog | `GET /api/categories`<br>`X-Student-Id: 23127255` | Every category item has exactly 2 properties (`id`, `name`) | SCH-CAT-06 (`additionalProperties: false`) | Ensure no leaked internal properties |
| **TC-CAT-37** | SCHEMA | Admin logged in | `POST /api/categories`<br>`Authorization: Bearer <admin_token>` | Status 200, matches `{ "message": "Category created", "id": integer }` | SCH-CAT-07 (POST Response Schema) | Validate category creation response shape |
| **TC-CAT-38** | SCHEMA | None (No Token) | `POST /api/categories`<br>`Content-Type: application/json` | Status 401, matches `{ "error": "Unauthorized" }` | SCH-CAT-10 (401 Error Schema) | Validate structured error schema |

---

## 3. Testing Technique Coverage Matrix

| Testing Technique | Required Coverage Focus | Total Candidates | Covered Test Cases | Coverage Status |
|---|---|---|---|---|
| **Domain Testing (DT)** | Category listing, admin create, unicode, single char, user rejection, unauthenticated, empty/missing/duplicates, update, delete, GET with body | **12** | TC-CAT-01 to TC-CAT-12 | ✅ Complete |
| **Boundary Value Analysis (BVA)** | Name lengths (0, 1, 255, 10000 chars), path ID bounds (-1, 0, 999999), catalog cardinality | **8** | TC-CAT-13 to TC-CAT-20 | ✅ Complete |
| **State Transition (ST)** | Full CRUD lifecycle (`NON_EXISTENT` → `ACTIVE` → `UPDATED` → `DELETED`), re-deletion, dead mutation, orphan foreign key | **6** | TC-CAT-21 to TC-CAT-26 | ✅ Complete |
| **Security Testing (SEC)** | Broken RBAC (SEC-03 on POST/PUT/DELETE), Stored XSS (SEC-04), SQLi (SEC-05), JWT 'none' alg (SEC-02) | **7** | TC-CAT-27 to TC-CAT-33 | ✅ Complete |
| **Schema Validation (SCHEMA)** | JSON Draft-07 catalog schema, item fields, additional properties rejection, POST schema, 401 error schema | **5** | TC-CAT-34 to TC-CAT-38 | ✅ Complete |
| **TOTAL** | **Target: ≥ 35 candidates** | **38** | **TC-CAT-01 to TC-CAT-38** | ✅ **TARGET EXCEEDED** |

---

## 4. AI-GEN-01 Validation Checklist

- [x] ≥ 35 distinct candidate test cases generated for API 3 (Total = 38)
- [x] Every test case assigned a unique TC ID (`TC-CAT-01` to `TC-CAT-38`)
- [x] Full request specifications provided (Method, Path, Headers, Body)
- [x] Expected result and rationale documented for each test case
- [x] Complete technique coverage (DT: 12, BVA: 8, ST: 6, SEC: 7, SCHEMA: 5)
- [x] Traceability mapped to `api_specification.md`, SEC-01–SEC-07, and Stages 5–9 artifacts

---

*Artifact owner: AI (Stage 10 — AI-GEN-01, API 3)*  
*→ **HARD STOP — awaiting human review and approval. Next is Stage 11 (AUDIT-02 — Human Test Case Audit for API 3).***  
*⚠️ Per WORKFLOW.md Responsibility Table, Stage 11 is **OWNED BY HUMAN**. AI must not classify or audit test cases.*
