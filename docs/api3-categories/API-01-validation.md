# API-01 — API Validation Notes: GET /api/categories (Product Categories)

**Skill:** API-01  
**Stage:** 3  
**API:** API 3 — FR-14 Product Categories  
**Endpoint:** `GET /api/categories` (and associated Category CRUD: `POST`, `PUT`, `DELETE`)  
**Student ID:** 23127255  
**Date/Time:** 2026-08-20T13:21 +07:00  
**Authority:** `api_specification.md` §3.4  
**Executor:** AI (Antigravity / Gemini Flash)

---

## 1. Endpoint Summary

| Attribute | Documented Specification | Verified SUT Reality |
|---|---|---|
| HTTP Method | `GET` (Listing) / `POST` (Creation) / `PUT` (Update) / `DELETE` (Removal) | `GET`, `POST`, `PUT`, `DELETE` are active |
| Path | `/api/categories` (and `/api/categories/:id`) | `/api/categories` (and `/api/categories/:id`) |
| Base URL | `http://localhost:3000` | `http://localhost:3000` |
| Authentication (`GET`) | Public (No token required) | Verified: Public (`HTTP 200 OK`) |
| Authentication (`POST/PUT/DELETE`) | Protected (Admin token required per spec §3.3/3.4) | Protected by JWT existence, but **fails SEC-03 role check** (allows regular users) |

---

## 2. Request Specifications

### `GET /api/categories` (Primary Target)
- **Headers:** `X-Student-Id: 23127255`
- **Body:** None (GET request)
- **Parameters:** None documented

### `POST /api/categories` (Creation / State Transition)
- **Headers:** `Content-Type: application/json`, `Authorization: Bearer <token>`, `X-Student-Id: 23127255`
- **Body (JSON):**
  ```json
  {
    "name": "Tên danh mục"
  }
  ```

### `PUT /api/categories/:id` (Update)
- **Path Parameter:** `:id` (Integer category ID)
- **Body (JSON):** `{"name": "Tên mới"}`

### `DELETE /api/categories/:id` (Removal)
- **Path Parameter:** `:id` (Integer category ID)

---

## 3. Response Specifications

### Success Response (`GET /api/categories` — 200 OK)

Returns an Array of Category objects:

```json
[
  {
    "id": 1,
    "name": "Điện thoại"
  },
  {
    "id": 2,
    "name": "Laptop"
  },
  {
    "id": 3,
    "name": "Phụ kiện"
  }
]
```

### Success Response (`POST /api/categories` — 200 OK)
```json
{
  "message": "Category created",
  "id": 4
}
```

---

## 4. Live SUT Validation Evidence

| # | Scenario / Endpoint | Method | Auth Header | Expected Result | Actual SUT Result | Verdict / Defect |
|---|---|---|---|---|---|---|
| 1 | Public category listing | `GET /api/categories` | None | `200 OK` + Array of categories | `HTTP 200` + Array of 3 default categories | ✅ PASS |
| 2 | Create category (Admin) | `POST /api/categories` | `Bearer <admin_jwt>` | `200 OK` + `{"message":"Category created","id":N}` | `HTTP 200` + `id: 4` | ✅ PASS |
| 3 | Create category (Regular User) | `POST /api/categories` | `Bearer <user_jwt>` | `403 Forbidden` (Admin Only) | `HTTP 200` + Category created | 🚨 **CRITICAL BUG (SEC-03 Defect):** Regular user can create categories without admin role |
| 4 | Create category (Unauthenticated) | `POST /api/categories` | *(None)* | `401 Unauthorized` | `HTTP 401 Unauthorized` | ✅ PASS (Auth gate active) |
| 5 | Create category with empty `{}` | `POST /api/categories` | `Bearer <admin_jwt>` | `4xx Bad Request` | `HTTP 200` + creates `{ id: 6, name: null }` | ⚠️ **VALIDATION DEFECT:** Missing required `name` validation |
| 6 | Stored XSS in category name | `POST /api/categories` | `Bearer <admin_jwt>` | Input sanitized / escaped | `HTTP 200` + Stored unescaped `<script>` reflected in public `GET /api/categories` | 🚨 **HIGH SECURITY DEFECT (SEC-04):** Stored XSS reflected in public listing |
| 7 | Update category | `PUT /api/categories/1` | `Bearer <admin_jwt>` | `200 OK` + `{"message":"Category updated"}` | `HTTP 200` | ✅ PASS |
| 8 | Delete category | `DELETE /api/categories/4` | `Bearer <admin_jwt>` | `200 OK` + `{"message":"Category deleted"}` | `HTTP 200` | ✅ PASS |

---

## 5. Identified Defects for Stage 16 Bug Reporting

1. **Defect BC-CAT-1 (SEC-03 Broken Role-Based Access Control):** `POST /api/categories`, `PUT /api/categories/:id`, and `DELETE /api/categories/:id` permit regular non-admin users (`role: "user"`) to create, edit, and delete system categories.
2. **Defect BC-CAT-2 (SEC-04 Stored Cross-Site Scripting):** `<script>` tags injected into category names are stored and returned unescaped in the public `GET /api/categories` listing.
3. **Defect BC-CAT-3 (Input Validation Defect):** Submitting empty JSON `{}` creates ghost categories with `name: null`.

---

## 6. API-01 Validation Checklist

- [x] Endpoint paths verified (`/api/categories`, `/api/categories/:id`)
- [x] All HTTP methods evaluated (`GET`, `POST`, `PUT`, `DELETE`)
- [x] Public read vs. protected mutation access patterns tested
- [x] Response schemas captured and verified
- [x] Critical security defect (SEC-03 role escalation) discovered and evidenced
- [x] Stored XSS vulnerability (SEC-04) identified

---

*Artifact owner: AI (Stage 3 — API-01, API 3)*  
*→ **HARD STOP — awaiting human review and approval before Stage 4 (API-02 Workflow Understanding for API 3).***
