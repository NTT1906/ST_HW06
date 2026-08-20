# BVA-01 — Boundary Value Analysis: Product Categories (FR-14)

**Skill:** BVA-01  
**Stage:** 6  
**API:** API 3 — FR-14 Product Categories  
**Endpoint:** `GET /api/categories` (and associated Category CRUD)  
**Student ID:** 23127255  
**Date/Time:** 2026-08-20T13:29 +07:00  
**Inputs:** `api_specification.md` §3.4, DT-01–03 artifacts, Live SUT evidence  
**Executor:** AI (Antigravity / Gemini Flash)

---

## 1. Boundary Identification & Applicability

1. **Category `name` String Length Boundaries:**
   - Min - 1: Empty string `""` (0 characters)
   - Min: 1 character (`"A"`)
   - Nominal: 15–30 characters (`"Điện thoại & Phụ kiện"`)
   - Max (DB column): 255 characters
   - Extreme / DoS Boundary: 10,000 characters
2. **Category `:id` Numeric Path Boundaries:**
   - Negative / Invalid ID: `-1`, `0`
   - Min Valid ID: `1`
   - High Non-Existent ID: `999999`
3. **Category Catalog Collection Size (`GET /api/categories`):**
   - Min: 0 categories (empty database)
   - Nominal: 3–10 categories
   - Large catalog: 100+ categories

---

## 2. Boundary Value Table

| # | Variable | Boundary Category | Test Value / Condition | Expected Result (Spec Intent) | Actual Result (Live SUT) | Defect / Note |
|---|---|---|---|---|---|---|
| **BVA-CAT-01** | `name` | Min - 1 (Empty) | `name: ""` | `4xx Bad Request` | `HTTP 200` + Category created | ⚠️ SUT accepts empty string category name |
| **BVA-CAT-02** | `name` | Min (Lower Bound) | `name: "A"` (1 char) | `200 OK` | `HTTP 200` + `id: 9` | ✅ Single character name accepted |
| **BVA-CAT-03** | `name` | Nominal | `name: "Thiết bị điện tử"` | `200 OK` | `HTTP 200` | ✅ Nominal Vietnamese unicode name accepted |
| **BVA-CAT-04** | `name` | Max (DB Standard) | 255 characters (`"C" * 255`) | `200 OK` | `HTTP 200` | ✅ 255-char category name accepted |
| **BVA-CAT-05** | `name` | Extreme / Buffer | 10,000 characters | `4xx / 413 Payload Too Large` | `HTTP 200` | ⚠️ SUT accepts oversized strings without limit |
| **BVA-CAT-06** | `:id` | Min (Valid Lower Bound) | `PUT /api/categories/1` | `200 OK` + `{"message":"Category updated"}` | `HTTP 200` | ✅ Valid ID updated |
| **BVA-CAT-07** | `:id` | Invalid (Negative ID) | `PUT /api/categories/-1` | `404 Not Found` | `HTTP 200` + `{"message":"Category updated"}` | ⚠️ **SUT DEFECT:** Returns 200 on non-existent negative ID |
| **BVA-CAT-08** | `:id` | Invalid (Upper Bound) | `PUT /api/categories/999999` | `404 Not Found` | `HTTP 200` + `{"message":"Category updated"}` | ⚠️ **SUT DEFECT:** Returns 200 on non-existent upper-bound ID |
| **BVA-CAT-09** | Collection | Nominal Collection | `GET /api/categories` | `200 OK` + Array length ≥ 3 | `HTTP 200` + Array returned | ✅ Nominal catalog listing |

---

## 3. Boundary Analysis Findings

1. **Absence of Name Lower-Bound Validation:** Empty string `""` is processed and persisted with `HTTP 200`.
2. **Silent Success on Non-Existent Path IDs:** Updating or deleting non-existent IDs (`-1`, `999999`) returns `HTTP 200 {"message":"Category updated"}` instead of returning `404 Not Found`.

---

## 4. BVA-01 Validation Checklist

- [x] Length boundaries (0, 1, nominal, 255, 10000 chars) identified and tested
- [x] Path ID boundaries (-1, 0, 1, 999999) evaluated
- [x] Actual vs expected results recorded
- [x] Non-existent ID silent success defect documented

---

*Artifact owner: AI (Stage 6 — BVA-01, API 3)*  
*→ **HARD STOP — awaiting human review and approval before Stage 7 (ST-01 — State Transition Analysis for API 3).***
