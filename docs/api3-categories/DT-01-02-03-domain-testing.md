# DT-01/02/03 — Domain Testing: Product Categories (FR-14)

**Skills:** DT-01, DT-02, DT-03  
**Stage:** 5  
**API:** API 3 — FR-14 Product Categories  
**Endpoint:** `GET /api/categories` (and associated Category CRUD: `POST`, `PUT`, `DELETE`)  
**Student ID:** 23127255  
**Date/Time:** 2026-08-20T13:28 +07:00  
**Inputs:** `api_specification.md` §3.4, API-01/02 artifacts  
**Executor:** AI (Antigravity / Gemini Flash)

---

# Part 1 — DT-01: Domain Identification

| Variable | Location | Type | Valid Domain | Invalid Domain | Constraints | Dependencies | Evidence |
|---|---|---|---|---|---|---|---|
| **V1: Category `name`** | JSON body (`POST`/`PUT`) | `string` | Non-empty text string, Unicode Vietnamese (`"Điện thoại"`) | Empty string `""`, missing field, duplicate name, extreme buffer | Should be unique (OQ-CAT-01 defect) and non-empty | None | Spec §3.4 & OQ-CAT-01 |
| **V2: Category `:id`** | Path parameter (`PUT`/`DELETE`) | `integer` | Positive integer corresponding to existing category (`id >= 1`) | Non-existent ID (9999), 0, negative integer (`-1`), non-numeric string (`"abc"`) | Primary key in `categories` table | `POST /api/categories` | Spec §3.4 & SQLite DB |
| **V3: `Authorization` Header** | HTTP Header (`POST`/`PUT`/`DELETE`) | `string` | `Bearer <admin_jwt>` | Missing, `Bearer <user_jwt>` (SEC-03 defect), `Bearer <invalid>` | Mutation operations intended strictly for Admin | `POST /api/login` | Spec §3.3/3.4 & SEC-03 |
| **V4: Query Parameters** | URL Query (`GET`) | `string` | None | SQL injection strings | GET endpoint has no documented query parameters | None | Spec §3.4 |
| **V5: HTTP Method** | Request line | `string` | `GET`, `POST`, `PUT`, `DELETE` | `PATCH`, `HEAD` | Standard REST methods | None | Spec §3.4 |

---

# Part 2 — DT-02: Domain Partitioning

### V1 — Category `name`

| Partition | Type | Description | Representative Value | Expected Behavior |
|---|---|---|---|---|
| **CAT-N-V1** | Valid | Standard alphanumeric name | `"Fashion & Apparel"` | `200 OK` + Category created |
| **CAT-N-V2** | Valid | Accented Unicode Vietnamese name | `"Thiết bị gia dụng"` | `200 OK` + Unicode preserved |
| **CAT-N-V3** | Valid | Single character category name | `"X"` | `200 OK` |
| **CAT-N-V4** | Valid | Long nominal name | 50-character string | `200 OK` |
| **CAT-N-IV1** | Invalid (Spec Intent) | Missing `name` field in body (`{}`) | *(Field omitted)* | `4xx Bad Request` (SUT defect: creates null category) |
| **CAT-N-IV2** | Invalid (Spec Intent) | Empty string `""` | `""` | `4xx Bad Request` (SUT defect: accepts empty) |
| **CAT-N-IV3** | Invalid (Spec Intent) | Duplicate category name | `"Điện thoại"` (Existing) | `4xx / 409 Conflict` (SUT defect: allows duplicate) |
| **CAT-N-IV4** | Invalid / Security | Stored XSS payload | `"<script>alert(1)</script>"` | Sanitized / Escaped (SUT defect: stores verbatim) |
| **CAT-N-IV5** | Invalid / Security | SQL injection payload | `"' OR 1=1--"` | Parameterized handling |

### V2 — Category `:id` (Path Parameter)

| Partition | Type | Description | Representative Value | Expected Behavior |
|---|---|---|---|---|
| **CAT-ID-V1** | Valid | Existing Category ID | `1`, `2`, `3` | `200 OK` + Updated/Deleted |
| **CAT-ID-IV1** | Invalid | Non-existent positive integer | `99999` | `404 Not Found` |
| **CAT-ID-IV2** | Invalid | Zero or Negative integer | `0`, `-1` | `4xx / 404` |
| **CAT-ID-IV3** | Invalid | Non-numeric string | `"invalid_id"` | `4xx / 404` |

### V3 — `Authorization` Header (Mutations)

| Partition | Type | Description | Representative Value | Expected Behavior |
|---|---|---|---|---|
| **CAT-AUTH-V1** | Valid | Valid Administrator JWT | `Bearer <admin_token>` | `200 OK` |
| **CAT-AUTH-IV1** | Invalid (SEC-03) | Regular Customer JWT (`role: "user"`) | `Bearer <user_token>` | `403 Forbidden` (SUT defect: allows user) |
| **CAT-AUTH-IV2** | Invalid | Missing token | *(Omitted)* | `401 Unauthorized` |
| **CAT-AUTH-IV3** | Invalid | Tampered / forged token | `Bearer fake.token` | `403 Forbidden` |

---

# Part 3 — DT-03: Domain Test Cases

| TC ID | Operation | Preconditions | Method & Path | Authorization | Body / Payload | Expected Result | Covered Partitions |
|---|---|---|---|---|---|---|---|
| **DT-CAT-01** | Public Listing | Default categories exist | `GET /api/categories` | None | None | `200 OK` + Array of categories | BR-CAT-01 |
| **DT-CAT-02** | Create Category (Admin) | Admin logged in | `POST /api/categories` | `Bearer <admin_jwt>` | `{"name":"Home Appliances"}` | `200 OK` + `id` returned | CAT-N-V1, CAT-AUTH-V1 |
| **DT-CAT-03** | Create Category (Unicode) | Admin logged in | `POST /api/categories` | `Bearer <admin_jwt>` | `{"name":"Thời trang Nam"}` | `200 OK` + Unicode preserved | CAT-N-V2, CAT-AUTH-V1 |
| **DT-CAT-04** | Create Category (Single Char) | Admin logged in | `POST /api/categories` | `Bearer <admin_jwt>` | `{"name":"Z"}` | `200 OK` | CAT-N-V3, CAT-AUTH-V1 |
| **DT-CAT-05** | Create Category (User Role) | User logged in | `POST /api/categories` | `Bearer <user_jwt>` | `{"name":"Hacker Category"}` | `403 Forbidden` (Defect: SUT returns 200) | CAT-AUTH-IV1 (SEC-03) |
| **DT-CAT-06** | Create Category (Unauthenticated) | None | `POST /api/categories` | *(None)* | `{"name":"Anon Cat"}` | `401 Unauthorized` | CAT-AUTH-IV2 |
| **DT-CAT-07** | Create Category (Missing `name`) | Admin logged in | `POST /api/categories` | `Bearer <admin_jwt>` | `{}` | `4xx Bad Request` (Defect: SUT returns 200) | CAT-N-IV1 |
| **DT-CAT-08** | Create Category (Empty `name`) | Admin logged in | `POST /api/categories` | `Bearer <admin_jwt>` | `{"name":""}` | `4xx Bad Request` (Defect: SUT returns 200) | CAT-N-IV2 |
| **DT-CAT-09** | Create Duplicate Category Name | Admin logged in | `POST /api/categories` | `Bearer <admin_jwt>` | `{"name":"Điện thoại"}` | `4xx / 409 Conflict` (Defect: SUT returns 200) | CAT-N-IV3 (OQ-CAT-01) |
| **DT-CAT-10** | Update Category (Admin) | Category exists | `PUT /api/categories/1` | `Bearer <admin_jwt>` | `{"name":"Điện thoại Cao Cấp"}` | `200 OK` + `{"message":"Category updated"}` | CAT-ID-V1, CAT-AUTH-V1 |
| **DT-CAT-11** | Update Non-Existent Category | Admin logged in | `PUT /api/categories/99999` | `Bearer <admin_jwt>` | `{"name":"Ghost Category"}` | `404 Not Found` | CAT-ID-IV1, CAT-AUTH-V1 |
| **DT-CAT-12** | Delete Category (Admin) | Target category exists | `DELETE /api/categories/:id` | `Bearer <admin_jwt>` | None | `200 OK` + `{"message":"Category deleted"}` | CAT-ID-V1, CAT-AUTH-V1 |
| **DT-CAT-13** | Delete Non-Existent Category | Admin logged in | `DELETE /api/categories/99999` | `Bearer <admin_jwt>` | None | `404 Not Found` | CAT-ID-IV1, CAT-AUTH-V1 |

---

*Artifact owner: AI (Stage 5 — DT-01/02/03, API 3)*  
*→ **HARD STOP — awaiting human review and approval before Stage 6 (BVA-01 — Boundary Value Analysis for API 3).***
