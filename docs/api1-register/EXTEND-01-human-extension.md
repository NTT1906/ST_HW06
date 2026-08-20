# EXTEND-01 — Human Test Extensions: POST /api/register

**Skill:** EXTEND-01  
**Stage:** 12  
**API:** API 1 — FR-01 Account Registration  
**Endpoint:** `POST /api/register`  
**Student ID:** 23127255  
**Date/Time:** 2026-08-20T12:37 +07:00  
**Artifact Owner:** 👤 **HUMAN (Student)**  
**Authority:** `WORKFLOW.md` Stage 12, `2026.HW06.API Testing_En.md` §6.3  

---

## 1. Overview & Analysis of AI Blind Spots

During the review of the AI-generated test suite ([`AI-GEN-01-candidates.md`](file:///c:/Users/nttis/Downloads/SUT_HW06/docs/api1-register/AI-GEN-01-candidates.md)), several critical testing gaps were identified:

1. **State & Database Invariant Verification:** The AI verified API HTTP responses for duplicate registration, but did not assert that the underlying persistent state (database rows, original account metadata, single account invariant) remained immutable.
2. **Combination Attacks (Duplicate + Mass Assignment):** The AI tested mass assignment in isolation on new registrations, but missed combining mass assignment with duplicate registrations to test whether duplicate attempts could mutate an existing victim account's privileges.
3. **HTTP Protocol vs. JSON Payload Boundaries:** The AI tested `{}` as an empty JSON object, but omitted an actually empty HTTP raw body (0 bytes payload with `application/json` header).
4. **Information Disclosure & Leakage:** The AI noted 500 errors but did not evaluate error responses for internal data leaks (stack traces, SQL statements, filesystem paths).

To address these gaps, 5 genuinely new human-created test cases have been developed.

---

## 2. Human Test Extension Table (5 Test Cases)

| TC ID | Technique | Test Case Summary | Preconditions | Request / Action | Expected Result | Why AI Missed It |
|---|---|---|---|---|---|---|
| **TC-HUM-01** | State / Data Integrity | Original account remains unchanged after duplicate registration attempt | Existing account `extend01@test.com` with password `OriginalPass123!` | Attempt to register `extend01@test.com` again using a different name and password | Registration is rejected because email must be unique. The original account's name, password, and identity remain unchanged. | AI tested duplicate registration rejection, but did not verify that the existing account remains completely unchanged after the rejected attempt. |
| **TC-HUM-02** | State / Database Integrity | Duplicate registration does not create a second account | Existing account `extend02@test.com` | Record the existing user's ID, attempt another registration with the same email, then inspect the resulting account records | Exactly one account exists for `extend02@test.com`. No second user row/account is created. | AI checked the duplicate-registration response/state transition but did not explicitly verify the uniqueness invariant at the database/account level. |
| **TC-HUM-03** | Security / Mass Assignment | Duplicate registration cannot modify the existing user's privileged/system fields | Existing account `extend03@test.com` | Submit a duplicate registration using the existing email plus `role:"admin"`, `id:1`, or other system-controlled fields | Duplicate registration is rejected because the email already exists. The existing account's system/privilege fields remain unchanged. | AI tested mass assignment during new-user registration, but did not combine it with the duplicate-email/account-integrity condition. |
| **TC-HUM-04** | Input Handling | Empty HTTP request body does not create an account | No account associated with the test data | Send `POST /api/register` with `Content-Type: application/json` and an actually empty request body (0 bytes) | Request is rejected and no account is created. | AI tested `{}` as a JSON object, but did not distinguish an empty HTTP body from an empty JSON object. |
| **TC-HUM-05** | Security / Error Handling | Malformed registration request does not disclose internal implementation details | SUT available | Send malformed JSON to `POST /api/register` | Request fails without exposing stack traces, SQL statements, filesystem paths, or other internal implementation details. | AI tested malformed/non-JSON input, but did not explicitly inspect the error response for internal information disclosure. |

---

## 3. Final Combined Test Suite Composition for API 1

| Component | Test Case Count | Source |
|---|---|---|
| **Audited AI Test Cases** | **38** (26 VALID, 12 INVALID/Defect-detecting) | `AUDIT-02-audit-table.md` |
| **Human Extension Test Cases** | **5** (TC-HUM-01 to TC-HUM-05) | `EXTEND-01-human-extension.md` |
| **TOTAL FINAL TEST SUITE** | **43 Test Cases** | Ready for Postman Collection (`POSTMAN-01`) |

---

*Artifact owner: 👤 HUMAN (Stage 12 — EXTEND-01, API 1)*  
*Completed: 2026-08-20T12:37 +07:00*
