/**
 * Unit smoke test: estado de pago de facturas en céntimos.
 * Reproduce el bug de "Parcialmente Pagada" con floats de IVA/línea.
 */

function toCents(n) {
  return Math.round((Number(n) || 0) * 100);
}
function roundMoney(n) {
  return toCents(n) / 100;
}
function resolveInvoicePaymentStatus(totalPaid, total) {
  const paidCents = toCents(totalPaid);
  const totalCents = toCents(total);
  if (totalCents > 0 && paidCents >= totalCents) return "Pagada";
  if (paidCents > 0) return "Parcialmente Pagada";
  return "Enviada";
}
function isInvoiceFullyPaid(invoice) {
  if (!invoice) return false;
  const totalCents = toCents(invoice.total);
  if (totalCents <= 0) return false;
  return toCents(invoice.totalPaid) >= totalCents;
}
function getEffectiveInvoiceStatus(invoice) {
  if (!invoice) return "";
  const status = invoice.status || "";
  if (status === "Anulada" || status === "Borrador") return status;
  if (isInvoiceFullyPaid(invoice)) return "Pagada";
  if (toCents(invoice.totalPaid) > 0) return "Parcialmente Pagada";
  return status || "Enviada";
}

function assert(cond, msg) {
  if (!cond) throw new Error(msg);
}

// Caso clásico: total con ruido float, pago = toFixed(2)
{
  const total = 30.300000000000004;
  const paid = Number(total.toFixed(2));
  assert(paid < total, "precondición float: paid < total");
  assert(paid >= total === false, "precondición: comparación float falla");
  assert(
    resolveInvoicePaymentStatus(paid, total) === "Pagada",
    "debe marcar Pagada en céntimos",
  );
}

// Caso UI: cobro del pendiente en céntimos
{
  const invoice = { total: 110.19000000000001, totalPaid: 0 };
  const due = toCents(invoice.total) / 100;
  const newPaid = roundMoney(invoice.totalPaid + due);
  assert(
    resolveInvoicePaymentStatus(newPaid, invoice.total) === "Pagada",
    "pago del due en céntimos => Pagada",
  );
}

// Parcial real
{
  assert(
    resolveInvoicePaymentStatus(50, 100) === "Parcialmente Pagada",
    "parcial real",
  );
}

// Sin pagos
{
  assert(resolveInvoicePaymentStatus(0, 100) === "Enviada", "sin pagos");
}

// Factura atascada en Parcialmente Pagada
{
  const stuck = {
    status: "Parcialmente Pagada",
    total: 93.5 + 16.69 + 1e-12,
    totalPaid: 110.19,
  };
  assert(isInvoiceFullyPaid(stuck), "stuck is fully paid in cents");
  assert(
    getEffectiveInvoiceStatus(stuck) === "Pagada",
    "effective status heals UI",
  );
}

// Anulada no se reescribe
{
  assert(
    getEffectiveInvoiceStatus({
      status: "Anulada",
      total: 10,
      totalPaid: 10,
    }) === "Anulada",
    "anulada se respeta",
  );
}

console.log("[OK] test-payment-status-cents: todos los casos pasaron");
