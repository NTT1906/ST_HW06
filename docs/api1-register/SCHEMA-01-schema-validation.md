# SCHEMA-01 — Response Schema Validation: POST /api/register

**Skill:** SCHEMA-01  
**Stage:** 9  
**API:** API 1 — FR-01 Account Registration  
**Endpoint:** `POST /api/register`  
**Student ID:** 23127255  
**Date/Time:** 2026-08-20T12:21 +07:00  
**Inputs:** `api_specification.md` §1.1, Live SUT evidence  
**Executor:** AI (Antigravity / Gemini Flash)

---

## 1. Documented Response Schema Model

Based on `api_specification.md` §1.1:
- **Expected Status:** `200 OK`
- **Expected Media Type:** `application/json; charset=utf-8`

### Formal JSON Schema Definition (Draft-07)

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "RegisterSuccessResponse",
  "type": "object",
  "required": ["message", "id"],
  "properties": {
    "message": {
      "type": "string",
      "enum": ["User registered successfully"],
      "description": "Standard registration confirmation message"
    },
    "id": {
      "type": "integer",
      "minimum": 1,
      "description": "Auto-incremented primary key of the newly created user"
    }
  },
  "additionalProperties": false
}
```

---

## 2. Response Field Specification & Rules

| Field Name | Type | Required? | Nullable? | Documented Value / Constraints | SUT Observed Behavior |
|---|---|---|---|---|---|
| `message` | `string` | **YES** | No | Exact string `"User registered successfully"` | Returns exact string on all 200 responses |
| `id` | `integer` | **YES** | No | Positive integer (`>= 1`) | Returns integer auto-incremented ID |
| `*` (Extra Fields) | `any` | **NO** | N/A | None documented (No additional properties) | Exactly 2 properties returned; no extra leaked properties |

---

## 3. Schema Validation Test Matrix

| Test ID | Target Property / Rule | Assertion / Constraint | Expected Result | Actual SUT Result | Verdict |
|---|---|---|---|---|---|
| **SCH-TC01** | HTTP Status Code | Status == `200 OK` | `200 OK` | `200 OK` | ✅ PASS |
| **SCH-TC02** | Content-Type Header | `application/json` with utf-8 charset | `application/json; charset=utf-8` | `application/json; charset=utf-8` | ✅ PASS |
| **SCH-TC03** | Root Element Type | Root response is a JSON Object | Object `{}` | Object `{}` | ✅ PASS |
| **SCH-TC04** | Required Field: `message` | `message` exists and is non-null | Present | Present (`"User registered successfully"`) | ✅ PASS |
| **SCH-TC05** | Field Type: `message` | `typeof(message) === "string"` | `string` | `string` | ✅ PASS |
| **SCH-TC06** | Field Value: `message` | Value matches `"User registered successfully"` | Exact match | Exact match | ✅ PASS |
| **SCH-TC07** | Required Field: `id` | `id` exists and is non-null | Present | Present (e.g. `28`) | ✅ PASS |
| **SCH-TC08** | Field Type: `id` | `typeof(id) === "number"` (integer) | `integer` | `Int64` / `integer` | ✅ PASS |
| **SCH-TC09** | Field Value: `id` | `id >= 1` (valid DB primary key) | `>= 1` | Verified positive integer | ✅ PASS |
| **SCH-TC10** | Additional Properties | No extra/unexpected properties in body | Total keys == 2 | Total keys == 2 (`message`, `id`) | ✅ PASS |
| **SCH-TC11** | Error Response Schema | Malformed/non-JSON body returns structured JSON error `{ error: string }` | JSON Error Object | Returns raw HTML / stack trace with HTTP 500 | ⚠️ **SCHEMA DEFECT (BC-5):** Missing structured JSON error schema |

---

## 4. Postman Schema Validation Script (Snippet)

```javascript
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

pm.test("Content-Type is JSON", function () {
    pm.expect(pm.response.headers.get("Content-Type")).to.include("application/json");
});

pm.test("Response matches JSON Schema", function () {
    const schema = {
        "type": "object",
        "required": ["message", "id"],
        "properties": {
            "message": { "type": "string", "enum": ["User registered successfully"] },
            "id": { "type": "integer", "minimum": 1 }
        },
        "additionalProperties": false
    };
    pm.response.to.have.jsonSchema(schema);
});
```

---

## 5. SCHEMA-01 Validation Checklist

- [x] Documented response schema formalized into JSON Schema (Draft-07)
- [x] Required and optional fields, data types, and nullability documented
- [x] Schema assertions evaluated against live SUT response
- [x] Postman schema validation assertions drafted
- [x] Error schema defect (unstructured HTML 500) identified and documented

---

*Artifact owner: AI (Stage 9 — SCHEMA-01, API 1)*  
*→ **HARD STOP — awaiting human review and approval before Stage 10 (AI-GEN-01 — AI Test Generation for API 1).***
