# API-01 — API Validation Notes: POST /api/register

**Skill:** API-01  
**Stage:** 3  
**API:** API 1 — FR-01 Account Registration  
**Endpoint:** `POST /api/register`  
**Student ID:** 23127255  
**Date/Time:** 2026-08-20T12:00 +07:00  
**Authority:** `api_specification.md` §1.1  
**Executor:** AI (Antigravity / Claude Sonnet)

---

## 1. Endpoint Summary

| Attribute | Value |
|---|---|
| HTTP Method | POST |
| Path | `/api/register` |
| Base URL | `http://localhost:3000` |
| Full URL | `http://localhost:3000/api/register` |
| Authentication | None (public endpoint) |
| Authorization | None |
| Content-Type | `application/json` (required) |

---

## 2. Request Specification

### Headers

| Header | Required | Documented Value |
|---|---|---|
| `Content-Type` | Yes | `application/json` |
| `Authorization` | No | None (public) |
| `X-Student-Id` | HW06 requirement | `23127255` |

### Request Body (JSON)

| Field | Type | Documented |
|---|---|---|
| `name` | string | Yes — example: `"Nguyen Van A"` |
| `email` | string | Yes — example: `"test@domain.com"` |
| `password` | string | Yes — example: `"Password123!"` |

---

## 3. Response Specification

### Success

| Attribute | Documented Value |
|---|---|
| Status code | 200 OK |
| Body | `{"message": "User registered successfully", "id": <integer>}` |

### Error responses

> **⚠️ Not documented** — the specification (`api_specification.md` §1.1) only documents the success response. No error codes, error messages, or validation constraints are specified.

---

## 4. Validation Evidence (Live SUT)

All requests include `X-Student-Id: 23127255`.

| # | Test Scenario | Request Body | Expected (from spec) | Actual HTTP | Actual Body | Verdict |
|---|---|---|---|---|---|---|
| 1 | Happy path (new email) | `{name, email: valid_api01@test.com, password}` | 200 + id | **200** | `{"message":"User registered successfully","id":4}` | ✅ Match |
| 2 | Duplicate email | same email as #1 | Not documented | **200** | `{"message":"User registered successfully","id":5}` | ⚠️ **BUG CANDIDATE** — duplicate allowed |
| 3 | Missing `name` | `{email, password}` | Not documented | **200** | `{"message":"User registered successfully","id":6}` | ⚠️ **BUG CANDIDATE** — required field accepted as absent |
| 4 | Missing `email` | `{name, password}` | Not documented | **200** | `{"message":"User registered successfully","id":7}` | ⚠️ **BUG CANDIDATE** — required field accepted as absent |
| 5 | Missing `password` | `{name, email}` | Not documented | **200** | `{"message":"User registered successfully","id":8}` | ⚠️ **BUG CANDIDATE** — required field accepted as absent |
| 6 | Empty body `{}` | `{}` | Not documented | **200** | `{"message":"User registered successfully","id":9}` | ⚠️ **BUG CANDIDATE** — all fields omitted still returns 200 |
| 7 | Invalid email format | `{name, email:"notanemail", password}` | Not documented | **200** | `{"message":"User registered successfully","id":10}` | ⚠️ No format validation |
| 8 | Form content-type | `name=...&email=...&password=...` | Not documented | **500** | Stack trace: `TypeError: Cannot destructure property 'name' of 'req.body' as it is undefined` | ⚠️ **BUG CANDIDATE** — unhandled exception exposed to client |
| 9 | No body at all | (none) | Not documented | **500** | Internal Server Error | ⚠️ **BUG CANDIDATE** — unhandled server crash |
| 10 | Wrong method (GET) | — | Not documented | **404** | Not Found | ℹ️ Expected (route not registered for GET) |

---

## 5. Identified Constraints

### Documented constraints (from `api_specification.md`)
- **None.** The spec only states the happy-path request/response; no validation rules, field requirements, uniqueness constraints, or error codes are documented.

### Observed constraints (from live SUT)
| Constraint | Observed Behavior | Notes |
|---|---|---|
| Required fields | Not enforced — missing name/email/password all return 200 | **Discrepancy from reasonable expectation** |
| Email uniqueness | Not enforced — duplicate emails return 200 with new `id` | **Discrepancy from reasonable expectation** |
| Email format | Not validated — `notanemail` accepted | **Discrepancy from reasonable expectation** |
| Content-Type | Must be `application/json` — form-encoded causes 500 | **Unhandled exception bug** |
| No body | Causes 500 Internal Server Error | **Unhandled exception bug** |
| HTTP method | Only POST is routed — GET returns 404 | Normal |

---

## 6. Request/Response Dependencies

| Dependency | Detail |
|---|---|
| Upstream | None — registration is the entry point |
| Downstream | `POST /api/login` — requires a registered email/password |
| `id` in response | The returned `id` can be used to reference the created user in admin endpoints |

---

## 7. Preconditions & Postconditions

| | Detail |
|---|---|
| **Preconditions** | SUT is running; email not previously registered (per spec intent) |
| **Postconditions** | User record created in DB; user can log in with provided credentials |

---

## 8. Bug Candidates Identified

> These are candidates — each must be confirmed against spec intent before filing as BUG-01. Since the spec does not document error cases, these are flagged as discrepancies between reasonable API expectations and observed behavior.

| # | Scenario | Observed | Expected (reasonable) | Severity |
|---|---|---|---|---|
| BC-1 | Duplicate email | HTTP 200, new ID created | HTTP 4xx, error message | High |
| BC-2 | Missing required fields (any of name/email/password) | HTTP 200, record created | HTTP 4xx, field validation error | High |
| BC-3 | Empty body `{}` | HTTP 200, record created | HTTP 4xx | High |
| BC-4 | Invalid email format | HTTP 200 | HTTP 4xx | Medium |
| BC-5 | Form content-type body | HTTP 500 + stack trace exposed | HTTP 4xx, no stack trace | Medium |
| BC-6 | No body at all | HTTP 500 | HTTP 4xx | Medium |

---

## 9. Open Questions

1. **Are any field constraints (min/max length, regex for password) intended but undocumented?** — Cannot answer from spec alone; must treat as no-constraint unless spec is updated.
2. **Is email uniqueness intended?** — Logically expected for a registration endpoint, but not in spec. Confirmed as unenforced by SUT.
3. **Is the password stored in plaintext?** — Login response body returned `"password":"Admin123!"` in plaintext in the user object (observed during ENV-01). This is a security concern but out of scope for API-01 validation; will surface in SEC-01.

---

## 10. API-01 Validation Checklist

- [x] Endpoint path verified: `POST /api/register`
- [x] HTTP method verified: POST
- [x] Authentication: none required (public)
- [x] Authorization: none required
- [x] Request headers verified (`Content-Type: application/json` required)
- [x] Request body fields identified: `name`, `email`, `password`
- [x] Documented preconditions identified (none formally documented)
- [x] Success response verified: HTTP 200, `{"message":"User registered successfully","id":<int>}`
- [x] Representative request executed against running SUT
- [x] Response verified against spec
- [x] Discrepancies recorded (see Section 5 and 8)
- [x] Environment failures distinguished from SUT failures (500s are SUT bugs, not env issues)

---

*Artifact owner: AI (Stage 3 — API-01, API 1)*  
*→ **HARD STOP — awaiting human review and approval before Stage 4 (API-02 Workflow Understanding for API 1).***
