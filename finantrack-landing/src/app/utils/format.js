// Utilidades de formato compartidas por las pantallas de la app.

export function formatCOP(amount) {
  return Number(amount || 0).toLocaleString('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  });
}

export function formatDate(value) {
  return new Date(value).toLocaleDateString('es-CO', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

// Fecha local (YYYY-MM-DD) para valores por defecto de inputs type="date".
export function todayInputValue() {
  const now = new Date();
  const local = new Date(now.getTime() - now.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 10);
}

// Convierte una fecha de input (YYYY-MM-DD) a ISO al mediodía local,
// para que al mostrarla no cambie de día por la zona horaria.
export function dateInputToIso(dateInput) {
  return new Date(`${dateInput}T12:00:00`).toISOString();
}

export const TYPE_LABELS = { INCOME: 'Ingreso', EXPENSE: 'Egreso' };

// Los registros sin tipo (anteriores a la migración) se tratan como egreso.
export function isIncome(transaction) {
  return transaction.type === 'INCOME';
}
