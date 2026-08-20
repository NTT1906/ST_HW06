# SCHEMA-01 — Response Schema Validation: GET /api/orders/my-orders

**Skill:** SCHEMA-01  
**Stage:** 9  
**API:** API 2 — FR-11 Order History View (User)  
**Endpoint:** `GET /api/orders/my-orders`  
**Student ID:** 23127255  
**Date/Time:** 2026-08-20T12:51 +07:00  
**Inputs:** `api_specification.md` §4.4, Live SUT evidence  
**Executor:** AI (Antigravity / Gemini Flash)

---

## 1. Documented Response Schema Model

- **Expected Status:** `200 OK`
- **Expected Media Type:** `application/json; charset=utf-8`
- **Root Element:** JSON Array `[]` containing zero or more Order Objects

### Formal JSON Schema Definition (Draft-07)

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "OrderHistoryResponse",
  "type": "array",
  "items": {
    "type": "object",
    "required": [
      "id",
      "user_id",
      "total_amount",
      "status",
      "created_at"
    ],
    "properties": {
      "id": {
        "type": "integer",
        "minimum": 1,
        "description": "Unique auto-incremented primary key of the order"
      },
      "user_id": {
        "type": "integer",
        "minimum": 1,
        "description": "ID of the authenticated user owning the order"
      },
      "total_amount": {
        "type": "number",
        "minimum": 0,
        "description": "Total financial value of the order in VND"
      },
      "status": {
        "type": "string",
        "enum": ["pending", "confirmed", "shipping", "delivered", "canceled"],
        "description": "Current lifecycle status of the order"
      },
      "shipping_address": {
        "type": ["string", "null"],
        "description": "Delivery address provided at checkout, or null"
      },
      "created_at": {
        "type": "string",
        "description": "Timestamp string indicating when the order was created"
      }
    },
    "additionalProperties": false
  }
}
```

---

## 2. Response Field Specifications & Rules

| Property Name | Data Type | Required? | Nullable? | Documented Constraints | SUT Observed Behavior |
|---|---|---|---|---|---|
| `id` | `integer` | **YES** | No | `id >= 1` | Auto-incremented positive integer |
| `user_id` | `integer` | **YES** | No | Must match authenticated user ID | Strict match with token payload ID |
| `total_amount` | `number` | **YES** | No | `total_amount >= 0` | Numerical VND integer/float amount |
| `status` | `string` | **YES** | No | Enum (`pending`, `confirmed`, `shipping`, `delivered`, `canceled`) | Strictly returns valid lifecycle enum strings |
| `shipping_address` | `string` | No | **Yes** | Text address or `null` | Returns string or `null` properly |
| `created_at` | `string` | **YES** | No | Timestamp string (`YYYY-MM-DD HH:MM:SS`) | Returns ISO/SQL timestamp string |

---

## 3. Schema Validation Test Matrix

| Test ID | Target Property / Rule | Assertion / Constraint | Expected Result | Actual SUT Result | Verdict |
|---|---|---|---|---|---|
| **SCH-OH-01** | HTTP Status Code | Status == `200 OK` | `200 OK` | `200 OK` | ✅ PASS |
| **SCH-OH-02** | Content-Type Header | `application/json; charset=utf-8` | JSON MIME with utf-8 | `application/json; charset=utf-8` | ✅ PASS |
| **SCH-OH-03** | Root Structure Type | Root element is a JSON Array | `Array.isArray(res) === true` | JSON Array | ✅ PASS |
| **SCH-OH-04** | Empty Collection Schema | User with 0 orders returns empty array | `res.length === 0` | `[]` | ✅ PASS |
| **SCH-OH-05** | Order Item Required Fields | Every item contains `id`, `user_id`, `total_amount`, `status`, `created_at` | All required keys present | All 5 required keys present | ✅ PASS |
| **SCH-OH-06** | Data Type: `id` | `typeof(item.id) === "number"` | Positive integer | Integer | ✅ PASS |
| **SCH-OH-07** | Data Type: `user_id` | `typeof(item.user_id) === "number"` | Matches token ID | Matches token ID | ✅ PASS |
| **SCH-OH-08** | Data Type: `total_amount` | `typeof(item.total_amount) === "number"` | Number >= 0 | Number >= 0 | ✅ PASS |
| **SCH-OH-09** | Enum Validation: `status` | Status is one of `pending`, `confirmed`, `shipping`, `delivered`, `canceled` | Valid enum string | Valid enum string | ✅ PASS |
| **SCH-OH-10** | Nullability: `shipping_address` | String or `null` | Allowed null | Valid string or null | ✅ PASS |
| **SCH-OH-11** | Additional Properties | No unexpected fields in order objects | Exactly 6 keys | Exactly 6 keys | ✅ PASS |
| **SCH-OH-12** | Error Response Schema (401) | Missing token returns `{"error": "Unauthorized"}` | Structured error JSON | `{"error":"Unauthorized"}` | ✅ PASS |
| **SCH-OH-13** | Error Response Schema (403) | Bad token returns `{"error": "Forbidden"}` | Structured error JSON | `{"error":"Forbidden"}` | ✅ PASS |

---

## 4. Postman Schema Validation Script Snippet

```javascript
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

pm.test("Response is an Array matching Order Schema", function () {
    const schema = {
        "type": "array",
        "items": {
            "type": "object",
            "required": ["id", "user_id", "total_amount", "status", "created_at"],
            "properties": {
                "id": { "type": "integer", "minimum": 1 },
                "user_id": { "type": "integer", "minimum": 1 },
                "total_amount": { "type": "number", "minimum": 0 },
                "status": { "type": "string", "enum": ["pending", "confirmed", "shipping", "delivered", "canceled"] },
                "shipping_address": { "type": ["string", "null"] },
                "created_at": { "type": "string" }
            },
            "additionalProperties": false
        }
    };
    pm.response.to.have.jsonSchema(schema);
});
```

---

## 5. SCHEMA-01 Validation Checklist

- [x] Draft-07 JSON schema formalized for order history array and order items
- [x] Required fields, numerical constraints, and status enums defined
- [x] Schema evaluated against live SUT response
- [x] Error schemas for 401 and 403 verified
- [x] Postman schema validation assertions formulated

---

*Artifact owner: AI (Stage 9 — SCHEMA-01, API 2)*  
*→ **HARD STOP — awaiting human review and approval before Stage 10 (AI-GEN-01 — AI Test Generation for API 2).***
