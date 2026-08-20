# AUDIT-02 — Test Case Audit Table: POST /api/register

**Skill:** AUDIT-02  
**Stage:** 11  
**API:** API 1 — FR-01 Account Registration  
**Endpoint:** `POST /api/register`  
**Student ID:** 23127255  
**Date/Time:** 2026-08-20T12:34 +07:00  
**Artifact Owner:** 👤 **HUMAN (Student)**  
**Authority:** `WORKFLOW.md` Stage 11, `2026.HW06.API Testing_En.md` §6.2  

---

## 1. Audit Summary Statistics

| Metric | Count | Percentage |
|---|---|---|
| **Total AI Candidates Audited** | **38** | 100% |
| **VALID Cases** | **26** | 68.4% |
| **INVALID Cases** | **12** | 31.6% |
| **INCOMPLETE Cases** | **0** | 0.0% |

---

## 2. Complete Audit Table (38 Test Cases)

| TC ID | Category | AI Generated Condition | Classification | Human Reasoning | Correction / Action |
|---|---|---|---|---|---|
| **TC-REG-01** | DT | Standard happy path registration | **VALID** | Correct happy-path registration using the correct endpoint, JSON body, and documented 200 response. | — |
| **TC-REG-02** | DT | Duplicate email registration | **VALID** | Correctly tests the confirmed duplicate-email business rule. The SUT's failure does not make the test invalid. | Keep expected duplicate rejection; record actual duplicate creation as the confirmed bug. |
| **TC-REG-03** | DT | Invalid email: missing `@` symbol | **INVALID** | Assumes malformed email must return 4xx, but no email-format validation is documented or enforced. | Correct expected behavior to the verified SUT result and record missing email validation as a defect. |
| **TC-REG-04** | DT | Invalid email: missing local part (`@domain.com`) | **INVALID** | Assumes `@domain.com` must be rejected with 4xx without application-level validation evidence. | Correct expected result to verified SUT behavior. |
| **TC-REG-05** | DT | Invalid email: missing domain (`user@`) | **INVALID** | Assumes `user@` must be rejected with 4xx without application-level validation evidence. | Correct expected result to verified SUT behavior. |
| **TC-REG-06** | DT | Invalid email: whitespace in email | **INVALID** | Assumes whitespace in email must be rejected, but no such validation is documented or enforced. | Correct expected result to verified SUT behavior. |
| **TC-REG-07** | DT | Missing `name` field in JSON body | **INVALID** | Assumes `name` is required, but the SUT accepts registration when `name` is absent. | Correct expected result to verified SUT behavior and record missing-field validation as a defect. |
| **TC-REG-08** | DT | Missing `email` field in JSON body | **INVALID** | Assumes `email` is required, but the SUT accepts registration when `email` is absent. | Correct expected result to verified SUT behavior. |
| **TC-REG-09** | DT | Missing `password` field in JSON body | **INVALID** | Assumes `password` is required, but the SUT accepts registration when `password` is absent. | Correct expected result to verified SUT behavior. |
| **TC-REG-10** | DT | Empty JSON body `{}` | **INVALID** | Assumes `{}` must return 4xx, but the SUT returns 200 and creates a record. | Correct expected result to actual SUT behavior and record the ghost-record defect. |
| **TC-REG-11** | DT | Accented Unicode Vietnamese name | **VALID** | Valid Unicode-name domain test with a supported successful-registration expectation. | — |
| **TC-REG-12** | DT | Complex subdomain hierarchy in email | **VALID** | Valid subdomain-email test without an unsupported rejection rule. | — |
| **TC-REG-13** | BVA | Empty string for `name` (`""`) | **INVALID** | Treats empty `name` as a BVA boundary requiring 4xx, but no minimum length is documented or enforced. | Treat as robustness/negative testing and use verified SUT behavior. |
| **TC-REG-14** | BVA | Single character `name` (`"A"`) | **VALID** | One-character `name` is a valid executable input and was accepted by the SUT. | — |
| **TC-REG-15** | BVA | 255-character string for `name` | **VALID** | 255-character `name` was tested and accepted. Useful as a robustness boundary, but not an official application maximum. | Remove any claim that 255 is a documented application constraint. |
| **TC-REG-16** | BVA | Minimal valid email (`a@b.com`) | **VALID** | `a@b.com` is a valid concrete email test and was accepted. | — |
| **TC-REG-17** | BVA | 1-character TLD (`user@domain.c`) | **INVALID** | Assumes a one-character TLD is invalid and must return 4xx. This is not an enforced application rule. | Treat as exploratory email-format testing and use actual SUT behavior. |
| **TC-REG-18** | BVA | 2-character TLD (`user@domain.co`) | **VALID** | Valid two-character TLD test; SUT accepted it. | — |
| **TC-REG-19** | BVA | Empty string for `password` (`""`) | **INVALID** | Assumes empty password must return 4xx, but the SUT accepts an empty password. | Correct expected result to observed behavior and record missing password validation. |
| **TC-REG-20** | BVA | 1-character `password` (`"a"`) | **INVALID** | Assumes one-character password must fail due to complexity, but no password minimum/complexity is enforced. | Correct expected result to observed behavior. |
| **TC-REG-21** | ST | Entity creation (`NON_EXISTENT` → `ACTIVE_REGISTERED`) | **VALID** | Correct state-creation test: `NON_EXISTENT → ACTIVE_REGISTERED`. | — |
| **TC-REG-22** | ST | Downstream state verification via Login | **VALID** | Correct downstream state verification: registration followed by successful login. | — |
| **TC-REG-23** | ST | Duplicate registration rejection & account integrity | **VALID** | Correctly tests duplicate re-registration rejection and account-state integrity. The confirmed SUT failure does not invalidate the test. | Keep expected rejection and record actual duplicate-row creation as the confirmed bug. |
| **TC-REG-24** | ST | Account integrity / shadowing prevention | **VALID** | Correctly verifies original-account integrity after duplicate registration. The observed login failure demonstrates the account-shadowing defect. | Keep the test and document the actual shadowing behavior. |
| **TC-REG-25** | ST | Ghost-record prevention on failed payload | **VALID** | Correctly tests that invalid registration should not create a user state. The SUT failure is the defect being detected. | Keep expected `4xx + no DB row`; record actual ghost-record creation. |
| **TC-REG-26** | SEC | Plaintext password storage prohibition (**SEC-01**) | **VALID** | Valid security test for plaintext password storage/exposure. Existing SEC evidence confirms plaintext password exposure. | Keep and link to SEC-01 finding. |
| **TC-REG-27** | SEC | Credential exposure prevention in responses (**SEC-01**) | **VALID** | Valid downstream credential-disclosure test checking that login does not expose the password. | Keep and record actual plaintext exposure as the security defect. |
| **TC-REG-28** | SEC | Stored XSS prevention via `<script>` (**SEC-04**) | **VALID** | Valid stored-XSS security test. SEC evidence confirms the payload is persisted/returned unescaped. | Keep and link to SEC-04 finding. |
| **TC-REG-29** | SEC | Stored XSS prevention via event handler (**SEC-04**) | **VALID** | Valid stored-XSS test using an event-handler payload. | Keep and link to SEC-04 finding. |
| **TC-REG-30** | SEC | SQL Injection parameterized query verification (**SEC-05**) | **VALID** | Valid SQL-injection security test. Existing SEC evidence confirms parameterized handling. | — |
| **TC-REG-31** | SEC | Mass Assignment / Role Escalation (**SEC-06**) | **VALID** | Valid mass-assignment/role-escalation test. Evidence confirms `role:"admin"` is ignored and the user remains `role=user`. | — |
| **TC-REG-32** | SEC | System property injection (`id`, `locked_until`) (**SEC-06**) | **VALID** | Valid system-field injection test. Evidence confirms injected `id` and `locked_until` are ignored. | — |
| **TC-REG-33** | SCHEMA | Standard HTTP 200 status code | **VALID** | Correctly tests documented HTTP 200 success status. | — |
| **TC-REG-34** | SCHEMA | `Content-Type: application/json` MIME type | **VALID** | Correctly tests documented JSON Content-Type. | — |
| **TC-REG-35** | SCHEMA | Draft-07 JSON schema compliance (`message`, `id`) | **VALID** | Correctly tests the response object's required fields and types against the Draft-07 schema. | — |
| **TC-REG-36** | SCHEMA | Enum match on `"User registered successfully"` | **VALID** | Correctly tests the exact documented `message` value. | — |
| **TC-REG-37** | SCHEMA | No additional properties (`additionalProperties: false`) | **VALID** | Correctly tests `additionalProperties: false`; observed response contains exactly `message` and `id`. | — |
| **TC-REG-38** | SCHEMA | Structured error response schema | **VALID** | Valid error-schema/error-handling test. The SUT failing by returning HTML/stack trace is the defect being detected, not a reason to invalidate the test. | Keep and record the observed HTML/500 response as the schema/error-handling defect. |

---

## 3. Human Audit Key Takeaways

1. **AI Blind Spot on Unenforced Validations:**  
   The AI assumed standard HTTP 4xx validation errors for missing fields (TC-REG-07–09), empty bodies (TC-REG-10), malformed emails (TC-REG-03–06), and boundary conditions (TC-REG-13, 17, 19, 20). Because `api_specification.md` documents no error behaviors and the SUT enforces none of these checks, these 12 cases were classified as **INVALID** with corrections provided.
2. **Preservation of Defect-Detecting Test Cases:**  
   Critical security (SEC-01 plaintext, SEC-04 XSS), state integrity (duplicate shadowing), and error-handling tests where the SUT currently fails are retained as **VALID** tests because they accurately test the intended business & security rules.

---

*Artifact owner: 👤 HUMAN (Stage 11 — AUDIT-02, API 1)*  
*Audited: 2026-08-20T12:34 +07:00*
