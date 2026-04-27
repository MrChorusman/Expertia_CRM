/**
 * 🧾 Backfill IVA por producto (vatRate) — Expertis CRM
 *
 * Objetivo:
 * - Añadir `vatRate: 0.21` a todos los documentos de la colección `productos`
 *   que no lo tengan.
 *
 * Cómo ejecutar:
 * - Abrir la app en el navegador con un usuario con permisos de edición de productos
 * - Abrir consola DevTools y pegar este script completo
 */

(async function backfillProductosVatRate() {
  console.log("🧾 Iniciando backfill de vatRate en productos...");

  if (typeof db === "undefined" || !db) {
    console.error(
      "❌ Firebase no está disponible. Abre la app y asegúrate de que `db` existe.",
    );
    return;
  }

  const firebase = window.firebase;
  if (!firebase?.collection || !firebase?.getDocs || !firebase?.updateDoc || !firebase?.doc) {
    console.error(
      "❌ Funciones Firestore no disponibles en window.firebase (collection/getDocs/updateDoc/doc).",
    );
    return;
  }

  const { collection, getDocs, updateDoc, doc } = firebase;

  const productosRef = collection(db, "productos");
  const snap = await getDocs(productosRef);

  let updated = 0;
  let skipped = 0;
  let failed = 0;

  for (const d of snap.docs) {
    const data = d.data() || {};
    const hasVatRate = data.vatRate !== undefined && data.vatRate !== null;
    if (hasVatRate) {
      skipped += 1;
      continue;
    }

    try {
      await updateDoc(doc(db, "productos", d.id), { vatRate: 0.21 });
      updated += 1;
    } catch (e) {
      failed += 1;
      console.error("Error actualizando producto", d.id, e);
    }
  }

  console.log("✅ Backfill completado.", { updated, skipped, failed });
})();

