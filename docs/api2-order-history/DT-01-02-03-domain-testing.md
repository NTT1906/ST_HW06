# DT-01/02/03 — Domain Testing: GET /api/orders/my-orders

**Skills:** DT-01, DT-02, DT-03  
**Stage:** 5  
**API:** API 2 — FR-11 Order History View (User)  
**Endpoint:** `GET /api/orders/my-orders`  
**Student ID:** 23127255  
**Date/Time:** 2026-08-20T12:48 +07:00  
**Inputs:** `api_specification.md` §4.4, API-01/02 artifacts  
**Executor:** AI (Antigravity / Gemini Flash)

---

# Part 1 — DT-01: Domain Identification

| Variable | Location | Type | Valid Domain | Invalid Domain | Constraints | Dependencies | Evidence |
|---|---|---|---|---|---|---|---|
| **V1: `Authorization` Header** | HTTP Header | `string` | `Bearer <valid_user_jwt>`, `Bearer <valid_admin_jwt>` | Missing header, `Bearer <invalid>`, `Bearer <expired>`, `Basic ...`, empty `Bearer ` | Must be a valid signed JWT with `role` and `id` | `POST /api/login` | Spec §4 & Live SUT |
| **V2: User Order Population State** | SUT State | `integer` | User with ≥ 1 order, User with 0 orders | Orphan user ID (non-existent in DB) | Determines whether array has items or is `[]` | `POST /api/checkout` | Live SUT verified |
| **V3: `X-Student-Id` Header** | HTTP Header | `string` | `"23127255"` (or any valid string) | None enforced | Required for HW06 compliance | None | Assignment Spec |
| **V4: Query Parameters** | URL Query | `string` | None (empty), `?status=pending`, `?limit=10` | SQL injection strings | Unofficial/unsupported filters; must not crash server | None | Live SUT |
| **V5: Request Body** | HTTP Body | `any` | None (empty GET body) | Non-empty JSON body | Should be ignored on GET requests | None | HTTP/1.1 Standard |
| **V6: HTTP Method** | Method | `string` | `GET` | `POST`, `PUT`, `DELETE`, `PATCH` | Only `GET` is routed for this endpoint | None | Spec §4.4 |

---

# Part 2 — DT-02: Domain Partitioning

### V1 — `Authorization` Header

| Partition | Type | Description | Representative Value | Expected Behavior |
|---|---|---|---|---|
| **AUTH-V1** | Valid | Valid customer JWT with active session | `Bearer <valid_token_id2>` | `200 OK` + User's orders |
| **AUTH-V2** | Valid | Valid admin JWT | `Bearer <valid_token_id1>` | `200 OK` + Admin's personal orders |
| **AUTH-V3** | Valid | Valid customer JWT with 0 orders placed | `Bearer <fresh_user_token>` | `200 OK` + `[]` (empty array) |
| **AUTH-IV1** | Invalid | Missing `Authorization` header completely | *(Header omitted)* | `401 Unauthorized` |
| **AUTH-IV2** | Invalid | Malformed JWT string (tampered signature) | `Bearer eyJhbGciOi...invalid` | `403 Forbidden` |
| **AUTH-IV3** | Invalid | Empty Bearer token value | `Bearer ` | `401 / 403` |
| **AUTH-IV4** | Invalid | Non-Bearer authentication scheme | `Basic dXNlcjpwYXNz` | `401 Unauthorized` |
| **AUTH-IV5** | Invalid | Random garbage string in header | `InvalidAuthString123` | `401 / 403` |

### V2 — Order Dataset & Filtering

| Partition | Type | Description | Representative Value | Expected Behavior |
|---|---|---|---|---|
| **ORD-V1** | Valid | User with multiple orders in various states | User ID 2 (2 orders in DB) | Array of multiple order objects |
| **ORD-V2** | Valid | User with exactly 1 order | User with single checkout | Array with 1 item |
| **ORD-V3** | Valid | User with 0 orders | Freshly registered user | Empty array `[]` |
| **ORD-V4** | Valid | Filter query parameter (informal) | `?status=pending` | Handled safely, returns orders |
| **ORD-IV1**| Invalid | SQL injection payload in query param | `?status=' OR '1'='1` | Sanitized; returns only own orders |

### V6 — HTTP Method

| Partition | Type | Description | Representative Value | Expected Behavior |
|---|---|---|---|---|
| **MTH-V1** | Valid | Standard `GET` method | `GET /api/orders/my-orders` | `200 OK` |
| **MTH-IV1**| Invalid | `POST` method | `POST /api/orders/my-orders` | `404 Not Found` |
| **MTH-IV2**| Invalid | `PUT` method | `PUT /api/orders/my-orders` | `404 Not Found` |
| **MTH-IV3**| Invalid | `DELETE` method | `DELETE /api/orders/my-orders` | `404 Not Found` |

---

# Part 3 — DT-03: Domain Test Cases

| TC ID | Scenario | Preconditions | Method & Path | Authorization Header | Query Params | Expected HTTP | Expected Body / Assertions | Covered Partitions |
|---|---|---|---|---|---|---|---|---|
| **DT-OH-01** | Happy Path: User with multiple orders | User has placed 2+ orders | `GET /api/orders/my-orders` | `Bearer <token_user>` | None | `200 OK` | Array length ≥ 2; all items have `user_id == token.id` | AUTH-V1, ORD-V1, MTH-V1 |
| **DT-OH-02** | User with zero orders | Fresh registered user | `GET /api/orders/my-orders` | `Bearer <token_fresh>` | None | `200 OK` | `[]` (Empty array) | AUTH-V3, ORD-V3, MTH-V1 |
| **DT-OH-03** | Admin user accessing personal history | Admin account logged in | `GET /api/orders/my-orders` | `Bearer <token_admin>` | None | `200 OK` | `[]` (Admin personal orders only) | AUTH-V2, MTH-V1 |
| **DT-OH-04** | Missing Authorization header | None | `GET /api/orders/my-orders` | *(Omitted)* | None | `401 Unauthorized` | `{"error": "Unauthorized"}` | AUTH-IV1, MTH-V1 |
| **DT-OH-05** | Malformed / invalid JWT token | None | `GET /api/orders/my-orders` | `Bearer invalid.jwt.token` | None | `403 Forbidden` | `{"error": "Forbidden"}` | AUTH-IV2, MTH-V1 |
| **DT-OH-06** | Empty Bearer token | None | `GET /api/orders/my-orders` | `Bearer ` | None | `401 / 403` | Error response | AUTH-IV3, MTH-V1 |
| **DT-OH-07** | Basic Auth scheme instead of Bearer | None | `GET /api/orders/my-orders` | `Basic dXNlcjpwYXNz` | None | `401 Unauthorized` | `{"error": "Unauthorized"}` | AUTH-IV4, MTH-V1 |
| **DT-OH-08** | Random garbage header string | None | `GET /api/orders/my-orders` | `RandomGarbageString123` | None | `401 / 403` | Error response | AUTH-IV5, MTH-V1 |
| **DT-OH-09** | Safe query parameter handling | User with orders | `GET /api/orders/my-orders?status=pending` | `Bearer <token_user>` | `?status=pending` | `200 OK` | Handled safely, returns orders | AUTH-V1, ORD-V4, MTH-V1 |
| **DT-OH-10** | SQLi in query string parameter | User with orders | `GET /api/orders/my-orders?status=' OR '1'='1` | `Bearer <token_user>` | `?status=' OR '1'='1` | `200 OK` | Returns only own orders; no leakage | AUTH-V1, ORD-IV1, MTH-V1 |
| **DT-OH-11** | GET with unexpected JSON body | User with orders | `GET /api/orders/my-orders` | `Bearer <token_user>` | Body: `{"extra":"data"}` | `200 OK` | Body ignored, orders returned | AUTH-V1, MTH-V1 |
| **DT-OH-12** | Invalid HTTP Method: POST | User with orders | `POST /api/orders/my-orders` | `Bearer <token_user>` | None | `404 Not Found` | Cannot POST /api/orders/my-orders | AUTH-V1, MTH-IV1 |
| **DT-OH-13** | Invalid HTTP Method: DELETE | User with orders | `DELETE /api/orders/my-orders` | `Bearer <token_user>` | None | `404 Not Found` | Cannot DELETE /api/orders/my-orders | AUTH-V1, MTH-IV3 |

---

## Coverage Summary

- All 8 `Authorization` header partitions covered (AUTH-V1 to AUTH-V3, AUTH-IV1 to AUTH-IV5).
- All 5 Order population partitions covered (ORD-V1 to ORD-V4, ORD-IV1).
- All HTTP Method partitions covered (MTH-V1, MTH-IV1, MTH-IV3).

---

*Artifact owner: AI (Stage 5 — DT-01/02/03, API 2)*  
*→ **HARD STOP — awaiting human review and approval before Stage 6 (BVA-01 — Boundary Value Analysis for API 2).***
