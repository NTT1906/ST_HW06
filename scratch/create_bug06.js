const { spawnSync } = require('child_process');

const title = "[BUG-06][SEC-04] High: Stored Cross-Site Scripting (XSS) in Public Catalog Category Names";
const body = `### Summary
Category names accept arbitrary HTML script and event handler tags without sanitization, which are stored in the database and returned unescaped in public GET /api/categories.

### Steps to Reproduce
1. Send POST /api/categories with {"name":"<script>alert('XSS')</script>"}
2. Send GET /api/categories without authentication

### Expected Result
Input sanitized/stripped or HTML entities encoded prior to reflection.

### Actual Result
Raw script tags stored in SQLite and delivered in JSON payload to all storefront visitors.

### Severity & Security Mapping
- **Severity:** High
- **Requirement:** SEC-04 (User Input Sanitization & XSS Prevention)`;

const res = spawnSync('gh', ['issue', 'create', '--repo', 'NTT1906/ST_HW06', '--title', title, '--body', body], { encoding: 'utf-8' });
if (res.error) {
  console.error(res.error);
} else {
  console.log('Created BUG-06 issue:', res.stdout.trim());
}
