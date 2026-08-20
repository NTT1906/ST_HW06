# SELECT-01 — API Selection Validation

**Skill:** SELECT-01  
**Stage:** 2  
**Student ID:** 23127255  
**Date/Time:** 2026-08-20T11:57 +07:00  
**Authority:** `2026.HW06.API Testing_En.md` §4–5, `api_specification.md`  
**Executor:** AI (Antigravity / Claude Sonnet)

---

## 1. Pool Assignment Verification

Source: `2026.HW06.API Testing_En.md` §4 — Pool definitions:

| Pool | Features |
|---|---|
| **Pool A** | FR-01 (Registration), FR-02 (Login/Lockout), FR-03 (Forgot/Reset PW), FR-04 (Profile), FR-05 (Products), FR-06 (Product Detail) |
| **Pool B** | FR-07 (Cart), FR-08 (Checkout), FR-09 (Coupons), FR-10 (Order State Machine), FR-11 (Order History User) |
| **Pool C** | FR-12 (Access Control), FR-13 (Dashboard), FR-14 (Category CRUD), FR-15 (Product CRUD), FR-16 (Import CSV), FR-17 (Coupon CRUD), FR-18 (Order Admin), FR-19 (User Admin) |

---

## 2. API Selection Table

| # | Pool | FR | Feature | Endpoint | Method | Auth Required | Source in spec |
|---|---|---|---|---|---|---|---|
| **API 1** | **Pool A** | **FR-01** | Account Registration | `POST /api/register` | POST | None (public) | `api_specification.md` §1.1 |
| **API 2** | **Pool B** | **FR-11** | Order History View (User) | `GET /api/orders/my-orders` | GET | Bearer JWT (user role) | `api_specification.md` §4.4 |
| **API 3** | **Pool C** | **FR-14** | Category Management (CRUD) | `POST /api/categories`, `PUT /api/categories/:id`, `DELETE /api/categories/:id`, `GET /api/categories` | POST/PUT/DELETE/GET | Bearer JWT (admin role) for write ops | `api_specification.md` §3.4 |

---

## 3. Pool Coverage Result

| Requirement | Result |
|---|---|
| Exactly three APIs selected | ✅ 3 APIs selected |
| Pool A covered | ✅ FR-01 — `POST /api/register` |
| Pool B covered | ✅ FR-11 — `GET /api/orders/my-orders` |
| Pool C covered | ✅ FR-14 — `/api/categories` CRUD |
| All pools (A, B, C) covered | ✅ |
| Pool D (Mobile App) excluded | ✅ Not selected |

---

## 4. FR Assignment Verification

| FR | Assigned Pool (spec) | Selected Pool | Match |
|---|---|---|---|
| FR-01 Account Registration | Pool A | Pool A | ✅ |
| FR-11 Order History View (User) | Pool B | Pool B | ✅ |
| FR-14 Category Management (CRUD) | Pool C | Pool C | ✅ |

---

## 5. Endpoint Confirmation Against `api_specification.md`

### API 1 — POST /api/register

```
§1.1 Đăng ký tài khoản
Endpoint: POST /api/register
Body: { "name", "email", "password" }
Response: 200 OK → {"message": "User registered successfully", "id": 1}
Auth: none (public endpoint)
```
✅ Confirmed.

### API 2 — GET /api/orders/my-orders

```
§4.4 Lấy lịch sử đơn hàng cá nhân
Endpoint: GET /api/orders/my-orders
Auth: Authorization: Bearer <token>  (§4 header note)
Response: array of user's orders
```
✅ Confirmed. Live test returned HTTP 200 with 2 orders for test user.

### API 3 — /api/categories (CRUD)

```
§3.4 Danh mục (Categories)
GET /api/categories           — list
POST /api/categories          — create  (body: {"name": "..."})
PUT /api/categories/:id       — update
DELETE /api/categories/:id    — delete
```
✅ Confirmed. Live `GET /api/categories` returned HTTP 200 with 3 categories.

---

## 6. Duplicate-Selection Check

> ⚠️ **Note:** Group member selections are not available to the AI for verification.
> The human student must confirm that no other group member has selected the same three APIs (FR-01 + FR-11 + FR-14).

| Check | Status |
|---|---|
| FR-01 + FR-11 + FR-14 combination unique within group | **⚠️ Human must verify** |

---

## 7. SELECT-01 Validation Checklist

- [x] Exactly three APIs selected
- [x] API 1 is from Pool A (FR-01 confirmed in `2026.HW06.API Testing_En.md` §4)
- [x] API 2 is from Pool B (FR-11 confirmed in `2026.HW06.API Testing_En.md` §4)
- [x] API 3 is from Pool C (FR-14 confirmed in `2026.HW06.API Testing_En.md` §4)
- [x] Pool A, B, and C all covered
- [x] Pool D not selected
- [x] Exact endpoints confirmed against `api_specification.md`
- [ ] No duplication with group members — **⚠️ HUMAN MUST VERIFY**

---

*Artifact owner: AI (Stage 2 — SELECT-01)*  
*→ **HARD STOP — awaiting human review and approval (incl. group duplication check) before Stage 3 (API-01 for API 1).***
