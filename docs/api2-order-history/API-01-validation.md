# API-01 — API Validation Notes: GET /api/orders/my-orders

**Skill:** API-01  
**Stage:** 3  
**API:** API 2 — FR-11 Order History View (User)  
**Endpoint:** `GET /api/orders/my-orders`  
**Student ID:** 23127255  
**Date/Time:** 2026-08-20T12:45 +07:00  
**Authority:** `api_specification.md` §4.4  
**Executor:** AI (Antigravity / Gemini Flash)

---

## 1. Endpoint Summary

| Attribute | Documented Specification | Verified SUT Reality |
|---|---|---|
| HTTP Method | `GET` | `GET` |
| Path | `/api/orders/my-orders` | `/api/orders/my-orders` |
| Base URL | `http://localhost:3000` | `http://localhost:3000` |
| Authentication | Required (`Authorization: Bearer <token>`) | Required (Enforced: HTTP 401 if missing, HTTP 403 if invalid) |
| Authorization / Role | User role (or Admin) | Requires valid authenticated JWT |
| Request Body | None (GET request) | None |

---

## 2. Request Specification

### Headers

| Header | Required? | Documented Value | Verified Behavior |
|---|---|---|---|
| `Authorization` | **YES** | `Bearer <token>` | Missing → `HTTP 401 Unauthorized`<br>Malformed/invalid signature → `HTTP 403 Forbidden` |
| `X-Student-Id` | HW06 Requirement | `23127255` | Accepted by SUT without rejection |

### Parameters

- **Path Parameters:** None
- **Query Parameters:** None documented in spec. Query strings (e.g. `?status=pending`) are ignored or passed through with `HTTP 200`.

---

## 3. Response Specification

### Success Response (`200 OK`)

Returns a JSON Array of order objects belonging strictly to the authenticated user (`user_id == token.id`):

```json
[
  {
    "id": 1,
    "user_id": 2,
    "total_amount": 116000000,
    "status": "pending",
    "shipping_address": null,
    "created_at": "2026-08-20 04:55:42"
  }
]
```

- When the user has no orders, returns empty array: `[]` (`HTTP 200 OK`).

### Error Responses

| Status Code | Condition | Response Body |
|---|---|---|
| `401 Unauthorized` | Missing `Authorization` header | `{"error": "Unauthorized"}` |
| `403 Forbidden` | Invalid/expired JWT token | `{"error": "Forbidden"}` |

---

## 4. Live SUT Validation Evidence

| # | Scenario | Authorization Header | Expected HTTP | Actual HTTP | Actual Body Summary | Verdict |
|---|---|---|---|---|---|---|
| 1 | Happy path (User with 2 orders) | `Bearer <valid_token_id2>` | 200 OK | **200 OK** | Array with 2 order objects (id=1, id=2, `user_id=2`) | ✅ PASS |
| 2 | User with NO orders | `Bearer <fresh_user_token>` | 200 OK | **200 OK** | `[]` (Empty JSON array) | ✅ PASS |
| 3 | Admin user own orders | `Bearer <admin_token_id1>` | 200 OK | **200 OK** | `[]` (Empty array — Admin has no personal orders) | ✅ PASS |
| 4 | Missing Token (Unauthenticated) | *(None)* | 401 Unauthorized | **401** | `{"error":"Unauthorized"}` | ✅ PASS (Auth enforced) |
| 5 | Malformed Token String | `Bearer invalid.token.xyz` | 403 Forbidden | **403** | `{"error":"Forbidden"}` | ✅ PASS (Token validation enforced) |
| 6 | Non-Bearer Scheme | `Basic dXNlcjpwYXNz` | 401 / 403 | **401** | `{"error":"Unauthorized"}` | ✅ PASS |
| 7 | Wrong Method (`POST /my-orders`) | `Bearer <valid_token>` | 404 / 405 | **404** | Cannot POST `/api/orders/my-orders` | ✅ PASS |
| 8 | Query String Injection | `?status=' OR '1'='1` | 200 OK | **200 OK** | Returns user's orders safely | ✅ PASS |

---

## 5. Identified Constraints & Business Rules

1. **Authentication Enforcement:** `GET /api/orders/my-orders` strictly enforces JWT authentication (unlike the public `/api/register` endpoint).
2. **Horizontal Access Control (Resource Isolation):** The API isolates orders by the extracted `token.id`. User A cannot see User B's order history through this endpoint.
3. **Empty Result Format:** If no orders match the authenticated user, the endpoint correctly returns an empty JSON array `[]` with `200 OK` rather than an error or null.

---

## 6. API-01 Validation Checklist

- [x] Endpoint path verified: `GET /api/orders/my-orders`
- [x] HTTP method verified: `GET`
- [x] Authentication mechanism verified: `Authorization: Bearer <JWT>`
- [x] Missing and invalid token responses captured (401/403)
- [x] Success response shape verified: Array of order objects (`id`, `user_id`, `total_amount`, `status`, `shipping_address`, `created_at`)
- [x] Empty orders scenario verified (`[]`)
- [x] Validation evidence captured from live SUT

---

*Artifact owner: AI (Stage 3 — API-01, API 2)*  
*→ **HARD STOP — awaiting human review and approval before Stage 4 (API-02 Workflow Understanding for API 2).***
