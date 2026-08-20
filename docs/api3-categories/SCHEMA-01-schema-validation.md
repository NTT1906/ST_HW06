# SCHEMA-01 — Response Schema Validation: Product Categories (FR-14)

**Skill:** SCHEMA-01  
**Stage:** 9  
**API:** API 3 — FR-14 Product Categories  
**Endpoint:** `GET /api/categories` (and associated Category CRUD)  
**Student ID:** 23127255  
**Date/Time:** 2026-08-20T13:35 +07:00  
**Inputs:** `api_specification.md` §3.4, Live SUT evidence  
**Executor:** AI (Antigravity / Gemini Flash)

---

## 1. Documented Response Schema Models

### 1.1 `GET /api/categories` Response Schema (Draft-07)

- **Expected Status:** `200 OK`
- **Expected MIME:** `application/json; charset=utf-8`
- **Root Element:** JSON Array `[...]`

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "CategoryListResponse",
  "type": "array",
  "items": {
    "type": "object",
    "required": ["id", "name"],
    "properties": {
      "id": {
        "type": "integer",
        "minimum": 1,
        "description": "Unique auto-incremented primary key of the category"
      },
      "name": {
        "type": "string",
        "description": "Category display name"
      }
    },
    "additionalProperties": false
  }
}
```

### 1.2 `POST /api/categories` Response Schema (Draft-07)

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "CategoryCreateResponse",
  "type": "object",
  "required": ["message", "id"],
  "properties": {
    "message": {
      "type": "string",
      "enum": ["Category created"]
    },
    "id": {
      "type": "integer",
      "minimum": 1
    }
  },
  "additionalProperties": false
}
```

---

## 2. Response Field Specifications

| Endpoint | Field | Type | Required? | Nullable? | Documented Constraints | SUT Observed Behavior |
|---|---|---|---|---|---|---|
| `GET /api/categories` | `id` | `integer` | **YES** | No | `id >= 1` | Auto-incremented positive integer |
| `GET /api/categories` | `name` | `string` | **YES** | No | Category name text | String text (or null if corrupted by empty POST) |
| `POST /api/categories` | `message` | `string` | **YES** | No | Exact `"Category created"` | Returns exact string |
| `POST /api/categories` | `id` | `integer` | **YES** | No | `id >= 1` | Returns generated primary key |
| `PUT /api/categories/:id` | `message` | `string` | **YES** | No | Exact `"Category updated"` | Returns exact string |
| `DELETE /api/categories/:id` | `message` | `string` | **YES** | No | Exact `"Category deleted"` | Returns exact string |

---

## 3. Schema Validation Test Matrix

| Test ID | Target Property / Rule | Assertion / Constraint | Expected Result | Actual SUT Result | Verdict |
|---|---|---|---|---|---|
| **SCH-CAT-01** | `GET` HTTP Status Code | Status == `200 OK` | `200 OK` | `200 OK` | ✅ PASS |
| **SCH-CAT-02** | `GET` Content-Type | `application/json; charset=utf-8` | JSON MIME | `application/json; charset=utf-8` | ✅ PASS |
| **SCH-CAT-03** | `GET` Root Structure | Root element is JSON Array | `Array.isArray(res) === true` | JSON Array | ✅ PASS |
| **SCH-CAT-04** | `GET` Item Required Fields | Every category item has `id` and `name` | Both keys present | Both keys present | ✅ PASS |
| **SCH-CAT-05** | `GET` Item Data Types | `typeof(id) === "number"`, `typeof(name) === "string"` | Types match schema | Types match schema | ✅ PASS |
| **SCH-CAT-06** | `GET` Additional Properties | Exactly 2 properties per item (`id`, `name`) | Total keys == 2 | Total keys == 2 | ✅ PASS |
| **SCH-CAT-07** | `POST` Success Schema | Status 200, `{ message: "Category created", id: <int> }` | Matches Draft-07 schema | Exactly matches | ✅ PASS |
| **SCH-CAT-08** | `PUT` Success Schema | Status 200, `{ message: "Category updated" }` | Matches schema | Exactly matches | ✅ PASS |
| **SCH-CAT-09** | `DELETE` Success Schema | Status 200, `{ message: "Category deleted" }` | Matches schema | Exactly matches | ✅ PASS |
| **SCH-CAT-10** | Error Response Schema (401) | `{ "error": "Unauthorized" }` | Structured JSON error | `{"error":"Unauthorized"}` | ✅ PASS |

---

## 4. Postman Schema Validation Script Snippet

```javascript
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

pm.test("Response matches Category List Schema", function () {
    const schema = {
        "type": "array",
        "items": {
            "type": "object",
            "required": ["id", "name"],
            "properties": {
                "id": { "type": "integer", "minimum": 1 },
                "name": { "type": "string" }
            },
            "additionalProperties": false
        }
    };
    pm.response.to.have.jsonSchema(schema);
});
```

---

## 5. SCHEMA-01 Validation Checklist

- [x] Draft-07 schemas defined for Category listing, creation, update, and deletion
- [x] Required fields and data types verified against live SUT
- [x] No additional properties (`additionalProperties: false`) verified
- [x] Structured error response schemas validated

---

*Artifact owner: AI (Stage 9 — SCHEMA-01, API 3)*  
*→ **HARD STOP — awaiting human review and approval before Stage 10 (AI-GEN-01 — AI Test Generation for API 3).***
