import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '../../context/useAuth';
import { api } from '../../api/client';

const formatCOP = (amount) =>
  amount.toLocaleString('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 });

const EMPTY_FORM = { amount: '', description: '', category: '' };

export default function Transactions() {
  const { token } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const loadTransactions = useCallback(
    () => api.getTransactions(token).then((data) => setTransactions(data.transactions)),
    [token],
  );

  useEffect(() => {
    loadTransactions().finally(() => setLoading(false));
  }, [loadTransactions]);

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    try {
      await api.createTransaction(token, {
        amount: Number(form.amount),
        description: form.description,
        category: form.category || undefined,
      });
      setForm(EMPTY_FORM);
      await loadTransactions();
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    await api.deleteTransaction(token, id);
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  }

  return (
    <div className="transactions-page">
      <h1>Transacciones</h1>

      <form className="transaction-form" onSubmit={handleSubmit}>
        <input
          type="number"
          name="amount"
          placeholder="Monto"
          value={form.amount}
          onChange={handleChange}
          min="0"
          step="0.01"
          required
        />
        <input
          type="text"
          name="description"
          placeholder="Descripción (ej. Almuerzo en restaurante)"
          value={form.description}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="category"
          placeholder="Categoría (opcional, se autodetecta)"
          value={form.category}
          onChange={handleChange}
        />
        <button type="submit" className="btn btn--primary" disabled={saving}>
          {saving ? 'Guardando…' : 'Agregar'}
        </button>
      </form>

      {loading ? (
        <p>Cargando transacciones…</p>
      ) : transactions.length === 0 ? (
        <p>No tienes transacciones registradas todavía.</p>
      ) : (
        <table className="transactions-table">
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Descripción</th>
              <th>Categoría</th>
              <th>Monto</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((t) => (
              <tr key={t.id}>
                <td>{new Date(t.date).toLocaleDateString('es-CO')}</td>
                <td>{t.description}</td>
                <td>{t.category}</td>
                <td>{formatCOP(t.amount)}</td>
                <td>
                  <button type="button" className="link-button" onClick={() => handleDelete(t.id)}>
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
