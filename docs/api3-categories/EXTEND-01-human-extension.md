# EXTEND-01 — Human Test Extensions: Product Categories (FR-14)

**Skill:** EXTEND-01  
**Stage:** 12  
**API:** API 3 — FR-14 Product Categories  
**Endpoints:** `GET /api/categories`, `POST /api/categories`, `PUT /api/categories/:id`, `DELETE /api/categories/:id`  
**Student ID:** 23127255  
**Date/Time:** 2026-08-20T13:52 +07:00  
**Artifact Owner:** 👤 **HUMAN (Student)**  
**Authority:** `WORKFLOW.md` Stage 12, `2026.HW06.API Testing_En.md` §6.3  

---

## 1. Overview & Analysis of AI Blind Spots for API 3

Review of the AI candidate suite for Product Categories identified several critical system invariants missed by the AI:

1. **Uniqueness Invariant on Updates:** The AI checked duplicate-name creation (`TC-CAT-09`) but did not test the same uniqueness invariant during a `PUT /api/categories/:id` update operation.
2. **State Rollback on Mutation Failure:** The AI tested successful update transitions, but omitted assertions verifying that a failed or rejected rename preserves the original name and ID unchanged.
3. **Cross-Entity Referential Integrity During Renames:** The AI tested category rename reflection in the catalog, but did not verify that linked products (`category_id`) maintain their relationship to the same category entity without corruption.
4. **Entity Identity Lifecycle Across Delete-and-Recreate Sequences:** The AI tested deletion and duplicate-name creation in isolation, but did not assert that recreating a category with a previously used name creates a fresh ID and never silently reuses the deleted identity.
5. **Persistent State Preservation Under Unauthorized Mutation:** The AI validated the HTTP response codes for regular-user mutation attempts, but did not test the persistent database postcondition that unauthorized requests make zero modifications to the stored catalog data.

To resolve these blind spots, 5 human-created test cases have been developed.

---

## 2. Human Test Extension Table (5 Test Cases)

| TC ID | Technique | Scenario | Preconditions | Action | Expected Result | Why AI Missed It |
|---|---|---|---|---|---|---|
| **TC-HUM-CAT-01** | Domain / Business Rule | Updating a category to an existing category name must preserve name uniqueness | Categories `A` and `B` already exist | `PUT /api/categories/<B_ID>` with `{"name":"A"}` | Update is rejected because category names must be unique; neither existing category is corrupted | AI tested duplicate-name creation (`TC-CAT-09`) but did not test the same uniqueness invariant during category update. |
| **TC-HUM-CAT-02** | State / Data Integrity | Failed category update must leave the original category unchanged | Existing category `A` | Attempt an invalid/duplicate rename, then call `GET /api/categories` | The original category name and ID remain unchanged after the rejected update | AI tested the update transition itself but did not verify rollback/preservation after a failed mutation. |
| **TC-HUM-CAT-03** | State / Referential Integrity | Updating a category name must not change the category identity used by linked products | Category `A` has at least one linked product | Record category ID and linked product's `category_id`; rename the category; query the product | Category keeps the same ID and the product continues referencing that same category ID | AI tested category rename reflection but did not verify preservation of the foreign-key relationship across the update. |
| **TC-HUM-CAT-04** | State / Referential Integrity | Deleting and recreating a category with the same name must create a new category identity | Existing category `A` with ID `X` | Delete category `A`, then create a new category named `A` | The recreated category receives a new ID and does not silently reuse the deleted identity | AI tested deletion and duplicate-name creation separately, but did not test the identity relationship across the delete → recreate sequence. |
| **TC-HUM-CAT-05** | Security / Data Integrity | Unauthorized category mutation must leave the category unchanged | Existing category with known name/ID; regular user token available | Attempt `PUT` or `DELETE` using the regular-user JWT, then call `GET /api/categories` | The unauthorized request must not modify/delete the category; the category remains unchanged | AI tested the RBAC response for POST, PUT, and DELETE, but did not explicitly verify the postcondition that a rejected authorization attempt leaves persistent catalog data unchanged. |

---

## 3. Final Combined Test Suite Composition for API 3

| Component | Test Case Count | Source |
|---|---|---|
| **Audited AI Test Cases** | **38** (34 VALID, 0 INVALID, 4 INCOMPLETE/corrected) | `AUDIT-02-audit-table.md` |
| **Human Extension Test Cases** | **5** (`TC-HUM-CAT-01` to `TC-HUM-CAT-05`) | `EXTEND-01-human-extension.md` |
| **TOTAL FINAL TEST SUITE (API 3)** | **43 Test Cases** | Ready for Postman Collection (`POSTMAN-01`) |

---

*Artifact owner: 👤 HUMAN (Stage 12 — EXTEND-01, API 3)*  
*Completed: 2026-08-20T13:52 +07:00*
