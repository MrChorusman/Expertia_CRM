#!/usr/bin/env node
/**
 * Consulta support_logs en Firestore (requiere credenciales de admin).
 *
 * Uso:
 *   export GOOGLE_APPLICATION_CREDENTIALS=/ruta/serviceAccountKey.json
 *   node archive/tools/query-support-logs.mjs --name "Marta Rebaque"
 *   node archive/tools/query-support-logs.mjs --user-index 5
 *   node archive/tools/query-support-logs.mjs --uid <firebase-uid>
 */

import { readFileSync, existsSync } from "node:fs";
import { initializeApp, cert, applicationDefault } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

const PROJECT_ID = "expertiacrm-7e7eb";

function parseArgs(argv) {
  const args = { name: null, uid: null, userIndex: null, limit: 50 };
  for (let i = 2; i < argv.length; i += 1) {
    const key = argv[i];
    const value = argv[i + 1];
    if (key === "--name" && value) {
      args.name = value;
      i += 1;
    } else if (key === "--uid" && value) {
      args.uid = value;
      i += 1;
    } else if (key === "--user-index" && value) {
      args.userIndex = Number(value);
      i += 1;
    } else if (key === "--limit" && value) {
      args.limit = Number(value);
      i += 1;
    }
  }
  return args;
}

function initAdmin() {
  const localKey = new URL("./serviceAccountKey.json", import.meta.url);
  if (existsSync(localKey)) {
    const serviceAccount = JSON.parse(readFileSync(localKey, "utf8"));
    initializeApp({
      credential: cert(serviceAccount),
      projectId: PROJECT_ID,
    });
    return;
  }
  initializeApp({
    credential: applicationDefault(),
    projectId: PROJECT_ID,
  });
}

function formatTs(value) {
  if (!value) return "—";
  if (typeof value.toDate === "function") {
    return value.toDate().toISOString();
  }
  return String(value);
}

async function resolveUserId(db, { name, uid, userIndex }) {
  if (uid) return { id: uid, profile: null };

  const usersSnap = await db.collection("users").get();
  const users = usersSnap.docs
    .map((doc) => ({ id: doc.id, ...doc.data() }))
    .sort((a, b) => {
      const aTs = a.createdAt || "";
      const bTs = b.createdAt || "";
      return String(aTs).localeCompare(String(bTs));
    });

  if (userIndex != null && Number.isFinite(userIndex)) {
    const match = users[userIndex - 1];
    if (!match) {
      throw new Error(`No hay usuario en la posición #${userIndex} (total: ${users.length})`);
    }
    return { id: match.id, profile: match };
  }

  if (name) {
    const normalized = name.trim().toLowerCase();
    const match = users.find(
      (user) => String(user.name || "").trim().toLowerCase() === normalized,
    );
    if (!match) {
      const partial = users.filter((user) =>
        String(user.name || "").toLowerCase().includes(normalized),
      );
      if (partial.length === 1) {
        return { id: partial[0].id, profile: partial[0] };
      }
      throw new Error(
        `No se encontró usuario con nombre "${name}". Coincidencias parciales: ${partial.map((u) => u.name).join(", ") || "ninguna"}`,
      );
    }
    return { id: match.id, profile: match };
  }

  throw new Error("Indica --name, --uid o --user-index");
}

async function main() {
  const args = parseArgs(process.argv);
  initAdmin();
  const db = getFirestore();

  const { id: userId, profile } = await resolveUserId(db, args);
  console.log("Usuario resuelto:");
  console.log(`  uid: ${userId}`);
  if (profile) {
    console.log(`  nombre: ${profile.name || "—"}`);
    console.log(`  email: ${profile.email || "—"}`);
    console.log(`  rol: ${profile.role || "—"}`);
  }

  const logsSnap = await db
    .collection("support_logs")
    .where("userId", "==", userId)
    .limit(args.limit)
    .get();

  const logs = logsSnap.docs
    .map((doc) => ({ id: doc.id, ...doc.data() }))
    .sort((a, b) => String(b.createdAt || "").localeCompare(String(a.createdAt || "")));

  console.log(`\nEventos support_logs (${logs.length}):`);
  for (const log of logs) {
    console.log("---");
    console.log(`  id: ${log.id}`);
    console.log(`  createdAt: ${formatTs(log.createdAt)}`);
    console.log(`  level: ${log.level || "—"}`);
    console.log(`  event: ${log.event || "—"}`);
    if (log.context) console.log(`  context: ${JSON.stringify(log.context)}`);
    if (log.error?.message) console.log(`  error: ${log.error.message}`);
  }

  const relevant = logs.filter((log) =>
    /proforma|stock|invoice_payment|stock_apply/i.test(String(log.event || "")),
  );
  if (relevant.length > 0) {
    console.log(`\nEventos relevantes (${relevant.length}):`);
    for (const log of relevant) {
      console.log(
        `  [${formatTs(log.createdAt)}] ${log.level} ${log.event}${log.error?.message ? ` — ${log.error.message}` : ""}`,
      );
    }
  }
}

main().catch((error) => {
  console.error("Error:", error.message || error);
  process.exit(1);
});
