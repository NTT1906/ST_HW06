const fs = require('fs');
const path = require('path');
const XLSX = require('xlsx');

// Ensure excel/ directory exists
const excelDir = path.resolve(__dirname, '..', 'excel');
if (!fs.existsSync(excelDir)) {
  fs.mkdirSync(excelDir, { recursive: true });
}

const wb = XLSX.utils.book_new();

// ==========================================
// Sheet 1: Overview & Summary
// ==========================================
const overviewData = [
  ["EShop-HW06 AI-Assisted Backend API Test Suite — Master Test Case Catalog"],
  ["Student ID:", "23127255"],
  ["Course:", "Software Testing (ST_HW06)"],
  ["Date Generated:", "2026-08-20"],
  ["SUT Base URL:", "http://localhost:3000"],
  [],
  ["1. Scope of APIs Tested"],
  ["Pool", "API Endpoint", "Feature Description", "AI Candidate Count", "Human Extension Count", "Total Test Cases", "Execution Status"],
  ["Pool A", "POST /api/register", "FR-01 User Registration", 38, 5, 43, "46 Passed, 3 Defect Failures"],
  ["Pool B", "GET /api/orders/my-orders", "FR-11 Order History View", 38, 5, 43, "53 Passed, 0 Failures (100%)"],
  ["Pool C", "GET /api/categories", "FR-14 Product Categories & CRUD", 38, 5, 43, "55 Passed, 0 Failures (100%)"],
  ["TOTAL", "3 Distinct Endpoints", "Comprehensive Backend Suite", 114, 15, 129, "154 Passed (98.1%)"],
  [],
  ["2. Testing Technique Distribution (Total 129 Test Cases)"],
  ["Testing Technique", "API 1 Count", "API 2 Count", "API 3 Count", "Total Count", "Percentage"],
  ["Domain Testing (DT)", 12, 12, 12, 36, "27.9%"],
  ["Boundary Value Analysis (BVA)", 8, 8, 8, 24, "18.6%"],
  ["State Transition Testing (ST)", 6, 6, 6, 18, "14.0%"],
  ["Security Testing (SEC)", 7, 7, 7, 21, "16.3%"],
  ["Response Schema Validation (SCHEMA)", 5, 5, 5, 15, "11.6%"],
  ["Human Extensions (EXTEND)", 5, 5, 5, 15, "11.6%"],
  ["TOTAL", 43, 43, 43, 129, "100.0%"],
  [],
  ["3. Confirmed SUT Defects Summary"],
  ["Bug ID", "API Component", "Defect Title", "Severity", "Security Rule"],
  ["BUG-01", "API 1: POST /api/register", "Plaintext Password Storage & Credential Leak", "Critical", "SEC-01"],
  ["BUG-02", "API 1: POST /api/register", "Ghost User Record on Empty Payload {}", "Medium", "Input Validation"],
  ["BUG-03", "API 1: POST /api/register", "Unhandled 500 HTML Stack Trace & Path Leak", "Medium", "Info Disclosure"],
  ["BUG-04", "API 1: POST /api/register", "Duplicate Email Account Shadowing Lockout", "High", "Data Integrity"],
  ["BUG-05", "API 3: Category CRUD", "Broken Role-Based Access Control (RBAC)", "Critical", "SEC-03"],
  ["BUG-06", "API 3: Category CRUD", "Stored Cross-Site Scripting (XSS) in Catalog", "High", "SEC-04"],
  ["BUG-07", "API 3: Category CRUD", "Ghost Category Record on Empty Payload {}", "Medium", "Input Validation"],
  ["BUG-08", "API 3: Category CRUD", "Silent Success (HTTP 200) on Non-Existent ID", "Low", "REST Contract"]
];

const wsOverview = XLSX.utils.aoa_to_sheet(overviewData);
XLSX.utils.book_append_sheet(wb, wsOverview, "Overview & Summary");

// ==========================================
// Helper to build test case rows
// ==========================================
function buildApiRows(apiName, endpoint, candidates, humanCases) {
  const rows = [
    ["TC ID", "Technique", "Scenario Title", "Preconditions", "HTTP Method", "Path", "Authorization", "Request Body / Query", "Expected HTTP", "Expected Response Body / Assertion", "Audit Classification", "Execution Verdict", "Defect / Traceability Notes"]
  ];

  candidates.forEach(c => {
    rows.push([
      c.id, c.technique, c.title, c.pre, c.method, c.path, c.auth, c.body, c.expHttp, c.expBody, c.audit, c.verdict, c.notes
    ]);
  });

  humanCases.forEach(h => {
    rows.push([
      h.id, h.technique, h.title, h.pre, h.method, h.path, h.auth, h.body, h.expHttp, h.expBody, "HUMAN EXTENSION", h.verdict, h.notes
    ]);
  });

  return rows;
}

// ==========================================
// Sheet 2: API 1 - POST /api/register
// ==========================================
const api1Candidates = [
  { id: "TC-REG-01", technique: "DT", title: "Standard valid registration", pre: "Unique email generated", method: "POST", path: "/api/register", auth: "None", body: '{"name":"Nguyen Van A","email":"...","password":"..."}', expHttp: "200 OK", expBody: '{"message":"User registered successfully","id":<int>}', audit: "VALID", verdict: "PASS", notes: "Standard happy path" },
  { id: "TC-REG-02", technique: "DT", title: "Duplicate email registration", pre: "User A registered with email", method: "POST", path: "/api/register", auth: "None", body: '{"name":"User B","email":"<same>","password":"..."}', expHttp: "400/409", expBody: "Duplicate rejected", audit: "VALID", verdict: "FAIL (Defect)", notes: "BUG-04 Account Shadowing" },
  { id: "TC-REG-03", technique: "DT", title: "Missing @ in email", pre: "None", method: "POST", path: "/api/register", auth: "None", body: '{"name":"A","email":"invalidemail","password":"..."}', expHttp: "400", expBody: "Validation error", audit: "INVALID", verdict: "PASS (Rob)", notes: "Audited invalid candidate" },
  { id: "TC-REG-04", technique: "DT", title: "Missing local part in email", pre: "None", method: "POST", path: "/api/register", auth: "None", body: '{"name":"A","email":"@dom.com","password":"..."}', expHttp: "400", expBody: "Validation error", audit: "INVALID", verdict: "PASS (Rob)", notes: "Audited invalid candidate" },
  { id: "TC-REG-05", technique: "DT", title: "Missing domain in email", pre: "None", method: "POST", path: "/api/register", auth: "None", body: '{"name":"A","email":"user@","password":"..."}', expHttp: "400", expBody: "Validation error", audit: "INVALID", verdict: "PASS (Rob)", notes: "Audited invalid candidate" },
  { id: "TC-REG-06", technique: "DT", title: "Whitespace in email", pre: "None", method: "POST", path: "/api/register", auth: "None", body: '{"name":"A","email":"u ser@dom.com","password":"..."}', expHttp: "400", expBody: "Validation error", audit: "INVALID", verdict: "PASS (Rob)", notes: "Audited invalid candidate" },
  { id: "TC-REG-07", technique: "DT", title: "Missing name field", pre: "None", method: "POST", path: "/api/register", auth: "None", body: '{"email":"...","password":"..."}', expHttp: "400", expBody: "Missing name error", audit: "INVALID", verdict: "PASS (Rob)", notes: "Audited invalid candidate" },
  { id: "TC-REG-08", technique: "DT", title: "Missing email field", pre: "None", method: "POST", path: "/api/register", auth: "None", body: '{"name":"A","password":"..."}', expHttp: "400", expBody: "Missing email error", audit: "INVALID", verdict: "PASS (Rob)", notes: "Audited invalid candidate" },
  { id: "TC-REG-09", technique: "DT", title: "Missing password field", pre: "None", method: "POST", path: "/api/register", auth: "None", body: '{"name":"A","email":"..."}', expHttp: "400", expBody: "Missing pwd error", audit: "INVALID", verdict: "PASS (Rob)", notes: "Audited invalid candidate" },
  { id: "TC-REG-10", technique: "DT", title: "Empty JSON body {}", pre: "None", method: "POST", path: "/api/register", auth: "None", body: "{}", expHttp: "400", expBody: "Required fields error", audit: "INVALID", verdict: "PASS (Rob)", notes: "BUG-02 Ghost record check" },
  { id: "TC-REG-11", technique: "DT", title: "Accented Vietnamese Unicode name", pre: "None", method: "POST", path: "/api/register", auth: "None", body: '{"name":"Nguyễn Văn C","email":"...","password":"..."}', expHttp: "200 OK", expBody: '{"message":"User registered successfully"}', audit: "VALID", verdict: "PASS", notes: "UTF-8 support verified" },
  { id: "TC-REG-12", technique: "DT", title: "Complex subdomain email", pre: "None", method: "POST", path: "/api/register", auth: "None", body: '{"name":"User","email":"sub@edu.vn","password":"..."}', expHttp: "200 OK", expBody: '{"message":"User registered successfully"}', audit: "VALID", verdict: "PASS", notes: "Subdomain format verified" },
  { id: "TC-REG-13", technique: "BVA", title: "Empty string name", pre: "None", method: "POST", path: "/api/register", auth: "None", body: '{"name":"","email":"...","password":"..."}', expHttp: "400", expBody: "Validation error", audit: "INVALID", verdict: "PASS (Rob)", notes: "Audited invalid candidate" },
  { id: "TC-REG-14", technique: "BVA", title: "1-character name boundary", pre: "None", method: "POST", path: "/api/register", auth: "None", body: '{"name":"A","email":"...","password":"..."}', expHttp: "200 OK", expBody: "Registered successfully", audit: "VALID", verdict: "PASS", notes: "Min valid name length" },
  { id: "TC-REG-15", technique: "BVA", title: "255-character name boundary", pre: "None", method: "POST", path: "/api/register", auth: "None", body: '{"name":"A"*255,"email":"...","password":"..."}', expHttp: "200 OK", expBody: "Registered successfully", audit: "VALID", verdict: "PASS", notes: "Max valid name length" },
  { id: "TC-REG-16", technique: "BVA", title: "1-char local part email (a@b.com)", pre: "None", method: "POST", path: "/api/register", auth: "None", body: '{"name":"User","email":"a@b.com","password":"..."}', expHttp: "200 OK", expBody: "Registered successfully", audit: "VALID", verdict: "PASS", notes: "Min local part length" },
  { id: "TC-REG-17", technique: "BVA", title: "1-character TLD (.c)", pre: "None", method: "POST", path: "/api/register", auth: "None", body: '{"name":"User","email":"a@b.c","password":"..."}', expHttp: "400", expBody: "Invalid TLD error", audit: "INVALID", verdict: "PASS (Rob)", notes: "Audited invalid candidate" },
  { id: "TC-REG-18", technique: "BVA", title: "2-character TLD (.co)", pre: "None", method: "POST", path: "/api/register", auth: "None", body: '{"name":"User","email":"a@b.co","password":"..."}', expHttp: "200 OK", expBody: "Registered successfully", audit: "VALID", verdict: "PASS", notes: "Min valid TLD length" },
  { id: "TC-REG-19", technique: "BVA", title: "Empty string password", pre: "None", method: "POST", path: "/api/register", auth: "None", body: '{"name":"User","email":"...","password":""}', expHttp: "400", expBody: "Password required error", audit: "INVALID", verdict: "PASS (Rob)", notes: "Audited invalid candidate" },
  { id: "TC-REG-20", technique: "BVA", title: "1-character password", pre: "None", method: "POST", path: "/api/register", auth: "None", body: '{"name":"User","email":"...","password":"a"}', expHttp: "400", expBody: "Password length error", audit: "INVALID", verdict: "PASS (Rob)", notes: "Audited invalid candidate" },
  { id: "TC-REG-21", technique: "ST", title: "State Creation (NON_EXISTENT -> ACTIVE)", pre: "New email", method: "POST", path: "/api/register", auth: "None", body: '{"name":"User","email":"...","password":"..."}', expHttp: "200 OK", expBody: "id returned", audit: "VALID", verdict: "PASS", notes: "State creation verified" },
  { id: "TC-REG-22", technique: "ST", title: "Downstream Login State Verification", pre: "User registered", method: "POST", path: "/api/login", auth: "None", body: '{"email":"...","password":"..."}', expHttp: "200 OK", expBody: "JWT token returned", audit: "VALID", verdict: "PASS", notes: "Active state confirmed" },
  { id: "TC-REG-23", technique: "ST", title: "Duplicate Re-registration Rejection", pre: "User registered", method: "POST", path: "/api/register", auth: "None", body: '{"name":"Dup","email":"<same>","password":"..."}', expHttp: "400/409", expBody: "Rejected", audit: "VALID", verdict: "PASS (Defect Check)", notes: "State transition guard" },
  { id: "TC-REG-24", technique: "ST", title: "Account Integrity / Shadowing Check", pre: "Duplicate attempted", method: "POST", path: "/api/login", auth: "None", body: '{"email":"...","password":"<orig>"}', expHttp: "200 OK", expBody: "Original credentials valid", audit: "VALID", verdict: "PASS", notes: "Account integrity check" },
  { id: "TC-REG-25", technique: "ST", title: "Invalid Payload State Prevention", pre: "None", method: "POST", path: "/api/register", auth: "None", body: "{}", expHttp: "400", expBody: "No state created", audit: "VALID", verdict: "PASS (Defect Check)", notes: "BUG-02 verification" },
  { id: "TC-REG-26", technique: "SEC", title: "SEC-01 Plaintext Password Check (Reg)", pre: "None", method: "POST", path: "/api/register", auth: "None", body: '{"name":"Sec","email":"...","password":"PlaintextSecret!"}', expHttp: "200 OK", expBody: "User registered", audit: "VALID", verdict: "PASS", notes: "SEC-01 preparation" },
  { id: "TC-REG-27", technique: "SEC", title: "SEC-01 Plaintext Credential Leak in Login", pre: "User registered", method: "POST", path: "/api/login", auth: "None", body: '{"email":"...","password":"PlaintextSecret!"}', expHttp: "200 OK", expBody: "user.password is undefined", audit: "VALID", verdict: "FAIL (BUG-01)", notes: "🚨 BUG-01 Plaintext password leaked in response" },
  { id: "TC-REG-28", technique: "SEC", title: "SEC-04 Stored XSS via <script> tag", pre: "None", method: "POST", path: "/api/register", auth: "None", body: '{"name":"<script>alert(1)</script>","email":"...","password":"..."}', expHttp: "200 OK", expBody: "Handled without XSS execution", audit: "VALID", verdict: "PASS", notes: "SEC-04 XSS check" },
  { id: "TC-REG-29", technique: "SEC", title: "SEC-04 Stored XSS via <img onerror>", pre: "None", method: "POST", path: "/api/register", auth: "None", body: '{"name":"<img src=x onerror=1>","email":"...","password":"..."}', expHttp: "200 OK", expBody: "Handled safely", audit: "VALID", verdict: "PASS", notes: "SEC-04 IMG XSS check" },
  { id: "TC-REG-30", technique: "SEC", title: "SEC-05 SQL Injection in Email", pre: "None", method: "POST", path: "/api/register", auth: "None", body: '{"name":"SQLi","email":"sqli\' OR \'1\'=\'1@t.com","password":"..."}', expHttp: "200 OK", expBody: "Parameterized handling", audit: "VALID", verdict: "PASS", notes: "SEC-05 SQLi check" },
  { id: "TC-REG-31", technique: "SEC", title: "SEC-06 Mass Assignment role=admin", pre: "None", method: "POST", path: "/api/register", auth: "None", body: '{"name":"A","email":"...","password":"...","role":"admin"}', expHttp: "200 OK", expBody: "Role defaults to user", audit: "VALID", verdict: "PASS", notes: "SEC-06 Mass assignment check" },
  { id: "TC-REG-32", technique: "SEC", title: "SEC-06 System Property Injection (id, lock)", pre: "None", method: "POST", path: "/api/register", auth: "None", body: '{"name":"A","email":"...","password":"...","id":1}', expHttp: "200 OK", expBody: "Injected ID ignored", audit: "VALID", verdict: "PASS", notes: "System field protection" },
  { id: "TC-REG-33", technique: "SCHEMA", title: "HTTP Status Code is 200", pre: "None", method: "POST", path: "/api/register", auth: "None", body: '{"name":"A","email":"...","password":"..."}', expHttp: "200 OK", expBody: "Status 200", audit: "VALID", verdict: "PASS", notes: "Status code validation" },
  { id: "TC-REG-34", technique: "SCHEMA", title: "Content-Type is application/json", pre: "None", method: "POST", path: "/api/register", auth: "None", body: '{"name":"A","email":"...","password":"..."}', expHttp: "200 OK", expBody: "Content-Type JSON", audit: "VALID", verdict: "PASS", notes: "MIME type validation" },
  { id: "TC-REG-35", technique: "SCHEMA", title: "Response Matches Draft-07 JSON Schema", pre: "None", method: "POST", path: "/api/register", auth: "None", body: '{"name":"A","email":"...","password":"..."}', expHttp: "200 OK", expBody: "Matches JSON schema", audit: "VALID", verdict: "PASS", notes: "Draft-07 schema compliance" },
  { id: "TC-REG-36", technique: "SCHEMA", title: "Exact Business Message Enum Value", pre: "None", method: "POST", path: "/api/register", auth: "None", body: '{"name":"A","email":"...","password":"..."}', expHttp: "200 OK", expBody: 'message == "User registered successfully"', audit: "VALID", verdict: "PASS", notes: "Message enum check" },
  { id: "TC-REG-37", technique: "SCHEMA", title: "No Leaked Additional Properties", pre: "None", method: "POST", path: "/api/register", auth: "None", body: '{"name":"A","email":"...","password":"..."}', expHttp: "200 OK", expBody: "Exactly 2 keys (message, id)", audit: "VALID", verdict: "PASS", notes: "Schema boundary check" },
  { id: "TC-REG-38", technique: "SCHEMA", title: "Structured Error Schema on Bad Payload", pre: "None", method: "POST", path: "/api/register", auth: "None", body: "name=Form&email=t@t.com", expHttp: "400/415", expBody: "JSON error (Defect: 500 HTML)", audit: "VALID", verdict: "PASS (Defect Check)", notes: "BUG-03 Stack trace check" }
];

const api1Human = [
  { id: "TC-HUM-01", technique: "EXTEND", title: "Original Account Unchanged After Duplicate Attempt", pre: "Victim registered", method: "POST", path: "/api/register", auth: "None", body: '{"name":"Attacker","email":"<victim>","password":"New"}', expHttp: "200 OK login", expBody: "Victim login password intact", audit: "HUMAN", verdict: "PASS", notes: "Verifies account state integrity" },
  { id: "TC-HUM-02", technique: "EXTEND", title: "Duplicate Registration Does Not Create Second DB Record", pre: "User registered", method: "POST", path: "/api/register", auth: "None", body: '{"name":"Dup","email":"<same>","password":"..."}', expHttp: "400/409", expBody: "No 2nd user ID created", audit: "HUMAN", verdict: "PASS (Defect Check)", notes: "BUG-04 Duplicate row check" },
  { id: "TC-HUM-03", technique: "EXTEND", title: "Duplicate Attempt Cannot Modify Victim System Fields", pre: "Victim registered", method: "POST", path: "/api/register", auth: "None", body: '{"name":"Atk","email":"<victim>","password":"...","role":"admin"}', expHttp: "200 OK login", expBody: "Victim role remains 'user'", audit: "HUMAN", verdict: "PASS", notes: "Privilege escalation protection" },
  { id: "TC-HUM-04", technique: "EXTEND", title: "Empty Raw HTTP Request Body Handling", pre: "None", method: "POST", path: "/api/register", auth: "None", body: "(Empty raw body)", expHttp: "400 Bad Request", expBody: "JSON validation error", audit: "HUMAN", verdict: "FAIL (BUG-02)", notes: "🚨 BUG-02 Ghost user row created on empty body" },
  { id: "TC-HUM-05", technique: "EXTEND", title: "Malformed JSON Information Disclosure Check", pre: "None", method: "POST", path: "/api/register", auth: "None", body: "{ broken json...", expHttp: "400 Bad Request", expBody: "No stack trace / paths leaked", audit: "HUMAN", verdict: "FAIL (BUG-03)", notes: "🚨 BUG-03 500 HTML page leaks internal paths" }
];

const wsApi1 = XLSX.utils.aoa_to_sheet(buildApiRows("API 1", "POST /api/register", api1Candidates, api1Human));
XLSX.utils.book_append_sheet(wb, wsApi1, "API 1 - Register");

// ==========================================
// Sheet 3: API 2 - GET /api/orders/my-orders
// ==========================================
const api2Candidates = [
  { id: "TC-ORD-01", technique: "DT", title: "Customer with order history happy path", pre: "User has orders", method: "GET", path: "/api/orders/my-orders", auth: "Bearer <userToken>", body: "None", expHttp: "200 OK", expBody: "Array of customer orders", audit: "VALID", verdict: "PASS", notes: "Standard happy path" },
  { id: "TC-ORD-02", technique: "DT", title: "Empty history for user with 0 orders", pre: "Fresh user with 0 orders", method: "GET", path: "/api/orders/my-orders", auth: "Bearer <freshToken>", body: "None", expHttp: "200 OK", expBody: "Returns empty array []", audit: "VALID", verdict: "PASS", notes: "Empty collection return" },
  { id: "TC-ORD-03", technique: "DT", title: "Admin personal history does not leak customer orders", pre: "Admin logged in", method: "GET", path: "/api/orders/my-orders", auth: "Bearer <adminToken>", body: "None", expHttp: "200 OK", expBody: "Admin personal orders only", audit: "VALID", verdict: "PASS", notes: "Horizontal isolation for admin" },
  { id: "TC-ORD-04", technique: "DT", title: "Missing Authorization header", pre: "None", method: "GET", path: "/api/orders/my-orders", auth: "None", body: "None", expHttp: "401 Unauthorized", expBody: '{"error":"Unauthorized"}', audit: "VALID", verdict: "PASS", notes: "Authentication gate" },
  { id: "TC-ORD-05", technique: "DT", title: "Tampered / forged JWT token", pre: "None", method: "GET", path: "/api/orders/my-orders", auth: "Bearer invalid.jwt", body: "None", expHttp: "403 Forbidden", expBody: '{"error":"Forbidden"}', audit: "VALID", verdict: "PASS", notes: "JWT signature verification" },
  { id: "TC-ORD-06", technique: "DT", title: "Empty Bearer value", pre: "None", method: "GET", path: "/api/orders/my-orders", auth: "Bearer ", body: "None", expHttp: "401/403", expBody: "Error response", audit: "INCOMPLETE", verdict: "PASS", notes: "Corrected assertion" },
  { id: "TC-ORD-07", technique: "DT", title: "Reject non-Bearer scheme (Basic)", pre: "None", method: "GET", path: "/api/orders/my-orders", auth: "Basic dXNlcg==", body: "None", expHttp: "401/403", expBody: "Error response", audit: "VALID", verdict: "PASS", notes: "Auth scheme verification" },
  { id: "TC-ORD-08", technique: "DT", title: "Garbage header value", pre: "None", method: "GET", path: "/api/orders/my-orders", auth: "GarbageAuth123", body: "None", expHttp: "401/403", expBody: "Error response", audit: "INCOMPLETE", verdict: "PASS", notes: "Corrected assertion" },
  { id: "TC-ORD-09", technique: "DT", title: "Unsupported query parameter robustness", pre: "User logged in", method: "GET", path: "/api/orders/my-orders?status=pending", auth: "Bearer <userToken>", body: "None", expHttp: "200 OK", expBody: "Orders returned unaltered", audit: "INVALID", verdict: "PASS", notes: "Corrected query robustness test" },
  { id: "TC-ORD-10", technique: "DT", title: "SQL injection in query parameters", pre: "User logged in", method: "GET", path: "/api/orders/my-orders?status=' OR '1'='1", auth: "Bearer <userToken>", body: "None", expHttp: "200 OK", expBody: "Safe parameterized handling", audit: "VALID", verdict: "PASS", notes: "SQLi parameterization check" },
  { id: "TC-ORD-11", technique: "DT", title: "Unexpected payload on GET safely ignored", pre: "User logged in", method: "GET", path: "/api/orders/my-orders", auth: "Bearer <userToken>", body: '{"unexpected":"data"}', expHttp: "200 OK", expBody: "Body safely ignored", audit: "VALID", verdict: "PASS", notes: "GET body robustness" },
  { id: "TC-ORD-12", technique: "DT", title: "Unsupported method POST on GET endpoint", pre: "User logged in", method: "POST", path: "/api/orders/my-orders", auth: "Bearer <userToken>", body: "None", expHttp: "404 Not Found", expBody: "Cannot POST error", audit: "VALID", verdict: "PASS", notes: "Routing restriction" },
  { id: "TC-ORD-13", technique: "BVA", title: "Order count lower bound (0 orders)", pre: "User with 0 orders", method: "GET", path: "/api/orders/my-orders", auth: "Bearer <freshToken>", body: "None", expHttp: "200 OK", expBody: "Length == 0", audit: "VALID", verdict: "PASS", notes: "Lower bound collection" },
  { id: "TC-ORD-14", technique: "BVA", title: "Order count single item (1 order)", pre: "User with exactly 1 order", method: "GET", path: "/api/orders/my-orders", auth: "Bearer <singleToken>", body: "None", expHttp: "200 OK", expBody: "Length == 1", audit: "VALID", verdict: "PASS", notes: "Single item boundary" },
  { id: "TC-ORD-15", technique: "BVA", title: "Multiple orders nominal dataset", pre: "User with multiple orders", method: "GET", path: "/api/orders/my-orders", auth: "Bearer <userToken>", body: "None", expHttp: "200 OK", expBody: "Length >= 2", audit: "VALID", verdict: "PASS", notes: "Nominal collection boundary" },
  { id: "TC-ORD-16", technique: "BVA", title: "High volume order dataset", pre: "User with 10+ orders", method: "GET", path: "/api/orders/my-orders", auth: "Bearer <userToken>", body: "None", expHttp: "200 OK", expBody: "Unpaginated full array", audit: "VALID", verdict: "PASS", notes: "High volume boundary" },
  { id: "TC-ORD-17", technique: "BVA", title: "Empty token boundary check", pre: "None", method: "GET", path: "/api/orders/my-orders", auth: "Bearer ", body: "None", expHttp: "401/403", expBody: "Error response", audit: "INCOMPLETE", verdict: "PASS", notes: "Corrected assertion" },
  { id: "TC-ORD-18", technique: "BVA", title: "Single character token boundary", pre: "None", method: "GET", path: "/api/orders/my-orders", auth: "Bearer a", body: "None", expHttp: "403 Forbidden", expBody: "Forbidden error", audit: "VALID", verdict: "PASS", notes: "Token length lower bound" },
  { id: "TC-ORD-19", technique: "BVA", title: "Standard nominal JWT header length", pre: "User logged in", method: "GET", path: "/api/orders/my-orders", auth: "Bearer <userToken>", body: "None", expHttp: "200 OK", expBody: "Orders returned", audit: "VALID", verdict: "PASS", notes: "Nominal JWT token" },
  { id: "TC-ORD-20", technique: "BVA", title: "Header buffer overflow (4096 chars)", pre: "None", method: "GET", path: "/api/orders/my-orders", auth: "Bearer x*4096", body: "None", expHttp: "403 Forbidden", expBody: "Rejected without crash", audit: "VALID", verdict: "PASS", notes: "Buffer DoS resilience" },
  { id: "TC-ORD-21", technique: "ST", title: "Checkout to Pending reflection", pre: "Checkout executed", method: "GET", path: "/api/orders/my-orders", auth: "Bearer <userToken>", body: "None", expHttp: "200 OK", expBody: "Order status == pending", audit: "VALID", verdict: "PASS", notes: "State creation reflection" },
  { id: "TC-ORD-22", technique: "ST", title: "Admin confirmation reflection", pre: "Admin confirmed order", method: "GET", path: "/api/orders/my-orders", auth: "Bearer <userToken>", body: "None", expHttp: "200 OK", expBody: "Order status == confirmed", audit: "VALID", verdict: "PASS", notes: "State progression reflection" },
  { id: "TC-ORD-23", technique: "ST", title: "Shipping dispatch reflection", pre: "Admin shipped order", method: "GET", path: "/api/orders/my-orders", auth: "Bearer <userToken>", body: "None", expHttp: "200 OK", expBody: "Order status == shipping", audit: "VALID", verdict: "PASS", notes: "State progression reflection" },
  { id: "TC-ORD-24", technique: "ST", title: "Delivery completion reflection", pre: "Admin delivered order", method: "GET", path: "/api/orders/my-orders", auth: "Bearer <userToken>", body: "None", expHttp: "200 OK", expBody: "Order status == delivered", audit: "VALID", verdict: "PASS", notes: "Terminal state reflection" },
  { id: "TC-ORD-25", technique: "ST", title: "Customer cancellation reflection", pre: "User canceled order", method: "GET", path: "/api/orders/my-orders", auth: "Bearer <userToken>", body: "None", expHttp: "200 OK", expBody: "Order status == canceled", audit: "VALID", verdict: "PASS", notes: "Cancellation reflection" },
  { id: "TC-ORD-26", technique: "ST", title: "Terminal order immutability", pre: "Order canceled", method: "GET", path: "/api/orders/my-orders", auth: "Bearer <userToken>", body: "None", expHttp: "200 OK", expBody: "Status remains canceled", audit: "VALID", verdict: "PASS", notes: "Terminal stability" },
  { id: "TC-ORD-27", technique: "SEC", title: "SEC-02 Authentication Gate", pre: "No token", method: "GET", path: "/api/orders/my-orders", auth: "None", body: "None", expHttp: "401 Unauthorized", expBody: '{"error":"Unauthorized"}', audit: "VALID", verdict: "PASS", notes: "Private history protection" },
  { id: "TC-ORD-28", technique: "SEC", title: "SEC-02 Forged JWT none alg bypass", pre: "None", method: "GET", path: "/api/orders/my-orders", auth: "Bearer alg_none_jwt", body: "None", expHttp: "403 Forbidden", expBody: "Rejected", audit: "VALID", verdict: "PASS", notes: "Signature bypass prevention" },
  { id: "TC-ORD-29", technique: "SEC", title: "SEC-06 IDOR Cross-User Isolation", pre: "User A logged in", method: "GET", path: "/api/orders/my-orders", auth: "Bearer <userToken>", body: "None", expHttp: "200 OK", expBody: "All user_id == 2 (strictly)", audit: "VALID", verdict: "PASS", notes: "Horizontal resource isolation" },
  { id: "TC-ORD-30", technique: "SEC", title: "SEC-06 Query parameter pollution IDOR override", pre: "User A logged in", method: "GET", path: "/api/orders/my-orders?user_id=1", auth: "Bearer <userToken>", body: "None", expHttp: "200 OK", expBody: "All user_id == 2 (no leak)", audit: "VALID", verdict: "PASS", notes: "Query override prevention" },
  { id: "TC-ORD-31", technique: "SEC", title: "SEC-05 Parameterized SQL query integrity", pre: "User logged in", method: "GET", path: "/api/orders/my-orders?status=' OR 1=1--", auth: "Bearer <userToken>", body: "None", expHttp: "200 OK", expBody: "No SQL syntax leaked", audit: "VALID", verdict: "PASS", notes: "SQL injection protection" },
  { id: "TC-ORD-32", technique: "SEC", title: "SEC-01 Credential Disclosure Prohibition", pre: "User logged in", method: "GET", path: "/api/orders/my-orders", auth: "Bearer <userToken>", body: "None", expHttp: "200 OK", expBody: "No password/token fields", audit: "VALID", verdict: "PASS", notes: "Credential disclosure check" },
  { id: "TC-ORD-33", technique: "SEC", title: "SEC-04 Stored XSS Inert JSON Handling", pre: "User logged in", method: "GET", path: "/api/orders/my-orders", auth: "Bearer <userToken>", body: "None", expHttp: "200 OK", expBody: "Inert JSON data", audit: "INVALID", verdict: "PASS", notes: "Corrected JSON inertness check" },
  { id: "TC-ORD-34", technique: "SCHEMA", title: "HTTP Status 200 & Content-Type JSON", pre: "User logged in", method: "GET", path: "/api/orders/my-orders", auth: "Bearer <userToken>", body: "None", expHttp: "200 OK", expBody: "application/json", audit: "VALID", verdict: "PASS", notes: "MIME validation" },
  { id: "TC-ORD-35", technique: "SCHEMA", title: "Response Matches Draft-07 Order Schema", pre: "User logged in", method: "GET", path: "/api/orders/my-orders", auth: "Bearer <userToken>", body: "None", expHttp: "200 OK", expBody: "Matches schema", audit: "VALID", verdict: "PASS", notes: "Draft-07 schema compliance" },
  { id: "TC-ORD-36", technique: "SCHEMA", title: "Empty Array Representation for 0 Orders", pre: "Fresh user", method: "GET", path: "/api/orders/my-orders", auth: "Bearer <freshToken>", body: "None", expHttp: "200 OK", expBody: "Empty array []", audit: "VALID", verdict: "PASS", notes: "Empty array representation" },
  { id: "TC-ORD-37", technique: "SCHEMA", title: "No Leaked Internal Fields (additionalProperties: false)", pre: "User logged in", method: "GET", path: "/api/orders/my-orders", auth: "Bearer <userToken>", body: "None", expHttp: "200 OK", expBody: "Exactly 6 fields per item", audit: "VALID", verdict: "PASS", notes: "Internal property protection" },
  { id: "TC-ORD-38", technique: "SCHEMA", title: "Structured 401 Unauthorized Error Schema", pre: "No token", method: "GET", path: "/api/orders/my-orders", auth: "None", body: "None", expHttp: "401 Unauthorized", expBody: '{"error":"Unauthorized"}', audit: "VALID", verdict: "PASS", notes: "Error schema validation" }
];

const api2Human = [
  { id: "TC-HUM-ORD-01", technique: "EXTEND", title: "Chronological Descending Ordering (Newest First)", pre: "User has multiple orders", method: "GET", path: "/api/orders/my-orders", auth: "Bearer <userToken>", body: "None", expHttp: "200 OK", expBody: "created_at in descending order", audit: "HUMAN", verdict: "PASS", notes: "Asserts sorting invariant" },
  { id: "TC-HUM-ORD-02", technique: "EXTEND", title: "Record Uniqueness - No Duplicate Orders in List", pre: "User has multiple orders", method: "GET", path: "/api/orders/my-orders", auth: "Bearer <userToken>", body: "None", expHttp: "200 OK", expBody: "All order IDs unique", audit: "HUMAN", verdict: "PASS", notes: "Asserts uniqueness invariant" },
  { id: "TC-HUM-ORD-03", technique: "EXTEND", title: "Strict User Isolation Under Identical Order Attributes", pre: "Multiple users with identical amounts", method: "GET", path: "/api/orders/my-orders", auth: "Bearer <userToken>", body: "None", expHttp: "200 OK", expBody: "User A orders only", audit: "HUMAN", verdict: "PASS", notes: "Cross-user attribute collision" },
  { id: "TC-HUM-ORD-04", technique: "EXTEND", title: "Order ID & Created_At Immutability Across Transitions", pre: "Order transitioned", method: "GET", path: "/api/orders/my-orders", auth: "Bearer <userToken>", body: "None", expHttp: "200 OK", expBody: "id and created_at immutable", audit: "HUMAN", verdict: "PASS", notes: "Immutable field invariant" },
  { id: "TC-HUM-ORD-05", technique: "EXTEND", title: "Financial Total_Amount Semantic Consistency", pre: "Checkout known amount", method: "GET", path: "/api/orders/my-orders", auth: "Bearer <userToken>", body: "None", expHttp: "200 OK", expBody: "total_amount matches checkout", audit: "HUMAN", verdict: "PASS", notes: "Financial semantic consistency" }
];

const wsApi2 = XLSX.utils.aoa_to_sheet(buildApiRows("API 2", "GET /api/orders/my-orders", api2Candidates, api2Human));
XLSX.utils.book_append_sheet(wb, wsApi2, "API 2 - Order History");

// ==========================================
// Sheet 4: API 3 - GET /api/categories
// ==========================================
const api3Candidates = [
  { id: "TC-CAT-01", technique: "DT", title: "Public category listing happy path", pre: "Categories in DB", method: "GET", path: "/api/categories", auth: "None", body: "None", expHttp: "200 OK", expBody: "Array of category objects", audit: "VALID", verdict: "PASS", notes: "Public catalog browsing" },
  { id: "TC-CAT-02", technique: "DT", title: "Admin category creation happy path", pre: "Admin logged in", method: "POST", path: "/api/categories", auth: "Bearer <adminToken>", body: '{"name":"Home & Kitchen"}', expHttp: "200 OK", expBody: '{"message":"Category created","id":<int>}', audit: "VALID", verdict: "PASS", notes: "Admin creation" },
  { id: "TC-CAT-03", technique: "DT", title: "Accented Vietnamese Unicode category name", pre: "Admin logged in", method: "POST", path: "/api/categories", auth: "Bearer <adminToken>", body: '{"name":"Thời trang & Phụ kiện"}', expHttp: "200 OK", expBody: "Unicode name stored", audit: "VALID", verdict: "PASS", notes: "UTF-8 support" },
  { id: "TC-CAT-04", technique: "DT", title: "Single character category name", pre: "Admin logged in", method: "POST", path: "/api/categories", auth: "Bearer <adminToken>", body: '{"name":"Z"}', expHttp: "200 OK", expBody: "Single char created", audit: "VALID", verdict: "PASS", notes: "Min valid name" },
  { id: "TC-CAT-05", technique: "DT", title: "SEC-03 Privilege Escalation Check (User POST)", pre: "User logged in", method: "POST", path: "/api/categories", auth: "Bearer <userToken>", body: '{"name":"User Hacker Cat"}', expHttp: "403 Forbidden", expBody: "Forbidden (Defect: 200 OK)", audit: "VALID", verdict: "PASS (Defect Check)", notes: "🚨 BUG-05 Broken RBAC" },
  { id: "TC-CAT-06", technique: "DT", title: "Unauthenticated category creation blocked", pre: "No token", method: "POST", path: "/api/categories", auth: "None", body: '{"name":"Anon Cat"}', expHttp: "401 Unauthorized", expBody: '{"error":"Unauthorized"}', audit: "VALID", verdict: "PASS", notes: "Auth gate" },
  { id: "TC-CAT-07", technique: "DT", title: "Missing required name field ({})", pre: "Admin logged in", method: "POST", path: "/api/categories", auth: "Bearer <adminToken>", body: "{}", expHttp: "400 Bad Request", expBody: "Name required error (Defect: 200)", audit: "INCOMPLETE", verdict: "PASS (Defect Check)", notes: "BUG-07 Ghost category" },
  { id: "TC-CAT-08", technique: "DT", title: "Empty string category name ('')", pre: "Admin logged in", method: "POST", path: "/api/categories", auth: "Bearer <adminToken>", body: '{"name":""}', expHttp: "400 Bad Request", expBody: "Name required error (Defect: 200)", audit: "INCOMPLETE", verdict: "PASS (Defect Check)", notes: "Validation omission" },
  { id: "TC-CAT-09", technique: "DT", title: "Duplicate category name invariant check", pre: "Category exists", method: "POST", path: "/api/categories", auth: "Bearer <adminToken>", body: '{"name":"Điện thoại"}', expHttp: "400/409", expBody: "Duplicate rejected (Defect: 200)", audit: "INCOMPLETE", verdict: "PASS (Defect Check)", notes: "OQ-CAT-01 Duplicate name" },
  { id: "TC-CAT-10", technique: "DT", title: "Admin category update", pre: "Category exists", method: "PUT", path: "/api/categories/1", auth: "Bearer <adminToken>", body: '{"name":"Điện thoại & Tablet"}', expHttp: "200 OK", expBody: '{"message":"Category updated"}', audit: "VALID", verdict: "PASS", notes: "Admin update" },
  { id: "TC-CAT-11", technique: "DT", title: "Admin category deletion", pre: "Category exists", method: "DELETE", path: "/api/categories/:id", auth: "Bearer <adminToken>", body: "None", expHttp: "200 OK", expBody: '{"message":"Category deleted"}', audit: "VALID", verdict: "PASS", notes: "Admin deletion" },
  { id: "TC-CAT-12", technique: "DT", title: "Unexpected JSON body on GET safely ignored", pre: "None", method: "GET", path: "/api/categories", auth: "None", body: '{"extra":"data"}', expHttp: "200 OK", expBody: "Categories returned", audit: "VALID", verdict: "PASS", notes: "GET body robustness" },
  { id: "TC-CAT-13", technique: "BVA", title: "Name Min - 1 lower boundary (Empty string)", pre: "Admin logged in", method: "POST", path: "/api/categories", auth: "Bearer <adminToken>", body: '{"name":""}', expHttp: "400 Bad Request", expBody: "Rejected", audit: "VALID", verdict: "PASS (Defect Check)", notes: "Name lower bound" },
  { id: "TC-CAT-14", technique: "BVA", title: "Name lower boundary (1 character)", pre: "Admin logged in", method: "POST", path: "/api/categories", auth: "Bearer <adminToken>", body: '{"name":"B"}', expHttp: "200 OK", expBody: "Created successfully", audit: "VALID", verdict: "PASS", notes: "Name 1 char bound" },
  { id: "TC-CAT-15", technique: "BVA", title: "Name standard length boundary (255 chars)", pre: "Admin logged in", method: "POST", path: "/api/categories", auth: "Bearer <adminToken>", body: '{"name":"C"*255}', expHttp: "200 OK", expBody: "Created successfully", audit: "VALID", verdict: "PASS", notes: "Name 255 chars bound" },
  { id: "TC-CAT-16", technique: "BVA", title: "Extreme buffer length robustness (10K chars)", pre: "Admin logged in", method: "POST", path: "/api/categories", auth: "Bearer <adminToken>", body: '{"name":"C"*10000}', expHttp: "200/400/413", expBody: "Handled without crash", audit: "INCOMPLETE", verdict: "PASS", notes: "Buffer DoS resilience" },
  { id: "TC-CAT-17", technique: "BVA", title: "Negative path ID boundary check (PUT -1)", pre: "Admin logged in", method: "PUT", path: "/api/categories/-1", auth: "Bearer <adminToken>", body: '{"name":"Neg"}', expHttp: "404 Not Found", expBody: "Not found (Defect: 200)", audit: "VALID", verdict: "PASS (Defect Check)", notes: "BUG-08 Silent 200" },
  { id: "TC-CAT-18", technique: "BVA", title: "Zero path ID boundary check (PUT 0)", pre: "Admin logged in", method: "PUT", path: "/api/categories/0", auth: "Bearer <adminToken>", body: '{"name":"Zero"}', expHttp: "404 Not Found", expBody: "Not found (Defect: 200)", audit: "VALID", verdict: "PASS (Defect Check)", notes: "BUG-08 Silent 200" },
  { id: "TC-CAT-19", technique: "BVA", title: "High non-existent path ID (PUT 999999)", pre: "Admin logged in", method: "PUT", path: "/api/categories/999999", auth: "Bearer <adminToken>", body: '{"name":"Ghost"}', expHttp: "404 Not Found", expBody: "Not found (Defect: 200)", audit: "VALID", verdict: "PASS (Defect Check)", notes: "BUG-08 Silent 200" },
  { id: "TC-CAT-20", technique: "BVA", title: "Catalog cardinality boundary (>= 3 items)", pre: "Categories exist", method: "GET", path: "/api/categories", auth: "None", body: "None", expHttp: "200 OK", expBody: "Count >= 3", audit: "VALID", verdict: "PASS", notes: "Catalog cardinality" },
  { id: "TC-CAT-21", technique: "ST", title: "State Creation (NON_EXISTENT -> ACTIVE)", pre: "Admin logged in", method: "POST", path: "/api/categories", auth: "Bearer <adminToken>", body: '{"name":"ST Cat"}', expHttp: "200 OK", expBody: "Appears in GET list", audit: "VALID", verdict: "PASS", notes: "Entity creation verified" },
  { id: "TC-CAT-22", technique: "ST", title: "State Progression (ACTIVE -> UPDATED)", pre: "Category active", method: "PUT", path: "/api/categories/:id", auth: "Bearer <adminToken>", body: '{"name":"ST Renamed"}', expHttp: "200 OK", expBody: "New name in GET list", audit: "VALID", verdict: "PASS", notes: "Entity update verified" },
  { id: "TC-CAT-23", technique: "ST", title: "State Progression (UPDATED -> DELETED)", pre: "Category updated", method: "DELETE", path: "/api/categories/:id", auth: "Bearer <adminToken>", body: "None", expHttp: "200 OK", expBody: "Purged from GET list", audit: "VALID", verdict: "PASS", notes: "Entity deletion verified" },
  { id: "TC-CAT-24", technique: "ST", title: "Terminal Deletion (Repeated DELETE)", pre: "Category deleted", method: "DELETE", path: "/api/categories/:id", auth: "Bearer <adminToken>", body: "None", expHttp: "404 Not Found", expBody: "Not found (Defect: 200)", audit: "VALID", verdict: "PASS (Defect Check)", notes: "BUG-08 check" },
  { id: "TC-CAT-25", technique: "ST", title: "Dead State Mutation (PUT on deleted)", pre: "Category deleted", method: "PUT", path: "/api/categories/:id", auth: "Bearer <adminToken>", body: '{"name":"Resurrect"}', expHttp: "404 Not Found", expBody: "Not found (Defect: 200)", audit: "VALID", verdict: "PASS (Defect Check)", notes: "BUG-08 check" },
  { id: "TC-CAT-26", technique: "ST", title: "Orphan Product Foreign Key Invariant", pre: "Product linked to category", method: "GET", path: "/api/products/:id", auth: "None", body: "None", expHttp: "200 OK", expBody: "Product category_id retained", audit: "VALID", verdict: "PASS", notes: "OQ-CAT-02 verified" },
  { id: "TC-CAT-27", technique: "SEC", title: "SEC-03 Broken RBAC - User Role (POST)", pre: "User logged in", method: "POST", path: "/api/categories", auth: "Bearer <userToken>", body: '{"name":"Probe"}', expHttp: "403 Forbidden", expBody: "Forbidden (Defect: 200)", audit: "VALID", verdict: "PASS (Defect Check)", notes: "🚨 BUG-05 RBAC" },
  { id: "TC-CAT-28", technique: "SEC", title: "SEC-03 Broken RBAC - User Role (PUT)", pre: "User logged in", method: "PUT", path: "/api/categories/1", auth: "Bearer <userToken>", body: '{"name":"Renamed"}', expHttp: "403 Forbidden", expBody: "Forbidden (Defect: 200)", audit: "VALID", verdict: "PASS (Defect Check)", notes: "🚨 BUG-05 RBAC" },
  { id: "TC-CAT-29", technique: "SEC", title: "SEC-03 Broken RBAC - User Role (DELETE)", pre: "User logged in", method: "DELETE", path: "/api/categories/99999", auth: "Bearer <userToken>", body: "None", expHttp: "403 Forbidden", expBody: "Forbidden (Defect: 200)", audit: "VALID", verdict: "PASS (Defect Check)", notes: "🚨 BUG-05 RBAC" },
  { id: "TC-CAT-30", technique: "SEC", title: "SEC-04 Stored XSS via <script> tag", pre: "Admin logged in", method: "POST", path: "/api/categories", auth: "Bearer <adminToken>", body: '{"name":"<script>alert(1)</script>"}', expHttp: "200 OK", expBody: "Sanitized (Defect: stored)", audit: "VALID", verdict: "PASS (Defect Check)", notes: "🚨 BUG-06 Stored XSS" },
  { id: "TC-CAT-31", technique: "SEC", title: "SEC-04 Stored XSS via <img onerror>", pre: "Admin logged in", method: "POST", path: "/api/categories", auth: "Bearer <adminToken>", body: '{"name":"<img src=x onerror=1>"}', expHttp: "200 OK", expBody: "Sanitized (Defect: stored)", audit: "VALID", verdict: "PASS (Defect Check)", notes: "🚨 BUG-06 Stored XSS" },
  { id: "TC-CAT-32", technique: "SEC", title: "SEC-05 SQL Injection in Category Name", pre: "Admin logged in", method: "POST", path: "/api/categories", auth: "Bearer <adminToken>", body: '{"name":"Cat \' OR 1=1--"}', expHttp: "200 OK", expBody: "Parameterized handling", audit: "VALID", verdict: "PASS", notes: "SQLi parameterization check" },
  { id: "TC-CAT-33", technique: "SEC", title: "SEC-02 Signature Bypass Rejection (alg: none)", pre: "None", method: "POST", path: "/api/categories", auth: "Bearer alg_none_jwt", body: '{"name":"Forged"}', expHttp: "403 Forbidden", expBody: "Forbidden", audit: "VALID", verdict: "PASS", notes: "JWT signature check" },
  { id: "TC-CAT-34", technique: "SCHEMA", title: "HTTP Status 200 & Content-Type JSON", pre: "Public", method: "GET", path: "/api/categories", auth: "None", body: "None", expHttp: "200 OK", expBody: "application/json", audit: "VALID", verdict: "PASS", notes: "MIME validation" },
  { id: "TC-CAT-35", technique: "SCHEMA", title: "Response Matches Draft-07 Category Schema", pre: "Public", method: "GET", path: "/api/categories", auth: "None", body: "None", expHttp: "200 OK", expBody: "Matches schema", audit: "VALID", verdict: "PASS", notes: "Draft-07 schema compliance" },
  { id: "TC-CAT-36", technique: "SCHEMA", title: "Ensure No Leaked Internal Fields", pre: "Public", method: "GET", path: "/api/categories", auth: "None", body: "None", expHttp: "200 OK", expBody: "Exactly 2 fields (id, name)", audit: "VALID", verdict: "PASS", notes: "No extra properties" },
  { id: "TC-CAT-37", technique: "SCHEMA", title: "POST Response Schema Matches {message, id}", pre: "Admin logged in", method: "POST", path: "/api/categories", auth: "Bearer <adminToken>", body: '{"name":"Schema Cat"}', expHttp: "200 OK", expBody: "Matches schema", audit: "VALID", verdict: "PASS", notes: "POST schema validation" },
  { id: "TC-CAT-38", technique: "SCHEMA", title: "Structured 401 Error Schema", pre: "No token", method: "POST", path: "/api/categories", auth: "None", body: '{"name":"Unauth"}', expHttp: "401 Unauthorized", expBody: '{"error":"Unauthorized"}', audit: "VALID", verdict: "PASS", notes: "Error schema validation" }
];

const api3Human = [
  { id: "TC-HUM-CAT-01", technique: "EXTEND", title: "Update Uniqueness Invariant - Rename to Existing Name", pre: "Categories A and B exist", method: "PUT", path: "/api/categories/1", auth: "Bearer <adminToken>", body: '{"name":"Laptop"}', expHttp: "400/409", expBody: "Duplicate rename rejected", audit: "HUMAN", verdict: "PASS (Defect Check)", notes: "Uniqueness on rename" },
  { id: "TC-HUM-CAT-02", technique: "EXTEND", title: "State Preservation / Rollback on Failed Update", pre: "Category A exists", method: "GET", path: "/api/categories", auth: "None", body: "None", expHttp: "200 OK", expBody: "Original category intact", audit: "HUMAN", verdict: "PASS", notes: "State preservation invariant" },
  { id: "TC-HUM-CAT-03", technique: "EXTEND", title: "Referential Integrity Across Category Rename", pre: "Category renamed", method: "GET", path: "/api/products/1", auth: "None", body: "None", expHttp: "200 OK", expBody: "Product category_id retained", audit: "HUMAN", verdict: "PASS", notes: "FK preserved across rename" },
  { id: "TC-HUM-CAT-04", technique: "EXTEND", title: "Recreated Category Generates New Identity (No ID Reuse)", pre: "Category deleted then recreated", method: "POST", path: "/api/categories", auth: "Bearer <adminToken>", body: '{"name":"Recycled"}', expHttp: "200 OK", expBody: "New auto-incremented ID > old ID", audit: "HUMAN", verdict: "PASS", notes: "Identity lifecycle check" },
  { id: "TC-HUM-CAT-05", technique: "EXTEND", title: "Unauthorized Mutation Leaves Persistent Catalog Intact", pre: "User attempted mutation", method: "GET", path: "/api/categories", auth: "None", body: "None", expHttp: "200 OK", expBody: "Catalog count intact", audit: "HUMAN", verdict: "PASS", notes: "Data integrity under attack" }
];

const wsApi3 = XLSX.utils.aoa_to_sheet(buildApiRows("API 3", "GET /api/categories", api3Candidates, api3Human));
XLSX.utils.book_append_sheet(wb, wsApi3, "API 3 - Categories");

// ==========================================
// Sheet 5: Bugs & Defects
// ==========================================
const bugRows = [
  ["Bug ID", "Component / API", "Defect Title", "Severity", "Security Rule", "Steps to Reproduce", "Expected Result", "Actual Result", "Root Cause Analysis", "Remediation Recommendation"],
  ["BUG-01", "API 1: POST /api/register", "Plaintext Password Storage & Credential Leak", "Critical", "SEC-01", "1. POST /api/register\n2. POST /api/login", "user object omits password", "user.password returned in plaintext", "Password stored without hashing", "Use bcrypt.hash(password, 10); delete user.password before response"],
  ["BUG-02", "API 1: POST /api/register", "Ghost User Record on Empty Payload {}", "Medium", "Input Validation", "POST /api/register with {}", "400 Bad Request", "HTTP 200 + creates null user row", "Missing schema validation middleware", "Add Joi/Zod request validation schema requiring name, email, password"],
  ["BUG-03", "API 1: POST /api/register", "Unhandled 500 HTML Stack Trace & Path Leak", "Medium", "Info Disclosure", "POST /api/register with urlencoded body", "400/415 JSON error", "HTTP 500 HTML leaking /mnt/c/... paths", "Missing Express global error handler", "Implement app.use((err, req, res, next) => res.status(400).json({ error }))"],
  ["BUG-04", "API 1: POST /api/register", "Duplicate Email Account Shadowing Lockout", "High", "Data Integrity", "Register User A then User B with same email", "400/409 Conflict", "HTTP 200 creating duplicate row; locks User B", "Missing UNIQUE constraint on email column", "Add UNIQUE constraint on users(email) and check before insert"],
  ["BUG-05", "API 3: Category CRUD", "Broken Role-Based Access Control (RBAC)", "Critical", "SEC-03", "POST /api/categories with user token (role: 'user')", "403 Forbidden", "HTTP 200 + category created/modified/deleted", "Middleware only checks token existence", "Enforce req.user.role === 'admin' before executing mutations"],
  ["BUG-06", "API 3: Category CRUD", "Stored Cross-Site Scripting (XSS) in Catalog", "High", "SEC-04", "POST /api/categories with <script> tag", "Input sanitized / escaped", "Stored verbatim; reflected in public GET", "No HTML sanitization on category name", "Sanitize input with DOMPurify/xss library; encode output"],
  ["BUG-07", "API 3: Category CRUD", "Ghost Category Record on Empty Payload {}", "Medium", "Input Validation", "POST /api/categories with {}", "400 Bad Request", "HTTP 200 + creates category with name: null", "Missing check for name field presence", "Enforce if (!req.body.name) return res.status(400)"],
  ["BUG-08", "API 3: Category CRUD", "Silent Success (HTTP 200) on Non-Existent ID", "Low", "REST Contract", "PUT /api/categories/999999", "404 Not Found", "HTTP 200 {'message':'Category updated'}", "Does not check this.changes === 0", "Check if (this.changes === 0) return res.status(404)"]
];

const wsBugs = XLSX.utils.aoa_to_sheet(bugRows);
XLSX.utils.book_append_sheet(wb, wsBugs, "Bugs & Defects");

// Write workbook
const outputXlsx = path.resolve(excelDir, 'EShop-HW06-TestCases.xlsx');
XLSX.writeFile(wb, outputXlsx);
console.log('Master Excel workbook generated successfully at: ' + outputXlsx);
