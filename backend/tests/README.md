# Authentication and authorization E2E tests

These tests exercise the backend HTTP routes against a real, isolated PostgreSQL
test database. They start the Express app on a temporary local port, create
uniquely named test accounts, and delete those accounts afterward. An admin
account is inserted directly to test the admin authorization role.

Use Node.js 20.10 or newer and set `AUTH_TEST_DATABASE_URL` to a disposable
database with the project schema already applied. Do not point it at development
or production data.

From the repository root, run:

```sh
AUTH_TEST_DATABASE_URL='postgresql://USER:PASSWORD@localhost:5433/transcendence_test' \
  node --test backend/tests/auth.e2e.test.js
```

The suite covers registration validation, duplicate accounts, optional profile
fields, password hashing, login success and failure, cookie attributes, session
lookup, invalid and expired tokens, cookie and bearer-token authentication,
role-based access for organizer/provider/admin, disabled accounts, and logout.

The suite runs the backend API end to end. It does not drive the browser UI.
