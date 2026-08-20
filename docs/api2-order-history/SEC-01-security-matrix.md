# SEC-01 — Security Test Design: GET /api/orders/my-orders

**Skill:** SEC-01  
**Stage:** 8  
**API:** API 2 — FR-11 Order History View (User)  
**Endpoint:** `GET /api/orders/my-orders`  
**Student ID:** 23127255  
**Date/Time:** 2026-08-20T12:51 +07:00  
**Inputs:** `eshop-sut/README.md` (SEC-01–SEC-07), `api_specification.md` §4, Live SUT evidence  
**Executor:** AI (Antigravity / Gemini Flash)

---

## 1. SEC-01–SEC-07 Applicability Matrix

| Requirement | Title / Focus | Applicable to `GET /api/orders/my-orders`? | Rationale |
|---|---|---|---|
| **SEC-01** | Plaintext Password Prohibition | **YES (Indirect)** | Order history payload must never leak customer passwords or authentication secrets in order items or nested user objects. |
| **SEC-02** | Secure APIs must require valid JWT | **YES (Direct)** | `GET /api/orders/my-orders` is a protected customer endpoint. Unauthenticated or invalid token requests must be rejected. |
| **SEC-03** | Admin Role Verification | **NO** | Customer endpoint; accessible to any authenticated user with `role: "user"` or `role: "admin"`. |
| **SEC-04** | User Input Sanitization (XSS) | **YES (Direct)** | If custom shipping addresses containing script tags are reflected in order history, they must not execute on clients. |
| **SEC-05** | SQL Injection via Parameterized Queries | **YES (Direct)** | The backend must execute parameterized SQL queries when filtering by `user_id` or query parameters. |
| **SEC-06** | Access Control / IDOR / Horizontal Isolation | **YES (Direct & Critical)** | User A must never be able to access User B's order records. Horizontal resource isolation must be strictly enforced via token context. |
| **SEC-07** | Password Reset OTP Security | **NO** | Specific to FR-03 password reset workflow. |

---

## 2. Security Test Matrix

| Test ID | Mapped Requirement | Security Attack Vector | Test Condition / Payload | Expected Result | Actual Live SUT Result | Security Finding / Verdict |
|---|---|---|---|---|---|---|
| **SEC-OH-01** | **SEC-02** | Unauthenticated Request | Request without `Authorization` header | `401 Unauthorized`<br>`{"error": "Unauthorized"}` | `HTTP 401 Unauthorized` | ✅ PASS (Authentication strictly enforced) |
| **SEC-OH-02** | **SEC-02** | Forged JWT with `"none"` Algorithm | `Authorization: Bearer <header.payload.>` (`alg: "none"`) | `403 Forbidden` | `HTTP 403 Forbidden` | ✅ PASS (Alg 'none' signature bypass rejected) |
| **SEC-OH-03** | **SEC-02** | Tampered JWT Signature | Valid token with modified signature characters | `403 Forbidden` | `HTTP 403 Forbidden` | ✅ PASS (Signature tampering detected) |
| **SEC-OH-04** | **SEC-02** | Empty / Malformed Bearer Token | `Authorization: Bearer ` | `401 / 403` | `HTTP 403 Forbidden` | ✅ PASS |
| **SEC-OH-05** | **SEC-06** | Horizontal Privilege Escalation (IDOR) | User A requests `/my-orders` while User B has private orders | User A receives ONLY orders with `user_id == A.id` | User A receives only their 4 orders; User B's order is not exposed | ✅ PASS (Strict horizontal resource isolation) |
| **SEC-OH-06** | **SEC-06** | IDOR via Query Parameter Pollution | `GET /api/orders/my-orders?user_id=1&id=1` | Ignores `user_id` query parameter; filters by token only | Filters strictly by token ID; ignores query override | ✅ PASS (Query override ignored) |
| **SEC-OH-07** | **SEC-05** | SQL Injection via Status Filter | `GET /api/orders/my-orders?status=' OR '1'='1` | Parameterized query handling; no SQL syntax leak | Returns user's orders safely without SQL error or data dump | ✅ PASS (Safe parameterized handling) |
| **SEC-OH-08** | **SEC-01** | Credential Leakage in Order Objects | Inspect returned JSON order objects | No `password`, `hash`, or authentication secret exposed | Only order attributes returned (`id`, `total_amount`, `status`, etc.) | ✅ PASS (No sensitive credentials exposed) |
| **SEC-OH-09** | **SEC-04** | Stored XSS in Order Shipping Address | Order placed with `shipping_address: "<script>alert(1)</script>"` | Content returned as JSON string; clients parse as data | Returned as standard JSON string literal | ℹ️ JSON API safe (Frontend display must avoid innerHTML) |

---

## 3. Security Findings & Controls Summary

1. **Robust Authentication Gate (SEC-02):**
   - The SUT rejects missing tokens with `401 Unauthorized` and forged/tampered tokens with `403 Forbidden`.
   - Algorithm `none` bypass attempts are rejected.
2. **Strict Horizontal Resource Isolation (SEC-06 / IDOR Prevention):**
   - Live testing confirmed that User A cannot see User B's orders under any circumstance. The endpoint derives `user_id` solely from the cryptographically verified JWT payload and ignores external query manipulation (`?user_id=...`).
3. **No Credential Exposure (SEC-01):**
   - Unlike the user registration/login endpoint which exposed plaintext passwords, order records contain strictly transactional data.

---

## 4. SEC-01 Validation Checklist

- [x] Applicable security requirements (SEC-01, SEC-02, SEC-04, SEC-05, SEC-06) identified
- [x] IDOR / Horizontal Privilege Escalation tested across multiple live user accounts
- [x] JWT signature tampering and `"none"` algorithm bypass evaluated
- [x] SQL injection query parameter testing conducted
- [x] Security findings verified against running SUT

---

*Artifact owner: AI (Stage 8 — SEC-01, API 2)*  
*→ **HARD STOP — awaiting human review and approval before Stage 9 (SCHEMA-01 — Schema Validation Design for API 2).***
