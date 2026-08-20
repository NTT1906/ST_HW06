const { execSync } = require('child_process');

const issues = [
  {
    title: "[BUG-01][SEC-01] Critical: Plaintext Password Storage and Credential Disclosure in /api/login",
    body: `### Summary\nThe SUT stores passwords in plaintext in the SQLite database and returns the plaintext password in the 'user.password' property on 'POST /api/login'.\n\n### Steps to Reproduce\n1. Send POST /api/register with password 'PlaintextSecret123!'\n2. Send POST /api/login with registered credentials\n\n### Expected Result\nPOST /api/login response should omit sensitive credential fields (user.password must be undefined).\n\n### Actual Result\nPOST /api/login returns user.password: 'PlaintextSecret123!'.\n\n### Severity & Security Mapping\n- **Severity:** Critical\n- **Requirement:** SEC-01 (Prohibition of Plaintext Passwords)`
  },
  {
    title: "[BUG-02] Medium: Ghost User Record Initialization on Empty Payload {} in /api/register",
    body: `### Summary\nSending an empty JSON payload {} to POST /api/register returns HTTP 200 OK and creates a ghost user record with null fields in the database.\n\n### Steps to Reproduce\n1. Send POST /api/register with body {}\n\n### Expected Result\nHTTP 400 Bad Request with structured validation error.\n\n### Actual Result\nHTTP 200 OK with {"message":"User registered successfully","id":<int>} and null fields in SQLite.\n\n### Severity\n- **Severity:** Medium (Input Validation Defect)`
  },
  {
    title: "[BUG-03] Medium: Unhandled Exception Stack Trace & Server Path Disclosure in /api/register",
    body: `### Summary\nSending non-JSON (e.g. application/x-www-form-urlencoded) payloads causes an unhandled server crash returning HTTP 500 HTML disclosing local server filesystem paths (/mnt/c/...).\n\n### Steps to Reproduce\n1. Send POST /api/register with Content-Type: application/x-www-form-urlencoded\n\n### Expected Result\nStructured JSON client error (400 Bad Request or 415 Unsupported Media Type).\n\n### Actual Result\nHTTP 500 Internal Server Error with raw stack trace HTML disclosing internal server directories.\n\n### Severity\n- **Severity:** Medium (Information Disclosure)`
  },
  {
    title: "[BUG-04] High: Duplicate Email Registration Permitted Resulting in Account Shadowing Lockout",
    body: `### Summary\nThe registration endpoint allows multiple accounts to be registered with the identical email address because the SQLite table lacks a UNIQUE constraint on email.\n\n### Steps to Reproduce\n1. Register User A with email: 'user@test.com', password: 'Pass1'\n2. Register User B with email: 'user@test.com', password: 'Pass2'\n3. Attempt login with User B credentials\n\n### Expected Result\nStep 2 should be rejected with HTTP 400/409 Conflict.\n\n### Actual Result\nStep 2 returns HTTP 200 OK. Downstream login query SELECT * FROM users WHERE email = ? only matches the first user, permanently locking out User B.\n\n### Severity\n- **Severity:** High (Data Integrity / Account Shadowing)`
  },
  {
    title: "[BUG-05][SEC-03] Critical: Broken Role-Based Access Control on Category Management APIs",
    body: `### Summary\nCustomer tokens (role: 'user') are permitted to execute administrative category creation (POST /api/categories), modification (PUT), and deletion (DELETE).\n\n### Steps to Reproduce\n1. Login as regular customer test@eshop.com (role: 'user')\n2. Send POST /api/categories with header Authorization: Bearer <customer_token> and body {"name":"User Hacker Cat"}\n\n### Expected Result\nHTTP 403 Forbidden ({"error": "Forbidden"}).\n\n### Actual Result\nHTTP 200 OK and category is created in database.\n\n### Severity & Security Mapping\n- **Severity:** Critical\n- **Requirement:** SEC-03 (Admin Role Verification)`
  },
  {
    title: "[BUG-06][SEC-04] High: Stored Cross-Site Scripting (XSS) in Public Catalog Category Names",
    body: `### Summary\nCategory names accept arbitrary HTML <script> and event handler tags without sanitization, which are stored in the database and returned unescaped in public GET /api/categories.\n\n### Steps to Reproduce\n1. Send POST /api/categories with {"name":"<script>alert('XSS')</script>"}\n2. Send GET /api/categories without authentication\n\n### Expected Result\nInput sanitized/stripped or HTML entities encoded prior to reflection.\n\n### Actual Result\nRaw <script> tags stored in SQLite and delivered in JSON payload to all storefront visitors.\n\n### Severity & Security Mapping\n- **Severity:** High\n- **Requirement:** SEC-04 (User Input Sanitization & XSS Prevention)`
  },
  {
    title: "[BUG-07] Medium: Ghost Category Record Initialization on Empty Payload {} in /api/categories",
    body: `### Summary\nSending {} to POST /api/categories creates a category with name: null.\n\n### Steps to Reproduce\n1. Send POST /api/categories with body {}\n\n### Expected Result\nHTTP 400 Bad Request requiring non-empty name string.\n\n### Actual Result\nHTTP 200 OK creating category { "id": <int>, "name": null }.\n\n### Severity\n- **Severity:** Medium (Input Validation Defect)`
  },
  {
    title: "[BUG-08] Low: Silent Success (HTTP 200) on Non-Existent Entity Update / Deletion",
    body: `### Summary\nSending PUT /api/categories/999999 or DELETE /api/categories/999999 returns HTTP 200 OK despite 0 database rows affected.\n\n### Steps to Reproduce\n1. Send PUT /api/categories/999999 with {"name":"Ghost"}\n\n### Expected Result\nHTTP 404 Not Found.\n\n### Actual Result\nHTTP 200 OK {"message":"Category updated"}.\n\n### Severity\n- **Severity:** Low (REST API Contract Compliance)`
  }
];

const results = [];
for (const item of issues) {
  try {
    const cmd = `gh issue create --repo NTT1906/ST_HW06 --title ${JSON.stringify(item.title)} --body ${JSON.stringify(item.body)}`;
    const output = execSync(cmd, { encoding: 'utf-8' }).trim();
    console.log(`Created Issue: ${output}`);
    results.push({ title: item.title, url: output });
  } catch (err) {
    console.error(`Failed to create issue "${item.title}":`, err.message);
  }
}

console.log('Finished creating GitHub issues. Total created: ' + results.length);
