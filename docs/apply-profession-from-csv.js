#!/usr/bin/env node
/**
 * 👤 Aplicar profesión de clientes desde CSV (Firestore)
 *
 * Lee `docs/clientes activos clasificados.csv` y actualiza `clientes.profession`
 * usando la columna "Actividad".
 *
 * Matching:
 * - Primero por email (case-insensitive)
 * - Fallback por (nombre + empresa) normalizados, si no hay email
 *
 * Uso:
 *   node docs/apply-profession-from-csv.js --dry-run
 *   node docs/apply-profession-from-csv.js
 */

const fs = require("fs");
const path = require("path");

const { parse } = require("csv-parse/sync");

const { initializeApp } = require("firebase/app");
const { getAuth, signInWithEmailAndPassword } = require("firebase/auth");
const {
  getFirestore,
  collection,
  getDocs,
  doc,
  updateDoc,
} = require("firebase/firestore");

const DRY_RUN = process.argv.includes("--dry-run");

const firebaseConfig = {
  apiKey: "AIzaSyBvxsbp8Lo8bGWK5sbEDC3RN-01Gfj0jFY",
  authDomain: "expertiacrm-7e7eb.firebaseapp.com",
  databaseURL:
    "https://expertiacrm-7e7eb-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "expertiacrm-7e7eb",
  storageBucket: "expertiacrm-7e7eb.firebasestorage.app",
  messagingSenderId: "730578427970",
  appId: "1:730578427970:web:d9a14fc298b786ba53cddb",
};

function normalizeKey(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ")
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "");
}

function normEmail(value) {
  const s = String(value || "").trim().toLowerCase();
  return s.includes("@") ? s : "";
}

const allowedProfessions = [
  "Fisioterapeuta",
  "Ginecólogo",
  "Traumatólogo",
  "Médico Estético",
  "Urógolo",
  "Otro",
];
const allowedSet = new Set(allowedProfessions);

function mapActividadToProfession(actividadRaw) {
  const a = normalizeKey(actividadRaw);
  if (!a) return null;

  // Normalizaciones frecuentes del fichero
  // - "Fisio", "fisio", "fisioterapia", "fisioterapeuta"
  if (
    a.includes("fisio") ||
    a.includes("fisioter") ||
    a.includes("rehab") ||
    a.includes("fisioterapia")
  ) {
    // Si mezcla con otra actividad, priorizamos la que podamos detectar abajo.
    // (seguimos evaluando)
  }

  const tokens = new Set(
    a
      .split(/[\/,;|\-]+/g)
      .map((x) => normalizeKey(x))
      .filter(Boolean),
  );

  const hasFisio =
    a.includes("fisio") ||
    a.includes("fisioter") ||
    tokens.has("fisio") ||
    tokens.has("fisioterapeuta");
  const hasGine =
    a.includes("gine") || tokens.has("gine") || tokens.has("ginecologo");
  const hasTrauma =
    a.includes("trauma") ||
    tokens.has("traumatologo") ||
    a.includes("traumatologo");
  const hasEstetica =
    a.includes("estetic") || tokens.has("estetica") || tokens.has("medico estetico");
  const hasUro = a.includes("uro") || tokens.has("urologo") || tokens.has("urogolo");

  // Reglas de prioridad: si hay especialidad médica explícita, gana sobre "Fisio"
  if (hasTrauma) return "Traumatólogo";
  if (hasGine) return "Ginecólogo";
  if (hasUro) return "Urógolo";
  if (hasEstetica) return "Médico Estético";
  if (hasFisio) return "Fisioterapeuta";

  // "cliente"/otros → Otro
  return "Otro";
}

function readQaCreds() {
  const credsPath = path.join(__dirname, "..", ".local", "test-users.json");
  if (!fs.existsSync(credsPath)) throw new Error(`No existe ${credsPath}`);
  const raw = JSON.parse(fs.readFileSync(credsPath, "utf8"));
  const qa = (raw.users || []).find((u) => u.role === "admin") || raw.users?.[0];
  if (!qa?.email || !qa?.password) {
    throw new Error("No se encontraron credenciales válidas en test-users.json");
  }
  return { email: qa.email, password: qa.password };
}

function readCsvRows() {
  const csvPath = path.join(__dirname, "clientes activos clasificados.csv");
  if (!fs.existsSync(csvPath)) throw new Error(`No existe ${csvPath}`);
  const csv = fs.readFileSync(csvPath, "utf8");
  return parse(csv, {
    columns: true,
    skip_empty_lines: true,
    relax_quotes: true,
    relax_column_count: true,
    trim: true,
  });
}

async function main() {
  console.log("👤 Aplicando profesión de clientes desde CSV…");
  console.log(`- Modo: ${DRY_RUN ? "DRY-RUN (sin escribir)" : "ESCRITURA"}`);

  const { email, password } = readQaCreds();
  const rows = readCsvRows();
  console.log(`- Filas CSV: ${rows.length}`);

  // Deseados por email / por (nombre+empresa)
  const desiredByEmail = new Map();
  const desiredByNameCompany = new Map();
  let unmappedActividad = 0;

  for (const r of rows) {
    const actividad = r["Actividad"];
    const desired = mapActividadToProfession(actividad);
    if (!desired || !allowedSet.has(desired)) {
      unmappedActividad += 1;
      continue;
    }
    const emailKey = normEmail(r["Email"]);
    if (emailKey) desiredByEmail.set(emailKey, desired);

    const nameKey = normalizeKey(r["Nombre"]);
    const companyKey = normalizeKey(r["Empresa"]);
    if (nameKey || companyKey) {
      desiredByNameCompany.set(`${nameKey}::${companyKey}`, desired);
    }
  }

  console.log(
    `- Mapeos: email=${desiredByEmail.size}, nombre+empresa=${desiredByNameCompany.size}, actividadSinMap=${unmappedActividad}`,
  );

  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  await signInWithEmailAndPassword(auth, email, password);
  const db = getFirestore(app);

  const snap = await getDocs(collection(db, "clientes"));
  console.log(`- Clientes Firestore: ${snap.size}`);

  let updated = 0;
  let unchanged = 0;
  let missingInCsv = 0;
  let errors = 0;

  for (const d of snap.docs) {
    const data = d.data() || {};
    const emailKey = normEmail(data.email);
    const nameCompanyKey = `${normalizeKey(data.name)}::${normalizeKey(
      data.company,
    )}`;

    const desired =
      (emailKey && desiredByEmail.get(emailKey)) ||
      desiredByNameCompany.get(nameCompanyKey);

    if (!desired) {
      missingInCsv += 1;
      continue;
    }

    const current = String(data.profession || "").trim() || "Otro";
    if (current === desired) {
      unchanged += 1;
      continue;
    }

    if (!DRY_RUN) {
      try {
        await updateDoc(doc(db, "clientes", d.id), { profession: desired });
      } catch (e) {
        errors += 1;
        continue;
      }
    }

    updated += 1;
    if (!DRY_RUN && updated % 25 === 0) {
      console.log(`- Progreso: ${updated} actualizados`);
    }
  }

  console.log("✅ Resultado:");
  console.log({ updated, unchanged, missingInCsv, errors });
  if (DRY_RUN) console.log("ℹ️ Ejecuta sin --dry-run para aplicar cambios.");

  setTimeout(() => process.exit(errors ? 1 : 0), 250).unref();
}

main().catch((e) => {
  console.error("❌ Error:", e?.message || e);
  process.exitCode = 1;
});

