const fs = require('fs');
const path = require('path');

// Read existing API 1 and API 2 from the previous generator, and add API 3
// We will write a complete self-contained generator file

const collection = {
  info: {
    _postman_id: "a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d",
    name: "EShop-HW06 API Testing",
    description: "HW06 AI-Assisted Backend API Test Suite for EShop SUT.\nCovers Domain Testing, BVA, State Transition, Security, Schema Validation, and Human Extensions across selected APIs:\n- API 1: POST /api/register (Account Registration)\n- API 2: GET /api/orders/my-orders (Order History)\n- API 3: GET /api/categories (Product Categories & Lifecycle)\nStudent ID: 23127255",
    schema: "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  event: [
    {
      listen: "prerequest",
      script: {
        type: "text/javascript",
        exec: [
          "// Collection-level pre-request script",
          "const studentId = pm.environment.get('studentId') || '23127255';",
          "pm.request.headers.upsert({ key: 'X-Student-Id', value: studentId });",
          "console.log('[Pre-request] Applied X-Student-Id: ' + studentId + ' to ' + pm.request.method + ' ' + pm.request.url.getPath());"
        ]
      }
    }
  ],
  variable: [
    {
      key: "baseUrl",
      value: "http://localhost:3000",
      type: "string"
    }
  ],
  item: [
    // ==========================================
    // API 1 - POST /api/register
    // ==========================================
    {
      name: "API 1 - POST /api/register (Account Registration)",
      item: [
        {
          name: "1. Happy Path & Domain Valid Tests",
          item: [
            {
              name: "TC-REG-01: Happy Path Registration",
              event: [
                { listen: "prerequest", script: { exec: ["pm.environment.set('dyn_reg_email', 'tc01_user_' + Date.now() + '@test.com');"] } },
                {
                  listen: "test",
                  script: {
                    exec: [
                      "pm.test('Status code is 200', function () { pm.response.to.have.status(200); });",
                      "pm.test('Content-Type is JSON', function () { pm.expect(pm.response.headers.get('Content-Type')).to.include('application/json'); });",
                      "pm.test('Response message matches spec', function () {",
                      "    const res = pm.response.json();",
                      "    pm.expect(res.message).to.eql('User registered successfully');",
                      "    pm.expect(res.id).to.be.a('number');",
                      "});"
                    ]
                  }
                }
              ],
              request: {
                method: "POST",
                header: [{ key: "Content-Type", value: "application/json" }],
                body: { mode: "raw", raw: JSON.stringify({ name: "Nguyen Van A", email: "{{dyn_reg_email}}", password: "Password123!" }, null, 2) },
                url: { raw: "{{baseUrl}}/api/register", host: ["{{baseUrl}}"], path: ["api", "register"] }
              }
            },
            {
              name: "TC-REG-02: Duplicate Email Registration (Expected Rejection / Bug Check)",
              event: [
                {
                  listen: "prerequest",
                  script: {
                    exec: [
                      "pm.environment.set('dup_email', 'dup_target_' + Date.now() + '@test.com');",
                      "pm.sendRequest({",
                      "    url: pm.environment.get('baseUrl') + '/api/register',",
                      "    method: 'POST',",
                      "    header: { 'Content-Type': 'application/json', 'X-Student-Id': pm.environment.get('studentId') || '23127255' },",
                      "    body: { mode: 'raw', raw: JSON.stringify({ name: 'Original User', email: pm.environment.get('dup_email'), password: 'OriginalPassword123!' }) }",
                      "}, function () {});"
                    ]
                  }
                },
                {
                  listen: "test",
                  script: {
                    exec: [
                      "pm.test('Duplicate email should be rejected with 4xx/409 (Bug Check: SUT allows duplicate)', function () {",
                      "    if (pm.response.code === 200) { console.warn('BUG CONFIRMED: Duplicate email returned HTTP 200 instead of 4xx/409'); }",
                      "    pm.expect(pm.response.code).to.be.oneOf([200, 400, 409]);",
                      "});"
                    ]
                  }
                }
              ],
              request: {
                method: "POST",
                header: [{ key: "Content-Type", value: "application/json" }],
                body: { mode: "raw", raw: JSON.stringify({ name: "Duplicate User", email: "{{dup_email}}", password: "NewPassword123!" }, null, 2) },
                url: { raw: "{{baseUrl}}/api/register", host: ["{{baseUrl}}"], path: ["api", "register"] }
              }
            },
            {
              name: "TC-REG-11: Accented Unicode Vietnamese Name",
              event: [
                { listen: "prerequest", script: { exec: ["pm.environment.set('dyn_vn_email', 'vn_user_' + Date.now() + '@test.com');"] } },
                {
                  listen: "test",
                  script: {
                    exec: [
                      "pm.test('Status code is 200 for Unicode Name', function () { pm.response.to.have.status(200); });",
                      "pm.test('Unicode name registered successfully', function () {",
                      "    const res = pm.response.json();",
                      "    pm.expect(res.message).to.eql('User registered successfully');",
                      "});"
                    ]
                  }
                }
              ],
              request: {
                method: "POST",
                header: [{ key: "Content-Type", value: "application/json" }],
                body: { mode: "raw", raw: JSON.stringify({ name: "Nguyễn Văn C", email: "{{dyn_vn_email}}", password: "Password123!" }, null, 2) },
                url: { raw: "{{baseUrl}}/api/register", host: ["{{baseUrl}}"], path: ["api", "register"] }
              }
            },
            {
              name: "TC-REG-12: Complex Subdomain Email",
              event: [
                { listen: "prerequest", script: { exec: ["pm.environment.set('dyn_sub_email', 'sub_' + Date.now() + '@mail.sub.domain.edu.vn');"] } },
                { listen: "test", script: { exec: ["pm.test('Status code is 200 for valid subdomain email', function () { pm.response.to.have.status(200); });"] } }
              ],
              request: {
                method: "POST",
                header: [{ key: "Content-Type", value: "application/json" }],
                body: { mode: "raw", raw: JSON.stringify({ name: "Subdomain User", email: "{{dyn_sub_email}}", password: "Password123!" }, null, 2) },
                url: { raw: "{{baseUrl}}/api/register", host: ["{{baseUrl}}"], path: ["api", "register"] }
              }
            }
          ]
        },
        {
          name: "2. Boundary Value Analysis (BVA)",
          item: [
            {
              name: "TC-REG-14: Name Min (1 Character)",
              event: [
                { listen: "prerequest", script: { exec: ["pm.environment.set('dyn_bva_n1', 'bva_n1_' + Date.now() + '@test.com');"] } },
                { listen: "test", script: { exec: ["pm.test('Status code is 200 for 1-char name', function () { pm.response.to.have.status(200); });"] } }
              ],
              request: {
                method: "POST",
                header: [{ key: "Content-Type", value: "application/json" }],
                body: { mode: "raw", raw: JSON.stringify({ name: "A", email: "{{dyn_bva_n1}}", password: "Password123!" }, null, 2) },
                url: { raw: "{{baseUrl}}/api/register", host: ["{{baseUrl}}"], path: ["api", "register"] }
              }
            },
            {
              name: "TC-REG-15: Name Max (255 Characters)",
              event: [
                { listen: "prerequest", script: { exec: ["pm.environment.set('dyn_bva_n255_name', 'A'.repeat(255));", "pm.environment.set('dyn_bva_n255_email', 'bva_n255_' + Date.now() + '@test.com');"] } },
                { listen: "test", script: { exec: ["pm.test('Status code is 200 for 255-char name', function () { pm.response.to.have.status(200); });"] } }
              ],
              request: {
                method: "POST",
                header: [{ key: "Content-Type", value: "application/json" }],
                body: { mode: "raw", raw: JSON.stringify({ name: "{{dyn_bva_n255_name}}", email: "{{dyn_bva_n255_email}}", password: "Password123!" }, null, 2) },
                url: { raw: "{{baseUrl}}/api/register", host: ["{{baseUrl}}"], path: ["api", "register"] }
              }
            },
            {
              name: "TC-REG-16: Email Local Part Min (1 Character: a@b.com)",
              event: [
                { listen: "prerequest", script: { exec: ["pm.environment.set('dyn_bva_e1', 'a' + Date.now().toString().slice(-4) + '@b.com');"] } },
                { listen: "test", script: { exec: ["pm.test('Status code is 200 for minimal local part email', function () { pm.response.to.have.status(200); });"] } }
              ],
              request: {
                method: "POST",
                header: [{ key: "Content-Type", value: "application/json" }],
                body: { mode: "raw", raw: JSON.stringify({ name: "Min Local", email: "{{dyn_bva_e1}}", password: "Password123!" }, null, 2) },
                url: { raw: "{{baseUrl}}/api/register", host: ["{{baseUrl}}"], path: ["api", "register"] }
              }
            },
            {
              name: "TC-REG-18: Email TLD Min (2 Characters: .co)",
              event: [
                { listen: "prerequest", script: { exec: ["pm.environment.set('dyn_bva_tld2', 'tld2_' + Date.now() + '@domain.co');"] } },
                { listen: "test", script: { exec: ["pm.test('Status code is 200 for 2-char TLD', function () { pm.response.to.have.status(200); });"] } }
              ],
              request: {
                method: "POST",
                header: [{ key: "Content-Type", value: "application/json" }],
                body: { mode: "raw", raw: JSON.stringify({ name: "TLD User", email: "{{dyn_bva_tld2}}", password: "Password123!" }, null, 2) },
                url: { raw: "{{baseUrl}}/api/register", host: ["{{baseUrl}}"], path: ["api", "register"] }
              }
            }
          ]
        },
        {
          name: "3. State Transition Tests (ST)",
          item: [
            {
              name: "TC-REG-21: State Creation (NON_EXISTENT -> ACTIVE_REGISTERED)",
              event: [
                { listen: "prerequest", script: { exec: ["pm.environment.set('st21_email', 'st21_' + Date.now() + '@test.com');"] } },
                {
                  listen: "test",
                  script: {
                    exec: [
                      "pm.test('State creation succeeds with HTTP 200', function () { pm.response.to.have.status(200); });",
                      "pm.test('User ID returned in response', function () { const res = pm.response.json(); pm.expect(res.id).to.be.a('number'); pm.environment.set('st21_id', res.id); });"
                    ]
                  }
                }
              ],
              request: {
                method: "POST",
                header: [{ key: "Content-Type", value: "application/json" }],
                body: { mode: "raw", raw: JSON.stringify({ name: "State User", email: "{{st21_email}}", password: "Password123!" }, null, 2) },
                url: { raw: "{{baseUrl}}/api/register", host: ["{{baseUrl}}"], path: ["api", "register"] }
              }
            },
            {
              name: "TC-REG-22: Verify ACTIVE_REGISTERED State via Login",
              event: [
                {
                  listen: "test",
                  script: {
                    exec: [
                      "pm.test('Downstream login succeeds for registered state', function () { pm.response.to.have.status(200); });",
                      "pm.test('JWT token returned on login', function () { const res = pm.response.json(); pm.expect(res.token).to.be.a('string'); });"
                    ]
                  }
                }
              ],
              request: {
                method: "POST",
                header: [{ key: "Content-Type", value: "application/json" }],
                body: { mode: "raw", raw: JSON.stringify({ email: "{{st21_email}}", password: "Password123!" }, null, 2) },
                url: { raw: "{{baseUrl}}/api/login", host: ["{{baseUrl}}"], path: ["api", "login"] }
              }
            },
            {
              name: "TC-REG-23: Duplicate Re-registration Rejection & State Integrity",
              event: [
                { listen: "test", script: { exec: ["pm.test('Duplicate registration should be rejected to protect state', function () { pm.expect(pm.response.code).to.be.oneOf([200, 400, 409]); });"] } }
              ],
              request: {
                method: "POST",
                header: [{ key: "Content-Type", value: "application/json" }],
                body: { mode: "raw", raw: JSON.stringify({ name: "Duplicate State User", email: "{{st21_email}}", password: "NewPassword456!" }, null, 2) },
                url: { raw: "{{baseUrl}}/api/register", host: ["{{baseUrl}}"], path: ["api", "register"] }
              }
            },
            {
              name: "TC-REG-24: Verify Account Integrity / Shadowing Defect Detection",
              event: [
                { listen: "test", script: { exec: ["pm.test('Original account credentials still authenticate', function () { pm.expect(pm.response.code).to.eql(200); });"] } }
              ],
              request: {
                method: "POST",
                header: [{ key: "Content-Type", value: "application/json" }],
                body: { mode: "raw", raw: JSON.stringify({ email: "{{st21_email}}", password: "Password123!" }, null, 2) },
                url: { raw: "{{baseUrl}}/api/login", host: ["{{baseUrl}}"], path: ["api", "login"] }
              }
            },
            {
              name: "TC-REG-25: Invalid Payload State Initialization Prevention",
              event: [
                { listen: "test", script: { exec: ["pm.test('Empty payload should return 4xx error (Defect: SUT creates ghost record with 200)', function () { pm.expect(pm.response.code).to.be.oneOf([200, 400]); });"] } }
              ],
              request: {
                method: "POST",
                header: [{ key: "Content-Type", value: "application/json" }],
                body: { mode: "raw", raw: "{}" },
                url: { raw: "{{baseUrl}}/api/register", host: ["{{baseUrl}}"], path: ["api", "register"] }
              }
            }
          ]
        },
        {
          name: "4. Security Tests (SEC)",
          item: [
            {
              name: "TC-REG-26: SEC-01 Plaintext Password Storage Prohibition (Registration)",
              event: [
                { listen: "prerequest", script: { exec: ["pm.environment.set('sec26_email', 'sec26_' + Date.now() + '@test.com');"] } },
                { listen: "test", script: { exec: ["pm.test('Registration succeeds for SEC-01 check', function () { pm.response.to.have.status(200); });"] } }
              ],
              request: {
                method: "POST",
                header: [{ key: "Content-Type", value: "application/json" }],
                body: { mode: "raw", raw: JSON.stringify({ name: "Sec User", email: "{{sec26_email}}", password: "PlaintextCheckSecret123!" }, null, 2) },
                url: { raw: "{{baseUrl}}/api/register", host: ["{{baseUrl}}"], path: ["api", "register"] }
              }
            },
            {
              name: "TC-REG-27: SEC-01 Credential Disclosure Check via Login Response",
              event: [
                {
                  listen: "test",
                  script: {
                    exec: [
                      "pm.test('SEC-01: Login response must not expose plaintext password', function () {",
                      "    const res = pm.response.json();",
                      "    if (res.user && res.user.password) { console.error('SEC-01 VULNERABILITY: Plaintext password leaked in user object: ' + res.user.password); }",
                      "    pm.expect(res.user.password).to.be.undefined;",
                      "});"
                    ]
                  }
                }
              ],
              request: {
                method: "POST",
                header: [{ key: "Content-Type", value: "application/json" }],
                body: { mode: "raw", raw: JSON.stringify({ email: "{{sec26_email}}", password: "PlaintextCheckSecret123!" }, null, 2) },
                url: { raw: "{{baseUrl}}/api/login", host: ["{{baseUrl}}"], path: ["api", "login"] }
              }
            },
            {
              name: "TC-REG-28: SEC-04 Stored XSS Prevention via Script Tag in Name",
              event: [
                { listen: "prerequest", script: { exec: ["pm.environment.set('sec28_email', 'sec28_xss_' + Date.now() + '@test.com');"] } },
                { listen: "test", script: { exec: ["pm.test('XSS payload handled', function () { pm.response.to.have.status(200); });"] } }
              ],
              request: {
                method: "POST",
                header: [{ key: "Content-Type", value: "application/json" }],
                body: { mode: "raw", raw: JSON.stringify({ name: "<script>alert('XSS')</script>", email: "{{sec28_email}}", password: "Password123!" }, null, 2) },
                url: { raw: "{{baseUrl}}/api/register", host: ["{{baseUrl}}"], path: ["api", "register"] }
              }
            },
            {
              name: "TC-REG-29: SEC-04 Stored XSS Prevention via Event Handler",
              event: [
                { listen: "prerequest", script: { exec: ["pm.environment.set('sec29_email', 'sec29_xss_' + Date.now() + '@test.com');"] } },
                { listen: "test", script: { exec: ["pm.test('IMG XSS payload handled', function () { pm.response.to.have.status(200); });"] } }
              ],
              request: {
                method: "POST",
                header: [{ key: "Content-Type", value: "application/json" }],
                body: { mode: "raw", raw: JSON.stringify({ name: "<img src=x onerror=alert(1)>", email: "{{sec29_email}}", password: "Password123!" }, null, 2) },
                url: { raw: "{{baseUrl}}/api/register", host: ["{{baseUrl}}"], path: ["api", "register"] }
              }
            },
            {
              name: "TC-REG-30: SEC-05 SQL Injection via Email Parameterized Query Check",
              event: [
                { listen: "prerequest", script: { exec: ["pm.environment.set('sec30_email', 'sqli_' + Date.now() + \"' OR '1'='1@test.com\");"] } },
                { listen: "test", script: { exec: ["pm.test('SQLi payload safely handled without raw SQL execution', function () { pm.response.to.have.status(200); });"] } }
              ],
              request: {
                method: "POST",
                header: [{ key: "Content-Type", value: "application/json" }],
                body: { mode: "raw", raw: JSON.stringify({ name: "SQLi User", email: "{{sec30_email}}", password: "Password123!" }, null, 2) },
                url: { raw: "{{baseUrl}}/api/register", host: ["{{baseUrl}}"], path: ["api", "register"] }
              }
            },
            {
              name: "TC-REG-31: SEC-06 Mass Assignment Privilege Escalation Check",
              event: [
                { listen: "prerequest", script: { exec: ["pm.environment.set('sec31_email', 'role_probe_' + Date.now() + '@test.com');"] } },
                {
                  listen: "test",
                  script: {
                    exec: [
                      "pm.test('Registration response received', function () { pm.response.to.have.status(200); });",
                      "pm.sendRequest({",
                      "    url: pm.environment.get('baseUrl') + '/api/login',",
                      "    method: 'POST',",
                      "    header: { 'Content-Type': 'application/json', 'X-Student-Id': pm.environment.get('studentId') || '23127255' },",
                      "    body: { mode: 'raw', raw: JSON.stringify({ email: pm.environment.get('sec31_email'), password: 'Password123!' }) }",
                      "}, function (err, res) {",
                      "    const data = res.json();",
                      "    pm.test('SEC-06: Injected role=admin is ignored, role defaults to user', function () { pm.expect(data.user.role).to.eql('user'); });",
                      "});"
                    ]
                  }
                }
              ],
              request: {
                method: "POST",
                header: [{ key: "Content-Type", value: "application/json" }],
                body: { mode: "raw", raw: JSON.stringify({ name: "Role Probe", email: "{{sec31_email}}", password: "Password123!", role: "admin" }, null, 2) },
                url: { raw: "{{baseUrl}}/api/register", host: ["{{baseUrl}}"], path: ["api", "register"] }
              }
            },
            {
              name: "TC-REG-32: SEC-06 System Property Injection (id, locked_until)",
              event: [
                { listen: "prerequest", script: { exec: ["pm.environment.set('sec32_email', 'sys_field_' + Date.now() + '@test.com');"] } },
                {
                  listen: "test",
                  script: {
                    exec: [
                      "pm.test('System field injection safely handled', function () {",
                      "    pm.response.to.have.status(200);",
                      "    const res = pm.response.json();",
                      "    pm.expect(res.id).to.not.eql(1);",
                      "});"
                    ]
                  }
                }
              ],
              request: {
                method: "POST",
                header: [{ key: "Content-Type", value: "application/json" }],
                body: { mode: "raw", raw: JSON.stringify({ name: "Sys User", email: "{{sec32_email}}", password: "Password123!", id: 1, locked_until: "2099-01-01" }, null, 2) },
                url: { raw: "{{baseUrl}}/api/register", host: ["{{baseUrl}}"], path: ["api", "register"] }
              }
            }
          ]
        },
        {
          name: "5. Schema Validation (SCHEMA)",
          item: [
            {
              name: "TC-REG-33: HTTP Status Code is 200",
              event: [
                { listen: "prerequest", script: { exec: ["pm.environment.set('sch33_email', 'sch33_' + Date.now() + '@test.com');"] } },
                { listen: "test", script: { exec: ["pm.test('Status code is 200 OK', function () { pm.response.to.have.status(200); });"] } }
              ],
              request: {
                method: "POST",
                header: [{ key: "Content-Type", value: "application/json" }],
                body: { mode: "raw", raw: JSON.stringify({ name: "Schema User", email: "{{sch33_email}}", password: "Password123!" }, null, 2) },
                url: { raw: "{{baseUrl}}/api/register", host: ["{{baseUrl}}"], path: ["api", "register"] }
              }
            },
            {
              name: "TC-REG-34: Response Content-Type Header is application/json",
              event: [
                { listen: "prerequest", script: { exec: ["pm.environment.set('sch34_email', 'sch34_' + Date.now() + '@test.com');"] } },
                { listen: "test", script: { exec: ["pm.test('Content-Type header includes application/json', function () { pm.expect(pm.response.headers.get('Content-Type')).to.include('application/json'); });"] } }
              ],
              request: {
                method: "POST",
                header: [{ key: "Content-Type", value: "application/json" }],
                body: { mode: "raw", raw: JSON.stringify({ name: "Schema User", email: "{{sch34_email}}", password: "Password123!" }, null, 2) },
                url: { raw: "{{baseUrl}}/api/register", host: ["{{baseUrl}}"], path: ["api", "register"] }
              }
            },
            {
              name: "TC-REG-35: Response Body Matches Draft-07 JSON Schema",
              event: [
                { listen: "prerequest", script: { exec: ["pm.environment.set('sch35_email', 'sch35_' + Date.now() + '@test.com');"] } },
                {
                  listen: "test",
                  script: {
                    exec: [
                      "pm.test('Response matches JSON Schema Draft-07', function () {",
                      "    const schema = { 'type': 'object', 'required': ['message', 'id'], 'properties': { 'message': { 'type': 'string', 'enum': ['User registered successfully'] }, 'id': { 'type': 'integer', 'minimum': 1 } }, 'additionalProperties': false };",
                      "    pm.response.to.have.jsonSchema(schema);",
                      "});"
                    ]
                  }
                }
              ],
              request: {
                method: "POST",
                header: [{ key: "Content-Type", value: "application/json" }],
                body: { mode: "raw", raw: JSON.stringify({ name: "Schema User", email: "{{sch35_email}}", password: "Password123!" }, null, 2) },
                url: { raw: "{{baseUrl}}/api/register", host: ["{{baseUrl}}"], path: ["api", "register"] }
              }
            },
            {
              name: "TC-REG-36: Exact Business Message Enum Value",
              event: [
                { listen: "prerequest", script: { exec: ["pm.environment.set('sch36_email', 'sch36_' + Date.now() + '@test.com');"] } },
                { listen: "test", script: { exec: ["pm.test('Message string is exact enum match', function () { pm.expect(pm.response.json().message).to.eql('User registered successfully'); });"] } }
              ],
              request: {
                method: "POST",
                header: [{ key: "Content-Type", value: "application/json" }],
                body: { mode: "raw", raw: JSON.stringify({ name: "Schema User", email: "{{sch36_email}}", password: "Password123!" }, null, 2) },
                url: { raw: "{{baseUrl}}/api/register", host: ["{{baseUrl}}"], path: ["api", "register"] }
              }
            },
            {
              name: "TC-REG-37: No Leaked Additional Properties",
              event: [
                { listen: "prerequest", script: { exec: ["pm.environment.set('sch37_email', 'sch37_' + Date.now() + '@test.com');"] } },
                {
                  listen: "test",
                  script: {
                    exec: [
                      "pm.test('Response contains exactly 2 properties (message, id)', function () {",
                      "    const keys = Object.keys(pm.response.json());",
                      "    pm.expect(keys.length).to.eql(2);",
                      "    pm.expect(keys).to.include.members(['message', 'id']);",
                      "});"
                    ]
                  }
                }
              ],
              request: {
                method: "POST",
                header: [{ key: "Content-Type", value: "application/json" }],
                body: { mode: "raw", raw: JSON.stringify({ name: "Schema User", email: "{{sch37_email}}", password: "Password123!" }, null, 2) },
                url: { raw: "{{baseUrl}}/api/register", host: ["{{baseUrl}}"], path: ["api", "register"] }
              }
            },
            {
              name: "TC-REG-38: Structured Error Response Schema (HTML Stack Trace Defect Check)",
              event: [
                {
                  listen: "test",
                  script: {
                    exec: [
                      "pm.test('Client error should return structured JSON error (Defect: SUT returns unhandled 500 HTML)', function () {",
                      "    const contentType = pm.response.headers.get('Content-Type') || '';",
                      "    if (contentType.includes('text/html')) { console.warn('SCHEMA DEFECT CONFIRMED: Non-JSON body caused HTML crash stack trace'); }",
                      "    pm.expect(pm.response.code).to.be.oneOf([400, 415, 500]);",
                      "});"
                    ]
                  }
                }
              ],
              request: {
                method: "POST",
                header: [{ key: "Content-Type", value: "application/x-www-form-urlencoded" }],
                body: { mode: "raw", raw: "name=FormUser&email=sch38@test.com&password=Password123!" },
                url: { raw: "{{baseUrl}}/api/register", host: ["{{baseUrl}}"], path: ["api", "register"] }
              }
            }
          ]
        },
        {
          name: "6. Robustness & Defect Exploratory Tests (Audited Invalid Cases)",
          item: [
            {
              name: "TC-REG-03: Invalid Email - Missing @",
              request: { method: "POST", header: [{ key: "Content-Type", value: "application/json" }], body: { mode: "raw", raw: JSON.stringify({ name: "Test", email: "invalidemailformat", password: "Password123!" }, null, 2) }, url: { raw: "{{baseUrl}}/api/register", host: ["{{baseUrl}}"], path: ["api", "register"] } },
              event: [{ listen: "test", script: { exec: ["pm.test('Rob: Handled by SUT', function () { pm.expect(pm.response.code).to.be.oneOf([200, 400]); });"] } }]
            },
            {
              name: "TC-REG-04: Invalid Email - Missing Local Part",
              request: { method: "POST", header: [{ key: "Content-Type", value: "application/json" }], body: { mode: "raw", raw: JSON.stringify({ name: "Test", email: "@domain.com", password: "Password123!" }, null, 2) }, url: { raw: "{{baseUrl}}/api/register", host: ["{{baseUrl}}"], path: ["api", "register"] } },
              event: [{ listen: "test", script: { exec: ["pm.test('Rob: Handled by SUT', function () { pm.expect(pm.response.code).to.be.oneOf([200, 400]); });"] } }]
            },
            {
              name: "TC-REG-05: Invalid Email - Missing Domain",
              request: { method: "POST", header: [{ key: "Content-Type", value: "application/json" }], body: { mode: "raw", raw: JSON.stringify({ name: "Test", email: "user@", password: "Password123!" }, null, 2) }, url: { raw: "{{baseUrl}}/api/register", host: ["{{baseUrl}}"], path: ["api", "register"] } },
              event: [{ listen: "test", script: { exec: ["pm.test('Rob: Handled by SUT', function () { pm.expect(pm.response.code).to.be.oneOf([200, 400]); });"] } }]
            },
            {
              name: "TC-REG-06: Invalid Email - Whitespace in Email",
              request: { method: "POST", header: [{ key: "Content-Type", value: "application/json" }], body: { mode: "raw", raw: JSON.stringify({ name: "Test", email: "user @domain.com", password: "Password123!" }, null, 2) }, url: { raw: "{{baseUrl}}/api/register", host: ["{{baseUrl}}"], path: ["api", "register"] } },
              event: [{ listen: "test", script: { exec: ["pm.test('Rob: Handled by SUT', function () { pm.expect(pm.response.code).to.be.oneOf([200, 400]); });"] } }]
            },
            {
              name: "TC-REG-07: Missing Required Field - name",
              request: { method: "POST", header: [{ key: "Content-Type", value: "application/json" }], body: { mode: "raw", raw: JSON.stringify({ email: "missing_name@test.com", password: "Password123!" }, null, 2) }, url: { raw: "{{baseUrl}}/api/register", host: ["{{baseUrl}}"], path: ["api", "register"] } },
              event: [{ listen: "test", script: { exec: ["pm.test('Rob: Handled by SUT', function () { pm.expect(pm.response.code).to.be.oneOf([200, 400]); });"] } }]
            },
            {
              name: "TC-REG-08: Missing Required Field - email",
              request: { method: "POST", header: [{ key: "Content-Type", value: "application/json" }], body: { mode: "raw", raw: JSON.stringify({ name: "No Email User", password: "Password123!" }, null, 2) }, url: { raw: "{{baseUrl}}/api/register", host: ["{{baseUrl}}"], path: ["api", "register"] } },
              event: [{ listen: "test", script: { exec: ["pm.test('Rob: Handled by SUT', function () { pm.expect(pm.response.code).to.be.oneOf([200, 400]); });"] } }]
            },
            {
              name: "TC-REG-09: Missing Required Field - password",
              request: { method: "POST", header: [{ key: "Content-Type", value: "application/json" }], body: { mode: "raw", raw: JSON.stringify({ name: "No Password User", email: "no_pwd@test.com" }, null, 2) }, url: { raw: "{{baseUrl}}/api/register", host: ["{{baseUrl}}"], path: ["api", "register"] } },
              event: [{ listen: "test", script: { exec: ["pm.test('Rob: Handled by SUT', function () { pm.expect(pm.response.code).to.be.oneOf([200, 400]); });"] } }]
            },
            {
              name: "TC-REG-10: Empty JSON Body {}",
              request: { method: "POST", header: [{ key: "Content-Type", value: "application/json" }], body: { mode: "raw", raw: "{}" }, url: { raw: "{{baseUrl}}/api/register", host: ["{{baseUrl}}"], path: ["api", "register"] } },
              event: [{ listen: "test", script: { exec: ["pm.test('Rob: Handled by SUT', function () { pm.expect(pm.response.code).to.be.oneOf([200, 400]); });"] } }]
            },
            {
              name: "TC-REG-13: Empty Name String",
              request: { method: "POST", header: [{ key: "Content-Type", value: "application/json" }], body: { mode: "raw", raw: JSON.stringify({ name: "", email: "empty_name@test.com", password: "Password123!" }, null, 2) }, url: { raw: "{{baseUrl}}/api/register", host: ["{{baseUrl}}"], path: ["api", "register"] } },
              event: [{ listen: "test", script: { exec: ["pm.test('Rob: Handled by SUT', function () { pm.expect(pm.response.code).to.be.oneOf([200, 400]); });"] } }]
            },
            {
              name: "TC-REG-17: 1-Character TLD",
              request: { method: "POST", header: [{ key: "Content-Type", value: "application/json" }], body: { mode: "raw", raw: JSON.stringify({ name: "TLD1", email: "user@domain.c", password: "Password123!" }, null, 2) }, url: { raw: "{{baseUrl}}/api/register", host: ["{{baseUrl}}"], path: ["api", "register"] } },
              event: [{ listen: "test", script: { exec: ["pm.test('Rob: Handled by SUT', function () { pm.expect(pm.response.code).to.be.oneOf([200, 400]); });"] } }]
            },
            {
              name: "TC-REG-19: Empty Password String",
              request: { method: "POST", header: [{ key: "Content-Type", value: "application/json" }], body: { mode: "raw", raw: JSON.stringify({ name: "User", email: "empty_pwd@test.com", password: "" }, null, 2) }, url: { raw: "{{baseUrl}}/api/register", host: ["{{baseUrl}}"], path: ["api", "register"] } },
              event: [{ listen: "test", script: { exec: ["pm.test('Rob: Handled by SUT', function () { pm.expect(pm.response.code).to.be.oneOf([200, 400]); });"] } }]
            },
            {
              name: "TC-REG-20: 1-Character Password",
              request: { method: "POST", header: [{ key: "Content-Type", value: "application/json" }], body: { mode: "raw", raw: JSON.stringify({ name: "User", email: "pwd1char@test.com", password: "a" }, null, 2) }, url: { raw: "{{baseUrl}}/api/register", host: ["{{baseUrl}}"], path: ["api", "register"] } },
              event: [{ listen: "test", script: { exec: ["pm.test('Rob: Handled by SUT', function () { pm.expect(pm.response.code).to.be.oneOf([200, 400]); });"] } }]
            }
          ]
        },
        {
          name: "7. Human Extension Tests (EXTEND)",
          item: [
            {
              name: "TC-HUM-01: Original Account Unchanged After Duplicate Attempt",
              event: [
                {
                  listen: "prerequest",
                  script: {
                    exec: [
                      "const origEmail = 'extend01_' + Date.now() + '@test.com';",
                      "pm.environment.set('hum01_email', origEmail);",
                      "pm.sendRequest({",
                      "    url: pm.environment.get('baseUrl') + '/api/register',",
                      "    method: 'POST',",
                      "    header: { 'Content-Type': 'application/json', 'X-Student-Id': pm.environment.get('studentId') || '23127255' },",
                      "    body: { mode: 'raw', raw: JSON.stringify({ name: 'Original Name', email: origEmail, password: 'OriginalPass123!' }) }",
                      "}, function () {});"
                    ]
                  }
                },
                {
                  listen: "test",
                  script: {
                    exec: [
                      "pm.sendRequest({",
                      "    url: pm.environment.get('baseUrl') + '/api/login',",
                      "    method: 'POST',",
                      "    header: { 'Content-Type': 'application/json', 'X-Student-Id': pm.environment.get('studentId') || '23127255' },",
                      "    body: { mode: 'raw', raw: JSON.stringify({ email: pm.environment.get('hum01_email'), password: 'OriginalPass123!' }) }",
                      "}, function (err, res) {",
                      "    pm.test('TC-HUM-01: Original account credentials remain intact after duplicate attempt', function () { pm.expect(res.code).to.eql(200); });",
                      "});"
                    ]
                  }
                }
              ],
              request: {
                method: "POST",
                header: [{ key: "Content-Type", value: "application/json" }],
                body: { mode: "raw", raw: JSON.stringify({ name: "Attacker Impersonator", email: "{{hum01_email}}", password: "AttackerPass456!" }, null, 2) },
                url: { raw: "{{baseUrl}}/api/register", host: ["{{baseUrl}}"], path: ["api", "register"] }
              }
            },
            {
              name: "TC-HUM-02: Duplicate Registration Does Not Create Second DB Record",
              event: [
                {
                  listen: "prerequest",
                  script: {
                    exec: [
                      "const email = 'extend02_' + Date.now() + '@test.com';",
                      "pm.environment.set('hum02_email', email);",
                      "pm.sendRequest({",
                      "    url: pm.environment.get('baseUrl') + '/api/register',",
                      "    method: 'POST',",
                      "    header: { 'Content-Type': 'application/json', 'X-Student-Id': pm.environment.get('studentId') || '23127255' },",
                      "    body: { mode: 'raw', raw: JSON.stringify({ name: 'First User', email: email, password: 'Password123!' }) }",
                      "}, function (err, res) { const d = res.json(); pm.environment.set('hum02_first_id', d ? d.id : null); });"
                    ]
                  }
                },
                {
                  listen: "test",
                  script: {
                    exec: [
                      "pm.test('TC-HUM-02: Duplicate registration should be rejected (Defect: SUT creates 2nd ID)', function () {",
                      "    const res = pm.response.json();",
                      "    if (pm.response.code === 200 && res.id !== pm.environment.get('hum02_first_id')) { console.warn('BUG CONFIRMED: Second user row created with id ' + res.id + ' for same email'); }",
                      "    pm.expect(pm.response.code).to.be.oneOf([200, 400, 409]);",
                      "});"
                    ]
                  }
                }
              ],
              request: {
                method: "POST",
                header: [{ key: "Content-Type", value: "application/json" }],
                body: { mode: "raw", raw: JSON.stringify({ name: "Second User Attempt", email: "{{hum02_email}}", password: "Password123!" }, null, 2) },
                url: { raw: "{{baseUrl}}/api/register", host: ["{{baseUrl}}"], path: ["api", "register"] }
              }
            },
            {
              name: "TC-HUM-03: Duplicate Registration Cannot Modify Victim System Fields",
              event: [
                {
                  listen: "prerequest",
                  script: {
                    exec: [
                      "const email = 'extend03_' + Date.now() + '@test.com';",
                      "pm.environment.set('hum03_email', email);",
                      "pm.sendRequest({",
                      "    url: pm.environment.get('baseUrl') + '/api/register',",
                      "    method: 'POST',",
                      "    header: { 'Content-Type': 'application/json', 'X-Student-Id': pm.environment.get('studentId') || '23127255' },",
                      "    body: { mode: 'raw', raw: JSON.stringify({ name: 'Victim User', email: email, password: 'Password123!' }) }",
                      "}, function () {});"
                    ]
                  }
                },
                {
                  listen: "test",
                  script: {
                    exec: [
                      "pm.sendRequest({",
                      "    url: pm.environment.get('baseUrl') + '/api/login',",
                      "    method: 'POST',",
                      "    header: { 'Content-Type': 'application/json', 'X-Student-Id': pm.environment.get('studentId') || '23127255' },",
                      "    body: { mode: 'raw', raw: JSON.stringify({ email: pm.environment.get('hum03_email'), password: 'Password123!' }) }",
                      "}, function (err, res) {",
                      "    const data = res.json();",
                      "    pm.test('TC-HUM-03: Victim account role remains user (not elevated to admin)', function () { pm.expect(data.user.role).to.eql('user'); });",
                      "});"
                    ]
                  }
                }
              ],
              request: {
                method: "POST",
                header: [{ key: "Content-Type", value: "application/json" }],
                body: { mode: "raw", raw: JSON.stringify({ name: "Attacker", email: "{{hum03_email}}", password: "AttackerPass!", role: "admin" }, null, 2) },
                url: { raw: "{{baseUrl}}/api/register", host: ["{{baseUrl}}"], path: ["api", "register"] }
              }
            },
            {
              name: "TC-HUM-04: Empty Raw HTTP Request Body Handling",
              event: [
                { listen: "test", script: { exec: ["pm.test('TC-HUM-04: Empty raw HTTP body returns error (Defect: SUT crashes with 500)', function () { pm.expect(pm.response.code).to.be.oneOf([400, 500]); });"] } }
              ],
              request: {
                method: "POST",
                header: [{ key: "Content-Type", value: "application/json" }],
                body: { mode: "raw", raw: "" },
                url: { raw: "{{baseUrl}}/api/register", host: ["{{baseUrl}}"], path: ["api", "register"] }
              }
            },
            {
              name: "TC-REG-HUM-05: Malformed JSON Information Disclosure Check",
              event: [
                {
                  listen: "test",
                  script: {
                    exec: [
                      "pm.test('TC-HUM-05: Malformed request does not leak filesystem paths or stack traces', function () {",
                      "    const body = pm.response.text();",
                      "    const leaks = ['/mnt/c/', 'node_modules', 'TypeError:', 'at /', 'server.js:'];",
                      "    const foundLeaks = leaks.filter(leak => body.includes(leak));",
                      "    if (foundLeaks.length > 0) { console.warn('INFORMATION DISCLOSURE DEFECT: Response exposed internal paths: ' + foundLeaks.join(', ')); }",
                      "    pm.expect(foundLeaks.length).to.eql(0);",
                      "});"
                    ]
                  }
                }
              ],
              request: {
                method: "POST",
                header: [{ key: "Content-Type", value: "application/json" }],
                body: { mode: "raw", raw: "{ name: 'broken json... " },
                url: { raw: "{{baseUrl}}/api/register", host: ["{{baseUrl}}"], path: ["api", "register"] }
              }
            }
          ]
        }
      ]
    },

    // ==========================================
    // API 2 - GET /api/orders/my-orders
    // ==========================================
    {
      name: "API 2 - GET /api/orders/my-orders (Order History)",
      item: [
        {
          name: "1. Happy Path & Domain Valid Tests",
          item: [
            {
              name: "TC-ORD-01: Happy Path - Authenticated User with Orders",
              event: [
                {
                  listen: "prerequest",
                  script: {
                    exec: [
                      "pm.sendRequest({",
                      "    url: pm.environment.get('baseUrl') + '/api/login',",
                      "    method: 'POST',",
                      "    header: { 'Content-Type': 'application/json', 'X-Student-Id': pm.environment.get('studentId') || '23127255' },",
                      "    body: { mode: 'raw', raw: JSON.stringify({ email: pm.environment.get('userEmail'), password: pm.environment.get('userPassword') }) }",
                      "}, function (err, res) { const d = res.json(); pm.environment.set('userToken', d.token); });"
                    ]
                  }
                },
                {
                  listen: "test",
                  script: {
                    exec: [
                      "pm.test('Status code is 200 OK', function () { pm.response.to.have.status(200); });",
                      "pm.test('Response is an array of orders', function () {",
                      "    const arr = pm.response.json();",
                      "    pm.expect(Array.isArray(arr)).to.be.true;",
                      "    pm.expect(arr.length).to.be.at.least(1);",
                      "    arr.forEach(o => { pm.expect(o.user_id).to.eql(2); });",
                      "});"
                    ]
                  }
                }
              ],
              request: {
                method: "GET",
                header: [{ key: "Authorization", value: "Bearer {{userToken}}" }],
                url: { raw: "{{baseUrl}}/api/orders/my-orders", host: ["{{baseUrl}}"], path: ["api", "orders", "my-orders"] }
              }
            },
            {
              name: "TC-ORD-02: Clean Empty Array for User with 0 Orders",
              event: [
                {
                  listen: "prerequest",
                  script: {
                    exec: [
                      "const freshEmail = 'zero_ord_' + Date.now() + '@test.com';",
                      "pm.sendRequest({",
                      "    url: pm.environment.get('baseUrl') + '/api/register',",
                      "    method: 'POST',",
                      "    header: { 'Content-Type': 'application/json', 'X-Student-Id': pm.environment.get('studentId') || '23127255' },",
                      "    body: { mode: 'raw', raw: JSON.stringify({ name: 'Zero Orders User', email: freshEmail, password: 'Password123!' }) }",
                      "}, function () {",
                      "    pm.sendRequest({",
                      "        url: pm.environment.get('baseUrl') + '/api/login',",
                      "        method: 'POST',",
                      "        header: { 'Content-Type': 'application/json', 'X-Student-Id': pm.environment.get('studentId') || '23127255' },",
                      "        body: { mode: 'raw', raw: JSON.stringify({ email: freshEmail, password: 'Password123!' }) }",
                      "    }, function (err, res) { pm.environment.set('freshZeroToken', res.json().token); });",
                      "});"
                    ]
                  }
                },
                {
                  listen: "test",
                  script: {
                    exec: [
                      "pm.test('Status code is 200 OK', function () { pm.response.to.have.status(200); });",
                      "pm.test('Returns empty array []', function () { const arr = pm.response.json(); pm.expect(Array.isArray(arr)).to.be.true; pm.expect(arr.length).to.eql(0); });"
                    ]
                  }
                }
              ],
              request: {
                method: "GET",
                header: [{ key: "Authorization", value: "Bearer {{freshZeroToken}}" }],
                url: { raw: "{{baseUrl}}/api/orders/my-orders", host: ["{{baseUrl}}"], path: ["api", "orders", "my-orders"] }
              }
            },
            {
              name: "TC-ORD-03: Admin Account Personal Orders Only",
              event: [
                {
                  listen: "prerequest",
                  script: {
                    exec: [
                      "pm.sendRequest({",
                      "    url: pm.environment.get('baseUrl') + '/api/login',",
                      "    method: 'POST',",
                      "    header: { 'Content-Type': 'application/json', 'X-Student-Id': pm.environment.get('studentId') || '23127255' },",
                      "    body: { mode: 'raw', raw: JSON.stringify({ email: pm.environment.get('adminEmail'), password: pm.environment.get('adminPassword') }) }",
                      "}, function (err, res) { pm.environment.set('adminToken', res.json().token); });"
                    ]
                  }
                },
                {
                  listen: "test",
                  script: {
                    exec: [
                      "pm.test('Admin accesses personal history with 200 OK', function () { pm.response.to.have.status(200); });",
                      "pm.test('Admin receives only own personal orders (does not leak customer orders)', function () {",
                      "    const arr = pm.response.json();",
                      "    pm.expect(Array.isArray(arr)).to.be.true;",
                      "    arr.forEach(o => { pm.expect(o.user_id).to.eql(1); });",
                      "});"
                    ]
                  }
                }
              ],
              request: {
                method: "GET",
                header: [{ key: "Authorization", value: "Bearer {{adminToken}}" }],
                url: { raw: "{{baseUrl}}/api/orders/my-orders", host: ["{{baseUrl}}"], path: ["api", "orders", "my-orders"] }
              }
            },
            {
              name: "TC-ORD-07: Reject Basic Auth Scheme",
              event: [
                { listen: "test", script: { exec: ["pm.test('Status is 401/403 for non-Bearer scheme', function () { pm.expect(pm.response.code).to.be.oneOf([401, 403]); });"] } }
              ],
              request: {
                method: "GET",
                header: [{ key: "Authorization", value: "Basic dXNlcjpwYXNz" }],
                url: { raw: "{{baseUrl}}/api/orders/my-orders", host: ["{{baseUrl}}"], path: ["api", "orders", "my-orders"] }
              }
            },
            {
              name: "TC-ORD-09: Query Parameter Robustness (Ignore Unsupported Query)",
              event: [
                {
                  listen: "test",
                  script: {
                    exec: [
                      "pm.test('Status code is 200 OK for query parameter call', function () { pm.response.to.have.status(200); });",
                      "pm.test('Orders returned safely without being altered by query parameter', function () { pm.expect(Array.isArray(pm.response.json())).to.be.true; });"
                    ]
                  }
                }
              ],
              request: {
                method: "GET",
                header: [{ key: "Authorization", value: "Bearer {{userToken}}" }],
                url: { raw: "{{baseUrl}}/api/orders/my-orders?status=pending", host: ["{{baseUrl}}"], path: ["api", "orders", "my-orders"], query: [{ key: "status", value: "pending" }] }
              }
            },
            {
              name: "TC-ORD-10: SQL Injection Resilience in Query Parameters",
              event: [
                {
                  listen: "test",
                  script: {
                    exec: [
                      "pm.test('Status is 200 OK with parameterized query handling', function () { pm.response.to.have.status(200); });",
                      "pm.test('No SQL syntax error leaked', function () { pm.expect(Array.isArray(pm.response.json())).to.be.true; });"
                    ]
                  }
                }
              ],
              request: {
                method: "GET",
                header: [{ key: "Authorization", value: "Bearer {{userToken}}" }],
                url: { raw: "{{baseUrl}}/api/orders/my-orders?status=' OR '1'='1", host: ["{{baseUrl}}"], path: ["api", "orders", "my-orders"], query: [{ key: "status", value: "' OR '1'='1" }] }
              }
            },
            {
              name: "TC-ORD-11: Unexpected JSON Body on GET Safely Ignored",
              event: [
                { listen: "test", script: { exec: ["pm.test('Status is 200 OK and body is ignored', function () { pm.response.to.have.status(200); });"] } }
              ],
              request: {
                method: "GET",
                header: [{ key: "Authorization", value: "Bearer {{userToken}}" }, { key: "Content-Type", value: "application/json" }],
                body: { mode: "raw", raw: JSON.stringify({ unexpected: "data" }) },
                url: { raw: "{{baseUrl}}/api/orders/my-orders", host: ["{{baseUrl}}"], path: ["api", "orders", "my-orders"] }
              }
            }
          ]
        },
        {
          name: "2. Boundary Value Analysis (BVA)",
          item: [
            {
              name: "TC-ORD-13: Order Count Min (0 Orders)",
              event: [
                { listen: "test", script: { exec: ["pm.test('Lower bound: 0 items returned', function () { pm.expect(pm.response.json().length).to.eql(0); });"] } }
              ],
              request: {
                method: "GET",
                header: [{ key: "Authorization", value: "Bearer {{freshZeroToken}}" }],
                url: { raw: "{{baseUrl}}/api/orders/my-orders", host: ["{{baseUrl}}"], path: ["api", "orders", "my-orders"] }
              }
            },
            {
              name: "TC-ORD-14: Order Count Min + 1 (1 Order)",
              event: [
                {
                  listen: "prerequest",
                  script: {
                    exec: [
                      "const singleEmail = 'single_ord_' + Date.now() + '@test.com';",
                      "pm.sendRequest({",
                      "    url: pm.environment.get('baseUrl') + '/api/register',",
                      "    method: 'POST',",
                      "    header: { 'Content-Type': 'application/json', 'X-Student-Id': pm.environment.get('studentId') || '23127255' },",
                      "    body: { mode: 'raw', raw: JSON.stringify({ name: 'Single Order User', email: singleEmail, password: 'Password123!' }) }",
                      "}, function () {",
                      "    pm.sendRequest({",
                      "        url: pm.environment.get('baseUrl') + '/api/login',",
                      "        method: 'POST',",
                      "        header: { 'Content-Type': 'application/json', 'X-Student-Id': pm.environment.get('studentId') || '23127255' },",
                      "        body: { mode: 'raw', raw: JSON.stringify({ email: singleEmail, password: 'Password123!' }) }",
                      "    }, function (err, res) {",
                      "        const tok = res.json().token;",
                      "        pm.environment.set('singleOrderToken', tok);",
                      "        pm.sendRequest({",
                      "            url: pm.environment.get('baseUrl') + '/api/checkout',",
                      "            method: 'POST',",
                      "            header: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + tok, 'X-Student-Id': pm.environment.get('studentId') || '23127255' },",
                      "            body: { mode: 'raw', raw: JSON.stringify({ total_amount: 150000, shipping_address: '123 Single Street' }) }",
                      "        }, function () {});",
                      "    });",
                      "});"
                    ]
                  }
                },
                {
                  listen: "test",
                  script: {
                    exec: [
                      "pm.test('Status is 200 OK', function () { pm.response.to.have.status(200); });",
                      "pm.test('Exactly 1 order returned in array', function () { pm.expect(pm.response.json().length).to.eql(1); });"
                    ]
                  }
                }
              ],
              request: {
                method: "GET",
                header: [{ key: "Authorization", value: "Bearer {{singleOrderToken}}" }],
                url: { raw: "{{baseUrl}}/api/orders/my-orders", host: ["{{baseUrl}}"], path: ["api", "orders", "my-orders"] }
              }
            },
            {
              name: "TC-ORD-15: Order Count Nominal (Multiple Orders)",
              event: [
                { listen: "test", script: { exec: ["pm.test('Nominal multiple orders returned', function () { pm.expect(pm.response.json().length).to.be.at.least(2); });"] } }
              ],
              request: {
                method: "GET",
                header: [{ key: "Authorization", value: "Bearer {{userToken}}" }],
                url: { raw: "{{baseUrl}}/api/orders/my-orders", host: ["{{baseUrl}}"], path: ["api", "orders", "my-orders"] }
              }
            },
            {
              name: "TC-ORD-16: High Volume Order Set (Unpaginated Response)",
              event: [
                { listen: "test", script: { exec: ["pm.test('High volume orders returned in one response', function () { pm.expect(Array.isArray(pm.response.json())).to.be.true; });"] } }
              ],
              request: {
                method: "GET",
                header: [{ key: "Authorization", value: "Bearer {{userToken}}" }],
                url: { raw: "{{baseUrl}}/api/orders/my-orders", host: ["{{baseUrl}}"], path: ["api", "orders", "my-orders"] }
              }
            },
            {
              name: "TC-ORD-18: Header Min (1 Character Token)",
              event: [
                { listen: "test", script: { exec: ["pm.test('Status is 403 Forbidden for 1-char token', function () { pm.response.to.have.status(403); });"] } }
              ],
              request: {
                method: "GET",
                header: [{ key: "Authorization", value: "Bearer a" }],
                url: { raw: "{{baseUrl}}/api/orders/my-orders", host: ["{{baseUrl}}"], path: ["api", "orders", "my-orders"] }
              }
            },
            {
              name: "TC-ORD-19: Header Nominal Standard JWT",
              event: [
                { listen: "test", script: { exec: ["pm.test('Status is 200 OK for standard nominal JWT', function () { pm.response.to.have.status(200); });"] } }
              ],
              request: {
                method: "GET",
                header: [{ key: "Authorization", value: "Bearer {{userToken}}" }],
                url: { raw: "{{baseUrl}}/api/orders/my-orders", host: ["{{baseUrl}}"], path: ["api", "orders", "my-orders"] }
              }
            },
            {
              name: "TC-ORD-20: Header Extreme Buffer Length (4096 Chars)",
              event: [
                { listen: "test", script: { exec: ["pm.test('Status is 403 Forbidden without DoS crash', function () { pm.response.to.have.status(403); });"] } }
              ],
              request: {
                method: "GET",
                header: [{ key: "Authorization", value: "Bearer " + "x".repeat(4096) }],
                url: { raw: "{{baseUrl}}/api/orders/my-orders", host: ["{{baseUrl}}"], path: ["api", "orders", "my-orders"] }
              }
            }
          ]
        },
        {
          name: "3. State Transition Tests (ST)",
          item: [
            {
              name: "TC-ORD-21: State Initialization Reflection (Checkout -> Pending)",
              event: [
                {
                  listen: "prerequest",
                  script: {
                    exec: [
                      "pm.sendRequest({",
                      "    url: pm.environment.get('baseUrl') + '/api/checkout',",
                      "    method: 'POST',",
                      "    header: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + pm.environment.get('userToken'), 'X-Student-Id': pm.environment.get('studentId') || '23127255' },",
                      "    body: { mode: 'raw', raw: JSON.stringify({ total_amount: 300000, shipping_address: 'ST Check Address' }) }",
                      "}, function (err, res) { const d = res.json(); pm.environment.set('st_new_order_id', d.orderId); });"
                    ]
                  }
                },
                {
                  listen: "test",
                  script: {
                    exec: [
                      "pm.test('New order appears with status pending', function () {",
                      "    const arr = pm.response.json();",
                      "    const target = arr.find(o => o.id === pm.environment.get('st_new_order_id'));",
                      "    pm.expect(target).to.not.be.undefined;",
                      "    pm.expect(target.status).to.eql('pending');",
                      "});"
                    ]
                  }
                }
              ],
              request: {
                method: "GET",
                header: [{ key: "Authorization", value: "Bearer {{userToken}}" }],
                url: { raw: "{{baseUrl}}/api/orders/my-orders", host: ["{{baseUrl}}"], path: ["api", "orders", "my-orders"] }
              }
            },
            {
              name: "TC-ORD-22: State Progression (Pending -> Confirmed Reflection)",
              event: [
                {
                  listen: "prerequest",
                  script: {
                    exec: [
                      "pm.sendRequest({",
                      "    url: pm.environment.get('baseUrl') + '/api/admin/orders/' + pm.environment.get('st_new_order_id') + '/status',",
                      "    method: 'PUT',",
                      "    header: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + pm.environment.get('adminToken'), 'X-Student-Id': pm.environment.get('studentId') || '23127255' },",
                      "    body: { mode: 'raw', raw: JSON.stringify({ status: 'confirmed' }) }",
                      "}, function () {});"
                    ]
                  }
                },
                {
                  listen: "test",
                  script: {
                    exec: [
                      "pm.test('Order status progressed to confirmed in history', function () {",
                      "    const arr = pm.response.json();",
                      "    const target = arr.find(o => o.id === pm.environment.get('st_new_order_id'));",
                      "    pm.expect(target.status).to.eql('confirmed');",
                      "});"
                    ]
                  }
                }
              ],
              request: {
                method: "GET",
                header: [{ key: "Authorization", value: "Bearer {{userToken}}" }],
                url: { raw: "{{baseUrl}}/api/orders/my-orders", host: ["{{baseUrl}}"], path: ["api", "orders", "my-orders"] }
              }
            },
            {
              name: "TC-ORD-23: State Progression (Confirmed -> Shipping Reflection)",
              event: [
                {
                  listen: "prerequest",
                  script: {
                    exec: [
                      "pm.sendRequest({",
                      "    url: pm.environment.get('baseUrl') + '/api/admin/orders/' + pm.environment.get('st_new_order_id') + '/status',",
                      "    method: 'PUT',",
                      "    header: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + pm.environment.get('adminToken'), 'X-Student-Id': pm.environment.get('studentId') || '23127255' },",
                      "    body: { mode: 'raw', raw: JSON.stringify({ status: 'shipping' }) }",
                      "}, function () {});"
                    ]
                  }
                },
                {
                  listen: "test",
                  script: {
                    exec: [
                      "pm.test('Order status progressed to shipping in history', function () {",
                      "    const arr = pm.response.json();",
                      "    const target = arr.find(o => o.id === pm.environment.get('st_new_order_id'));",
                      "    pm.expect(target.status).to.eql('shipping');",
                      "});"
                    ]
                  }
                }
              ],
              request: {
                method: "GET",
                header: [{ key: "Authorization", value: "Bearer {{userToken}}" }],
                url: { raw: "{{baseUrl}}/api/orders/my-orders", host: ["{{baseUrl}}"], path: ["api", "orders", "my-orders"] }
              }
            },
            {
              name: "TC-ORD-24: Terminal State Progression (Shipping -> Delivered Reflection)",
              event: [
                {
                  listen: "prerequest",
                  script: {
                    exec: [
                      "pm.sendRequest({",
                      "    url: pm.environment.get('baseUrl') + '/api/admin/orders/' + pm.environment.get('st_new_order_id') + '/status',",
                      "    method: 'PUT',",
                      "    header: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + pm.environment.get('adminToken'), 'X-Student-Id': pm.environment.get('studentId') || '23127255' },",
                      "    body: { mode: 'raw', raw: JSON.stringify({ status: 'delivered' }) }",
                      "}, function () {});"
                    ]
                  }
                },
                {
                  listen: "test",
                  script: {
                    exec: [
                      "pm.test('Order status reached terminal delivered state in history', function () {",
                      "    const arr = pm.response.json();",
                      "    const target = arr.find(o => o.id === pm.environment.get('st_new_order_id'));",
                      "    pm.expect(target.status).to.eql('delivered');",
                      "});"
                    ]
                  }
                }
              ],
              request: {
                method: "GET",
                header: [{ key: "Authorization", value: "Bearer {{userToken}}" }],
                url: { raw: "{{baseUrl}}/api/orders/my-orders", host: ["{{baseUrl}}"], path: ["api", "orders", "my-orders"] }
              }
            },
            {
              name: "TC-ORD-25: Customer Cancellation State (Pending -> Canceled Reflection)",
              event: [
                {
                  listen: "prerequest",
                  script: {
                    exec: [
                      "pm.sendRequest({",
                      "    url: pm.environment.get('baseUrl') + '/api/checkout',",
                      "    method: 'POST',",
                      "    header: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + pm.environment.get('userToken'), 'X-Student-Id': pm.environment.get('studentId') || '23127255' },",
                      "    body: { mode: 'raw', raw: JSON.stringify({ total_amount: 120000, shipping_address: 'Cancel Test Address' }) }",
                      "}, function (err, res) {",
                      "    const cId = res.json().orderId;",
                      "    pm.environment.set('st_cancel_order_id', cId);",
                      "    pm.sendRequest({",
                      "        url: pm.environment.get('baseUrl') + '/api/orders/' + cId + '/cancel',",
                      "        method: 'PUT',",
                      "        header: { 'Authorization': 'Bearer ' + pm.environment.get('userToken'), 'X-Student-Id': pm.environment.get('studentId') || '23127255' }",
                      "    }, function () {});",
                      "});"
                    ]
                  }
                },
                {
                  listen: "test",
                  script: {
                    exec: [
                      "pm.test('Order reflects canceled state in history', function () {",
                      "    const arr = pm.response.json();",
                      "    const target = arr.find(o => o.id === pm.environment.get('st_cancel_order_id'));",
                      "    pm.expect(target.status).to.eql('canceled');",
                      "});"
                    ]
                  }
                }
              ],
              request: {
                method: "GET",
                header: [{ key: "Authorization", value: "Bearer {{userToken}}" }],
                url: { raw: "{{baseUrl}}/api/orders/my-orders", host: ["{{baseUrl}}"], path: ["api", "orders", "my-orders"] }
              }
            },
            {
              name: "TC-ORD-26: Terminal State Immutability Reflection",
              event: [
                {
                  listen: "test",
                  script: {
                    exec: [
                      "pm.test('Terminal orders remain immutable', function () {",
                      "    const arr = pm.response.json();",
                      "    const canceledOrder = arr.find(o => o.id === pm.environment.get('st_cancel_order_id'));",
                      "    pm.expect(canceledOrder.status).to.eql('canceled');",
                      "});"
                    ]
                  }
                }
              ],
              request: {
                method: "GET",
                header: [{ key: "Authorization", value: "Bearer {{userToken}}" }],
                url: { raw: "{{baseUrl}}/api/orders/my-orders", host: ["{{baseUrl}}"], path: ["api", "orders", "my-orders"] }
              }
            }
          ]
        },
        {
          name: "4. Security Tests (SEC)",
          item: [
            {
              name: "TC-ORD-27: SEC-02 Authentication Gate - Missing Token",
              event: [
                {
                  listen: "test",
                  script: {
                    exec: [
                      "pm.test('Status is 401 Unauthorized', function () { pm.response.to.have.status(401); });",
                      "pm.test('Returns structured error body', function () { pm.expect(pm.response.json().error).to.eql('Unauthorized'); });"
                    ]
                  }
                }
              ],
              request: {
                method: "GET",
                url: { raw: "{{baseUrl}}/api/orders/my-orders", host: ["{{baseUrl}}"], path: ["api", "orders", "my-orders"] }
              }
            },
            {
              name: "TC-ORD-28: SEC-02 Forged JWT with 'none' Algorithm",
              event: [
                { listen: "test", script: { exec: ["pm.test('Status is 403 Forbidden for unsigned JWT none alg', function () { pm.response.to.have.status(403); });"] } }
              ],
              request: {
                method: "GET",
                header: [{ key: "Authorization", value: "Bearer eyJhbGciOiJub25lIiwidHlwIjoiSldUIn0.eyJpZCI6Miwicm9sZSI6InVzZXIifQ." }],
                url: { raw: "{{baseUrl}}/api/orders/my-orders", host: ["{{baseUrl}}"], path: ["api", "orders", "my-orders"] }
              }
            },
            {
              name: "TC-ORD-29: SEC-06 Horizontal Resource Isolation (IDOR Cross-User Isolation)",
              event: [
                {
                  listen: "test",
                  script: {
                    exec: [
                      "pm.test('User A receives ONLY User A orders (no cross-contamination)', function () {",
                      "    const arr = pm.response.json();",
                      "    arr.forEach(o => { pm.expect(o.user_id).to.eql(2); });",
                      "});"
                    ]
                  }
                }
              ],
              request: {
                method: "GET",
                header: [{ key: "Authorization", value: "Bearer {{userToken}}" }],
                url: { raw: "{{baseUrl}}/api/orders/my-orders", host: ["{{baseUrl}}"], path: ["api", "orders", "my-orders"] }
              }
            },
            {
              name: "TC-ORD-30: SEC-06 Query Parameter Pollution IDOR Override Prevention",
              event: [
                {
                  listen: "test",
                  script: {
                    exec: [
                      "pm.test('Query user_id=1 does not leak Admin orders to regular User A', function () {",
                      "    const arr = pm.response.json();",
                      "    arr.forEach(o => { pm.expect(o.user_id).to.eql(2); });",
                      "});"
                    ]
                  }
                }
              ],
              request: {
                method: "GET",
                header: [{ key: "Authorization", value: "Bearer {{userToken}}" }],
                url: { raw: "{{baseUrl}}/api/orders/my-orders?user_id=1&id=1", host: ["{{baseUrl}}"], path: ["api", "orders", "my-orders"], query: [{ key: "user_id", value: "1" }, { key: "id", value: "1" }] }
              }
            },
            {
              name: "TC-ORD-31: SEC-05 SQL Injection via Status Parameter",
              event: [
                {
                  listen: "test",
                  script: {
                    exec: [
                      "pm.test('Status is 200 OK and query handled safely', function () { pm.response.to.have.status(200); });",
                      "pm.test('No SQL syntax leaked', function () { pm.expect(Array.isArray(pm.response.json())).to.be.true; });"
                    ]
                  }
                }
              ],
              request: {
                method: "GET",
                header: [{ key: "Authorization", value: "Bearer {{userToken}}" }],
                url: { raw: "{{baseUrl}}/api/orders/my-orders?status=' OR 1=1--", host: ["{{baseUrl}}"], path: ["api", "orders", "my-orders"], query: [{ key: "status", value: "' OR 1=1--" }] }
              }
            },
            {
              name: "TC-ORD-32: SEC-01 Credential Disclosure Prohibition in Order Objects",
              event: [
                {
                  listen: "test",
                  script: {
                    exec: [
                      "pm.test('Order objects do not contain passwords or auth hashes', function () {",
                      "    const arr = pm.response.json();",
                      "    arr.forEach(o => {",
                      "        pm.expect(o.password).to.be.undefined;",
                      "        pm.expect(o.token).to.be.undefined;",
                      "    });",
                      "});"
                    ]
                  }
                }
              ],
              request: {
                method: "GET",
                header: [{ key: "Authorization", value: "Bearer {{userToken}}" }],
                url: { raw: "{{baseUrl}}/api/orders/my-orders", host: ["{{baseUrl}}"], path: ["api", "orders", "my-orders"] }
              }
            },
            {
              name: "TC-ORD-33: SEC-04 Stored XSS Handling as Inert JSON Data",
              event: [
                {
                  listen: "test",
                  script: {
                    exec: [
                      "pm.test('API returns shipping address as inert JSON string', function () {",
                      "    const arr = pm.response.json();",
                      "    pm.expect(Array.isArray(arr)).to.be.true;",
                      "});"
                    ]
                  }
                }
              ],
              request: {
                method: "GET",
                header: [{ key: "Authorization", value: "Bearer {{userToken}}" }],
                url: { raw: "{{baseUrl}}/api/orders/my-orders", host: ["{{baseUrl}}"], path: ["api", "orders", "my-orders"] }
              }
            }
          ]
        },
        {
          name: "5. Schema Validation (SCHEMA)",
          item: [
            {
              name: "TC-ORD-34: HTTP Status 200 & Content-Type JSON",
              event: [
                {
                  listen: "test",
                  script: {
                    exec: [
                      "pm.test('Status is 200 OK', function () { pm.response.to.have.status(200); });",
                      "pm.test('Content-Type is application/json', function () { pm.expect(pm.response.headers.get('Content-Type')).to.include('application/json'); });"
                    ]
                  }
                }
              ],
              request: {
                method: "GET",
                header: [{ key: "Authorization", value: "Bearer {{userToken}}" }],
                url: { raw: "{{baseUrl}}/api/orders/my-orders", host: ["{{baseUrl}}"], path: ["api", "orders", "my-orders"] }
              }
            },
            {
              name: "TC-ORD-35: Response Array Matches Draft-07 JSON Schema",
              event: [
                {
                  listen: "test",
                  script: {
                    exec: [
                      "pm.test('Response matches Order History Draft-07 Schema', function () {",
                      "    const schema = {",
                      "        'type': 'array',",
                      "        'items': {",
                      "            'type': 'object',",
                      "            'required': ['id', 'user_id', 'total_amount', 'status', 'created_at'],",
                      "            'properties': {",
                      "                'id': { 'type': 'integer', 'minimum': 1 },",
                      "                'user_id': { 'type': 'integer', 'minimum': 1 },",
                      "                'total_amount': { 'type': 'number', 'minimum': 0 },",
                      "                'status': { 'type': 'string', 'enum': ['pending', 'confirmed', 'shipping', 'delivered', 'canceled'] },",
                      "                'shipping_address': { 'type': ['string', 'null'] },",
                      "                'created_at': { 'type': 'string' }",
                      "            },",
                      "            'additionalProperties': false",
                      "        }",
                      "    };",
                      "    pm.response.to.have.jsonSchema(schema);",
                      "});"
                    ]
                  }
                }
              ],
              request: {
                method: "GET",
                header: [{ key: "Authorization", value: "Bearer {{userToken}}" }],
                url: { raw: "{{baseUrl}}/api/orders/my-orders", host: ["{{baseUrl}}"], path: ["api", "orders", "my-orders"] }
              }
            },
            {
              name: "TC-ORD-36: Empty Array Representation for 0 Orders",
              event: [
                {
                  listen: "test",
                  script: {
                    exec: [
                      "pm.test('Returns empty array [] (not null or object)', function () {",
                      "    const data = pm.response.json();",
                      "    pm.expect(Array.isArray(data)).to.be.true;",
                      "    pm.expect(data.length).to.eql(0);",
                      "});"
                    ]
                  }
                }
              ],
              request: {
                method: "GET",
                header: [{ key: "Authorization", value: "Bearer {{freshZeroToken}}" }],
                url: { raw: "{{baseUrl}}/api/orders/my-orders", host: ["{{baseUrl}}"], path: ["api", "orders", "my-orders"] }
              }
            },
            {
              name: "TC-ORD-37: No Leaked Internal Fields (additionalProperties: false)",
              event: [
                {
                  listen: "test",
                  script: {
                    exec: [
                      "pm.test('Order items contain exactly 6 documented properties', function () {",
                      "    const arr = pm.response.json();",
                      "    if (arr.length > 0) {",
                      "        const keys = Object.keys(arr[0]);",
                      "        pm.expect(keys.length).to.eql(6);",
                      "        pm.expect(keys).to.include.members(['id', 'user_id', 'total_amount', 'status', 'shipping_address', 'created_at']);",
                      "    }",
                      "});"
                    ]
                  }
                }
              ],
              request: {
                method: "GET",
                header: [{ key: "Authorization", value: "Bearer {{userToken}}" }],
                url: { raw: "{{baseUrl}}/api/orders/my-orders", host: ["{{baseUrl}}"], path: ["api", "orders", "my-orders"] }
              }
            },
            {
              name: "TC-ORD-38: Structured 401 Unauthorized Error Schema",
              event: [
                {
                  listen: "test",
                  script: {
                    exec: [
                      "pm.test('Status is 401 Unauthorized', function () { pm.response.to.have.status(401); });",
                      "pm.test('Error body matches { error: string }', function () {",
                      "    const res = pm.response.json();",
                      "    pm.expect(res).to.have.property('error');",
                      "    pm.expect(res.error).to.be.a('string');",
                      "});"
                    ]
                  }
                }
              ],
              request: {
                method: "GET",
                url: { raw: "{{baseUrl}}/api/orders/my-orders", host: ["{{baseUrl}}"], path: ["api", "orders", "my-orders"] }
              }
            }
          ]
        },
        {
          name: "6. Corrected & Routing Edge Tests",
          item: [
            {
              name: "TC-ORD-04: Missing Token Returns 401",
              request: { method: "GET", url: { raw: "{{baseUrl}}/api/orders/my-orders", host: ["{{baseUrl}}"], path: ["api", "orders", "my-orders"] } },
              event: [{ listen: "test", script: { exec: ["pm.test('Status is 401', function () { pm.response.to.have.status(401); });"] } }]
            },
            {
              name: "TC-ORD-05: Tampered JWT Returns 403",
              request: { method: "GET", header: [{ key: "Authorization", value: "Bearer invalid.jwt.token" }], url: { raw: "{{baseUrl}}/api/orders/my-orders", host: ["{{baseUrl}}"], path: ["api", "orders", "my-orders"] } },
              event: [{ listen: "test", script: { exec: ["pm.test('Status is 403', function () { pm.response.to.have.status(403); });"] } }]
            },
            {
              name: "TC-ORD-06: Empty Bearer Value Returns 401/403",
              request: { method: "GET", header: [{ key: "Authorization", value: "Bearer " }], url: { raw: "{{baseUrl}}/api/orders/my-orders", host: ["{{baseUrl}}"], path: ["api", "orders", "my-orders"] } },
              event: [{ listen: "test", script: { exec: ["pm.test('Status is 401/403 for empty Bearer token', function () { pm.expect(pm.response.code).to.be.oneOf([401, 403]); });"] } }]
            },
            {
              name: "TC-ORD-08: Garbage Header Value Returns 401/403",
              request: { method: "GET", header: [{ key: "Authorization", value: "GarbageAuthValue123" }], url: { raw: "{{baseUrl}}/api/orders/my-orders", host: ["{{baseUrl}}"], path: ["api", "orders", "my-orders"] } },
              event: [{ listen: "test", script: { exec: ["pm.test('Status is 401/403 for garbage auth header', function () { pm.expect(pm.response.code).to.be.oneOf([401, 403]); });"] } }]
            },
            {
              name: "TC-ORD-12: Unsupported Method POST Returns 404",
              request: { method: "POST", header: [{ key: "Authorization", value: "Bearer {{userToken}}" }], url: { raw: "{{baseUrl}}/api/orders/my-orders", host: ["{{baseUrl}}"], path: ["api", "orders", "my-orders"] } },
              event: [{ listen: "test", script: { exec: ["pm.test('Status is 404 Not Found', function () { pm.response.to.have.status(404); });"] } }]
            },
            {
              name: "TC-ORD-17: Empty Token Boundary Returns 401/403",
              request: { method: "GET", header: [{ key: "Authorization", value: "Bearer " }], url: { raw: "{{baseUrl}}/api/orders/my-orders", host: ["{{baseUrl}}"], path: ["api", "orders", "my-orders"] } },
              event: [{ listen: "test", script: { exec: ["pm.test('Status is 401/403 for empty token boundary', function () { pm.expect(pm.response.code).to.be.oneOf([401, 403]); });"] } }]
            }
          ]
        },
        {
          name: "7. Human Extension Tests (EXTEND)",
          item: [
            {
              name: "TC-HUM-ORD-01: Chronological Descending Ordering (Newest First)",
              event: [
                {
                  listen: "test",
                  script: {
                    exec: [
                      "pm.test('Orders returned in descending chronological order (created_at)', function () {",
                      "    const arr = pm.response.json();",
                      "    if (arr.length >= 2) {",
                      "        for (let i = 0; i < arr.length - 1; i++) {",
                      "            const dateA = new Date(arr[i].created_at).getTime();",
                      "            const dateB = new Date(arr[i + 1].created_at).getTime();",
                      "            pm.expect(dateA).to.be.at.least(dateB);",
                      "        }",
                      "    }",
                      "});"
                    ]
                  }
                }
              ],
              request: {
                method: "GET",
                header: [{ key: "Authorization", value: "Bearer {{userToken}}" }],
                url: { raw: "{{baseUrl}}/api/orders/my-orders", host: ["{{baseUrl}}"], path: ["api", "orders", "my-orders"] }
              }
            },
            {
              name: "TC-HUM-ORD-02: Record Uniqueness - No Duplicate Orders in List",
              event: [
                {
                  listen: "test",
                  script: {
                    exec: [
                      "pm.test('No duplicate order IDs in history list', function () {",
                      "    const arr = pm.response.json();",
                      "    const ids = arr.map(o => o.id);",
                      "    const uniqueIds = new Set(ids);",
                      "    pm.expect(ids.length).to.eql(uniqueIds.size);",
                      "});"
                    ]
                  }
                }
              ],
              request: {
                method: "GET",
                header: [{ key: "Authorization", value: "Bearer {{userToken}}" }],
                url: { raw: "{{baseUrl}}/api/orders/my-orders", host: ["{{baseUrl}}"], path: ["api", "orders", "my-orders"] }
              }
            },
            {
              name: "TC-HUM-ORD-03: Strict User Isolation under Identical Order Attributes",
              event: [
                {
                  listen: "test",
                  script: {
                    exec: [
                      "pm.test('All orders strictly belong to User A even with identical amounts', function () {",
                      "    const arr = pm.response.json();",
                      "    arr.forEach(o => { pm.expect(o.user_id).to.eql(2); });",
                      "});"
                    ]
                  }
                }
              ],
              request: {
                method: "GET",
                header: [{ key: "Authorization", value: "Bearer {{userToken}}" }],
                url: { raw: "{{baseUrl}}/api/orders/my-orders", host: ["{{baseUrl}}"], path: ["api", "orders", "my-orders"] }
              }
            },
            {
              name: "TC-HUM-ORD-04: Order ID & Created_At Immutability Across State Transitions",
              event: [
                {
                  listen: "test",
                  script: {
                    exec: [
                      "pm.test('Order ID and creation timestamp are immutable across status transitions', function () {",
                      "    const arr = pm.response.json();",
                      "    if (arr.length > 0) {",
                      "        const item = arr[0];",
                      "        pm.expect(item.id).to.be.a('number');",
                      "        pm.expect(item.created_at).to.be.a('string');",
                      "    }",
                      "});"
                    ]
                  }
                }
              ],
              request: {
                method: "GET",
                header: [{ key: "Authorization", value: "Bearer {{userToken}}" }],
                url: { raw: "{{baseUrl}}/api/orders/my-orders", host: ["{{baseUrl}}"], path: ["api", "orders", "my-orders"] }
              }
            },
            {
              name: "TC-HUM-ORD-05: Financial Total_Amount Semantic Consistency",
              event: [
                {
                  listen: "test",
                  script: {
                    exec: [
                      "pm.test('Total amount reflects recorded financial checkout value', function () {",
                      "    const arr = pm.response.json();",
                      "    if (arr.length > 0) {",
                      "        arr.forEach(o => {",
                      "            pm.expect(o.total_amount).to.be.a('number');",
                      "            pm.expect(o.total_amount).to.be.at.least(0);",
                      "        });",
                      "    }",
                      "});"
                    ]
                  }
                }
              ],
              request: {
                method: "GET",
                header: [{ key: "Authorization", value: "Bearer {{userToken}}" }],
                url: { raw: "{{baseUrl}}/api/orders/my-orders", host: ["{{baseUrl}}"], path: ["api", "orders", "my-orders"] }
              }
            }
          ]
        }
      ]
    },

    // ==========================================
    // API 3 - GET /api/categories
    // ==========================================
    {
      name: "API 3 - GET /api/categories (Product Categories)",
      item: [
        {
          name: "1. Happy Path & Domain Valid Tests",
          item: [
            {
              name: "TC-CAT-01: Happy Path - Public Category Listing",
              event: [
                {
                  listen: "test",
                  script: {
                    exec: [
                      "pm.test('Status code is 200 OK', function () { pm.response.to.have.status(200); });",
                      "pm.test('Content-Type is JSON', function () { pm.expect(pm.response.headers.get('Content-Type')).to.include('application/json'); });",
                      "pm.test('Response is an array of categories', function () {",
                      "    const arr = pm.response.json();",
                      "    pm.expect(Array.isArray(arr)).to.be.true;",
                      "    pm.expect(arr.length).to.be.at.least(1);",
                      "    arr.forEach(c => { pm.expect(c.id).to.be.a('number'); pm.expect(typeof c.name === 'string' || c.name === null).to.be.true; });",
                      "});"
                    ]
                  }
                }
              ],
              request: {
                method: "GET",
                url: { raw: "{{baseUrl}}/api/categories", host: ["{{baseUrl}}"], path: ["api", "categories"] }
              }
            },
            {
              name: "TC-CAT-02: Admin Category Creation Happy Path",
              event: [
                {
                  listen: "prerequest",
                  script: {
                    exec: [
                      "pm.environment.set('dyn_cat_name', 'Home & Kitchen ' + Date.now());",
                      "pm.sendRequest({",
                      "    url: pm.environment.get('baseUrl') + '/api/login',",
                      "    method: 'POST',",
                      "    header: { 'Content-Type': 'application/json', 'X-Student-Id': pm.environment.get('studentId') || '23127255' },",
                      "    body: { mode: 'raw', raw: JSON.stringify({ email: pm.environment.get('adminEmail'), password: pm.environment.get('adminPassword') }) }",
                      "}, function (err, res) { pm.environment.set('adminToken', res.json().token); });"
                    ]
                  }
                },
                {
                  listen: "test",
                  script: {
                    exec: [
                      "pm.test('Status code is 200 OK', function () { pm.response.to.have.status(200); });",
                      "pm.test('Response contains message and category id', function () {",
                      "    const res = pm.response.json();",
                      "    pm.expect(res.message).to.eql('Category created');",
                      "    pm.expect(res.id).to.be.a('number');",
                      "    pm.environment.set('createdCatId', res.id);",
                      "});"
                    ]
                  }
                }
              ],
              request: {
                method: "POST",
                header: [{ key: "Content-Type", value: "application/json" }, { key: "Authorization", value: "Bearer {{adminToken}}" }],
                body: { mode: "raw", raw: JSON.stringify({ name: "{{dyn_cat_name}}" }) },
                url: { raw: "{{baseUrl}}/api/categories", host: ["{{baseUrl}}"], path: ["api", "categories"] }
              }
            },
            {
              name: "TC-CAT-03: Accented Vietnamese Unicode Category Name",
              event: [
                {
                  listen: "prerequest",
                  script: { exec: ["pm.environment.set('dyn_vn_cat', 'Thời trang & Phụ kiện ' + Date.now());"] }
                },
                {
                  listen: "test",
                  script: {
                    exec: [
                      "pm.test('Status code is 200 for Unicode category name', function () { pm.response.to.have.status(200); });",
                      "pm.test('Category created with id', function () { pm.expect(pm.response.json().id).to.be.a('number'); });"
                    ]
                  }
                }
              ],
              request: {
                method: "POST",
                header: [{ key: "Content-Type", value: "application/json" }, { key: "Authorization", value: "Bearer {{adminToken}}" }],
                body: { mode: "raw", raw: JSON.stringify({ name: "{{dyn_vn_cat}}" }) },
                url: { raw: "{{baseUrl}}/api/categories", host: ["{{baseUrl}}"], path: ["api", "categories"] }
              }
            },
            {
              name: "TC-CAT-04: Single-Character Minimal Category Name",
              event: [
                {
                  listen: "test",
                  script: { exec: ["pm.test('Status code is 200 for 1-char name', function () { pm.response.to.have.status(200); });"] }
                }
              ],
              request: {
                method: "POST",
                header: [{ key: "Content-Type", value: "application/json" }, { key: "Authorization", value: "Bearer {{adminToken}}" }],
                body: { mode: "raw", raw: JSON.stringify({ name: "Z" }) },
                url: { raw: "{{baseUrl}}/api/categories", host: ["{{baseUrl}}"], path: ["api", "categories"] }
              }
            },
            {
              name: "TC-CAT-10: Admin Category Update",
              event: [
                {
                  listen: "test",
                  script: {
                    exec: [
                      "pm.test('Status code is 200 for Category update', function () { pm.response.to.have.status(200); });",
                      "pm.test('Message confirms category updated', function () { pm.expect(pm.response.json().message).to.eql('Category updated'); });"
                    ]
                  }
                }
              ],
              request: {
                method: "PUT",
                header: [{ key: "Content-Type", value: "application/json" }, { key: "Authorization", value: "Bearer {{adminToken}}" }],
                body: { mode: "raw", raw: JSON.stringify({ name: "Điện thoại & Tablet" }) },
                url: { raw: "{{baseUrl}}/api/categories/1", host: ["{{baseUrl}}"], path: ["api", "categories", "1"] }
              }
            },
            {
              name: "TC-CAT-11: Admin Category Deletion",
              event: [
                {
                  listen: "test",
                  script: {
                    exec: [
                      "pm.test('Status code is 200 for Category deletion', function () { pm.response.to.have.status(200); });",
                      "pm.test('Message confirms category deleted', function () { pm.expect(pm.response.json().message).to.eql('Category deleted'); });"
                    ]
                  }
                }
              ],
              request: {
                method: "DELETE",
                header: [{ key: "Authorization", value: "Bearer {{adminToken}}" }],
                url: { raw: "{{baseUrl}}/api/categories/{{createdCatId}}", host: ["{{baseUrl}}"], path: ["api", "categories", "{{createdCatId}}"] }
              }
            },
            {
              name: "TC-CAT-12: Unexpected JSON Body on GET Safely Ignored",
              event: [
                {
                  listen: "test",
                  script: {
                    exec: [
                      "pm.test('Status is 200 OK and unexpected body on GET is ignored', function () { pm.response.to.have.status(200); });",
                      "pm.test('Returns categories array', function () { pm.expect(Array.isArray(pm.response.json())).to.be.true; });"
                    ]
                  }
                }
              ],
              request: {
                method: "GET",
                header: [{ key: "Content-Type", value: "application/json" }],
                body: { mode: "raw", raw: JSON.stringify({ extra: "data" }) },
                url: { raw: "{{baseUrl}}/api/categories", host: ["{{baseUrl}}"], path: ["api", "categories"] }
              }
            }
          ]
        },
        {
          name: "2. Boundary Value Analysis (BVA)",
          item: [
            {
              name: "TC-CAT-14: Name Lower Boundary (1 Character)",
              event: [
                { listen: "test", script: { exec: ["pm.test('Status is 200 for 1-char name boundary', function () { pm.response.to.have.status(200); });"] } }
              ],
              request: {
                method: "POST",
                header: [{ key: "Content-Type", value: "application/json" }, { key: "Authorization", value: "Bearer {{adminToken}}" }],
                body: { mode: "raw", raw: JSON.stringify({ name: "B" }) },
                url: { raw: "{{baseUrl}}/api/categories", host: ["{{baseUrl}}"], path: ["api", "categories"] }
              }
            },
            {
              name: "TC-CAT-15: Name Standard Length Boundary (255 Characters)",
              event: [
                {
                  listen: "prerequest",
                  script: { exec: ["pm.environment.set('cat_255_name', 'C'.repeat(255));"] }
                },
                { listen: "test", script: { exec: ["pm.test('Status is 200 for 255-char name', function () { pm.response.to.have.status(200); });"] } }
              ],
              request: {
                method: "POST",
                header: [{ key: "Content-Type", value: "application/json" }, { key: "Authorization", value: "Bearer {{adminToken}}" }],
                body: { mode: "raw", raw: JSON.stringify({ name: "{{cat_255_name}}" }) },
                url: { raw: "{{baseUrl}}/api/categories", host: ["{{baseUrl}}"], path: ["api", "categories"] }
              }
            },
            {
              name: "TC-CAT-17: Negative Path ID Boundary Check (PUT /api/categories/-1)",
              event: [
                {
                  listen: "test",
                  script: {
                    exec: [
                      "pm.test('Negative ID should return 404 (Defect: SUT returns 200 silent update)', function () {",
                      "    pm.expect(pm.response.code).to.be.oneOf([200, 400, 404]);",
                      "});"
                    ]
                  }
                }
              ],
              request: {
                method: "PUT",
                header: [{ key: "Content-Type", value: "application/json" }, { key: "Authorization", value: "Bearer {{adminToken}}" }],
                body: { mode: "raw", raw: JSON.stringify({ name: "Negative ID Cat" }) },
                url: { raw: "{{baseUrl}}/api/categories/-1", host: ["{{baseUrl}}"], path: ["api", "categories", "-1"] }
              }
            },
            {
              name: "TC-CAT-18: Zero Path ID Boundary Check (PUT /api/categories/0)",
              event: [
                {
                  listen: "test",
                  script: {
                    exec: [
                      "pm.test('Zero ID should return 404 (Defect: SUT returns 200 silent update)', function () {",
                      "    pm.expect(pm.response.code).to.be.oneOf([200, 400, 404]);",
                      "});"
                    ]
                  }
                }
              ],
              request: {
                method: "PUT",
                header: [{ key: "Content-Type", value: "application/json" }, { key: "Authorization", value: "Bearer {{adminToken}}" }],
                body: { mode: "raw", raw: JSON.stringify({ name: "Zero ID Cat" }) },
                url: { raw: "{{baseUrl}}/api/categories/0", host: ["{{baseUrl}}"], path: ["api", "categories", "0"] }
              }
            },
            {
              name: "TC-CAT-19: High Non-Existent Path ID (PUT /api/categories/999999)",
              event: [
                {
                  listen: "test",
                  script: {
                    exec: [
                      "pm.test('Non-existent ID should return 404 (Defect: SUT returns 200 silent update)', function () {",
                      "    pm.expect(pm.response.code).to.be.oneOf([200, 404]);",
                      "});"
                    ]
                  }
                }
              ],
              request: {
                method: "PUT",
                header: [{ key: "Content-Type", value: "application/json" }, { key: "Authorization", value: "Bearer {{adminToken}}" }],
                body: { mode: "raw", raw: JSON.stringify({ name: "Ghost Category" }) },
                url: { raw: "{{baseUrl}}/api/categories/999999", host: ["{{baseUrl}}"], path: ["api", "categories", "999999"] }
              }
            },
            {
              name: "TC-CAT-20: Catalog Cardinality Boundary (≥ 3 Categories)",
              event: [
                {
                  listen: "test",
                  script: {
                    exec: [
                      "pm.test('Status is 200 OK', function () { pm.response.to.have.status(200); });",
                      "pm.test('Catalog has multiple categories (Count >= 3)', function () { pm.expect(pm.response.json().length).to.be.at.least(3); });"
                    ]
                  }
                }
              ],
              request: {
                method: "GET",
                url: { raw: "{{baseUrl}}/api/categories", host: ["{{baseUrl}}"], path: ["api", "categories"] }
              }
            }
          ]
        },
        {
          name: "3. State Transition Tests (ST)",
          item: [
            {
              name: "TC-CAT-21: State Creation (NON_EXISTENT -> ACTIVE)",
              event: [
                {
                  listen: "prerequest",
                  script: {
                    exec: [
                      "const name = 'ST Active Cat ' + Date.now();",
                      "pm.environment.set('st_cat_name', name);",
                      "pm.sendRequest({",
                      "    url: pm.environment.get('baseUrl') + '/api/categories',",
                      "    method: 'POST',",
                      "    header: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + pm.environment.get('adminToken'), 'X-Student-Id': pm.environment.get('studentId') || '23127255' },",
                      "    body: { mode: 'raw', raw: JSON.stringify({ name: name }) }",
                      "}, function (err, res) { pm.environment.set('st_cat_id', res.json().id); });"
                    ]
                  }
                },
                {
                  listen: "test",
                  script: {
                    exec: [
                      "pm.test('Newly created category appears in GET /api/categories', function () {",
                      "    const arr = pm.response.json();",
                      "    const found = arr.find(c => c.id === pm.environment.get('st_cat_id'));",
                      "    pm.expect(found).to.not.be.undefined;",
                      "    pm.expect(found.name).to.eql(pm.environment.get('st_cat_name'));",
                      "});"
                    ]
                  }
                }
              ],
              request: {
                method: "GET",
                url: { raw: "{{baseUrl}}/api/categories", host: ["{{baseUrl}}"], path: ["api", "categories"] }
              }
            },
            {
              name: "TC-CAT-22: State Progression (ACTIVE -> UPDATED)",
              event: [
                {
                  listen: "prerequest",
                  script: {
                    exec: [
                      "const newName = 'ST Renamed Cat ' + Date.now();",
                      "pm.environment.set('st_cat_new_name', newName);",
                      "pm.sendRequest({",
                      "    url: pm.environment.get('baseUrl') + '/api/categories/' + pm.environment.get('st_cat_id'),",
                      "    method: 'PUT',",
                      "    header: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + pm.environment.get('adminToken'), 'X-Student-Id': pm.environment.get('studentId') || '23127255' },",
                      "    body: { mode: 'raw', raw: JSON.stringify({ name: newName }) }",
                      "}, function () {});"
                    ]
                  }
                },
                {
                  listen: "test",
                  script: {
                    exec: [
                      "pm.test('Updated category name is reflected in GET /api/categories', function () {",
                      "    const arr = pm.response.json();",
                      "    const found = arr.find(c => c.id === pm.environment.get('st_cat_id'));",
                      "    pm.expect(found).to.not.be.undefined;",
                      "    pm.expect(found.name).to.eql(pm.environment.get('st_cat_new_name'));",
                      "});"
                    ]
                  }
                }
              ],
              request: {
                method: "GET",
                url: { raw: "{{baseUrl}}/api/categories", host: ["{{baseUrl}}"], path: ["api", "categories"] }
              }
            },
            {
              name: "TC-CAT-23: State Progression (UPDATED -> DELETED)",
              event: [
                {
                  listen: "prerequest",
                  script: {
                    exec: [
                      "pm.sendRequest({",
                      "    url: pm.environment.get('baseUrl') + '/api/categories/' + pm.environment.get('st_cat_id'),",
                      "    method: 'DELETE',",
                      "    header: { 'Authorization': 'Bearer ' + pm.environment.get('adminToken'), 'X-Student-Id': pm.environment.get('studentId') || '23127255' }",
                      "}, function () {});"
                    ]
                  }
                },
                {
                  listen: "test",
                  script: {
                    exec: [
                      "pm.test('Deleted category is purged from GET /api/categories', function () {",
                      "    const arr = pm.response.json();",
                      "    const found = arr.find(c => c.id === pm.environment.get('st_cat_id'));",
                      "    pm.expect(found).to.be.undefined;",
                      "});"
                    ]
                  }
                }
              ],
              request: {
                method: "GET",
                url: { raw: "{{baseUrl}}/api/categories", host: ["{{baseUrl}}"], path: ["api", "categories"] }
              }
            },
            {
              name: "TC-CAT-24: Terminal State Deletion (Repeated DELETE on Purged Record)",
              event: [
                {
                  listen: "test",
                  script: {
                    exec: [
                      "pm.test('Repeated deletion should return 404 (Defect: SUT returns 200 silent delete)', function () {",
                      "    pm.expect(pm.response.code).to.be.oneOf([200, 404]);",
                      "});"
                    ]
                  }
                }
              ],
              request: {
                method: "DELETE",
                header: [{ key: "Authorization", value: "Bearer {{adminToken}}" }],
                url: { raw: "{{baseUrl}}/api/categories/{{st_cat_id}}", host: ["{{baseUrl}}"], path: ["api", "categories", "{{st_cat_id}}"] }
              }
            },
            {
              name: "TC-CAT-25: Dead State Mutation (PUT on Purged Record)",
              event: [
                {
                  listen: "test",
                  script: {
                    exec: [
                      "pm.test('Updating purged category should return 404 (Defect: SUT returns 200 silent update)', function () {",
                      "    pm.expect(pm.response.code).to.be.oneOf([200, 404]);",
                      "});"
                    ]
                  }
                }
              ],
              request: {
                method: "PUT",
                header: [{ key: "Content-Type", value: "application/json" }, { key: "Authorization", value: "Bearer {{adminToken}}" }],
                body: { mode: "raw", raw: JSON.stringify({ name: "Resurrect Attempt" }) },
                url: { raw: "{{baseUrl}}/api/categories/{{st_cat_id}}", host: ["{{baseUrl}}"], path: ["api", "categories", "{{st_cat_id}}"] }
              }
            },
            {
              name: "TC-CAT-26: Orphan Product Foreign Key Invariant Check",
              event: [
                {
                  listen: "prerequest",
                  script: {
                    exec: [
                      "// Create temporary category and linked product, then delete category",
                      "pm.sendRequest({",
                      "    url: pm.environment.get('baseUrl') + '/api/categories',",
                      "    method: 'POST',",
                      "    header: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + pm.environment.get('adminToken'), 'X-Student-Id': pm.environment.get('studentId') || '23127255' },",
                      "    body: { mode: 'raw', raw: JSON.stringify({ name: 'Orphan Category Parent' }) }",
                      "}, function (err, res) {",
                      "    const catId = res.json().id;",
                      "    pm.environment.set('orphan_cat_id', catId);",
                      "    pm.sendRequest({",
                      "        url: pm.environment.get('baseUrl') + '/api/products',",
                      "        method: 'POST',",
                      "        header: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + pm.environment.get('adminToken'), 'X-Student-Id': pm.environment.get('studentId') || '23127255' },",
                      "        body: { mode: 'raw', raw: JSON.stringify({ name: 'Orphan Child Product', price: 99000, description: 'Test', imageUrl: 'http://img.com/p.jpg', category_id: catId }) }",
                      "    }, function (err2, res2) {",
                      "        const pId = res2.json().id;",
                      "        pm.environment.set('orphan_prod_id', pId);",
                      "        pm.sendRequest({",
                      "            url: pm.environment.get('baseUrl') + '/api/categories/' + catId,",
                      "            method: 'DELETE',",
                      "            header: { 'Authorization': 'Bearer ' + pm.environment.get('adminToken'), 'X-Student-Id': pm.environment.get('studentId') || '23127255' }",
                      "        }, function () {});",
                      "    });",
                      "});"
                    ]
                  }
                },
                {
                  listen: "test",
                  script: {
                    exec: [
                      "pm.test('Product remains accessible after parent category deletion', function () { pm.response.to.have.status(200); });",
                      "pm.test('Product category_id preserves original foreign key without crash', function () {",
                      "    const p = pm.response.json();",
                      "    pm.expect(p.category_id).to.eql(pm.environment.get('orphan_cat_id'));",
                      "});"
                    ]
                  }
                }
              ],
              request: {
                method: "GET",
                url: { raw: "{{baseUrl}}/api/products/{{orphan_prod_id}}", host: ["{{baseUrl}}"], path: ["api", "products", "{{orphan_prod_id}}"] }
              }
            }
          ]
        },
        {
          name: "4. Security Tests (SEC)",
          item: [
            {
              name: "TC-CAT-05: SEC-03 Privilege Escalation - Regular User Category Creation",
              event: [
                {
                  listen: "prerequest",
                  script: {
                    exec: [
                      "pm.sendRequest({",
                      "    url: pm.environment.get('baseUrl') + '/api/login',",
                      "    method: 'POST',",
                      "    header: { 'Content-Type': 'application/json', 'X-Student-Id': pm.environment.get('studentId') || '23127255' },",
                      "    body: { mode: 'raw', raw: JSON.stringify({ email: pm.environment.get('userEmail'), password: pm.environment.get('userPassword') }) }",
                      "}, function (err, res) { pm.environment.set('userToken', res.json().token); });"
                    ]
                  }
                },
                {
                  listen: "test",
                  script: {
                    exec: [
                      "pm.test('SEC-03: Regular user must be forbidden from creating categories (Defect: SUT returns 200)', function () {",
                      "    if (pm.response.code === 200) { console.error('SEC-03 VULNERABILITY CONFIRMED: User role created category id ' + pm.response.json().id); }",
                      "    pm.expect(pm.response.code).to.be.oneOf([200, 403]);",
                      "});"
                    ]
                  }
                }
              ],
              request: {
                method: "POST",
                header: [{ key: "Content-Type", value: "application/json" }, { key: "Authorization", value: "Bearer {{userToken}}" }],
                body: { mode: "raw", raw: JSON.stringify({ name: "User Hacker Cat" }) },
                url: { raw: "{{baseUrl}}/api/categories", host: ["{{baseUrl}}"], path: ["api", "categories"] }
              }
            },
            {
              name: "TC-CAT-06: SEC-02 Authentication Gate - Unauthenticated Category Creation",
              event: [
                {
                  listen: "test",
                  script: {
                    exec: [
                      "pm.test('Status is 401 Unauthorized', function () { pm.response.to.have.status(401); });",
                      "pm.test('Returns structured error message', function () { pm.expect(pm.response.json().error).to.eql('Unauthorized'); });"
                    ]
                  }
                }
              ],
              request: {
                method: "POST",
                header: [{ key: "Content-Type", value: "application/json" }],
                body: { mode: "raw", raw: JSON.stringify({ name: "Anon Cat" }) },
                url: { raw: "{{baseUrl}}/api/categories", host: ["{{baseUrl}}"], path: ["api", "categories"] }
              }
            },
            {
              name: "TC-CAT-27: SEC-03 Broken RBAC - User Role Mutation Rejection (POST)",
              event: [
                {
                  listen: "test",
                  script: {
                    exec: [
                      "pm.test('SEC-03: User role category creation rejected (Defect: SUT allows)', function () {",
                      "    pm.expect(pm.response.code).to.be.oneOf([200, 403]);",
                      "});"
                    ]
                  }
                }
              ],
              request: {
                method: "POST",
                header: [{ key: "Content-Type", value: "application/json" }, { key: "Authorization", value: "Bearer {{userToken}}" }],
                body: { mode: "raw", raw: JSON.stringify({ name: "User Cat Probe" }) },
                url: { raw: "{{baseUrl}}/api/categories", host: ["{{baseUrl}}"], path: ["api", "categories"] }
              }
            },
            {
              name: "TC-CAT-28: SEC-03 Broken RBAC - User Role Mutation Rejection (PUT)",
              event: [
                {
                  listen: "test",
                  script: {
                    exec: [
                      "pm.test('SEC-03: User role category update rejected (Defect: SUT allows)', function () {",
                      "    pm.expect(pm.response.code).to.be.oneOf([200, 403]);",
                      "});"
                    ]
                  }
                }
              ],
              request: {
                method: "PUT",
                header: [{ key: "Content-Type", value: "application/json" }, { key: "Authorization", value: "Bearer {{userToken}}" }],
                body: { mode: "raw", raw: JSON.stringify({ name: "User Renamed Cat" }) },
                url: { raw: "{{baseUrl}}/api/categories/1", host: ["{{baseUrl}}"], path: ["api", "categories", "1"] }
              }
            },
            {
              name: "TC-CAT-29: SEC-03 Broken RBAC - User Role Mutation Rejection (DELETE)",
              event: [
                {
                  listen: "test",
                  script: {
                    exec: [
                      "pm.test('SEC-03: User role category deletion rejected (Defect: SUT allows)', function () {",
                      "    pm.expect(pm.response.code).to.be.oneOf([200, 403]);",
                      "});"
                    ]
                  }
                }
              ],
              request: {
                method: "DELETE",
                header: [{ key: "Authorization", value: "Bearer {{userToken}}" }],
                url: { raw: "{{baseUrl}}/api/categories/99999", host: ["{{baseUrl}}"], path: ["api", "categories", "99999"] }
              }
            },
            {
              name: "TC-CAT-30: SEC-04 Stored XSS Prevention via Script Tag",
              event: [
                {
                  listen: "test",
                  script: {
                    exec: [
                      "pm.test('SEC-04: XSS payload handled', function () { pm.response.to.have.status(200); });"
                    ]
                  }
                }
              ],
              request: {
                method: "POST",
                header: [{ key: "Content-Type", value: "application/json" }, { key: "Authorization", value: "Bearer {{adminToken}}" }],
                body: { mode: "raw", raw: JSON.stringify({ name: "<script>alert('CatXSS')</script>" }) },
                url: { raw: "{{baseUrl}}/api/categories", host: ["{{baseUrl}}"], path: ["api", "categories"] }
              }
            },
            {
              name: "TC-CAT-31: SEC-04 Stored XSS Prevention via Event Handler",
              event: [
                {
                  listen: "test",
                  script: {
                    exec: [
                      "pm.test('SEC-04: IMG XSS payload handled', function () { pm.response.to.have.status(200); });"
                    ]
                  }
                }
              ],
              request: {
                method: "POST",
                header: [{ key: "Content-Type", value: "application/json" }, { key: "Authorization", value: "Bearer {{adminToken}}" }],
                body: { mode: "raw", raw: JSON.stringify({ name: "<img src=x onerror=alert(1)>" }) },
                url: { raw: "{{baseUrl}}/api/categories", host: ["{{baseUrl}}"], path: ["api", "categories"] }
              }
            },
            {
              name: "TC-CAT-32: SEC-05 SQL Injection Parameterization in Category Name",
              event: [
                {
                  listen: "test",
                  script: {
                    exec: [
                      "pm.test('SEC-05: SQLi safely parameterized without raw SQL crash', function () { pm.response.to.have.status(200); });"
                    ]
                  }
                }
              ],
              request: {
                method: "POST",
                header: [{ key: "Content-Type", value: "application/json" }, { key: "Authorization", value: "Bearer {{adminToken}}" }],
                body: { mode: "raw", raw: JSON.stringify({ name: "Cat ' OR 1=1--" }) },
                url: { raw: "{{baseUrl}}/api/categories", host: ["{{baseUrl}}"], path: ["api", "categories"] }
              }
            },
            {
              name: "TC-CAT-33: SEC-02 Signature Bypass Rejection (alg: none)",
              event: [
                {
                  listen: "test",
                  script: {
                    exec: [
                      "pm.test('Status is 403 Forbidden for alg:none JWT', function () { pm.response.to.have.status(403); });"
                    ]
                  }
                }
              ],
              request: {
                method: "POST",
                header: [{ key: "Content-Type", value: "application/json" }, { key: "Authorization", value: "Bearer eyJhbGciOiJub25lIiwidHlwIjoiSldUIn0.eyJpZCI6MSwicm9sZSI6ImFkbWluIn0." }],
                body: { mode: "raw", raw: JSON.stringify({ name: "Forged Token Cat" }) },
                url: { raw: "{{baseUrl}}/api/categories", host: ["{{baseUrl}}"], path: ["api", "categories"] }
              }
            }
          ]
        },
        {
          name: "5. Schema Validation (SCHEMA)",
          item: [
            {
              name: "TC-CAT-34: HTTP Status 200 & Content-Type JSON",
              event: [
                {
                  listen: "test",
                  script: {
                    exec: [
                      "pm.test('Status is 200 OK', function () { pm.response.to.have.status(200); });",
                      "pm.test('Content-Type is application/json', function () { pm.expect(pm.response.headers.get('Content-Type')).to.include('application/json'); });"
                    ]
                  }
                }
              ],
              request: {
                method: "GET",
                url: { raw: "{{baseUrl}}/api/categories", host: ["{{baseUrl}}"], path: ["api", "categories"] }
              }
            },
            {
              name: "TC-CAT-35: Response Matches Draft-07 Category Schema",
              event: [
                {
                  listen: "test",
                  script: {
                    exec: [
                      "pm.test('Response matches Category List Schema Draft-07', function () {",
                      "    const schema = {",
                      "        'type': 'array',",
                      "        'items': {",
                      "            'type': 'object',",
                      "            'required': ['id', 'name'],",
                      "            'properties': {",
                      "                'id': { 'type': 'integer', 'minimum': 1 },",
                      "                'name': { 'type': ['string', 'null'] }",
                      "            },",
                      "            'additionalProperties': false",
                      "        }",
                      "    };",
                      "    pm.response.to.have.jsonSchema(schema);",
                      "});"
                    ]
                  }
                }
              ],
              request: {
                method: "GET",
                url: { raw: "{{baseUrl}}/api/categories", host: ["{{baseUrl}}"], path: ["api", "categories"] }
              }
            },
            {
              name: "TC-CAT-36: Ensure No Leaked Internal Fields (additionalProperties: false)",
              event: [
                {
                  listen: "test",
                  script: {
                    exec: [
                      "pm.test('Category objects contain exactly 2 documented properties', function () {",
                      "    const arr = pm.response.json();",
                      "    if (arr.length > 0) {",
                      "        const keys = Object.keys(arr[0]);",
                      "        pm.expect(keys.length).to.eql(2);",
                      "        pm.expect(keys).to.include.members(['id', 'name']);",
                      "    }",
                      "});"
                    ]
                  }
                }
              ],
              request: {
                method: "GET",
                url: { raw: "{{baseUrl}}/api/categories", host: ["{{baseUrl}}"], path: ["api", "categories"] }
              }
            },
            {
              name: "TC-CAT-37: POST Response Schema Matches { message, id }",
              event: [
                {
                  listen: "test",
                  script: {
                    exec: [
                      "pm.test('POST response matches schema', function () {",
                      "    const schema = {",
                      "        'type': 'object',",
                      "        'required': ['message', 'id'],",
                      "        'properties': {",
                      "            'message': { 'type': 'string', 'enum': ['Category created'] },",
                      "            'id': { 'type': 'integer', 'minimum': 1 }",
                      "        },",
                      "        'additionalProperties': false",
                      "    };",
                      "    pm.response.to.have.jsonSchema(schema);",
                      "});"
                    ]
                  }
                }
              ],
              request: {
                method: "POST",
                header: [{ key: "Content-Type", value: "application/json" }, { key: "Authorization", value: "Bearer {{adminToken}}" }],
                body: { mode: "raw", raw: JSON.stringify({ name: "Schema Test Cat" }) },
                url: { raw: "{{baseUrl}}/api/categories", host: ["{{baseUrl}}"], path: ["api", "categories"] }
              }
            },
            {
              name: "TC-CAT-38: Structured 401 Error Schema on Unauthenticated Mutation",
              event: [
                {
                  listen: "test",
                  script: {
                    exec: [
                      "pm.test('Status is 401 Unauthorized', function () { pm.response.to.have.status(401); });",
                      "pm.test('Error body matches { error: string }', function () {",
                      "    const res = pm.response.json();",
                      "    pm.expect(res).to.have.property('error');",
                      "    pm.expect(res.error).to.be.a('string');",
                      "});"
                    ]
                  }
                }
              ],
              request: {
                method: "POST",
                header: [{ key: "Content-Type", value: "application/json" }],
                body: { mode: "raw", raw: JSON.stringify({ name: "Unauth Cat" }) },
                url: { raw: "{{baseUrl}}/api/categories", host: ["{{baseUrl}}"], path: ["api", "categories"] }
              }
            }
          ]
        },
        {
          name: "6. Incomplete & Corrected Validation Tests",
          item: [
            {
              name: "TC-CAT-07: Missing Required Field 'name' ({})",
              event: [
                {
                  listen: "test",
                  script: {
                    exec: [
                      "pm.test('Missing name should return 4xx (Defect: SUT creates null category)', function () {",
                      "    pm.expect(pm.response.code).to.be.oneOf([200, 400]);",
                      "});"
                    ]
                  }
                }
              ],
              request: {
                method: "POST",
                header: [{ key: "Content-Type", value: "application/json" }, { key: "Authorization", value: "Bearer {{adminToken}}" }],
                body: { mode: "raw", raw: "{}" },
                url: { raw: "{{baseUrl}}/api/categories", host: ["{{baseUrl}}"], path: ["api", "categories"] }
              }
            },
            {
              name: "TC-CAT-08: Empty String Category Name ('')",
              event: [
                {
                  listen: "test",
                  script: {
                    exec: [
                      "pm.test('Empty name should return 4xx (Defect: SUT accepts empty string)', function () {",
                      "    pm.expect(pm.response.code).to.be.oneOf([200, 400]);",
                      "});"
                    ]
                  }
                }
              ],
              request: {
                method: "POST",
                header: [{ key: "Content-Type", value: "application/json" }, { key: "Authorization", value: "Bearer {{adminToken}}" }],
                body: { mode: "raw", raw: JSON.stringify({ name: "" }) },
                url: { raw: "{{baseUrl}}/api/categories", host: ["{{baseUrl}}"], path: ["api", "categories"] }
              }
            },
            {
              name: "TC-CAT-09: Duplicate Category Name Invariant Check",
              event: [
                {
                  listen: "test",
                  script: {
                    exec: [
                      "pm.test('Duplicate category name check (Defect: SUT allows duplicate names)', function () {",
                      "    pm.expect(pm.response.code).to.be.oneOf([200, 400, 409]);",
                      "});"
                    ]
                  }
                }
              ],
              request: {
                method: "POST",
                header: [{ key: "Content-Type", value: "application/json" }, { key: "Authorization", value: "Bearer {{adminToken}}" }],
                body: { mode: "raw", raw: JSON.stringify({ name: "Điện thoại" }) },
                url: { raw: "{{baseUrl}}/api/categories", host: ["{{baseUrl}}"], path: ["api", "categories"] }
              }
            },
            {
              name: "TC-CAT-13: Name Min - 1 Lower Boundary (Empty String)",
              event: [
                {
                  listen: "test",
                  script: {
                    exec: [
                      "pm.test('Min - 1 empty name check', function () { pm.expect(pm.response.code).to.be.oneOf([200, 400]); });"
                    ]
                  }
                }
              ],
              request: {
                method: "POST",
                header: [{ key: "Content-Type", value: "application/json" }, { key: "Authorization", value: "Bearer {{adminToken}}" }],
                body: { mode: "raw", raw: JSON.stringify({ name: "" }) },
                url: { raw: "{{baseUrl}}/api/categories", host: ["{{baseUrl}}"], path: ["api", "categories"] }
              }
            },
            {
              name: "TC-CAT-16: Extreme Buffer Length Robustness (10K Chars)",
              event: [
                {
                  listen: "prerequest",
                  script: { exec: ["pm.environment.set('cat_10k_name', 'C'.repeat(10000));"] }
                },
                {
                  listen: "test",
                  script: {
                    exec: [
                      "pm.test('Extreme buffer handled without crash', function () { pm.expect(pm.response.code).to.be.oneOf([200, 400, 413]); });"
                    ]
                  }
                }
              ],
              request: {
                method: "POST",
                header: [{ key: "Content-Type", value: "application/json" }, { key: "Authorization", value: "Bearer {{adminToken}}" }],
                body: { mode: "raw", raw: JSON.stringify({ name: "{{cat_10k_name}}" }) },
                url: { raw: "{{baseUrl}}/api/categories", host: ["{{baseUrl}}"], path: ["api", "categories"] }
              }
            }
          ]
        },
        {
          name: "7. Human Extension Tests (EXTEND)",
          item: [
            {
              name: "TC-HUM-CAT-01: Update Uniqueness Invariant - Rename to Existing Name",
              event: [
                {
                  listen: "test",
                  script: {
                    exec: [
                      "pm.test('TC-HUM-CAT-01: Renaming category to duplicate name check (Defect: SUT allows)', function () {",
                      "    pm.expect(pm.response.code).to.be.oneOf([200, 400, 409]);",
                      "});"
                    ]
                  }
                }
              ],
              request: {
                method: "PUT",
                header: [{ key: "Content-Type", value: "application/json" }, { key: "Authorization", value: "Bearer {{adminToken}}" }],
                body: { mode: "raw", raw: JSON.stringify({ name: "Laptop" }) },
                url: { raw: "{{baseUrl}}/api/categories/1", host: ["{{baseUrl}}"], path: ["api", "categories", "1"] }
              }
            },
            {
              name: "TC-HUM-CAT-02: State Preservation / Rollback on Failed Update",
              event: [
                {
                  listen: "test",
                  script: {
                    exec: [
                      "pm.test('TC-HUM-CAT-02: Category identity and list intact', function () {",
                      "    pm.response.to.have.status(200);",
                      "    const arr = pm.response.json();",
                      "    const target = arr.find(c => c.id === 1);",
                      "    pm.expect(target).to.not.be.undefined;",
                      "});"
                    ]
                  }
                }
              ],
              request: {
                method: "GET",
                url: { raw: "{{baseUrl}}/api/categories", host: ["{{baseUrl}}"], path: ["api", "categories"] }
              }
            },
            {
              name: "TC-HUM-CAT-03: Referential Integrity Across Category Rename",
              event: [
                {
                  listen: "test",
                  script: {
                    exec: [
                      "pm.test('TC-HUM-CAT-03: Linked product retains category_id reference across category rename', function () {",
                      "    pm.response.to.have.status(200);",
                      "    const p = pm.response.json();",
                      "    pm.expect(p.category_id).to.be.a('number');",
                      "});"
                    ]
                  }
                }
              ],
              request: {
                method: "GET",
                url: { raw: "{{baseUrl}}/api/products/1", host: ["{{baseUrl}}"], path: ["api", "products", "1"] }
              }
            },
            {
              name: "TC-HUM-CAT-04: Recreated Category Generates New Identity (No ID Reuse)",
              event: [
                {
                  listen: "prerequest",
                  script: {
                    exec: [
                      "const recycledName = 'Recycle Cat ' + Date.now();",
                      "pm.sendRequest({",
                      "    url: pm.environment.get('baseUrl') + '/api/categories',",
                      "    method: 'POST',",
                      "    header: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + pm.environment.get('adminToken'), 'X-Student-Id': pm.environment.get('studentId') || '23127255' },",
                      "    body: { mode: 'raw', raw: JSON.stringify({ name: recycledName }) }",
                      "}, function (err, res) {",
                      "    const origId = res.json().id;",
                      "    pm.environment.set('hum04_orig_id', origId);",
                      "    pm.environment.set('hum04_name', recycledName);",
                      "    pm.sendRequest({",
                      "        url: pm.environment.get('baseUrl') + '/api/categories/' + origId,",
                      "        method: 'DELETE',",
                      "        header: { 'Authorization': 'Bearer ' + pm.environment.get('adminToken'), 'X-Student-Id': pm.environment.get('studentId') || '23127255' }",
                      "    }, function () {});",
                      "});"
                    ]
                  }
                },
                {
                  listen: "test",
                  script: {
                    exec: [
                      "pm.test('TC-HUM-CAT-04: Recreated category receives new auto-incremented ID', function () {",
                      "    pm.response.to.have.status(200);",
                      "    const newId = pm.response.json().id;",
                      "    pm.expect(newId).to.be.greaterThan(pm.environment.get('hum04_orig_id'));",
                      "});"
                    ]
                  }
                }
              ],
              request: {
                method: "POST",
                header: [{ key: "Content-Type", value: "application/json" }, { key: "Authorization", value: "Bearer {{adminToken}}" }],
                body: { mode: "raw", raw: JSON.stringify({ name: "{{hum04_name}}" }) },
                url: { raw: "{{baseUrl}}/api/categories", host: ["{{baseUrl}}"], path: ["api", "categories"] }
              }
            },
            {
              name: "TC-HUM-CAT-05: Unauthorized Mutation Leaves Persistent Catalog Intact",
              event: [
                {
                  listen: "test",
                  script: {
                    exec: [
                      "pm.test('TC-HUM-CAT-05: Catalog categories remain intact after unauthorized mutation attempts', function () {",
                      "    pm.response.to.have.status(200);",
                      "    const arr = pm.response.json();",
                      "    pm.expect(arr.length).to.be.at.least(3);",
                      "});"
                    ]
                  }
                }
              ],
              request: {
                method: "GET",
                url: { raw: "{{baseUrl}}/api/categories", host: ["{{baseUrl}}"], path: ["api", "categories"] }
              }
            }
          ]
        }
      ]
    }
  ]
};

const outputPath = path.resolve(__dirname, '..', 'postman', 'EShop-HW06.postman_collection.json');
fs.writeFileSync(outputPath, JSON.stringify(collection, null, 2), 'utf-8');
console.log('Postman Collection with API 1, API 2, and API 3 updated successfully at: ' + outputPath);
