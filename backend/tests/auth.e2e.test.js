import assert from "node:assert/strict";
import { randomBytes, randomUUID } from "node:crypto";
import { after, before, test } from "node:test";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const runId = randomUUID();
const emailFor = (role) => `auth-e2e-${role}-${runId}@example.test`;
const emailsToClean = [];
let appServer;
let baseUrl;
let db;
let Users;
let secret;
let organizer;
let provider;
let admin;

const request = async (path, { method, body, cookie, bearer } = {}) => {
  const headers = {};
  if (body !== undefined) headers["content-type"] = "application/json";
  if (cookie !== undefined) headers.cookie = cookie;
  if (bearer) headers.authorization = `Bearer ${bearer}`;

  const response = await fetch(`${baseUrl}${path}`, {
    method: method ?? (body === undefined ? "GET" : "POST"),
    headers,
    ...(body === undefined ? {} : { body: JSON.stringify(body) }),
  });
  const data = await response.json().catch(() => null);

  return {
    response,
    data,
    setCookie: response.headers.get("set-cookie") ?? "",
  };
};

const cookieFrom = (setCookie) => {
  const value = setCookie.match(/^jwt=([^;]*)/);
  return value ? `jwt=${value[1]}` : null;
};

const register = async (role, overrides = {}) => {
  const email = overrides.email ?? emailFor(role.toLowerCase());
  emailsToClean.push(email);
  const result = await request("/auth/register", {
    body: {
      name: `${role} E2E`,
      email,
      password: "e2e-password-strong",
      role,
      ...overrides,
    },
  });
  return { ...result, email };
};

const createDatabaseUser = async ({
  name,
  email,
  password,
  role,
  isActive = true,
}) => {
  emailsToClean.push(email);
  return Users.create({
    name,
    email,
    password: await bcrypt.hash(password, 10),
    role,
    isActive,
  });
};

before(async () => {
  const testDatabaseUrl = process.env.AUTH_TEST_DATABASE_URL;
  if (!testDatabaseUrl) {
    throw new Error(
      "Set AUTH_TEST_DATABASE_URL to an isolated test database before running auth E2E tests.",
    );
  }

  process.env.DATABASE_URL = testDatabaseUrl;
  process.env.NODE_ENV = "test";
  process.env.JWT_SECRET = randomBytes(32).toString("hex");
  process.env.JWT_EXPIRES_IN = "1h";
  secret = process.env.JWT_SECRET;

  ({ db } = await import("../src/modules/auth/auth.config.db.js"));
  Users = db.orm.public.User;
  await db.connect();

  const { default: app } = await import("../src/app.js");
  appServer = app.listen(0, "127.0.0.1");
  await new Promise((resolve, reject) => {
    appServer.once("listening", resolve);
    appServer.once("error", reject);
  });
  baseUrl = `http://127.0.0.1:${appServer.address().port}`;

  organizer = await register("ORGANIZER");
  provider = await register("PROVIDER");
  admin = await createDatabaseUser({
    name: "E2E Admin",
    email: emailFor("admin"),
    password: "e2e-admin-password",
    role: "ADMIN",
  });
});

after(async () => {
  if (appServer?.listening) {
    await new Promise((resolve, reject) => {
      appServer.close((error) => (error ? reject(error) : resolve()));
    });
  }

  if (db) {
    for (const email of emailsToClean) {
      await Users.where({ email }).delete();
    }
    await db.close();
  }
});

test("authentication and authorization work end to end", async (t) => {
  await t.test(
    "unauthenticated session and invalid registration inputs",
    async () => {
      const session = await request("/auth/me");
      assert.equal(session.response.status, 200);
      assert.equal(session.data.status, "success");
      assert.equal(session.data.data.user, null);

      for (const body of [
        {},
        {
          email: "missing-name@example.test",
          password: "x",
          role: "ORGANIZER",
        },
        { name: "Missing email", password: "x", role: "ORGANIZER" },
        {
          name: "Missing password",
          email: "missing-password@example.test",
          role: "ORGANIZER",
        },
        {
          name: "Missing role",
          email: "missing-role@example.test",
          password: "x",
        },
        {
          name: "Admin signup",
          email: "admin-signup@example.test",
          password: "x",
          role: "ADMIN",
        },
      ]) {
        const result = await request("/auth/register", { body });
        assert.equal(result.response.status, 401);
        assert.equal(result.data.status, "error");
      }
    },
  );

  await t.test(
    "registration hashes passwords, returns safe user data, and sets a cookie",
    async () => {
      assert.equal(organizer.response.status, 200);
      assert.equal(organizer.data.status, "success");
      assert.equal(organizer.data.data.user.role, "ORGANIZER");
      assert.equal(organizer.data.data.user.email, organizer.email);
      assert.equal(organizer.data.data.user.phone, null);
      assert.equal(organizer.data.data.user.avatarUrl, null);
      assert.equal("password" in organizer.data.data.user, false);
      assert.ok(organizer.data.data.token);

      const cookie = cookieFrom(organizer.setCookie);
      assert.ok(cookie);
      assert.match(organizer.setCookie, /httponly/i);
      assert.match(organizer.setCookie, /samesite=lax/i);
      assert.match(organizer.setCookie, /max-age=604800/i);
      assert.equal(cookie.slice("jwt=".length), organizer.data.data.token);

      const user = await Users.where({ email: organizer.email }).first();
      assert.ok(user.password);
      assert.notEqual(user.password, "e2e-password-strong");
      assert.equal(
        await bcrypt.compare("e2e-password-strong", user.password),
        true,
      );

      const optional = await register("PROVIDER", {
        email: emailFor("provider-optional"),
        phone: "+15550001234",
        avatarUrl: "https://example.test/avatar.png",
      });
      assert.equal(optional.response.status, 200);
      assert.equal(optional.data.data.user.phone, "+15550001234");
      assert.equal(
        optional.data.data.user.avatarUrl,
        "https://example.test/avatar.png",
      );
    },
  );

  await t.test(
    "duplicate registration and login credentials are handled",
    async () => {
      const duplicate = await request("/auth/register", {
        body: {
          name: "Duplicate",
          email: organizer.email,
          password: "another-password",
          role: "ORGANIZER",
        },
      });
      assert.equal(duplicate.response.status, 409);

      const duplicateWithDifferentEmailCase = await request("/auth/register", {
        body: {
          name: "Case-insensitive duplicate",
          email: organizer.email.toUpperCase(),
          password: "another-password",
          role: "ORGANIZER",
        },
      });
      assert.equal(duplicateWithDifferentEmailCase.response.status, 409);

      const validLogin = await request("/auth/login", {
        body: {
          email: organizer.email.toUpperCase(),
          password: "e2e-password-strong",
        },
      });
      assert.equal(validLogin.response.status, 200);
      assert.ok(validLogin.data.data.token);
      assert.ok(cookieFrom(validLogin.setCookie));

      for (const credentials of [
        { email: organizer.email, password: "incorrect-password" },
        { email: "unknown@example.test", password: "incorrect-password" },
        {},
      ]) {
        const failedLogin = await request("/auth/login", { body: credentials });
        assert.equal(failedLogin.response.status, 401);
        assert.equal(failedLogin.data.status, "error");
      }
    },
  );

  await t.test(
    "session lookup accepts valid cookies and rejects invalid or expired tokens",
    async () => {
      const loggedIn = await request("/auth/login", {
        body: { email: organizer.email, password: "e2e-password-strong" },
      });
      const cookie = cookieFrom(loggedIn.setCookie);
      const session = await request("/auth/me", { cookie });
      assert.equal(session.response.status, 200);
      assert.equal(session.data.data.user.email, organizer.email);
      assert.equal(session.data.data.token, null);
      assert.equal("password" in session.data.data.user, false);

      const invalid = await request("/auth/me", {
        cookie: "jwt=not-a-valid-token",
      });
      assert.equal(invalid.response.status, 200);
      assert.equal(invalid.data.data.user, null);

      const expiredToken = jwt.sign(
        { id: organizer.data.data.user.id },
        secret,
        {
          expiresIn: -1,
        },
      );
      const expired = await request("/auth/me", {
        cookie: `jwt=${expiredToken}`,
      });
      assert.equal(expired.response.status, 200);
      assert.equal(expired.data.data.user, null);
    },
  );

  await t.test(
    "protected provider area enforces authentication and roles",
    async () => {
      const deniedWithoutCredentials = await request("/provider-area/");
      assert.equal(deniedWithoutCredentials.response.status, 401);

      const deniedWithInvalidToken = await request("/provider-area/", {
        bearer: "invalid-token",
      });
      assert.equal(deniedWithInvalidToken.response.status, 401);

      const expiredToken = jwt.sign(
        { id: provider.data.data.user.id },
        secret,
        { expiresIn: -1 },
      );
      const deniedWithExpiredToken = await request("/provider-area/", {
        bearer: expiredToken,
      });
      assert.equal(deniedWithExpiredToken.response.status, 401);

      const organizerCookie = cookieFrom(organizer.setCookie);
      const organizerDenied = await request("/provider-area/", {
        cookie: organizerCookie,
      });
      assert.equal(organizerDenied.response.status, 403);

      const providerCookie = cookieFrom(provider.setCookie);
      const providerAllowed = await request("/provider-area/", {
        cookie: providerCookie,
      });
      assert.equal(providerAllowed.response.status, 200);
      assert.equal(providerAllowed.data.role, "PROVIDER");

      const bearerAllowed = await request("/provider-area/", {
        bearer: provider.data.data.token,
      });
      assert.equal(bearerAllowed.response.status, 200);

      const adminLogin = await request("/auth/login", {
        body: { email: admin.email, password: "e2e-admin-password" },
      });
      const adminAllowed = await request("/provider-area/", {
        cookie: cookieFrom(adminLogin.setCookie),
      });
      assert.equal(adminAllowed.response.status, 200);
      assert.equal(adminAllowed.data.role, "ADMIN");
    },
  );

  await t.test(
    "organizer profile allows organizer and admin but forbids provider",
    async () => {
      const organizerProfile = await request("/organiser/profile", {
        cookie: cookieFrom(organizer.setCookie),
      });
      assert.equal(organizerProfile.response.status, 200);
      assert.equal(organizerProfile.data.email, organizer.email);
      assert.equal("password" in organizerProfile.data, false);

      const providerDenied = await request("/organiser/profile", {
        cookie: cookieFrom(provider.setCookie),
      });
      assert.equal(providerDenied.response.status, 403);

      const adminLogin = await request("/auth/login", {
        body: { email: admin.email, password: "e2e-admin-password" },
      });
      const adminAllowed = await request("/organiser/profile", {
        cookie: cookieFrom(adminLogin.setCookie),
      });
      assert.equal(adminAllowed.response.status, 200);
    },
  );

  await t.test(
    "remaining guarded routes reject anonymous and wrong-role requests",
    async () => {
      const organizerRoutes = [
        { method: "GET", path: "/organiser/profile" },
        { method: "PATCH", path: "/organiser/profile", body: {} },
        { method: "GET", path: "/organiser/profile/events" },
        { method: "GET", path: "/organiser/profile/events/upcoming" },
        { method: "GET", path: "/organiser/profile/events/past" },
      ];
      const providerMutationRoutes = [
        {
          method: "PATCH",
          path: "/api/providers/00000000-0000-4000-8000-000000000000",
          body: {},
        },
        {
          method: "POST",
          path: "/api/providers/00000000-0000-4000-8000-000000000000/services",
          body: {},
        },
        {
          method: "PATCH",
          path: "/api/providers/00000000-0000-4000-8000-000000000000/services/00000000-0000-4000-8000-000000000000",
          body: {},
        },
        {
          method: "DELETE",
          path: "/api/providers/00000000-0000-4000-8000-000000000000/services/00000000-0000-4000-8000-000000000000",
        },
      ];

      for (const route of [...organizerRoutes, ...providerMutationRoutes]) {
        const anonymous = await request(route.path, {
          method: route.method,
          ...(route.body === undefined ? {} : { body: route.body }),
        });
        assert.equal(
          anonymous.response.status,
          401,
          `${route.method} ${route.path}`,
        );
      }

      for (const route of organizerRoutes) {
        const providerDenied = await request(route.path, {
          method: route.method,
          cookie: cookieFrom(provider.setCookie),
          ...(route.body === undefined ? {} : { body: route.body }),
        });
        assert.equal(
          providerDenied.response.status,
          403,
          `${route.method} ${route.path}`,
        );
      }
    },
  );

  await t.test(
    "event routes reject unauthenticated requests and enforce route roles",
    async () => {
      const eventRoutes = [
        { method: "POST", path: "/api/events/", roles: ["PROVIDER", "ADMIN"] },
        { method: "GET", path: "/api/events/", roles: ["ADMIN"] },
        {
          method: "GET",
          path: "/api/events/00000000-0000-4000-8000-000000000000",
          roles: ["PROVIDER", "ADMIN"],
        },
        {
          method: "PATCH",
          path: "/api/events/00000000-0000-4000-8000-000000000000",
          roles: ["PROVIDER", "ADMIN"],
        },
        {
          method: "DELETE",
          path: "/api/events/00000000-0000-4000-8000-000000000000",
          roles: ["PROVIDER", "ADMIN"],
        },
      ];

      for (const route of eventRoutes) {
        const unauthenticated = await request(route.path, {
          method: route.method,
          ...(route.method === "POST" || route.method === "PATCH"
            ? { body: {} }
            : {}),
        });
        assert.equal(
          unauthenticated.response.status,
          401,
          `${route.method} ${route.path}`,
        );
      }

      const adminLogin = await request("/auth/login", {
        body: { email: admin.email, password: "e2e-admin-password" },
      });
      const cookiesByRole = {
        PROVIDER: cookieFrom(provider.setCookie),
        ADMIN: cookieFrom(adminLogin.setCookie),
      };

      for (const route of eventRoutes) {
        for (const role of route.roles) {
          const forbidden = await request(route.path, {
            method: route.method,
            cookie: cookiesByRole[role],
            ...(route.method === "POST" || route.method === "PATCH"
              ? { body: {} }
              : {}),
          });
          assert.equal(
            forbidden.response.status,
            403,
            `${role} should not access ${route.method} ${route.path}`,
          );
        }
      }
    },
  );

  await t.test(
    "disabled accounts cannot log in or continue using an existing token",
    async () => {
      const disabledEmail = emailFor("disabled");
      const disabled = await createDatabaseUser({
        name: "Disabled E2E",
        email: disabledEmail,
        password: "e2e-disabled-password",
        role: "PROVIDER",
      });
      const initialLogin = await request("/auth/login", {
        body: { email: disabledEmail, password: "e2e-disabled-password" },
      });
      assert.equal(initialLogin.response.status, 200);

      await Users.where({ id: disabled.id }).update({ isActive: false });

      const rejectedLogin = await request("/auth/login", {
        body: { email: disabledEmail, password: "e2e-disabled-password" },
      });
      assert.equal(rejectedLogin.response.status, 403);

      const rejectedProtectedRequest = await request("/provider-area/", {
        cookie: cookieFrom(initialLogin.setCookie),
      });
      assert.equal(rejectedProtectedRequest.response.status, 401);

      const emptySession = await request("/auth/me", {
        cookie: cookieFrom(initialLogin.setCookie),
      });
      assert.equal(emptySession.response.status, 200);
      assert.equal(emptySession.data.data.user, null);
    },
  );

  await t.test(
    "logout clears the session cookie and returns a null session",
    async () => {
      const logout = await request("/auth/logout", {
        body: {},
        cookie: cookieFrom(organizer.setCookie),
      });
      assert.equal(logout.response.status, 200);
      assert.equal(logout.data.status, "success");
      assert.equal(logout.data.data.user, null);
      assert.equal(logout.data.data.token, null);
      assert.match(logout.setCookie, /jwt=;/);
      assert.match(
        logout.setCookie,
        /expires=thu, 01 jan 1970/i,
      );
      const sessionAfterLogout = await request("/auth/me", {
        cookie: cookieFrom(logout.setCookie) ?? "jwt=",
      });
      assert.equal(sessionAfterLogout.response.status, 200);
      assert.equal(sessionAfterLogout.data.data.user, null);
    },
  );
});
