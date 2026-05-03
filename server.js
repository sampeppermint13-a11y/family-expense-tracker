const http = require("http");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const PORT = Number(process.env.PORT || 4173);
const ROOT = __dirname;
const DATA_FILE = path.join(ROOT, "family-data.json");
const sessions = new Map();

const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml"
};

function readDb() {
  if (!fs.existsSync(DATA_FILE)) return { users: [], state: {} };
  try {
    const parsed = JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
    if (Array.isArray(parsed.users) && parsed.state) return parsed;
    return { users: [], state: parsed || {} };
  } catch {
    return { users: [], state: {} };
  }
}

function writeDb(db) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(db, null, 2));
}

function readBody(request) {
  return new Promise((resolve, reject) => {
    let body = "";
    request.on("data", (chunk) => {
      body += chunk;
      if (body.length > 8_000_000) {
        reject(new Error("Payload too large"));
        request.destroy();
      }
    });
    request.on("end", () => resolve(body));
    request.on("error", reject);
  });
}

function hashPassword(password, salt = crypto.randomBytes(16).toString("hex")) {
  const hash = crypto.scryptSync(password, salt, 64).toString("hex");
  return { salt, hash };
}

function verifyPassword(password, user) {
  const { hash } = hashPassword(password, user.salt);
  return crypto.timingSafeEqual(Buffer.from(hash, "hex"), Buffer.from(user.hash, "hex"));
}

function createSession(username) {
  const token = crypto.randomBytes(32).toString("hex");
  sessions.set(token, { username, createdAt: Date.now() });
  return token;
}

function getAuthUser(request) {
  const header = request.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : "";
  return sessions.get(token)?.username || "";
}

function send(response, status, payload, type = "application/json; charset=utf-8") {
  response.writeHead(status, { "Content-Type": type, "Cache-Control": "no-store" });
  response.end(payload);
}

function sendJson(response, status, payload) {
  send(response, status, JSON.stringify(payload));
}

async function parseJson(request) {
  return JSON.parse(await readBody(request));
}

function serveFile(response, urlPath) {
  const requested = urlPath === "/" ? "/index.html" : urlPath;
  const filePath = path.normalize(path.join(ROOT, requested));
  if (!filePath.startsWith(ROOT)) {
    send(response, 403, "Forbidden", "text/plain; charset=utf-8");
    return;
  }
  fs.readFile(filePath, (error, content) => {
    if (error) {
      send(response, 404, "Not found", "text/plain; charset=utf-8");
      return;
    }
    send(response, 200, content, mimeTypes[path.extname(filePath)] || "application/octet-stream");
  });
}

function publicUser(user) {
  return { username: user.username };
}

async function handleApi(request, response, url) {
  const db = readDb();
  const authUser = getAuthUser(request);

  if (url.pathname === "/api/bootstrap" && request.method === "GET") {
    sendJson(response, 200, { hasUsers: db.users.length > 0 });
    return true;
  }

  if (url.pathname === "/api/register" && request.method === "POST") {
    try {
      const { username, password } = await parseJson(request);
      if (!username || !password || password.length < 4) {
        sendJson(response, 400, { error: "Enter a username and a password with at least 4 characters." });
        return true;
      }
      if (db.users.some((user) => user.username.toLowerCase() === String(username).toLowerCase())) {
        sendJson(response, 409, { error: "Username already exists." });
        return true;
      }
      const credentials = hashPassword(password);
      db.users.push({ username, ...credentials });
      writeDb(db);
      sendJson(response, 200, { username, token: createSession(username) });
    } catch {
      sendJson(response, 400, { error: "Invalid request." });
    }
    return true;
  }

  if (url.pathname === "/api/login" && request.method === "POST") {
    try {
      const { username, password } = await parseJson(request);
      const user = db.users.find((item) => item.username.toLowerCase() === String(username).toLowerCase());
      if (!user || !verifyPassword(password, user)) {
        sendJson(response, 401, { error: "Wrong username or password." });
        return true;
      }
      sendJson(response, 200, { username: user.username, token: createSession(user.username) });
    } catch {
      sendJson(response, 400, { error: "Invalid request." });
    }
    return true;
  }

  if (url.pathname.startsWith("/api/")) {
    if (!authUser) {
      sendJson(response, 401, { error: "Unauthorized" });
      return true;
    }

    if (url.pathname === "/api/users" && request.method === "GET") {
      sendJson(response, 200, { users: db.users.map(publicUser) });
      return true;
    }

    if (url.pathname === "/api/users" && request.method === "POST") {
      try {
        const { username, password } = await parseJson(request);
        if (!username || !password || password.length < 4) {
          sendJson(response, 400, { error: "Enter a username and a password with at least 4 characters." });
          return true;
        }
        if (db.users.some((user) => user.username.toLowerCase() === String(username).toLowerCase())) {
          sendJson(response, 409, { error: "Username already exists." });
          return true;
        }
        db.users.push({ username, ...hashPassword(password) });
        writeDb(db);
        sendJson(response, 200, { ok: true });
      } catch {
        sendJson(response, 400, { error: "Invalid request." });
      }
      return true;
    }

    if (url.pathname === "/api/state" && request.method === "GET") {
      sendJson(response, 200, db.state || {});
      return true;
    }

    if (url.pathname === "/api/state" && request.method === "PUT") {
      try {
        db.state = await parseJson(request);
        writeDb(db);
        sendJson(response, 200, { ok: true });
      } catch {
        sendJson(response, 400, { error: "Invalid JSON" });
      }
      return true;
    }

    sendJson(response, 404, { error: "Not found" });
    return true;
  }

  return false;
}

const server = http.createServer(async (request, response) => {
  const url = new URL(request.url, `http://${request.headers.host}`);

  if (await handleApi(request, response, url)) return;

  if (request.method !== "GET" && request.method !== "HEAD") {
    send(response, 405, "Method not allowed", "text/plain; charset=utf-8");
    return;
  }

  serveFile(response, decodeURIComponent(url.pathname));
});

server.listen(PORT, "0.0.0.0", () => {
  console.log(`Family tracker running at http://localhost:${PORT}`);
  console.log("Users can create their own username and password from the login screen.");
});
