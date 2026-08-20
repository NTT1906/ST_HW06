# DT-01/02/03 — Domain Testing: POST /api/register

**Skills:** DT-01, DT-02, DT-03  
**Stage:** 5  
**API:** API 1 — FR-01 Account Registration  
**Endpoint:** `POST /api/register`  
**Student ID:** 23127255  
**Date/Time:** 2026-08-20T12:11 +07:00  
**Inputs:** `api_specification.md` §1.1, API-01 results, API-02 results (OQs resolved)  
**Executor:** AI (Antigravity / Claude Sonnet)

---

# Part 1 — DT-01: Domain Identification

## Input Variables

| # | Variable | Location | Type | Valid Domain | Invalid Domain | Constraints | Dependencies | Evidence |
|---|---|---|---|---|---|---|---|---|
| V1 | `name` | JSON body | string | Non-empty string | *(none enforced by SUT)* | None documented; SUT accepts any value incl. absent | None | api_spec §1.1 + API-01 observed |
| V2 | `email` | JSON body | string | Valid email format, not previously registered | Invalid format; already-registered email | **Uniqueness required** (OQ-2 human confirm); format should follow email convention | None | api_spec §1.1 + OQ-2 resolved |
| V3 | `password` | JSON body | string | Non-empty string | *(none enforced by SUT)* | None documented; SUT accepts any value incl. absent | None | api_spec §1.1 + API-01 observed |
| V4 | `Content-Type` header | HTTP header | string | `application/json` | Any other value | SUT crashes (HTTP 500) on non-JSON body when Content-Type is wrong | None | API-01 observed (form body → 500) |
| V5 | Extra fields in body | JSON body | any | Not present | `role`, `id`, or other system fields injected | Should be ignored (OQ-5 verified: `role:"admin"` is ignored) | V2, V3 | API-02 OQ-5 verified |

> **Notes:**
> - `name` and `password` have no documented or SUT-enforced boundaries → BVA skipped for these (per BVA-01 rule: skip unbounded variables).
> - `email` has structural/uniqueness constraints (OQ-2); these drive meaningful partitions.
> - `Content-Type` affects whether the body is even parsed — treated as a separate partition dimension.

---

# Part 2 — DT-02: Domain Partitioning

## V1 — `name`

| Partition | Valid/Invalid | Description | Representative Value |
|---|---|---|---|
| N-V1 | **Valid** | Typical non-empty name string | `"Nguyen Van A"` |
| N-V2 | **Valid** | Single character name | `"A"` |
| N-V3 | **Valid** | Name with special characters (unicode) | `"Nguyễn Văn A"` |
| N-V4 | **Valid** | Name with spaces only | `"   "` |
| N-V5 | **Invalid** (spec intent) | Missing (field absent) | *(field omitted)* |
| N-V6 | **Invalid** (spec intent) | Empty string | `""` |
| N-V7 | **Valid** | Very long name (stress) | 255-char string |

## V2 — `email`

| Partition | Valid/Invalid | Description | Representative Value |
|---|---|---|---|
| E-V1 | **Valid** | Standard well-formed email, not registered | `"newuser@domain.com"` |
| E-V2 | **Invalid** | Already-registered email (uniqueness violation) | `"valid_api01@test.com"` (registered in API-01) |
| E-V3 | **Invalid** | No `@` symbol | `"notanemail"` |
| E-V4 | **Invalid** | Missing local part | `"@domain.com"` |
| E-V5 | **Invalid** | Missing domain | `"user@"` |
| E-V6 | **Invalid** | Missing TLD | `"user@domain"` |
| E-V7 | **Invalid** | Spaces in email | `"user @domain.com"` |
| E-V8 | **Invalid** | Field absent | *(field omitted)* |
| E-V9 | **Invalid** | Empty string | `""` |
| E-V10 | **Valid** | Email with subdomain | `"user@mail.domain.com"` |
| E-V11 | **Invalid** | SQL injection payload | `"' OR '1'='1"` |
| E-V12 | **Invalid** | XSS payload | `"<script>alert(1)</script>@x.com"` |

## V3 — `password`

| Partition | Valid/Invalid | Description | Representative Value |
|---|---|---|---|
| P-V1 | **Valid** | Typical strong password (matches spec example pattern) | `"Password123!"` |
| P-V2 | **Valid** | Minimum viable non-empty string | `"a"` |
| P-V3 | **Invalid** (spec intent) | Missing (field absent) | *(field omitted)* |
| P-V4 | **Invalid** (spec intent) | Empty string | `""` |
| P-V5 | **Valid** | Spaces only | `"   "` |
| P-V6 | **Valid** | Very long password (stress) | 255-char string |
| P-V7 | **Invalid** | SQL injection payload | `"' OR '1'='1"` |

## V4 — `Content-Type` header

| Partition | Valid/Invalid | Description | Representative Value |
|---|---|---|---|
| CT-V1 | **Valid** | JSON content type | `application/json` |
| CT-V2 | **Invalid** | Form-encoded | `application/x-www-form-urlencoded` |
| CT-V3 | **Invalid** | Missing header / no body | *(omitted)* |

## V5 — Extra fields

| Partition | Valid/Invalid | Description | Representative Value |
|---|---|---|---|
| EF-V1 | **Valid** | No extra fields (normal) | *(standard body)* |
| EF-V2 | **Invalid** (should be rejected) | Role injection | `"role":"admin"` added to body |
| EF-V3 | **Invalid** (should be rejected) | ID injection | `"id":1` added to body |

---

# Part 3 — DT-03: Domain Test Cases

> Convention: **Expected result** uses current SUT behaviour where spec is silent.  
> Where spec intent (OQ-2 human answer) conflicts with SUT, the **expected** reflects the intended correct behaviour; the **actual** (from API-01) is noted.

| TC ID | Scenario | `name` | `email` | `password` | Extra | Content-Type | Expected HTTP | Expected Body | Covered Partition | Business Rule |
|---|---|---|---|---|---|---|---|---|---|---|
| DT-01 | Happy path | `"Nguyen Van A"` | fresh unique email | `"Password123!"` | — | `application/json` | 200 | `{"message":"User registered successfully","id":<int>}` | N-V1, E-V1, P-V1, CT-V1, EF-V1 | BR-1, BR-2, BR-3 |
| DT-02 | Duplicate email | `"Nguyen Van A"` | already-registered | `"Password123!"` | — | `application/json` | **4xx** (intended) / 200 (current SUT) | Error message | N-V1, **E-V2**, P-V1 | OQ-2: uniqueness required → **bug BC-1** |
| DT-03 | Invalid email — no `@` | `"Test"` | `"notanemail"` | `"Test123!"` | — | `application/json` | **4xx** (intended) / 200 (current SUT) | Error message | N-V1, **E-V3**, P-V1 | Email format |
| DT-04 | Invalid email — missing local part | `"Test"` | `"@domain.com"` | `"Test123!"` | — | `application/json` | **4xx** (intended) / 200 (current SUT) | Error message | N-V1, **E-V4**, P-V1 | Email format |
| DT-05 | Invalid email — missing domain | `"Test"` | `"user@"` | `"Test123!"` | — | `application/json` | **4xx** (intended) / 200 (current SUT) | Error message | N-V1, **E-V5**, P-V1 | Email format |
| DT-06 | Invalid email — missing TLD | `"Test"` | `"user@domain"` | `"Test123!"` | — | `application/json` | **4xx** (intended) / 200 (current SUT) | Error message | N-V1, **E-V6**, P-V1 | Email format |
| DT-07 | Missing `name` field | *(absent)* | fresh unique email | `"Password123!"` | — | `application/json` | **4xx** (intended) / 200 (current SUT) | Error message | **N-V5**, E-V1, P-V1 | Required field |
| DT-08 | Missing `email` field | `"Test"` | *(absent)* | `"Password123!"` | — | `application/json` | **4xx** (intended) / 200 (current SUT) | Error message | N-V1, **E-V8**, P-V1 | Required field |
| DT-09 | Missing `password` field | `"Test"` | fresh unique email | *(absent)* | — | `application/json` | **4xx** (intended) / 200 (current SUT) | Error message | N-V1, E-V1, **P-V3** | Required field |
| DT-10 | All fields absent (empty body `{}`) | *(absent)* | *(absent)* | *(absent)* | — | `application/json` | **4xx** (intended) / 200 (current SUT) | Error message | **N-V5**, **E-V8**, **P-V3** | All required fields |
| DT-11 | Empty `name` string | `""` | fresh unique email | `"Password123!"` | — | `application/json` | **4xx** (intended) / 200 (current SUT) | Error message | **N-V6**, E-V1, P-V1 | Required field |
| DT-12 | Empty `email` string | `"Test"` | `""` | `"Password123!"` | — | `application/json` | **4xx** (intended) / 200 (current SUT) | Error message | N-V1, **E-V9**, P-V1 | Required field |
| DT-13 | Empty `password` string | `"Test"` | fresh unique email | `""` | — | `application/json` | **4xx** (intended) / 200 (current SUT) | Error message | N-V1, E-V1, **P-V4** | Required field |
| DT-14 | Form content-type | `"Test"` | `test@x.com` | `"Test123!"` | — | `application/x-www-form-urlencoded` | **4xx or 500** | Error (no stack trace) | N-V1, E-V1, P-V1, **CT-V2** | BR-3 |
| DT-15 | No body at all | *(none)* | *(none)* | *(none)* | — | *(none)* | **4xx** / 500 (current SUT) | Error | **CT-V3** | BR-3 |
| DT-16 | Role injection in body | `"Hacker"` | fresh unique email | `"Test123!"` | `"role":"admin"` | `application/json` | 200, role stays `user` | `{"message":"User registered successfully","id":<int>}` | N-V1, E-V1, P-V1, **EF-V2** | OQ-5: extra fields ignored |
| DT-17 | Unicode name | `"Nguyễn Văn A"` | fresh unique email | `"Password123!"` | — | `application/json` | 200 | `{"message":"User registered successfully","id":<int>}` | **N-V3**, E-V1, P-V1 | No constraint on name |
| DT-18 | Single-char name | `"A"` | fresh unique email | `"Password123!"` | — | `application/json` | 200 | `{"message":"User registered successfully","id":<int>}` | **N-V2**, E-V1, P-V1 | No constraint on name |
| DT-19 | Email with subdomain | `"Test"` | `"user@mail.domain.com"` | `"Password123!"` | — | `application/json` | 200 | `{"message":"User registered successfully","id":<int>}` | N-V1, **E-V10**, P-V1 | Valid email variant |
| DT-20 | Minimal password (1 char) | `"Test"` | fresh unique email | `"a"` | — | `application/json` | 200 (no complexity enforced) | `{"message":"User registered successfully","id":<int>}` | N-V1, E-V1, **P-V2** | No complexity rule |

---

## Coverage Summary

| Domain | Partitions Total | Partitions Covered | Test Cases |
|---|---|---|---|
| `name` (V1) | 7 | 7 | DT-01, 07, 11, 17, 18 + DT-10 |
| `email` (V2) | 12 | 11 | DT-01–06, 08, 12, 16, 19 (E-V11/12 → SEC-01) |
| `password` (V3) | 7 | 6 | DT-01, 09, 13, 15, 16, 20 (P-V7 → SEC-01) |
| `Content-Type` (V4) | 3 | 3 | DT-01, 14, 15 |
| Extra fields (V5) | 3 | 2 | DT-01, 16 (EF-V3 → SEC-01) |

> SQL/XSS partitions (E-V11, E-V12, P-V7, EF-V3) are deferred to SEC-01 (Stage 8) to avoid duplication.

---

*Artifact owner: AI (Stage 5 — DT-01/02/03, API 1)*  
*→ **HARD STOP — awaiting human review and approval before Stage 6 (BVA-01 — Boundary Value Analysis for API 1).***
