# SEC-01 — Security Test Design: Product Categories (FR-14)

**Skill:** SEC-01  
**Stage:** 8  
**API:** API 3 — FR-14 Product Categories  
**Endpoint:** `GET /api/categories` (and associated Category CRUD)  
**Student ID:** 23127255  
**Date/Time:** 2026-08-20T13:34 +07:00  
**Inputs:** `eshop-sut/README.md` (SEC-01–SEC-07), `api_specification.md` §3.4, Live SUT evidence  
**Executor:** AI (Antigravity / Gemini Flash)

---

## 1. SEC-01–SEC-07 Applicability Matrix

| Requirement | Focus | Applicable to Category APIs? | Rationale |
|---|---|---|---|
| **SEC-01** | Plaintext Passwords | **NO** | No user credentials or password fields in category records. |
| **SEC-02** | JWT Token Required for Secure APIs | **YES (Direct)** | `POST`, `PUT`, `DELETE /api/categories` must require valid JWT authentication. |
| **SEC-03** | Admin Role Verification (`role = 'admin'`) | **YES (Direct & Critical)** | Admin APIs must verify `role = 'admin'` in the token payload, not merely the existence of a token. |
| **SEC-04** | User Input Sanitization / XSS Prevention | **YES (Direct & Critical)** | Category `name` strings are reflected to public storefront visitors in `GET /api/categories` and must prevent stored XSS. |
| **SEC-05** | SQL Parameterized Queries | **YES (Direct)** | Database queries for category insertion, update, and deletion must use parameterized queries. |
| **SEC-06** | Privilege Escalation Prevention | **YES (Direct)** | Non-admin actors must not be able to execute administrative catalog changes. |
| **SEC-07** | Password Reset OTP | **NO** | Specific to FR-03 password reset workflow. |

---

## 2. Security Test Matrix

| Test ID | Mapped Rule | Security Attack Vector | Test Condition / Payload | Expected Result (Spec Intent) | Actual Live SUT Result | Security Finding / Verdict |
|---|---|---|---|---|---|---|
| **SEC-CAT-01** | **SEC-03** | Privilege Escalation via User Role (POST) | `POST /api/categories` with Customer Token (`role: "user"`) | `403 Forbidden`<br>`{"error": "Forbidden"}` | `HTTP 200 OK`<br>`{"message":"Category created","id":5}` | 🚨 **CRITICAL VULNERABILITY (SEC-03 Defect):** Regular users can create system categories |
| **SEC-CAT-02** | **SEC-03** | Privilege Escalation via User Role (PUT) | `PUT /api/categories/1` with Customer Token (`role: "user"`) | `403 Forbidden` | `HTTP 200 OK`<br>`{"message":"Category updated"}` | 🚨 **CRITICAL VULNERABILITY (SEC-03 Defect):** Regular users can modify existing categories |
| **SEC-CAT-03** | **SEC-03** | Privilege Escalation via User Role (DELETE) | `DELETE /api/categories/5` with Customer Token (`role: "user"`) | `403 Forbidden` | `HTTP 200 OK`<br>`{"message":"Category deleted"}` | 🚨 **CRITICAL VULNERABILITY (SEC-03 Defect):** Regular users can delete categories |
| **SEC-CAT-04** | **SEC-04** | Stored XSS via Script Tag | `POST /api/categories` with `name: "<script>alert('XSS')</script>"` | Input sanitized or escaped before persistence | `HTTP 200 OK`<br>Stored verbatim & reflected unescaped in `GET /api/categories` | 🚨 **HIGH VULNERABILITY (SEC-04 Defect):** Stored XSS in public catalog |
| **SEC-CAT-05** | **SEC-04** | Stored XSS via Event Handler | `POST /api/categories` with `name: "<img src=x onerror=alert(1)>"` | Sanitized / stripped | `HTTP 200 OK`<br>HTML payload stored in catalog | 🚨 **HIGH VULNERABILITY (SEC-04 Defect):** Event handler stored XSS |
| **SEC-CAT-06** | **SEC-05** | SQL Injection in Category Name | `POST /api/categories` with `name: "Cat ' OR '1'='1"` | Parameterized query execution | `HTTP 200 OK`<br>Handled safely as string literal | ✅ PASS (Parameterized query used) |
| **SEC-CAT-07** | **SEC-02** | Unauthenticated Mutation Rejection | `POST /api/categories` without `Authorization` header | `401 Unauthorized` | `HTTP 401 Unauthorized` | ✅ PASS (Unauthenticated access blocked) |
| **SEC-CAT-08** | **SEC-02** | Forged JWT Token Rejection (`alg: "none"`) | `POST /api/categories` with `alg: "none"` JWT | `403 Forbidden` | `HTTP 403 Forbidden` | ✅ PASS (Signature check enforced) |

---

## 3. Security Findings & Defect Summary

1. **Critical Defect — SEC-03 Broken Role-Based Access Control:**
   - The SUT checks only whether an `Authorization` header exists and contains a valid JWT signature; it **fails to inspect `decoded.role === 'admin'`**.
   - Any registered customer can create, rename, and delete catalog categories, leading to full catalog defacement.
2. **High Defect — SEC-04 Stored Cross-Site Scripting (XSS):**
   - Category names accept arbitrary HTML tags (`<script>`, `<img>`) without sanitization or HTML encoding.
   - Because `GET /api/categories` is public, any anonymous storefront visitor will receive the malicious script payloads.

---

## 4. SEC-01 Validation Checklist

- [x] SEC-01 through SEC-07 mapped to Category APIs
- [x] Broken access control (SEC-03) verified across POST, PUT, and DELETE operations
- [x] Stored XSS injection (SEC-04) verified through public `GET /api/categories` reflection
- [x] SQL injection parameterization (SEC-05) verified

---

*Artifact owner: AI (Stage 8 — SEC-01, API 3)*  
*→ **HARD STOP — awaiting human review and approval before Stage 9 (SCHEMA-01 — Schema Validation Design for API 3).***
