#!/usr/bin/env node
/**
 * Mock local de la API de CPM.
 *
 * No tiene dependencias: alcanza con `npm run mock` (Node 18+).
 * Implementa el contrato mínimo para probar el flujo de autenticación:
 * registro, verificación de email, login, logout, recuperación y cambio
 * de contraseña.
 *
 * Los emails no se envían: los links de verificación y reseteo se imprimen
 * en la consola y se pueden consultar en `GET /__mock/state`.
 */
"use strict";

const http = require("http");
const { randomUUID } = require("crypto");

const PORT = Number(process.env.MOCK_API_PORT) || 4000;
const APP_URL = process.env.MOCK_APP_URL || "http://localhost:3000";
const PREFIX = "/api";

const now = () => new Date().toISOString();

const users = new Map();
const sessions = new Map();
const verificationTokens = new Map();
const resetTokens = new Map();

const lastEmails = {
  verification: null,
  reset: null,
};

let nextUserId = 1;

const createToken = (prefix) => `${prefix}_${randomUUID()}`;

const buildUser = ({ email, password, firstname, lastname, active = false }) => {
  const id = String(nextUserId++);
  const fullName = [firstname, lastname].filter(Boolean).join(" ");

  return {
    id,
    email,
    password,
    name: firstname || email.split("@")[0],
    full_name: fullName || firstname || email.split("@")[0],
    firstname: firstname || "",
    lastname: lastname || "",
    username: email.split("@")[0],
    active,
    terms: active ? now() : "",
    documents: [],
    accounts: [],
    createdAt: now(),
    updatedAt: now(),
    address: "",
    zip_code: "",
    country: "",
    legalId: "",
    phoneNumber: "",
    sex: "",
    subject_politically: false,
    subject_uif: false,
    profile_complete: false,
    avatar: "",
    birthday: "",
    balance: { available: 0, invested: 0, locked: 0 },
  };
};

const publicUser = (user) => {
  const { password, ...rest } = user;
  return rest;
};

const seedDemoUser = () => {
  const demo = buildUser({
    email: "demo@cpm.la",
    password: "Password1!",
    firstname: "Demo",
    lastname: "User",
    active: true,
  });

  demo.profile_complete = true;
  demo.country = "AR";
  demo.balance = { available: 1000, invested: 500, locked: 0 };
  users.set(demo.email, demo);
};

seedDemoUser();

const send = (res, status, body) => {
  const payload = body === undefined ? "" : JSON.stringify(body);

  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Content-Length": Buffer.byteLength(payload),
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type, cpm_user_app_token",
    "Access-Control-Allow-Methods": "GET,POST,PUT,PATCH,DELETE,OPTIONS",
  });

  res.end(payload);
};

const readBody = (req) =>
  new Promise((resolve, reject) => {
    let raw = "";

    req.on("data", (chunk) => {
      raw += chunk;
      if (raw.length > 1_000_000) {
        reject(new Error("Body demasiado grande"));
      }
    });

    req.on("end", () => {
      if (!raw) {
        resolve({});
        return;
      }

      try {
        resolve(JSON.parse(raw));
      } catch (error) {
        reject(new Error("JSON inválido"));
      }
    });

    req.on("error", reject);
  });

const getSessionUser = (req) => {
  const token = req.headers["cpm_user_app_token"];
  if (!token || typeof token !== "string") {
    return null;
  }

  const email = sessions.get(token);
  return email ? users.get(email) || null : null;
};

const issueSession = (email) => {
  const token = createToken("mock");
  sessions.set(token, email);
  return token;
};

const issueVerification = (user) => {
  const token = createToken("verify");
  verificationTokens.set(token, user.email);

  const url = `${APP_URL}/verify-email?token=${encodeURIComponent(token)}`;
  lastEmails.verification = { email: user.email, token, url };

  console.log(`[mock] Verificación de ${user.email}: ${url}`);
  return { token, url };
};

const issuePasswordReset = (user) => {
  const token = createToken("reset");
  resetTokens.set(token, user.email);

  const url = `${APP_URL}/reset-password?token=${encodeURIComponent(token)}`;
  lastEmails.reset = { email: user.email, token, url };

  console.log(`[mock] Reseteo de ${user.email}: ${url}`);
  return { token, url };
};

const PUBLIC_USER_FIELDS = [
  "id",
  "email",
  "name",
  "full_name",
  "firstname",
  "lastname",
  "username",
  "active",
];

const handleRequest = async (req, res) => {
  const url = new URL(req.url, "http://localhost");
  const path = url.pathname.startsWith(PREFIX)
    ? url.pathname.slice(PREFIX.length) || "/"
    : url.pathname;
  const method = req.method || "GET";

  if (method === "OPTIONS") {
    send(res, 204);
    return;
  }

  let body = {};
  if (method === "POST" || method === "PUT" || method === "PATCH") {
    try {
      body = await readBody(req);
    } catch (error) {
      send(res, 400, { error: error.message });
      return;
    }
  }

  console.log(
    `[mock] ${method} ${url.pathname}${url.search ? url.search : ""}`
  );

  // --- Endpoints de desarrollo (no existen en la API real) --------------

  if (path === "/__health" && method === "GET") {
    send(res, 200, { ok: true, users: users.size, sessions: sessions.size });
    return;
  }

  if (path === "/__mock/state" && method === "GET") {
    send(res, 200, {
      users: Array.from(users.values()).map((user) => ({
        ...Object.fromEntries(
          PUBLIC_USER_FIELDS.map((field) => [field, user[field]])
        ),
        hasPassword: Boolean(user.password),
      })),
      lastEmails,
    });
    return;
  }

  if (path === "/__mock/reset" && method === "POST") {
    users.clear();
    sessions.clear();
    verificationTokens.clear();
    resetTokens.clear();
    nextUserId = 1;
    lastEmails.verification = null;
    lastEmails.reset = null;
    seedDemoUser();
    send(res, 200, { ok: true });
    return;
  }

  // --- Auth -------------------------------------------------------------

  if (path === "/auth/register" && method === "POST") {
    const email =
      typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const password = typeof body.password === "string" ? body.password : "";
    const firstname =
      typeof body.firstname === "string" ? body.firstname.trim() : "";
    const lastname =
      typeof body.lastname === "string" ? body.lastname.trim() : "";

    if (!email || !password) {
      send(res, 400, { error: "Email y contraseña son requeridos" });
      return;
    }

    if (users.has(email)) {
      send(res, 409, { error: "Ya existe una cuenta con ese email" });
      return;
    }

    const user = buildUser({ email, password, firstname, lastname });
    users.set(email, user);

    const verification = issueVerification(user);

    send(res, 201, {
      ...publicUser(user),
      // Solo el mock devuelve el token; la API real lo envía por email.
      mock_verification_token: verification.token,
    });
    return;
  }

  if (path === "/auth/login" && method === "POST") {
    const email =
      typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const password = typeof body.password === "string" ? body.password : "";
    const user = users.get(email);

    if (!user || user.password !== password) {
      send(res, 401, { error: "Usuario o contraseña incorrectos" });
      return;
    }

    const token = issueSession(user.email);
    send(res, 200, { token, user: publicUser(user) });
    return;
  }

  if (path === "/auth/reset-password" && method === "POST") {
    const email =
      typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const user = users.get(email);

    if (user) {
      issuePasswordReset(user);
    }

    // Misma respuesta exista o no la cuenta (evita enumeración de usuarios).
    send(res, 200, {
      message:
        "Si el email está registrado, vas a recibir un correo para reiniciar tu contraseña",
    });
    return;
  }

  // --- Usuarios ---------------------------------------------------------

  if (path === "/users" && method === "GET") {
    const user = getSessionUser(req);

    if (!user) {
      send(res, 401, { error: "No autorizado" });
      return;
    }

    send(res, 200, publicUser(user));
    return;
  }

  if (path === "/users" && (method === "PATCH" || method === "PUT")) {
    const user = getSessionUser(req);

    if (!user) {
      send(res, 401, { error: "No autorizado" });
      return;
    }

    const editableFields = ["username", "address", "zip_code"];

    editableFields.forEach((field) => {
      if (typeof body[field] === "string") {
        user[field] = body[field].trim();
      }
    });

    if (typeof body.email === "string") {
      const nextEmail = body.email.trim().toLowerCase();

      if (nextEmail && nextEmail !== user.email) {
        if (users.has(nextEmail)) {
          send(res, 409, { error: "Ya existe una cuenta con ese email" });
          return;
        }

        const previousEmail = user.email;
        users.delete(previousEmail);
        user.email = nextEmail;
        users.set(nextEmail, user);

        sessions.forEach((sessionEmail, token) => {
          if (sessionEmail === previousEmail) {
            sessions.set(token, nextEmail);
          }
        });
      }
    }

    user.updatedAt = now();

    send(res, 200, publicUser(user));
    return;
  }

  if (path === "/users/verify-email" && method === "POST") {
    const token =
      (typeof url.searchParams.get("token") === "string" &&
        url.searchParams.get("token")) ||
      (typeof body.token === "string" ? body.token : "");

    const email = verificationTokens.get(token);

    if (!email) {
      send(res, 400, {
        active: false,
        message: "Token de verificación inválido o expirado",
        error: "Token de verificación inválido o expirado",
      });
      return;
    }

    const user = users.get(email);
    verificationTokens.delete(token);

    if (!user) {
      send(res, 400, {
        active: false,
        message: "El usuario ya no existe",
        error: "El usuario ya no existe",
      });
      return;
    }

    user.active = true;
    user.terms = user.terms || now();
    user.updatedAt = now();

    send(res, 200, {
      active: true,
      message: "Email verificado correctamente",
    });
    return;
  }

  if (path === "/users/resend-verification" && method === "POST") {
    const user = getSessionUser(req);

    if (!user) {
      send(res, 401, { error: "No autorizado" });
      return;
    }

    if (user.active) {
      send(res, 400, { error: "El email ya está verificado" });
      return;
    }

    const verification = issueVerification(user);

    send(res, 200, {
      message: "Email de verificación reenviado",
      mock_verification_token: verification.token,
    });
    return;
  }

  if (path === "/users/reset-password" && method === "POST") {
    const token =
      typeof url.searchParams.get("token") === "string"
        ? url.searchParams.get("token")
        : "";
    const newPassword =
      typeof body.password === "string" ? body.password : "";

    if (!newPassword) {
      send(res, 400, { error: "La nueva contraseña es requerida" });
      return;
    }

    let user = null;

    if (token) {
      const email = resetTokens.get(token);
      user = email ? users.get(email) : null;

      if (!user) {
        send(res, 400, { error: "Token de reseteo inválido o expirado" });
        return;
      }

      resetTokens.delete(token);
    } else {
      user = getSessionUser(req);

      if (!user) {
        send(res, 401, { error: "No autorizado" });
        return;
      }

      if (body.password_old !== user.password) {
        send(res, 400, { error: "La contraseña actual es incorrecta" });
        return;
      }
    }

    user.password = newPassword;
    user.updatedAt = now();

    // Invalida las sesiones abiertas del usuario.
    for (const [sessionToken, email] of sessions.entries()) {
      if (email === user.email) {
        sessions.delete(sessionToken);
      }
    }

    send(res, 200, { message: "Contraseña actualizada correctamente" });
    return;
  }

  // --- Datos que consume el dashboard (respuestas vacías) ---------------

  if (path === "/orders" && method === "GET") {
    send(res, 200, {
      data: [
        {
          id: "1",
          amount: 500,
          type: "inversion",
          status: "approved",
          fund: { id: "1", name: "Fondo CPM" },
          createdAt: "2026-11-02T14:30:00.000Z",
          updatedAt: "2026-11-02T14:30:00.000Z",
        },
        {
          id: "2",
          amount: 250,
          type: "buy",
          status: "approved",
          fund: { id: "2", name: "Fondo Bitcoin" },
          createdAt: "2026-11-10T09:15:00.000Z",
          updatedAt: "2026-11-10T09:15:00.000Z",
        },
        {
          id: "3",
          amount: 120,
          type: "withdrawal",
          status: "pending",
          fund: null,
          createdAt: "2026-11-18T18:45:00.000Z",
          updatedAt: "2026-11-18T18:45:00.000Z",
        },
      ],
      page: 1,
      per_page: 5,
      total: 3,
    });
    return;
  }

  if (path === "/funds" && method === "GET") {
    const composition = [
      ["Bitcoin", "BTC", 39.97],
      ["Ethereum", "ETH", 36.08],
      ["Cosmos", "ATOM", 3.36],
      ["BUSD", "BUSD", 1.72],
      ["Chainlink", "LINK", 1.32],
      ["Polkadot", "DOT", 5.68],
      ["Thorchain", "RUNE", 1.62],
      ["Avalanche", "AVAX", 3.01],
      ["Solana", "SOL", 4.37],
      ["Binance", "BNB", 2.88],
    ];

    send(res, 200, [
      {
        _id: "651d1716982a77b57c58af97",
        name: "Foundation",
        tickets: composition.map(([name, symbol, percent], index) => ({
          _id: `ticket-${index + 1}`,
          name,
          symbol,
          percent,
          marketcap: 1000000 * (index + 1),
          img: `/static/crypto-imgs/crypto-${index + 1}.svg`,
        })),
      },
    ]);
    return;
  }

  // Serie diaria para los gráficos de performance.
  if (path.startsWith("/funds/") && path.endsWith("/perform") && method === "GET") {
    const from = Number(url.searchParams.get("from"));
    const until = Number(url.searchParams.get("until"));
    const requestedDays =
      from && until && until > from
        ? Math.ceil((until - from) / 86400000) + 1
        : 10;
    const days = Math.min(Math.max(requestedDays, 2), 730);
    const today = new Date();

    const data = Array.from({ length: days }).map((_, index) => {
      const date = new Date(today);
      date.setDate(today.getDate() - (days - 1 - index));
      const perform = Number((12 + Math.sin(index / 1.7) * 3 + index * 0.4).toFixed(2));
      const time = date.getTime();

      return {
        label: date.toISOString(),
        perform,
        time,
        token: "USDT",
        performance: {
          date: date.toISOString(),
          percent: perform,
          perform,
          price: Number((1000 + index * 17.5).toFixed(2)),
          time,
          type: "daily",
        },
      };
    });

    send(res, 200, data);
    return;
  }

  if (path === "/contactForm" && method === "POST") {
    console.log(`[mock] Mensaje de contacto de ${body.email || "anónimo"}`);
    send(res, 201, { message: "Mensaje recibido" });
    return;
  }

  if (path === "/users/access-log" && method === "GET") {
    send(res, 200, {
      data: [
        {
          id: 1,
          createdAt: "2026-11-21T09:02:00.000Z",
          ip: "127.0.0.1",
          device: "Chrome en Windows (mock)",
        },
      ],
      page: 1,
      per_page: 100,
      total: 1,
    });
    return;
  }

  send(res, 404, { error: `Not found: ${method} ${path}` });
};

const server = http.createServer((req, res) => {
  handleRequest(req, res).catch((error) => {
    console.error("[mock] Error no controlado:", error);
    send(res, 500, { error: "Error interno del mock" });
  });
});

server.listen(PORT, () => {
  console.log(`[mock] API escuchando en http://localhost:${PORT}${PREFIX}`);
  console.log("[mock] Usuario demo: demo@cpm.la / Password1!");
  console.log(`[mock] App asumida en ${APP_URL} (MOCK_APP_URL)`);
});
