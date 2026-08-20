# ENV-01 — Environment Verification Notes

**Skill:** ENV-01  
**Stage:** 1  
**Student ID:** 23127255  
**Date/Time:** 2026-08-20T11:50 +07:00  
**Platform:** Windows 11 + Ubuntu 24.04 WSL  
**Executor:** AI (Antigravity / Claude Sonnet)  

---

## 1. SUT Connectivity

| Check | Result | Detail |
|---|---|---|
| Backend API reachable | ✅ PASS | `http://localhost:3000` responds |
| SUT started | ✅ PASS | Backend process running (was down initially due to DB corruption; reset by human, then online) |
| Note: initial state | ⚠️ | Database was corrupted at session start; human reset the DB before verification continued |

---

## 2. Tool / Version Information

| Tool | Version | Status |
|---|---|---|
| Node.js | v22.17.0 | ✅ |
| npm | 11.6.4 | ✅ |
| Newman | 6.2.2 | ✅ |
| Git | 2.50.0.windows.1 | ✅ |
| curl (Windows) | 8.21.0 (Schannel) | ✅ |
| Postman (GUI) | 12.24.2 | ✅ (installed at `%LOCALAPPDATA%\Postman\Postman.exe`; not in PATH — GUI app, not CLI) |

> Newman 6.2.2 is the CLI executor. Postman GUI is available for collection design and export. No PATH entry for `postman` is expected or required.

---

## 3. API Specification

| Check | Result |
|---|---|
| `eshop-sut/api_specification.md` present | ✅ |
| Base URL documented | ✅ `http://localhost:3000` |
| Selected API endpoints listed | ✅ (see Section 6 below) |

---

## 4. Authentication & Test Accounts

| Account | Role | Status | Detail |
|---|---|---|---|
| `smoke_env_check@test.com` | user | ✅ Created during smoke test | Registered via `POST /api/register`; login returns JWT |
| `test@eshop.com` / `Test1234!` | user | ✅ Confirmed (id=2) | Login HTTP 200, JWT contains `role:user` |
| `admin@eshop.com` / `Admin123!` | admin | ✅ Confirmed (id=1) | Login HTTP 200, JWT contains `role:admin` |

---

## 5. Test Data Readiness

| Data | Status | Note |
|---|---|---|
| User account (register test) | ✅ Creatable on demand | Endpoint creates fresh accounts |
| Duplicate email (negative test) | ✅ `smoke_env_check@test.com` already registered | Available for duplicate-registration test cases |
| Product catalog | ✅ 5 products returned | `GET /api/products` returned 5 items |
| Order history | ✅ Seeded (2 orders) | `GET /api/orders/my-orders` → HTTP 200, orders id=1 (status:pending) and id=2 (status:pending) for test user |
| Categories | ✅ Verified | `GET /api/categories` → HTTP 200, 3 categories: Điện thoại, Laptop, Phụ kiện |
| Admin JWT | ✅ Confirmed | `POST /api/login` with admin@eshop.com → JWT with `role:admin` |

---

## 6. Selected API Endpoints (from WORKFLOW.md §2)

| API | Pool | FR | Endpoint | Method |
|---|---|---|---|---|
| API 1 | Pool A | FR-01 Account Registration | `/api/register` | POST |
| API 2 | Pool B | FR-11 Order History (User) | `/api/orders/my-orders` | GET |
| API 3 | Pool C | FR-14 Category Management | `/api/categories` | POST / PUT / DELETE / GET |

---

## 7. Smoke Request Evidence

### 7.1 POST /api/register (API 1 — FR-01)

**Request:**
```
POST http://localhost:3000/api/register
Content-Type: application/json
X-Student-Id: 23127255

{
  "name": "SmokeUser",
  "email": "smoke_env_check@test.com",
  "password": "Smoke123!"
}
```

**Response:**
```
HTTP 200 OK
{"message":"User registered successfully","id":3}
```

✅ Response matches `api_specification.md` §1.1 exactly.

---

### 7.2 POST /api/login

**Request:**
```
POST http://localhost:3000/api/login
Content-Type: application/json
X-Student-Id: 23127255

{
  "email": "smoke_env_check@test.com",
  "password": "Smoke123!"
}
```

**Response:**
```
HTTP 200 OK
{"message":"Login successful","token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."}
```

✅ JWT returned. Spec §1.2 satisfied.

---

### 7.3 GET /api/products

**Request:**
```
GET http://localhost:3000/api/products
X-Student-Id: 23127255
```

**Response:**
```
HTTP 200 OK
[5 product objects]
```

✅ Products catalog is populated.

---

## 8. X-Student-Id Header Verification

| Check | Result |
|---|---|
| Header `X-Student-Id: 23127255` supplied in all smoke requests | ✅ |
| Backend accepted requests with header (no rejection) | ✅ |
| Header will be set via Postman environment variable / pre-request script | ✅ (configured in Stage 13) |

---

## 9. Git / GitHub Access

| Check | Result |
|---|---|
| Git installed | ✅ `git 2.50.0.windows.1` |
| Workspace is a git repo | ✅ `.git` present in `SUT_HW06/` |
| `eshop-sut` is a git submodule | ✅ `.gitmodules` present |
| GitHub access | ⚠️ Not verified at this stage — will be confirmed during CI-01 (Stage 17) |

---

## 10. Environment Limitations / Notes

| Item | Detail |
|---|---|
| Database corruption | DB was corrupted at session start; human reset before verification. Recorded as environment event — **not** a SUT bug. |
| WSL is running | `wsl` terminal active in workspace; all commands run via native PowerShell per user preference |
| Postman GUI not in PATH | Normal for desktop installation; Newman CLI (v6.2.2) is the actual executor |
| Admin credentials | Not yet established; **required before Stage 13 Postman collection** |
| Order test data | Must be seeded before FR-11 (Stage 3 API 2) pipeline begins |

---

## 11. ENV-01 Validation Checklist

- [x] Backend API is reachable — `http://localhost:3000`
- [x] Required API dependencies are available (backend running)
- [x] Required endpoints can be reached (`/api/register`, `/api/login`, `/api/products`, `/api/orders/my-orders`, `/api/categories`)
- [x] Authentication / test accounts are available (smoke user + test user + admin confirmed)
- [x] Admin role account verified — `admin@eshop.com` / `Admin123!` / id=1 / role=admin
- [x] Product test data available (5 products)
- [x] Order history data seeded — 2 orders for test user (id=1, id=2, status=pending)
- [x] `api_specification.md` is available at `eshop-sut/api_specification.md`
- [x] Postman is available (v12.24.2 GUI at `%LOCALAPPDATA%\Postman\Postman.exe`)
- [x] Newman is available (v6.2.2 CLI)
- [x] Node.js / npm environment available (v22.17.0 / 11.6.4)
- [x] Git installed (v2.50.0.windows.1)
- [x] A representative API request executed (`POST /api/register` → HTTP 200)
- [x] Environment failures distinguishable from SUT failures (DB corruption = environment event)

---

**✅ ALL OPEN ITEMS RESOLVED** (2026-08-20T11:57 +07:00):
1. Admin account confirmed: `admin@eshop.com` / `Admin123!` (id=1, role=admin)
2. Order data seeded: 2 orders present for test user (id=1, id=2)

---

*Artifact owner: AI (Stage 1 — ENV-01)*  
*→ **HARD STOP — awaiting human review and approval before Stage 2 (SELECT-01).***
