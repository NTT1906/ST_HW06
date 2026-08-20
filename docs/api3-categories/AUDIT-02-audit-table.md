# AUDIT-02 — Test Case Audit Table: Product Categories (FR-14)

**Skill:** AUDIT-02  
**Stage:** 11  
**API:** API 3 — FR-14 Product Categories  
**Endpoints:** `GET /api/categories`, `POST /api/categories`, `PUT /api/categories/:id`, `DELETE /api/categories/:id`  
**Student ID:** 23127255  
**Date/Time:** 2026-08-20T13:52 +07:00  
**Artifact Owner:** 👤 **HUMAN (Student)**  
**Authority:** `WORKFLOW.md` Stage 11, `2026.HW06.API Testing_En.md` §6.2  

---

## 1. Audit Summary Statistics

| Metric | Count | Percentage |
|---|---|---|
| **Total AI Candidates Audited** | **38** | 100% |
| **VALID Cases** | **34** | 89.5% |
| **INVALID Cases** | **0** | 0.0% |
| **INCOMPLETE Cases** | **4** | 10.5% |

---

## 2. Complete Audit Table (38 Test Cases)

| TC ID | Category | AI Generated Condition | Classification | Human Reasoning | Correction / Action |
|---|---|---|---|---|---|
| **TC-CAT-01** | DT | Standard happy path category catalog browsing | **VALID** | Correct public category-listing happy-path test. The SUT returns `200 OK` with an array. | — |
| **TC-CAT-02** | DT | Standard admin category creation happy path | **VALID** | Correct administrator category-creation test using the documented endpoint and request body. | — |
| **TC-CAT-03** | DT | Accented Vietnamese unicode name support | **VALID** | Valid Unicode category-name test. The API should preserve Vietnamese Unicode text. | — |
| **TC-CAT-04** | DT | Single-character minimal valid category name | **VALID** | Valid minimum practical category-name test using a one-character value. | — |
| **TC-CAT-05** | DT | Enforce Admin role gate on category creation | **VALID** | Correct authorization test. Category creation is intended to be restricted to admins. The SUT's `200` response is a confirmed RBAC defect, not a test-design defect. | Keep expected `403 Forbidden`; record the SUT's `200` as the SEC-03 defect. |
| **TC-CAT-06** | DT | Block unauthenticated category creation | **VALID** | Correct unauthenticated mutation test. API-01 confirms that missing authentication produces `401 Unauthorized`. | — |
| **TC-CAT-07** | DT | Verify required `name` field validation | **INCOMPLETE** | The test idea is valid, but `4xx Bad Request` is not a concrete expected status/body. API-01 establishes the intended validation failure but not one exact error response. | Specify the exact expected HTTP status and error schema after verification. |
| **TC-CAT-08** | DT | Verify non-empty category name validation | **INCOMPLETE** | Empty-name rejection is a valid business-rule test, but the expected result is only `4xx` rather than a concrete response. | Specify the exact expected status/body. |
| **TC-CAT-09** | DT | Verify category name uniqueness invariant | **INCOMPLETE** | Duplicate-name rejection is a valid test because uniqueness is an intended business rule, but `4xx / 409 Conflict` is ambiguous. | Use one concrete expected status/body and record the confirmed duplicate-name defect. |
| **TC-CAT-10** | DT | Standard admin category update | **VALID** | Correct administrator update test with an existing category ID. | — |
| **TC-CAT-11** | DT | Standard admin category deletion | **VALID** | Correct administrator deletion test for an existing category. | — |
| **TC-CAT-12** | DT | Safely ignore unexpected body on GET | **VALID** | Valid robustness test showing that an unexpected GET body does not alter the public category listing. | — |
| **TC-CAT-13** | BVA | Lower-bound empty string rejection | **VALID** | Correct BVA lower boundary: empty string represents the below-minimum boundary for the required non-empty name. | — |
| **TC-CAT-14** | BVA | Minimal 1-character name boundary | **VALID** | Correct minimum valid name boundary using one character. | — |
| **TC-CAT-15** | BVA | 255-character standard DB boundary | **VALID** | Valid 255-character boundary test. The SUT accepts the value. | Do not describe 255 as a formally documented application requirement unless supported by the API specification. |
| **TC-CAT-16** | BVA | Extreme buffer / DoS resilience (10K chars) | **INCOMPLETE** | The extreme-length test is useful, but `4xx / 413` is ambiguous and the API does not establish which status should be returned. | Use a concrete expected result and treat 10,000 characters as robustness testing rather than a documented boundary. |
| **TC-CAT-17** | BVA | Negative numeric path parameter rejection | **VALID** | Valid negative path-ID boundary. A negative category ID cannot identify an existing category and should not update one. | — |
| **TC-CAT-18** | BVA | Zero numeric path parameter rejection | **VALID** | Valid zero-ID boundary. `0` is outside the valid positive category-ID domain. | — |
| **TC-CAT-19** | BVA | Non-existent positive integer path boundary | **VALID** | Valid high non-existent ID test. It verifies that an unknown category cannot be updated as though it existed. | — |
| **TC-CAT-20** | BVA | Verify multi-item catalog collection | **VALID** | Valid collection-cardinality test for a populated category catalog. | — |
| **TC-CAT-21** | ST | Verify new category becomes immediately active | **VALID** | Correct state transition from `NON_EXISTENT` to `ACTIVE` after category creation. | — |
| **TC-CAT-22** | ST | Verify modified name updates catalog snapshot | **VALID** | Correct state transition from `ACTIVE` to `UPDATED`, verified through the public listing. | — |
| **TC-CAT-23** | ST | Verify deleted category disappears from catalog | **VALID** | Correct deletion transition and verification that the deleted category disappears from the catalog. | — |
| **TC-CAT-24** | ST | Prevent repeated deletion on non-existent record | **VALID** | Correct terminal-state test. Repeated deletion of an already deleted category should not report successful deletion. | Keep expected `404`; record the SUT's silent `200` as a defect. |
| **TC-CAT-25** | ST | Prevent updating purged category | **VALID** | Correct dead-state mutation test. A deleted category should not be successfully updated. | Keep expected `404`; record the SUT's `200` as a defect. |
| **TC-CAT-26** | ST | Verify orphan foreign key behavior | **VALID** | Valid data-integrity/state test for deleting a category that has linked products. API-02 confirms the actual orphaned `category_id` behavior. | Keep the test and document the orphaned-reference behavior. |
| **TC-CAT-27** | SEC | Prevent customer role creating categories | **VALID** | Correct RBAC test for preventing regular users from creating categories. | Keep expected `403`; link to SEC-03 defect. |
| **TC-CAT-28** | SEC | Prevent customer role modifying categories | **VALID** | Correct RBAC test for preventing regular users from modifying categories. | Keep expected `403`; link to SEC-03 defect. |
| **TC-CAT-29** | SEC | Prevent customer role deleting categories | **VALID** | Correct RBAC test for preventing regular users from deleting categories. | Keep expected `403`; link to SEC-03 defect. |
| **TC-CAT-30** | SEC | Stored XSS via script tag | **VALID** | Valid stored-XSS security test using a script payload. SEC-01 confirms the payload is stored and reflected unescaped. | Keep and link to SEC-04 finding. |
| **TC-CAT-31** | SEC | Stored XSS via event handler | **VALID** | Valid stored-XSS test using an event-handler payload. This is a distinct XSS vector from the script-tag test. | Keep and link to SEC-04 finding. |
| **TC-CAT-32** | SEC | Parameterized query integrity (SQLi) | **VALID** | Valid SQL-injection test. SEC-01 confirms the payload is handled as a string through parameterized queries. | — |
| **TC-CAT-33** | SEC | Reject forged unsigned tokens (`alg: "none"`) | **VALID** | Valid JWT signature-bypass test using `alg:none`. SEC-01 confirms the forged token is rejected with `403`. | — |
| **TC-CAT-34** | SCHEMA | Validate standard HTTP status and MIME | **VALID** | Correctly validates the documented `200 OK` and JSON Content-Type for the public listing. | — |
| **TC-CAT-35** | SCHEMA | Validate array structure, field types (`id`, `name`) | **VALID** | Correctly validates the root JSON array and required `id`/`name` fields and their types against the Draft-07 schema. | — |
| **TC-CAT-36** | SCHEMA | Ensure no leaked internal properties | **VALID** | Correctly validates `additionalProperties:false` for category objects. | — |
| **TC-CAT-37** | SCHEMA | Validate category creation response shape | **VALID** | Correctly validates the POST success response containing `message` and integer `id`. | — |
| **TC-CAT-38** | SCHEMA | Validate structured error schema | **VALID** | Correctly validates the structured `401 Unauthorized` response for an unauthenticated mutation request. | — |

---

*Artifact owner: 👤 HUMAN (Stage 11 — AUDIT-02, API 3)*  
*Audited: 2026-08-20T13:52 +07:00*
