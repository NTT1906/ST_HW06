# AI-GEN-01 — Candidate Test Cases: GET /api/orders/my-orders

**Skill:** AI-GEN-01  
**Stage:** 10  
**API:** API 2 — FR-11 Order History View (User)  
**Endpoint:** `GET /api/orders/my-orders`  
**Student ID:** 23127255  
**Date/Time:** 2026-08-20T12:52 +07:00  
**Inputs:** `api_specification.md` §4.4, Approved DT-01–03, BVA-01, ST-01, SEC-01, SCHEMA-01 artifacts for API 2  
**Total Candidates Generated:** 38 test cases (Target ≥ 35)  
**Executor:** AI (Antigravity / Gemini Flash)

---

## 1. Candidate Test Suite Overview

Every test case carries the required header:  
`X-Student-Id: 23127255`  
Base URL: `http://localhost:3000`

---

## 2. Candidate Test Cases Table (38 Candidates)

### Category 1: Domain Testing (DT) — 12 Cases

| TC ID | Technique | Preconditions | Request (Method, Path, Headers) | Query / Body | Expected Result (HTTP & Body) | Traceability / Partition | Rationale |
|---|---|---|---|---|---|---|---|
| **TC-ORD-01** | DT | User has 2+ orders | `GET /api/orders/my-orders`<br>`Authorization: Bearer <valid_token>`<br>`X-Student-Id: 23127255` | None | `200 OK`<br>Array containing orders matching user's ID | AUTH-V1, ORD-V1, MTH-V1 | Standard happy path for customer with order history |
| **TC-ORD-02** | DT | Fresh user (0 orders) | `GET /api/orders/my-orders`<br>`Authorization: Bearer <fresh_token>`<br>`X-Student-Id: 23127255` | None | `200 OK`<br>`[]` (Empty JSON array) | AUTH-V3, ORD-V3, MTH-V1 | Clean empty collection return when user has no orders |
| **TC-ORD-03** | DT | Admin account logged in | `GET /api/orders/my-orders`<br>`Authorization: Bearer <admin_token>`<br>`X-Student-Id: 23127255` | None | `200 OK`<br>`[]` (Admin personal orders only) | AUTH-V2, MTH-V1 | Verify admin personal history does not leak system orders |
| **TC-ORD-04** | DT | None (Unauthenticated) | `GET /api/orders/my-orders`<br>`X-Student-Id: 23127255` | None | `401 Unauthorized`<br>`{"error": "Unauthorized"}` | AUTH-IV1, MTH-V1 | Verify authentication requirement |
| **TC-ORD-05** | DT | None | `GET /api/orders/my-orders`<br>`Authorization: Bearer invalid.token.signature`<br>`X-Student-Id: 23127255` | None | `403 Forbidden`<br>`{"error": "Forbidden"}` | AUTH-IV2, MTH-V1 | Verify rejection of tampered/forged JWT |
| **TC-ORD-06** | DT | None | `GET /api/orders/my-orders`<br>`Authorization: Bearer `<br>`X-Student-Id: 23127255` | None | `401 / 403`<br>Error JSON | AUTH-IV3, MTH-V1 | Verify rejection of empty Bearer token value |
| **TC-ORD-07** | DT | None | `GET /api/orders/my-orders`<br>`Authorization: Basic dXNlcjpwYXNz`<br>`X-Student-Id: 23127255` | None | `401 Unauthorized`<br>`{"error": "Unauthorized"}` | AUTH-IV4, MTH-V1 | Reject non-Bearer authentication schemes |
| **TC-ORD-08** | DT | None | `GET /api/orders/my-orders`<br>`Authorization: RandomGarbageToken123`<br>`X-Student-Id: 23127255` | None | `401 / 403`<br>Error JSON | AUTH-IV5, MTH-V1 | Reject non-standard authorization format |
| **TC-ORD-09** | DT | User has orders | `GET /api/orders/my-orders?status=pending`<br>`Authorization: Bearer <valid_token>`<br>`X-Student-Id: 23127255` | `?status=pending` | `200 OK`<br>Returns user's orders | ORD-V4, MTH-V1 | Query parameter filtering robustness |
| **TC-ORD-10** | DT | User has orders | `GET /api/orders/my-orders?status=' OR '1'='1`<br>`Authorization: Bearer <valid_token>`<br>`X-Student-Id: 23127255` | `?status=' OR '1'='1` | `200 OK`<br>Returns only user's orders | ORD-IV1, MTH-V1 | SQL injection resilience in query parameters |
| **TC-ORD-11** | DT | User has orders | `GET /api/orders/my-orders`<br>`Authorization: Bearer <valid_token>`<br>`X-Student-Id: 23127255` | Body: `{"extra":"data"}` | `200 OK`<br>Orders returned; body ignored | V5 (GET with Body), MTH-V1 | Verify unexpected payload on GET is safely ignored |
| **TC-ORD-12** | DT | User has orders | `POST /api/orders/my-orders`<br>`Authorization: Bearer <valid_token>`<br>`X-Student-Id: 23127255` | None | `404 Not Found` | MTH-IV1 (Wrong Method) | Verify routing restriction on non-GET methods |

---

### Category 2: Boundary Value Analysis (BVA) — 8 Cases

| TC ID | Technique | Preconditions | Request (Method, Path, Headers) | Test Condition / Value | Expected Result (HTTP & Body) | Traceability / Boundary | Rationale |
|---|---|---|---|---|---|---|---|
| **TC-ORD-13** | BVA | User with 0 orders | `GET /api/orders/my-orders`<br>`Authorization: Bearer <fresh_token>` | 0 orders in dataset | `200 OK`<br>`Count: 0` (`[]`) | BVA-OH-01 (Order Count Min: 0) | Lower-bound collection response |
| **TC-ORD-14** | BVA | User with exactly 1 order | `GET /api/orders/my-orders`<br>`Authorization: Bearer <token_1order>` | 1 order in dataset | `200 OK`<br>`Count: 1` | BVA-OH-02 (Order Count Min + 1) | Single item array boundary |
| **TC-ORD-15** | BVA | User with 2–5 orders | `GET /api/orders/my-orders`<br>`Authorization: Bearer <token_user>` | 2–5 orders in dataset | `200 OK`<br>`Count >= 2` | BVA-OH-03 (Order Count Nominal) | Standard multiple order history list |
| **TC-ORD-16** | BVA | User with 10+ orders | `GET /api/orders/my-orders`<br>`Authorization: Bearer <token_10orders>` | 10+ orders in dataset | `200 OK`<br>All 10+ orders returned | BVA-OH-04 (High Volume / Pagination Threshold) | High-volume dataset boundary |
| **TC-ORD-17** | BVA | None | `GET /api/orders/my-orders`<br>`Authorization: Bearer ` | 0 chars token value | `403 Forbidden` | BVA-OH-05 (Header Min - 1) | Empty token boundary check |
| **TC-ORD-18** | BVA | None | `GET /api/orders/my-orders`<br>`Authorization: Bearer a` | 1 char token value | `403 Forbidden` | BVA-OH-06 (Header Min: 1 char) | Single-character token boundary check |
| **TC-ORD-19** | BVA | User logged in | `GET /api/orders/my-orders`<br>`Authorization: Bearer <nominal_jwt>` | Nominal ~180 char JWT | `200 OK` | BVA-OH-07 (Header Nominal) | Standard JWT header length |
| **TC-ORD-20** | BVA | None | `GET /api/orders/my-orders`<br>`Authorization: Bearer <4096 'x's>` | 4096 char header string | `403 Forbidden` / `431` | BVA-OH-08 (Extreme Header Buffer) | Header buffer overflow & DoS resilience |

---

### Category 3: State Transition Testing (ST) — 6 Cases

| TC ID | Technique | Preconditions | Request / Action Flow | State Evaluated | Expected Result | Traceability / State | Rationale |
|---|---|---|---|---|---|---|---|
| **TC-ORD-21** | ST | Fresh checkout completed | 1. `POST /api/checkout`<br>2. `GET /api/orders/my-orders` | `pending` state initialization | Latest order appears in history with `status: "pending"` | ST-OH-01 (Order Initialization) | Verify new checkout appears immediately in history as pending |
| **TC-ORD-22** | ST | Pending order exists | 1. Admin updates status to `confirmed`<br>2. Customer queries `/my-orders` | `confirmed` state progression | Target order reflects `status: "confirmed"` | ST-OH-02 (`pending` → `confirmed`) | Verify admin confirmation updates customer history |
| **TC-ORD-23** | ST | Confirmed order exists | 1. Admin updates status to `shipping`<br>2. Customer queries `/my-orders` | `shipping` state progression | Target order reflects `status: "shipping"` | ST-OH-03 (`confirmed` → `shipping`) | Verify shipping dispatch updates customer history |
| **TC-ORD-24** | ST | Shipping order exists | 1. Admin updates status to `delivered`<br>2. Customer queries `/my-orders` | `delivered` terminal state | Target order reflects `status: "delivered"` | ST-OH-04 (`shipping` → `delivered`) | Verify delivery completion updates customer history |
| **TC-ORD-25** | ST | Pending order exists | 1. Customer cancels order (`PUT /cancel`)<br>2. Customer queries `/my-orders` | `canceled` terminal state | Target order reflects `status: "canceled"` | ST-OH-05 (`pending` → `canceled`) | Verify customer cancellation updates customer history |
| **TC-ORD-26** | ST | Canceled/Delivered order | Query `/my-orders` repeatedly | Terminal state immutability | Terminal statuses remain constant over time | ST-OH-06/07 (Terminal State Stability) | Ensure terminal orders do not regress or alter |

---

### Category 4: Security Testing (SEC) — 7 Cases

| TC ID | Technique | Preconditions | Request (Method, Path, Headers) | Security Attack Vector | Expected Result | Traceability / SEC Rule | Rationale |
|---|---|---|---|---|---|---|---|
| **TC-ORD-27** | SEC | None (No Token) | `GET /api/orders/my-orders` | Unauthenticated access | `401 Unauthorized`<br>`{"error": "Unauthorized"}` | **SEC-02** (JWT Authentication Gate) | Protect private customer purchase history |
| **TC-ORD-28** | SEC | None | `GET /api/orders/my-orders`<br>`Authorization: Bearer <header.payload.>` (`alg: "none"`) | Forged JWT with `"none"` algorithm | `403 Forbidden` | **SEC-02** (Algorithm 'none' Signature Bypass) | Prevent forged token bypass vulnerabilities |
| **TC-ORD-29** | SEC | User A logged in; User B has private orders | `GET /api/orders/my-orders`<br>`Authorization: Bearer <tokA>` | Horizontal IDOR / Cross-User Leak | Response contains ONLY User A's orders (`user_id == A.id`) | **SEC-06** (Horizontal Resource Isolation) | Strict privacy & horizontal isolation across customers |
| **TC-ORD-30** | SEC | User A logged in | `GET /api/orders/my-orders?user_id=1&id=1`<br>`Authorization: Bearer <tokA>` | Query Parameter Pollution IDOR Override | Ignores `user_id` query param; filters strictly by token ID | **SEC-06** (Query Override IDOR Protection) | Prevent overriding token identity via URL query string |
| **TC-ORD-31** | SEC | User logged in | `GET /api/orders/my-orders?status=' OR 1=1--`<br>`Authorization: Bearer <valid_token>` | SQL Injection via status parameter | Parameterized query execution; no SQL leak | **SEC-05** (SQL Injection Prevention) | Parameterized SQL query integrity check |
| **TC-ORD-32** | SEC | User has orders | `GET /api/orders/my-orders`<br>`Authorization: Bearer <valid_token>` | Sensitive Credential Exposure Check | Order objects must NOT contain `password`, `hash`, or token data | **SEC-01** (Credential Exposure Prohibition) | Ensure customer credentials are not leaked in order data |
| **TC-ORD-33** | SEC | Order created with script address | `GET /api/orders/my-orders`<br>`Authorization: Bearer <valid_token>` | Stored XSS in `shipping_address` | Address returned as clean JSON string literal | **SEC-04** (Stored XSS Sanitization) | Prevent client execution of injected shipping addresses |

---

### Category 5: Schema Validation (SCHEMA) — 5 Cases

| TC ID | Technique | Preconditions | Request (Method, Path, Headers) | Expected Result | Traceability / Schema Rule | Rationale |
|---|---|---|---|---|---|---|
| **TC-ORD-34** | SCHEMA | User with orders | `GET /api/orders/my-orders`<br>`Authorization: Bearer <valid_token>` | Status `200 OK` + `Content-Type: application/json; charset=utf-8` | SCH-OH-01, 02 (HTTP & Content-Type) | Validate standard HTTP status and MIME type |
| **TC-ORD-35** | SCHEMA | User with orders | `GET /api/orders/my-orders`<br>`Authorization: Bearer <valid_token>` | Response root is JSON Array `[...]` matching Draft-07 Order Schema | SCH-OH-03, 05–09 (Draft-07 JSON Schema) | Validate array structure, required fields, and types |
| **TC-ORD-36** | SCHEMA | User with 0 orders | `GET /api/orders/my-orders`<br>`Authorization: Bearer <fresh_token>` | Response is exactly `[]` (Empty Array) | SCH-OH-04 (Empty Array Schema) | Validate empty array representation |
| **TC-ORD-37** | SCHEMA | User with orders | `GET /api/orders/my-orders`<br>`Authorization: Bearer <valid_token>` | Every item has exactly 6 keys (`id`, `user_id`, `total_amount`, `status`, `shipping_address`, `created_at`) | SCH-OH-11 (`additionalProperties: false`) | Ensure no unexpected internal properties are leaked |
| **TC-ORD-38** | SCHEMA | None (No Token) | `GET /api/orders/my-orders` | Status `401 Unauthorized` + Body matches `{ "error": "Unauthorized" }` | SCH-OH-12 (401 Error Schema) | Validate structured JSON error schema for unauthenticated calls |

---

## 3. Testing Technique Coverage Matrix

| Testing Technique | Required Coverage Focus | Total Candidates | Covered Test Cases | Coverage Status |
|---|---|---|---|---|
| **Domain Testing (DT)** | Valid user tokens, admin token, missing/bad auth, empty arrays, query params, invalid methods | **12** | TC-ORD-01 to TC-ORD-12 | ✅ Complete |
| **Boundary Value Analysis (BVA)** | Cardinality bounds (0, 1, nominal, high-volume), token length boundaries (empty, 1-char, nominal, 4KB) | **8** | TC-ORD-13 to TC-ORD-20 | ✅ Complete |
| **State Transition (ST)** | Order state machine progression (`pending` → `confirmed` → `shipping` → `delivered`, `canceled`) | **6** | TC-ORD-21 to TC-ORD-26 | ✅ Complete |
| **Security Testing (SEC)** | Auth enforcement (SEC-02), IDOR / Horizontal Isolation (SEC-06), SQLi (SEC-05), Credentials (SEC-01), XSS (SEC-04) | **7** | TC-ORD-27 to TC-ORD-33 | ✅ Complete |
| **Schema Validation (SCHEMA)** | JSON Draft-07 schema compliance, array types, item fields, additional properties, error schemas | **5** | TC-ORD-34 to TC-ORD-38 | ✅ Complete |
| **TOTAL** | **Target: ≥ 35 candidates** | **38** | **TC-ORD-01 to TC-ORD-38** | ✅ **TARGET EXCEEDED** |

---

## 4. AI-GEN-01 Validation Checklist

- [x] ≥ 35 distinct candidate test cases generated for API 2 (Total = 38)
- [x] Every test case assigned a unique TC ID (`TC-ORD-01` to `TC-ORD-38`)
- [x] Full request specifications provided (Method, Path, Headers, Query/Body)
- [x] Expected results and rationale documented for each test case
- [x] Complete technique coverage (DT: 12, BVA: 8, ST: 6, SEC: 7, SCHEMA: 5)
- [x] Traceability mapped to `api_specification.md`, SEC-01–SEC-07, and Stages 5–9 artifacts

---

*Artifact owner: AI (Stage 10 — AI-GEN-01, API 2)*  
*→ **HARD STOP — awaiting human review and approval. Next is Stage 11 (AUDIT-02 — Human Test Case Audit for API 2).***  
*⚠️ Per WORKFLOW.md Responsibility Table, Stage 11 is **OWNED BY HUMAN**. AI must not classify or audit test cases.*
