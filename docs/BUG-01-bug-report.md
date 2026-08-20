# BUG-01 — Master Bug & Defect Report Table

**Skill:** BUG-01  
**Stage:** 16  
**Assignment:** HW06 — AI-Assisted Backend API Testing  
**Student ID:** 23127255  
**Report Date:** 2026-08-20T13:58 +07:00  
**Authority:** `WORKFLOW.md` Stage 16, `SKILLS.md` BUG-01, `2026.HW06.API Testing_En.md` §6.5  
**Executor:** AI (Antigravity / Gemini Flash)

---

## 1. Defect Classification & Severity Criteria

- **Critical:** Security vulnerabilities that permit unauthorized administrative actions, plaintext password disclosure, or broken authentication/authorization gates.
- **High:** Significant data integrity or functional corruption issues (e.g. Stored XSS in public catalog, duplicate user registration causing permanent account shadowing lockout).
- **Medium:** Validation omissions resulting in ghost database records or unhandled exception stack traces leaking server paths.
- **Low:** Inappropriate HTTP response codes for non-existent entities (e.g. returning HTTP 200 silent update instead of 404 Not Found).

---

## 2. Master Bug Report Table (8 Discovered Defec| Bug ID | Component / API | Defect Title | Severity | Security Mapping | GitHub Issue Link | Expected Result | Actual Result | Root Cause Analysis | Remediation Recommendation |
|---|---|---|---|---|---|---|---|---|---|
| **BUG-01** | API 1 (`POST /api/register` & `POST /api/login`) | Plaintext Password Storage and Credential Disclosure | **Critical** | **SEC-01** | [#1](https://github.com/NTT1906/ST_HW06/issues/1) | Login response should return JWT and user profile omitting password field. | `POST /api/login` response returns `user.password: "Secret123!"` in plaintext. | Password is saved as raw text without bcrypt hashing and queried directly (`SELECT *`) into the response. | Hash passwords using `bcrypt.hash(password, 10)` before storing; strip `password` property from API responses. |
| **BUG-02** | API 1 (`POST /api/register`) | Ghost User Record Creation on Empty/Missing Payload | **Medium** | Input Validation | [#2](https://github.com/NTT1906/ST_HW06/issues/2) | SUT should return `400 Bad Request` with structured validation error. | SUT returns `HTTP 200 OK` and creates a ghost user record with `null` fields in SQLite. | Controller lacks request body validation schema (e.g. Joi/Zod) before executing `INSERT INTO users`. | Add request body schema validation middleware requiring `name`, `email`, and `password`. |
| **BUG-03** | API 1 (`POST /api/register`) | Unhandled Exception Stack Trace & Server Path Disclosure | **Medium** | Information Disclosure | [#3](https://github.com/NTT1906/ST_HW06/issues/3) | SUT should return structured JSON error (`400`/`415`). | SUT crashes returning `HTTP 500` HTML page exposing local server filesystem paths (`/mnt/c/...`). | Missing global Express error handling middleware for non-JSON payloads. | Implement central Express error handler `app.use((err, req, res, next) => res.status(400).json({ error: err.message }))`. |
| **BUG-04** | API 1 (`POST /api/register`) | Duplicate Email Registration Allowing Account Shadowing Lockout | **High** | Data Integrity | [#4](https://github.com/NTT1906/ST_HW06/issues/4) | Registration of duplicate email must be rejected with `400/409 Conflict`. | SUT returns `HTTP 200` creating duplicate row. Login query (`SELECT * WHERE email=?`) only matches first row, locking out User B. | `users.email` column lacks `UNIQUE` constraint in SQLite database schema. | Add `UNIQUE` constraint on `users(email)` and check existence prior to insertion. |
| **BUG-05** | API 3 (`POST /api/categories`, `PUT`, `DELETE`) | Broken Role-Based Access Control on Category Management | **Critical** | **SEC-03** | [#5](https://github.com/NTT1906/ST_HW06/issues/5) | SUT should return `403 Forbidden` (`{"error": "Forbidden"}`). | SUT returns `HTTP 200 OK` and creates/updates/deletes category. | Auth middleware only checks `jwt.verify(token)` without verifying `decoded.role === 'admin'`. | Add role-authorization middleware: `if (req.user.role !== 'admin') return res.status(403).json({ error: 'Forbidden' });`. |
| **BUG-06** | API 3 (`POST /api/categories`) | Stored Cross-Site Scripting (XSS) in Public Catalog Category Name | **High** | **SEC-04** | [#8](https://github.com/NTT1906/ST_HW06/issues/8) | SUT should sanitize/HTML-encode input before storing or rendering. | Payload stored verbatim and returned unescaped in public `GET /api/categories` JSON. | No input sanitization or output escaping on category names. | Sanitize input using `DOMPurify` / `xss` library and encode HTML entities on output. |
| **BUG-07** | API 3 (`POST /api/categories`) | Ghost Category Record Creation on Empty `{}` Payload | **Medium** | Input Validation | [#6](https://github.com/NTT1906/ST_HW06/issues/6) | SUT should reject with `400 Bad Request`. | SUT returns `HTTP 200 OK` and creates category with `name: null`. | Missing check for presence of `name` field in category creation controller. | Enforce `if (!req.body.name || typeof req.body.name !== 'string') return res.status(400).json({ error: 'Name is required' });`. |
| **BUG-08** | API 3 (`PUT /api/categories/:id`, `DELETE`) | Silent Success (HTTP 200) on Non-Existent Entity Modification | **Low** | REST Contract | [#7](https://github.com/NTT1906/ST_HW06/issues/7) | SUT should return `404 Not Found`. | SUT returns `HTTP 200 OK {"message":"Category updated"}`. | SUT executes SQL statement without inspecting `result.changes === 0`. | Check `if (this.changes === 0) return res.status(404).json({ error: 'Category not found' });`. |;`. |

---

## 3. Bug Summary by Severity & Security Mapping

| Severity | Count | Bug IDs |
|---|---|---|
| **Critical** | 2 | BUG-01 (SEC-01 Plaintext Password), BUG-05 (SEC-03 Broken RBAC) |
| **High** | 2 | BUG-04 (Account Shadowing / Duplicate Email), BUG-06 (SEC-04 Stored XSS) |
| **Medium** | 3 | BUG-02 (Ghost User Record), BUG-03 (Stack Trace Leak), BUG-07 (Ghost Category Record) |
| **Low** | 1 | BUG-08 (Silent 200 on Non-Existent ID) |
| **TOTAL** | **8 Defects** | Fully documented with root-cause analysis and remediation code |

---

*Artifact owner: AI (Stage 16 — BUG-01)*  
*→ **HARD STOP — awaiting human review and approval before Stage 17 (CICD-01 — GitHub Actions Workflow).***
