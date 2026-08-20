# EXTEND-01 — Human Test Extensions: GET /api/orders/my-orders

**Skill:** EXTEND-01  
**Stage:** 12  
**API:** API 2 — FR-11 Order History View (User)  
**Endpoint:** `GET /api/orders/my-orders`  
**Student ID:** 23127255  
**Date/Time:** 2026-08-20T12:55 +07:00  
**Artifact Owner:** 👤 **HUMAN (Student)**  
**Authority:** `WORKFLOW.md` Stage 12, `2026.HW06.API Testing_En.md` §6.3  

---

## 1. Overview & Analysis of AI Blind Spots for API 2

Review of the AI candidate suite for `GET /api/orders/my-orders` identified several important testing dimensions missed by the AI:

1. **Chronological Ordering Invariants:** The AI validated array presence and schema types, but did not assert that orders are sorted chronologically in descending order (`created_at` newest first).
2. **Result Set Uniqueness / Duplication Invariants:** The AI verified array count but omitted assertions that each returned order ID is unique with no duplicate rows.
3. **Data Disambiguation Under Identical Attributes:** The AI checked IDOR isolation generally, but missed testing cross-user isolation when multiple users place identical-looking orders (same product price, same status, same address string).
4. **Identity & Creation Timestamp Immutability Across State Transitions:** The AI tested state progression (`pending → confirmed → shipping`) but did not verify that an order's immutable fields (`id`, `created_at`) remain invariant through lifecycle updates.
5. **Financial / Semantic Total Amount Consistency:** The AI validated only that `total_amount` is a number; it did not assert semantic consistency between the checkout transaction amount and the amount rendered in history.

To resolve these blind spots, 5 human-created test cases have been developed.

---

## 2. Human Test Extension Table (5 Test Cases)

| TC ID | Technique | Scenario | Preconditions | Action | Expected Result | Why AI Missed It |
|---|---|---|---|---|---|---|
| **TC-HUM-ORD-01** | Domain / Ordering | Verify chronological ordering of the complete history | User has at least 3 orders created at clearly different timestamps | Send `GET /api/orders/my-orders` with a valid JWT | Orders are returned in the documented/resolved newest-first order (`created_at` descending) | The AI tested order existence and cardinality but did not create a dedicated assertion for the ordering of the returned collection. |
| **TC-HUM-ORD-02** | Domain / Data Integrity | Verify no order is duplicated in the returned history | User has multiple orders with different IDs | Send `GET /api/orders/my-orders` and collect every returned `id` | Every order ID appears at most once; the response contains no duplicate order records | The AI checked array size and schema but did not explicitly verify uniqueness of individual order records. |
| **TC-HUM-ORD-03** | Domain / Data Integrity | Verify returned orders belong exclusively to the authenticated user even when multiple users have identical order attributes | User A and User B each have orders with the same status, amount, and similar address | Authenticate as User A and request `/my-orders` | Every returned `user_id` equals User A's ID; identical-looking orders belonging to User B are not included | The AI's IDOR case checks cross-user isolation, but this human case specifically targets accidental record selection based on non-unique business fields rather than identity. |
| **TC-HUM-ORD-04** | State / Consistency | Verify an order's immutable identity and creation timestamp remain unchanged after lifecycle transitions | One order progresses through at least two states | Record `id` and `created_at`, transition the order, then request `/my-orders` | The same order keeps the same `id` and original `created_at`; only lifecycle-dependent fields such as `status` change | The AI tested status transitions but did not assert preservation of immutable order identity/data across those transitions. |
| **TC-HUM-ORD-05** | Schema / Data Integrity | Verify `total_amount` returned by order history matches the amount originally recorded for the order | User has an order with a known checkout total | Record checkout total, then call `/api/orders/my-orders` | The corresponding history entry contains the same `total_amount`; the GET operation does not recalculate or alter the financial amount | The AI validated only that `total_amount` has the correct JSON type and is non-negative; it did not verify semantic consistency with the original transaction. |

---

## 3. Final Combined Test Suite Composition for API 2

| Component | Test Case Count | Source |
|---|---|---|
| **Audited AI Test Cases** | **38** (33 VALID, 2 INVALID/corrected, 3 INCOMPLETE/corrected) | `AUDIT-02-audit-table.md` |
| **Human Extension Test Cases** | **5** (`TC-HUM-ORD-01` to `TC-HUM-ORD-05`) | `EXTEND-01-human-extension.md` |
| **TOTAL FINAL TEST SUITE (API 2)** | **43 Test Cases** | Ready for Postman Collection (`POSTMAN-01`) |

---

*Artifact owner: 👤 HUMAN (Stage 12 — EXTEND-01, API 2)*  
*Completed: 2026-08-20T12:55 +07:00*
