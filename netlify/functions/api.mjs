import { connectLambda, getStore } from "@netlify/blobs";
import crypto from "crypto";

const TOKEN_SECRET =
  process.env.AUTH_SECRET ||
  process.env.NETLIFY_SITE_ID ||
  "dev-family-tracker-secret";

function getBlobStore() {
  const siteID = process.env.NETLIFY_SITE_ID || process.env.SITE_ID || "";
  const token =
    process.env.NETLIFY_AUTH_TOKEN || process.env.NETLIFY_API_TOKEN || "";

  if (siteID && token) {
    return getStore({
      name: "family-tracker",
      siteID,
      token,
    });
  }

  return getStore("family-tracker");
}

function envSummary() {
  return {
    hasNetlifySiteId: Boolean(process.env.NETLIFY_SITE_ID),
    hasSiteId: Boolean(process.env.SITE_ID),
    hasNetlifyAuthToken: Boolean(process.env.NETLIFY_AUTH_TOKEN),
    hasNetlifyApiToken: Boolean(process.env.NETLIFY_API_TOKEN),
    hasAuthSecret: Boolean(process.env.AUTH_SECRET),
  };
}

function json(statusCode, body) {
  return {
    statusCode,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store",
    },
    body: JSON.stringify(body),
  };
}

async function readDb() {
  const store = getBlobStore();
  const stored = await store.get("db", { type: "json" });

  if (!stored) return { users: [], state: {} };
  if (Array.isArray(stored.users) && stored.state) return stored;

  return { users: [], state: stored || {} };
}

async function writeDb(db) {
  const store = getBlobStore();
  await store.setJSON("db", db);
}

function hashPassword(password, salt = crypto.randomBytes(16).toString("hex")) {
  const hash = crypto.scryptSync(password, salt, 64).toString("hex");
  return { salt, hash };
}

function verifyPassword(password, user) {
  const { hash } = hashPassword(password, user.salt);

  return crypto.timingSafeEqual(
    Buffer.from(hash, "hex"),
    Buffer.from(user.hash, "hex")
  );
}

function sign(value) {
  return crypto.createHmac("sha256", TOKEN_SECRET).update(value).digest("base64url");
}

function createToken(username) {
  const payload = Buffer.from(
    JSON.stringify({ username, createdAt: Date.now() })
  ).toString("base64url");

  return `${payload}.${sign(payload)}`;
}

function getAuthUser(event) {
  const header = event.headers.authorization || event.headers.Authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : "";
  const [payload, signature] = token.split(".");

  if (!payload || !signature || sign(payload) !== signature) return "";

  try {
    return (
      JSON.parse(Buffer.from(payload, "base64url").toString("utf8")).username || ""
    );
  } catch {
    return "";
  }
}

function publicUser(user) {
  return { username: user.username };
}

function getPath(event) {
  const url = new URL(event.rawUrl || `https://example.com${event.path}`);
  const route = url.searchParams.get("route");

  if (route) return route.startsWith("/") ? route : `/${route}`;

  return (
    url.pathname
      .replace(/^\/api\/?/, "/")
      .replace(/^\/\.netlify\/functions\/api\/?/, "/")
      .replace(/\/$/, "") || "/"
  );
}

export async function handler(event) {
  connectLambda(event);

  const path = getPath(event);
  const method = event.httpMethod;

  if (path === "/env-check" && method === "GET") {
    return json(200, envSummary());
  }

  let db;

  try {
    db = await readDb();
  } catch (error) {
    return json(500, {
      error:
        "Netlify Blobs is not configured. Check NETLIFY_SITE_ID and NETLIFY_AUTH_TOKEN environment variables in Netlify, then redeploy.",
      detail: error.message,
      env: envSummary(),
    });
  }

  const authUser = getAuthUser(event);

  if (path === "/bootstrap" && method === "GET") {
    return json(200, { hasUsers: db.users.length > 0 });
  }

  if (path === "/register" && method === "POST") {
    try {
      const { username, password } = JSON.parse(event.body || "{}");

      if (!username || !password || password.length < 4) {
        return json(400, {
          error: "Enter a username and a password with at least 4 characters.",
        });
      }

      if (
        db.users.some(
          (user) => user.username.toLowerCase() === String(username).toLowerCase()
        )
      ) {
        return json(409, { error: "Username already exists." });
      }

      db.users.push({ username, ...hashPassword(password) });
      await writeDb(db);

      return json(200, { username, token: createToken(username) });
    } catch {
      return json(400, { error: "Invalid request." });
    }
  }

  if (path === "/login" && method === "POST") {
    try {
      const { username, password } = JSON.parse(event.body || "{}");

      const user = db.users.find(
        (item) => item.username.toLowerCase() === String(username).toLowerCase()
      );

      if (!user || !verifyPassword(password, user)) {
        return json(401, { error: "Wrong username or password." });
      }

      return json(200, {
        username: user.username,
        token: createToken(user.username),
      });
    } catch {
      return json(400, { error: "Invalid request." });
    }
  }

  if (!authUser) {
    return json(401, { error: "Unauthorized" });
  }

  if (path === "/users" && method === "GET") {
    return json(200, { users: db.users.map(publicUser) });
  }

  if (path === "/users" && method === "POST") {
    try {
      const { username, password } = JSON.parse(event.body || "{}");

      if (!username || !password || password.length < 4) {
        return json(400, {
          error: "Enter a username and a password with at least 4 characters.",
        });
      }

      if (
        db.users.some(
          (user) => user.username.toLowerCase() === String(username).toLowerCase()
        )
      ) {
        return json(409, { error: "Username already exists." });
      }

      db.users.push({ username, ...hashPassword(password) });
      await writeDb(db);

      return json(200, { ok: true });
    } catch {
      return json(400, { error: "Invalid request." });
    }
  }

  if (path === "/state" && method === "GET") {
    return json(200, db.state || {});
  }

  if (path === "/state" && method === "PUT") {
    try {
      db.state = JSON.parse(event.body || "{}");
      await writeDb(db);

      return json(200, { ok: true });
    } catch {
      return json(400, { error: "Invalid JSON" });
    }
  }

  return json(404, { error: "Not found" });
}
