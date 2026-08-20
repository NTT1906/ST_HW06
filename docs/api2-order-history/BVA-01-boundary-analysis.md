# BVA-01 — Boundary Value Analysis: GET /api/orders/my-orders

**Skill:** BVA-01  
**Stage:** 6  
**API:** API 2 — FR-11 Order History View (User)  
**Endpoint:** `GET /api/orders/my-orders`  
**Student ID:** 23127255  
**Date/Time:** 2026-08-20T12:49 +07:00  
**Inputs:** `api_specification.md` §4.4, DT-01–03 artifacts, Live SUT evidence  
**Executor:** AI (Antigravity / Gemini Flash)

---

## 1. Boundary Identification & Applicability

For a read query endpoint such as `GET /api/orders/my-orders`:
1. **Result Set Cardinality Boundaries (Order Count):** Lower bound (0 orders), Minimal (1 order), Nominal (2–5 orders), and High Volume / Upper Threshold (≥ 10 orders per OQ-OH-03).
2. **Authorization Header Boundaries:** Empty token (`Bearer `), Minimal 1-char token (`Bearer a`), Normal JWT (approx 150–200 chars), and Extreme Header Buffer (4096 chars).
3. **Internal Numerical Field Boundaries (Inspected in items):** `total_amount` values across order records (0, nominal, large numbers).

---

## 2. Boundary Value Table

| # | Variable / Domain | Boundary Category | Value / Condition | Test Condition | Expected Result (Spec Intent) | Actual Result (Live SUT) | Assessment |
|---|---|---|---|---|---|---|---|
| **BVA-OH-01** | Order Count | Min (Lower Bound) | Exactly 0 orders | Fresh user account | `200 OK` + `[]` (Empty array) | `HTTP 200` (`Count: 0`) | ✅ PASS (Clean empty collection) |
| **BVA-OH-02** | Order Count | Min + 1 | Exactly 1 order | User with 1 completed checkout | `200 OK` + Array length 1 | `HTTP 200` (`Count: 1`) | ✅ PASS |
| **BVA-OH-03** | Order Count | Nominal | 2–5 orders | Test user (`test@eshop.com`) | `200 OK` + Array length ≥ 2 | `HTTP 200` (`Count: 2`) | ✅ PASS |
| **BVA-OH-04** | Order Count | High Threshold | ≥ 10 orders | User with 10+ orders (OQ-OH-03 pagination expectation) | `200 OK` + Unpaginated full list | `HTTP 200` + Full array returned | ℹ️ SUT returns unpaginated array |
| **BVA-OH-05** | `Authorization` Header | Min - 1 (Empty Bearer) | 0 characters after `Bearer ` | `Authorization: Bearer ` | `401 Unauthorized` / `403` | `HTTP 403 Forbidden` | ✅ PASS |
| **BVA-OH-06** | `Authorization` Header | Min (1 Char Token) | 1 character after `Bearer ` | `Authorization: Bearer a` | `403 Forbidden` | `HTTP 403 Forbidden` | ✅ PASS |
| **BVA-OH-07** | `Authorization` Header | Nominal JWT | Standard HMAC-SHA256 JWT | `Authorization: Bearer <valid_jwt>` | `200 OK` | `HTTP 200 OK` | ✅ PASS |
| **BVA-OH-08** | `Authorization` Header | Extreme Length | 4096 characters | `Authorization: Bearer <4096 'x's>` | `403 Forbidden` / `431 Header Too Large` | `HTTP 403 Forbidden` | ✅ PASS (Safe rejection, no buffer overflow) |

---

## 3. Boundary Analysis Findings

1. **Clean Lower-Bound Handling:** The endpoint safely returns an empty array `[]` (`HTTP 200`) without throwing null pointer exceptions or returning null objects when zero orders exist.
2. **Robust Header Length Processing:** Extreme 4KB authorization header strings are safely rejected with `403 Forbidden` without crashing Node.js or exposing memory buffers.
3. **Absence of Pagination / Upper Clamping:** The endpoint returns all records in one unpaginated payload regardless of count.

---

## 4. BVA-01 Validation Checklist

- [x] Collection cardinality boundaries (0, 1, nominal, high volume) identified and tested
- [x] Header string length boundaries (0 chars, 1 char, nominal, 4096 chars) evaluated
- [x] Live SUT execution results recorded with status codes
- [x] Unpaginated collection behavior documented

---

*Artifact owner: AI (Stage 6 — BVA-01, API 2)*  
*→ **HARD STOP — awaiting human review and approval before Stage 7 (ST-01 — State Transition Analysis for API 2).***
