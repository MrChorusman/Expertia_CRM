#!/usr/bin/env node
/**
 * 🧾 Aplicar IVA por producto desde Excel (Firestore)
 *
 * Lee `docs/inventario_productos_2026-04-26 IVA.xlsx` y actualiza `productos.vatRate`
 * buscando coincidencias por nombre (columna "Producto") y, si existe, por SKU.
 *
 * Requisitos:
 * - `npm install` (incluye `xlsx`)
 * - Credenciales locales en `.local/test-users.json` (ignorado por git)
 *
 * Uso:
 *   node docs/apply-vat-from-excel.js --dry-run
 *   node docs/apply-vat-from-excel.js
 */

const fs = require("fs");
const path = require("path");
const XLSX = require("xlsx");

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

function toVatRateFromPercent(value) {
  if (value === null || value === undefined || value === "") return null;
  const n = Number(String(value).replace(",", "."));
  if (!Number.isFinite(n)) return null;
  // Soporta 21 o 0.21
  const rate = n > 1 ? n / 100 : n;
  // Redondeo a 2 decimales para evitar 0.1000000003
  return Math.round(rate * 100) / 100;
}

function isAllowedVatRate(rate) {
  return [0, 0.04, 0.05, 0.1, 0.21].includes(rate);
}

function readQaCreds() {
  const credsPath = path.join(
    __dirname,
    "..",
    ".local",
    "test-users.json",
  );
  if (!fs.existsSync(credsPath)) {
    throw new Error(`No existe ${credsPath}`);
  }
  const raw = JSON.parse(fs.readFileSync(credsPath, "utf8"));
  const qa = (raw.users || []).find((u) => u.role === "admin") || raw.users?.[0];
  if (!qa?.email || !qa?.password) {
    throw new Error("No se encontraron credenciales válidas en test-users.json");
  }
  return { email: qa.email, password: qa.password };
}

function readExcelRows() {
  const excelPath = path.join(
    __dirname,
    "inventario_productos_2026-04-26 IVA.xlsx",
  );
  const wb = XLSX.readFile(excelPath);
  const sheet = wb.Sheets[wb.SheetNames[0]];
  return XLSX.utils.sheet_to_json(sheet, { defval: null });
}

async function main() {
  console.log("🧾 Aplicando IVA por producto desde Excel…");
  console.log(`- Modo: ${DRY_RUN ? "DRY-RUN (sin escribir)" : "ESCRITURA"}`);

  const { email, password } = readQaCreds();
  const rows = readExcelRows();
  console.log(`- Filas Excel: ${rows.length}`);

  const desiredByName = new Map();
  const desiredBySku = new Map();

  rows.forEach((r) => {
    const productName = r["Producto"];
    const sku = r["SKU"];
    const vatPercent = r["IVA %"];
    const vatRate = toVatRateFromPercent(vatPercent);
    if (!productName) return;
    if (vatRate === null) return;
    if (!isAllowedVatRate(vatRate)) return;

    desiredByName.set(normalizeKey(productName), vatRate);
    if (sku) desiredBySku.set(normalizeKey(sku), vatRate);
  });

  console.log(
    `- Mapeos con IVA definido: name=${desiredByName.size}, sku=${desiredBySku.size}`,
  );

  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  await signInWithEmailAndPassword(auth, email, password);
  const db = getFirestore(app);

  const snap = await getDocs(collection(db, "productos"));
  console.log(`- Productos Firestore: ${snap.size}`);

  let updated = 0;
  let unchanged = 0;
  let missingInExcel = 0;
  let invalidExcelVat = 0;
  let errors = 0;
  let processed = 0;

  for (const d of snap.docs) {
    processed += 1;
    const data = d.data() || {};
    const nameKey = normalizeKey(data.name);
    const skuKey = normalizeKey(data.sku);

    const desired =
      (skuKey && desiredBySku.get(skuKey)) || desiredByName.get(nameKey);

    if (desired === undefined) {
      missingInExcel += 1;
      continue;
    }
    if (!isAllowedVatRate(desired)) {
      invalidExcelVat += 1;
      continue;
    }

    const current =
      data.vatRate !== undefined && data.vatRate !== null
        ? Number(data.vatRate)
        : null;

    if (current === desired) {
      unchanged += 1;
      continue;
    }

    if (!DRY_RUN) {
      try {
        await updateDoc(doc(db, "productos", d.id), { vatRate: desired });
      } catch (e) {
        errors += 1;
        continue;
      }
    }
    updated += 1;

    if (!DRY_RUN && updated % 10 === 0) {
      console.log(`- Progreso: ${updated} actualizados (${processed}/${snap.size} procesados)`);
    }
  }

  console.log("✅ Resultado:");
  console.log({ updated, unchanged, missingInExcel, invalidExcelVat, errors });
  if (DRY_RUN) {
    console.log("ℹ️ Ejecuta sin --dry-run para aplicar cambios.");
  }

  // En Node, el SDK puede dejar handles abiertos; cerramos explícitamente.
  setTimeout(() => process.exit(errors ? 1 : 0), 250).unref();
}

main().catch((e) => {
  console.error("❌ Error:", e?.message || e);
  process.exitCode = 1;
});

