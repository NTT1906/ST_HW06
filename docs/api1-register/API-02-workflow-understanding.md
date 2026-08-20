# API-02 — API / Workflow Understanding: POST /api/register

**Skill:** API-02  
**Stage:** 4  
**API:** API 1 — FR-01 Account Registration  
**Endpoint:** `POST /api/register`  
**Student ID:** 23127255  
**Date/Time:** 2026-08-20T12:03 +07:00  
**Inputs:** `api_specification.md` §1.1, API-01 validation results  
**Executor:** AI (Antigravity / Claude Sonnet)

---

## 1. Purpose

`POST /api/register` creates a new user account in the EShop system.  
It is the entry point for all user-facing functionality that requires authentication (login, order history, cart, checkout).

---

## 2. Actors & Authentication

| Actor | Role | Auth Required |
|---|---|---|
| Anonymous visitor | Initiates registration | None — public endpoint |
| System | Persists user record, generates `id` | N/A |

No authentication token is required or accepted for this endpoint.  
No admin privilege is involved.

---

## 3. Inputs

| # | Field | Location | Type | Documented | Observed Constraint |
|---|---|---|---|---|---|
| 1 | `name` | JSON body | string | Yes | None enforced by SUT |
| 2 | `email` | JSON body | string | Yes | None enforced — format not validated, uniqueness not enforced |
| 3 | `password` | JSON body | string | Yes | None enforced by SUT |
| H1 | `Content-Type` | Header | string | Implicit (JSON API) | Must be `application/json`; form-encoded triggers HTTP 500 |
| H2 | `X-Student-Id` | Header | string | HW06 requirement | `23127255`; backend does not reject it |

---

## 4. Outputs

### Success (HTTP 200)

```json
{
  "message": "User registered successfully",
  "id": <integer>
}
```

| Field | Type | Meaning |
|---|---|---|
| `message` | string | Confirmation string, always the same value |
| `id` | integer | Auto-incremented DB primary key of the new user record |

### Error responses

> **Not documented in `api_specification.md`.**  
> Observed from SUT: HTTP 500 when body is absent or `Content-Type` is not JSON.  
> No 4xx validation errors are returned for any input scenario tested.

---

## 5. Business Rules

> Rules are derived **only** from the specification and observed SUT behavior.  
> Inferred rules are explicitly marked as [INFERRED — NOT VERIFIED].

| # | Rule | Source | Status |
|---|---|---|---|
| BR-1 | A successful registration returns `{"message":"User registered successfully","id":N}` | `api_specification.md` §1.1 | ✅ Documented + verified |
| BR-2 | The endpoint is public (no auth required) | Spec structure (§1 vs §2 auth note) | ✅ Verified |
| BR-3 | `Content-Type: application/json` is required | SUT behavior (500 on form body) | ✅ Observed |
| BR-4 | Email uniqueness is enforced | [INFERRED — NOT VERIFIED] | ❌ **Disproved by SUT** — duplicates accepted |
| BR-5 | Fields `name`, `email`, `password` are all required | [INFERRED — NOT VERIFIED] | ❌ **Disproved by SUT** — all fields optional in practice |
| BR-6 | Email must be a valid RFC-5321 format | [INFERRED — NOT VERIFIED] | ❌ **Disproved by SUT** — `notanemail` accepted |
| BR-7 | Password must meet complexity requirements | [INFERRED — NOT VERIFIED] | ❌ **Disproved by SUT** — no complexity check observed |

---

## 6. Endpoint Dependencies

| Relationship | Endpoint | Direction | Detail |
|---|---|---|---|
| Downstream | `POST /api/login` | Register → Login | A registered email/password pair is required to log in |
| Downstream | `GET /api/users/me` | Register → Login → Profile | Login token required for profile access |
| Downstream | `GET /api/orders/my-orders` | Register → Login → Orders | Login token required for order history (FR-11, API 2) |
| Upstream | None | — | Registration has no prerequisite API call |

---

## 7. Preconditions

| # | Precondition | Source |
|---|---|---|
| P1 | SUT backend is running and accepting connections | ENV-01 verified |
| P2 | Request body is valid JSON with `Content-Type: application/json` | Observed (SUT crashes otherwise) |
| P3 | Email is not already registered | [INFERRED — NOT ENFORCED by SUT] |

---

## 8. Postconditions

| # | Postcondition | Source |
|---|---|---|
| PC1 | User record is persisted in the database with a new integer `id` | Observed — response `id` increments with each call |
| PC2 | User can subsequently log in with the provided email/password | Verified in ENV-01 smoke test |
| PC3 | Response body always contains `message` and `id` on success | Spec + observed |

---

## 9. Stateful Behavior

`POST /api/register` is **state-creating** but not state-transitioning:

- It creates a new entity (user) in state `active` (implicit — no `locked_until`, no `login_attempts`).
- The spec describes a `locked_until` field on user records (observed in login response), meaning the account state can later transition to `locked` via FR-02 (login attempts).
- No state transitions occur within this endpoint itself.

---

## 10. Input Constraints Summary

| Field | Spec Constraint | SUT-Enforced | Observed Behavior |
|---|---|---|---|
| `name` | None documented | None | Any value accepted; absent = still creates record |
| `email` | None documented | None | Any string; invalid format accepted; duplicates accepted |
| `password` | Example shows `Password123!` (implies complexity) | None | Any string or absent accepted |
| Body as a whole | Must be JSON | Yes (crashes on non-JSON) | HTTP 500 on form body or no body |

---

## 11. Assumptions

| # | Assumption | Rationale |
|---|---|---|
| A1 | `name`, `email`, `password` are the intended required fields | They appear in the spec example body |
| A2 | Email uniqueness is intended business logic | Standard for any registration system — but **not enforced** |
| A3 | Password complexity (`Password123!` pattern) is intended | Spec example implies it, but no validation exists |
| A4 | Registered user role is `user` (not `admin`) | Observed in login JWT payload (`"role":"user"`) |
| A5 | The `id` in the response is the database primary key | Increments monotonically with each registration call |

---

## 12. Open Questions — RESOLVED

| # | Question | Human Answer | SUT Verification | Impact on Testing |
|---|---|---|---|---|
| OQ-1 | Field length/regex constraints? | "Probably no — they're just strings" | N/A — treat as unconstrained | No numeric BVA boundaries; domain = any string |
| OQ-2 | Is email uniqueness required? | **"Mail should be unique"** — confirmed intended behaviour | SUT does NOT enforce it → **BC-1 is a confirmed bug** | Duplicate-email = always a negative test case expected to fail but currently passes |
| OQ-3 | What status/body for validation failures? | "I don't have an answer" | Unknown — no error responses observed | Tests can only assert **current** behaviour (200); cannot assert correct 4xx without spec update |
| OQ-4 | Is `name` returned anywhere? | "Maybe profile / `/api/users/me`?" | ✅ **Confirmed** — `GET /api/users/me` returns full user object including `name` | `name` is functionally meaningful; blank/null name should be tested |
| OQ-5 | Are extra body fields accepted (e.g. `role:"admin"`)? | "It should not be" | ✅ **Extra field accepted at registration but ignored** — `role` injected in body → login shows `role=user` (not admin) | Mass-assignment does not escalate privilege here; confirmed safe but still a SEC test case |

---

*Artifact owner: AI (Stage 4 — API-02, API 1)*  
*OQs resolved: 2026-08-20T12:11 +07:00 (human input + live SUT verification)*  
*→ Approved. Proceeding to Stage 5 (DT-01/02/03).*

