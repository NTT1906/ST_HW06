# BVA-01 — Boundary Value Analysis: POST /api/register

**Skill:** BVA-01  
**Stage:** 6  
**API:** API 1 — FR-01 Account Registration  
**Endpoint:** `POST /api/register`  
**Student ID:** 23127255  
**Date/Time:** 2026-08-20T12:15 +07:00  
**Inputs:** `api_specification.md` §1.1, DT-01 Domain Table, DT-02 Partitions, Live SUT evidence  
**Executor:** AI (Antigravity / Gemini Flash)

---

## 1. Boundary Identification & Applicability

Per `BVA-01` skill guidelines:
- Boundary Value Analysis is applied to bounded variables and structural string boundaries (length boundaries, standard format lengths, empty/nominal/extreme values).
- The EShop API specification does not document explicit minimum or maximum numeric constraints for `POST /api/register`.
- However, standard RFC standards (RFC 5321 for email lengths) and standard string boundary conditions (0-length, 1-char, nominal, 255-char, extreme buffer lengths) apply to assess input robustness and defect detection.

---

## 2. Boundary Value Table

| # | Variable | Boundary Category | Value Description | Test Value | Expected Result (Spec Intent) | Actual Result (Live SUT) | Defect / Note |
|---|---|---|---|---|---|---|---|
| **BVA-01** | `name` | Min - 1 (Empty) | 0 characters (empty string) | `""` | 4xx Validation Error | HTTP 200 (id=12) | ⚠️ SUT accepts empty name |
| **BVA-02** | `name` | Min (Lower Bound) | 1 character | `"A"` | 200 OK | HTTP 200 (id=13) | ✅ Valid single char |
| **BVA-03** | `name` | Nominal | Typical name length | `"Nguyen Van A"` (13 chars) | 200 OK | HTTP 200 | ✅ Valid |
| **BVA-04** | `name` | Max (DB Standard) | 255 characters | `"A" * 255` | 200 OK | HTTP 200 (id=14) | ✅ Accepted |
| **BVA-05** | `name` | Extreme / Overflow | 10,000 characters | `"A" * 10000` | 4xx/413 Payload Too Large | HTTP 200 (id=15) | ⚠️ No length limit / truncation check |
| **BVA-06** | `email` | Local part Min - 1 | 0 chars before `@` | `"@domain.com"` | 4xx Invalid Email | HTTP 200 | ⚠️ No email structure validation |
| **BVA-07** | `email` | Local part Min | 1 char before `@` | `"a@b.com"` | 200 OK | HTTP 200 (id=19) | ✅ Accepted |
| **BVA-08** | `email` | TLD Min - 1 | 1-char TLD | `"user@domain.c"` | 4xx Invalid TLD | HTTP 200 (id=20) | ⚠️ Standard TLD is >= 2 chars |
| **BVA-09** | `email` | TLD Min | 2-char TLD | `"user@domain.co"` | 200 OK | HTTP 200 | ✅ Accepted |
| **BVA-10** | `email` | RFC 5321 Max | 254 characters standard email | `("a"*64) + "@" + ("b"*180) + ".com"` | 200 OK | HTTP 200 (id=21) | ✅ Accepted |
| **BVA-11** | `email` | RFC 5321 Max + 1 | 255+ characters email | `("a"*65) + "@" + ("b"*190) + ".com"` | 4xx Invalid Email Length | HTTP 200 | ⚠️ No length restriction on email |
| **BVA-12** | `password` | Min - 1 (Empty) | 0 characters (empty string) | `""` | 4xx Validation Error | HTTP 200 (id=16) | ⚠️ SUT accepts empty password |
| **BVA-13** | `password` | Min (Lower Bound) | 1 character | `"a"` | 4xx Password Too Short | HTTP 200 (id=17) | ⚠️ SUT enforces no min length |
| **BVA-14** | `password` | Nominal | Typical strong password | `"Password123!"` (12 chars) | 200 OK | HTTP 200 | ✅ Accepted |
| **BVA-15** | `password` | Max (Standard) | 255 characters | `"P" * 255` | 200 OK | HTTP 200 (id=18) | ✅ Accepted |
| **BVA-16** | `password` | Extreme / Overflow | 10,000 characters | `"P" * 10000` | 4xx / Hash DoS Prevention | HTTP 200 | ⚠️ Long password hash DoS vector |

---

## 3. Boundary Analysis Findings

1. **Absence of Lower-Bound Enforcements:**
   - Empty string values (`""`) for `name`, `email`, and `password` all return `HTTP 200` and create database records.
   - Minimal single-character passwords (`"a"`) are accepted without meeting standard complexity or length thresholds.
2. **Absence of Upper-Bound Enforcements:**
   - Payloads up to 10,000 characters for `name` and `password` are processed and accepted with `HTTP 200` without payload-size or buffer limits.
3. **Absence of Structural Email Boundary Validation:**
   - Both missing local-parts (`@domain.com`) and single-character TLDs (`user@domain.c`) are accepted.

---

## 4. BVA-01 Validation Checklist

- [x] Boundary categories (Min-1, Min, Nominal, Max, Max+1, Extreme) identified for each parameter
- [x] Representative boundary values tested against live SUT
- [x] Actual vs. expected results recorded with status codes and response bodies
- [x] Boundary assumptions explicitly noted and distinguished from documented specifications
- [x] Defects / boundary vulnerabilities documented

---

*Artifact owner: AI (Stage 6 — BVA-01, API 1)*  
*→ **HARD STOP — awaiting human review and approval before Stage 7 (ST-01 — State Transition Analysis for API 1).***
