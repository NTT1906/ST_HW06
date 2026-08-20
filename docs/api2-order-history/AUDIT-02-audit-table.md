# AUDIT-02 — Test Case Audit Table: GET /api/orders/my-orders

**Skill:** AUDIT-02  
**Stage:** 11  
**API:** API 2 — FR-11 Order History View (User)  
**Endpoint:** `GET /api/orders/my-orders`  
**Student ID:** 23127255  
**Date/Time:** 2026-08-20T12:55 +07:00  
**Artifact Owner:** 👤 **HUMAN (Student)**  
**Authority:** `WORKFLOW.md` Stage 11, `2026.HW06.API Testing_En.md` §6.2  

---

## 1. Audit Summary Statistics

| Metric | Count | Percentage |
|---|---|---|
| **Total AI Candidates Audited** | **38** | 100% |
| **VALID Cases** | **33** | 86.8% |
| **INVALID Cases** | **2** | 5.3% |
| **INCOMPLETE Cases** | **3** | 7.9% |

---

## 2. Complete Audit Table (38 Test Cases)

| TC ID | Category | AI Generated Condition | Classification | Human Reasoning | Correction / Action |
|---|---|---|---|---|---|
| **TC-ORD-01** | DT | Standard happy path for customer with order history | **VALID** | Correct happy-path test for an authenticated user with existing orders. The endpoint returns the user's orders. | — |
| **TC-ORD-02** | DT | Clean empty collection return when user has no orders | **VALID** | Correctly tests the documented empty-history condition. A user with no orders should receive `200 OK` with `[]`. | — |
| **TC-ORD-03** | DT | Admin personal history does not leak system orders | **VALID** | Correctly verifies that an authenticated admin account only receives orders associated with its own account rather than system-wide orders. | — |
| **TC-ORD-04** | DT | Verify authentication requirement | **VALID** | Correctly tests the authentication gate when the Authorization header is missing. | — |
| **TC-ORD-05** | DT | Rejection of tampered/forged JWT | **VALID** | Correctly tests rejection of an invalid/tampered JWT. The SUT verifies JWT validity and returns `403 Forbidden`. | — |
| **TC-ORD-06** | DT | Rejection of empty Bearer token value | **INCOMPLETE** | The expected result is ambiguous because it states `401 / 403` instead of one concrete expected result. The live SUT evidence shows `403 Forbidden` for an empty Bearer token. | Change the expected result to `403 Forbidden` with the verified error body. |
| **TC-ORD-07** | DT | Reject non-Bearer authentication schemes | **VALID** | Correctly tests rejection of a non-Bearer authentication scheme. | — |
| **TC-ORD-08** | DT | Reject non-standard authorization format | **INCOMPLETE** | The expected result is ambiguous (`401 / 403`) instead of a concrete assertion. | Use the verified SUT result and specify the exact expected status/body (`403 Forbidden`). |
| **TC-ORD-09** | DT | Query parameter filtering robustness | **INVALID** | The test treats `?status=pending` as a filtering feature, but no query parameters are documented for this endpoint. The SUT safely ignores/passes through the query rather than implementing a documented status filter. | Change this into an explicit query-parameter robustness test, asserting that unsupported query parameters do not alter the user's complete history. |
| **TC-ORD-10** | DT | SQL injection resilience in query parameters | **VALID** | Valid SQL-injection robustness test. The security evidence confirms safe parameterized handling and no SQL leakage. | — |
| **TC-ORD-11** | DT | Unexpected payload on GET is safely ignored | **VALID** | Valid test of GET behavior with an unexpected request body. The API documentation states the endpoint is a GET with no body, and the SUT safely ignores the body. | — |
| **TC-ORD-12** | DT | Routing restriction on non-GET methods (POST) | **VALID** | Correctly verifies that unsupported HTTP methods are not routed to the GET endpoint. | — |
| **TC-ORD-13** | BVA | Lower-bound collection response (0 orders) | **VALID** | Correct lower-bound collection test with zero orders. The SUT returns `200 OK` and `[]`. | — |
| **TC-ORD-14** | BVA | Single item array boundary (1 order) | **VALID** | Correct boundary test for exactly one order. | — |
| **TC-ORD-15** | BVA | Standard multiple order history list (2–5 orders) | **VALID** | Correct nominal multiple-order dataset test. | — |
| **TC-ORD-16** | BVA | High-volume dataset boundary (10+ orders) | **VALID** | Correct high-volume test. The BVA evidence confirms that 10+ orders are returned in one unpaginated response. | — |
| **TC-ORD-17** | BVA | Empty Bearer token boundary check | **INCOMPLETE** | The empty Bearer-token boundary is valid, but the AI expected `403` without explicitly matching the observed distinction between malformed/empty authentication cases. | Use the verified `403 Forbidden` result and exact error body. |
| **TC-ORD-18** | BVA | Single-character token boundary check | **VALID** | Correct one-character invalid-token boundary. The SUT safely rejects the token with `403 Forbidden`. | — |
| **TC-ORD-19** | BVA | Standard JWT header length | **VALID** | Correct nominal valid-JWT boundary. The SUT accepts a normal valid JWT and returns `200 OK`. | — |
| **TC-ORD-20** | BVA | Header buffer overflow & DoS resilience (4KB) | **VALID** | Valid extreme authorization-header robustness test. The SUT safely rejects the 4096-character value with `403` without crashing. | — |
| **TC-ORD-21** | ST | Verify new checkout appears immediately as pending | **VALID** | Correctly verifies that a newly created checkout order appears in order history as `pending`. | — |
| **TC-ORD-22** | ST | Verify admin confirmation updates customer history | **VALID** | Correctly verifies the `pending → confirmed` state transition as reflected by the order-history endpoint. | — |
| **TC-ORD-23** | ST | Verify shipping dispatch updates customer history | **VALID** | Correctly verifies the `confirmed → shipping` lifecycle transition in the customer's history. | — |
| **TC-ORD-24** | ST | Verify delivery completion updates customer history | **VALID** | Correctly verifies the `shipping → delivered` terminal transition. | — |
| **TC-ORD-25** | ST | Verify customer cancellation updates customer history | **VALID** | Correctly verifies the customer's `pending → canceled` transition. | — |
| **TC-ORD-26** | ST | Ensure terminal orders do not regress or alter | **VALID** | Valid terminal-state stability test. Delivered/canceled orders should not regress to another state. | — |
| **TC-ORD-27** | SEC | Protect private customer purchase history | **VALID** | Correct authentication-security test for unauthenticated access. | — |
| **TC-ORD-28** | SEC | Prevent forged token bypass vulnerabilities (`alg: "none"`) | **VALID** | Correct JWT `"alg":"none"` bypass test. The security evidence confirms the forged token is rejected. | — |
| **TC-ORD-29** | SEC | Strict privacy & horizontal isolation across customers (IDOR) | **VALID** | Correct horizontal-access-control/IDOR test. The response must contain only orders belonging to the authenticated user. | — |
| **TC-ORD-30** | SEC | Prevent overriding token identity via URL query string | **VALID** | Correct test that attacker-controlled `user_id`/`id` query parameters cannot override the authenticated user's identity. | — |
| **TC-ORD-31** | SEC | Parameterized SQL query integrity check | **VALID** | Correct SQL-injection security test. Existing SEC evidence confirms parameterized handling. | — |
| **TC-ORD-32** | SEC | Ensure customer credentials are not leaked in order data | **VALID** | Correct credential-exposure test. Order objects should not contain passwords, hashes, or authentication secrets. | — |
| **TC-ORD-33** | SEC | Stored XSS in `shipping_address` | **INVALID** | The case describes "Stored XSS Sanitization" and expects the address to be a "clean JSON string." A JSON API returning `<script>` as a JSON string is not the same as sanitizing the value. The SEC artifact explicitly notes that the JSON API is safe as data and that frontend rendering must avoid unsafe HTML insertion. | Change the assertion to verify that the API returns the value as inert JSON data and does not execute it. Do not require API-side sanitization unless documented. |
| **TC-ORD-34** | SCHEMA | Validate standard HTTP status and MIME type | **VALID** | Correctly validates HTTP status and JSON Content-Type for the success response. | — |
| **TC-ORD-35** | SCHEMA | Validate array structure, required fields, and types | **VALID** | Correctly validates the root array and the Draft-07 order-object schema, including required fields and types. | — |
| **TC-ORD-36** | SCHEMA | Validate empty array representation | **VALID** | Correctly validates that zero orders are represented by an empty JSON array rather than `null` or another structure. | — |
| **TC-ORD-37** | SCHEMA | Ensure no unexpected internal properties are leaked | **VALID** | Correctly verifies `additionalProperties: false` and checks that order objects contain only the documented six fields. | — |
| **TC-ORD-38** | SCHEMA | Validate structured JSON error schema for unauthenticated calls | **VALID** | Correctly validates the structured `401 Unauthorized` error response for a missing token. | — |

---

*Artifact owner: 👤 HUMAN (Stage 11 — AUDIT-02, API 2)*  
*Audited: 2026-08-20T12:55 +07:00*
