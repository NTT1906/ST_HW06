# SEC-01 — Security Test Design: POST /api/register

**Skill:** SEC-01  
**Stage:** 8  
**API:** API 1 — FR-01 Account Registration  
**Endpoint:** `POST /api/register`  
**Student ID:** 23127255  
**Date/Time:** 2026-08-20T12:19 +07:00  
**Inputs:** `eshop-sut/README.md` (SEC-01–SEC-07), `api_specification.md`, Live SUT evidence  
**Executor:** AI (Antigravity / Gemini Flash)

---

## 1. SEC-01–SEC-07 Applicability Matrix

| Requirement | Title / Rule | Applicable to `POST /api/register`? | Rationale |
|---|---|---|---|
| **SEC-01** | Passwords must not be stored in plaintext | **YES (Direct)** | Registration receives user password for storage. Downstream authentication/profile exposes stored format. |
| **SEC-02** | Secure APIs must require valid JWT | **NO (Endpoint is public)** | Registration is an unauthenticated entry point. Sending arbitrary/invalid Bearer tokens must not affect behavior. |
| **SEC-03** | Admin APIs must check `role = 'admin'` | **NO** | `POST /api/register` is a public customer endpoint. |
| **SEC-04** | User inputs must be sanitized/escaped (XSS) | **YES (Direct)** | `name` string is accepted at registration and later returned by `GET /api/users/me` and admin user views. |
| **SEC-05** | SQL queries must use Parameterized Queries | **YES (Direct)** | Registration inserts user records into the SQLite database. |
| **SEC-06** | Role escalation / mass assignment prevention | **YES (Direct)** | Client must not be able to register with elevated privileges (`"role": "admin"`). |
| **SEC-07** | Password Reset OTP security | **NO** | Relates to FR-03 (`/api/forgot-password` and `/api/reset-password`). |

---

## 2. Security Test Matrix

| Test ID | Mapped Requirement | Attack Vector / Security Condition | Test Payload / Action | Expected Result | Actual Live SUT Result | Security Finding / Verdict |
|---|---|---|---|---|---|---|
| **SEC-TC01** | **SEC-01** | Plaintext Password Storage | Register with `password: "SecCheck123!"`, then inspect stored/returned user object on login | Password should be hashed (bcrypt/argon2); never returned in plaintext | HTTP 200; Login returns `"password": "SecCheck123!"` in user object | 🚨 **CRITICAL VULNERABILITY (SEC-01 Defect):** Passwords stored and transmitted in plaintext |
| **SEC-TC02** | **SEC-04** | Stored XSS via `name` field | Register with `name: "<script>alert('XSS')</script>"` | Input sanitized or HTML-escaped before persistence/display | HTTP 200; Payload stored verbatim and returned unescaped in `GET /api/users/me` | 🚨 **HIGH VULNERABILITY (SEC-04 Defect):** Stored XSS payload stored unescaped |
| **SEC-TC03** | **SEC-04** | Stored XSS via SVG/img onerror | Register with `name: "<img src=x onerror=alert(1)>"` | Sanitized / stripped | HTTP 200; HTML tags preserved in DB | 🚨 **HIGH VULNERABILITY (SEC-04 Defect):** SVG/img event handlers preserved |
| **SEC-TC04** | **SEC-05** | SQL Injection via `email` | `email: "sqli_' OR '1'='1@test.com"` | Handled via parameterized query or 4xx rejection | HTTP 200; Parameterized query prevented SQL injection | ✅ PASS (No raw SQL syntax execution) |
| **SEC-TC05** | **SEC-05** | SQL Injection via `name` | `name: "admin'--"` | Parameterized query | HTTP 200; Handled safely as string literal | ✅ PASS (Parameterized query used) |
| **SEC-TC06** | **SEC-06** | Privilege Escalation (Mass Assignment) | Body: `{"name":"User","email":"...","password":"...","role":"admin"}` | Field ignored or rejected with 4xx; role defaults to `user` | HTTP 200; User created with `role: "user"` | ✅ PASS (Role parameter ignored on registration) |
| **SEC-TC07** | **SEC-06** | System Field Injection (`id`, `locked_until`) | Body: `{"id": 1, "locked_until": "2099-01-01"}` | System fields ignored | HTTP 200; `id` auto-generated, system fields ignored | ✅ PASS (System fields ignored) |
| **SEC-TC08** | **SEC-02** | Superfluous Token Handling | Send registration with bogus `Authorization: Bearer invalid.token.xyz` | Endpoint ignores token (public endpoint) | HTTP 200; Token ignored | ✅ PASS |

---

## 3. Security Findings & Defect Summary

1. **Critical Defect — SEC-01 Plaintext Passwords:**
   - Registration saves raw password strings directly into the SQLite database.
   - Downstream APIs (`POST /api/login` and `GET /api/users/me`) expose the plaintext password in response bodies.
2. **High Defect — SEC-04 Stored Cross-Site Scripting (XSS):**
   - The `name` parameter performs no sanitization or input filtering on HTML/JavaScript elements (`<script>`, `<img>` onerror).
   - The unsanitized payload is persisted and reflected to the user and admin views.
3. **Verified Controls:**
   - **SEC-05 (SQL Injection):** Backend utilizes parameterized SQLite queries for user insertion.
   - **SEC-06 (Privilege Escalation):** Mass-assignment attempt injecting `role: "admin"` is safely ignored by the backend.

---

## 4. SEC-01 Validation Checklist

- [x] SEC-01 through SEC-07 read directly from SUT specification
- [x] Applicability matrix created with rationale for every requirement
- [x] Concrete security test cases designed for all applicable requirements
- [x] Tests executed against running SUT and actual behavior recorded
- [x] Genuine security vulnerabilities (SEC-01 plaintext, SEC-04 stored XSS) discovered and evidenced

---

*Artifact owner: AI (Stage 8 — SEC-01, API 1)*  
*→ **HARD STOP — awaiting human review and approval before Stage 9 (SCHEMA-01 — Schema Validation Design for API 1).***
