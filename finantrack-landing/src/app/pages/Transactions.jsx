import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '../../context/useAuth';
import { api } from '../../api/client';
import { formatCOP, formatDate, isIncome, TYPE_LABELS } from '../utils/format';

const EMPTY_FORM = { type: 'EXPENSE', amount: '', description: '', category: '' };

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
        type: form.type,
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
      <header className="page-header">
        <h1>Transacciones</h1>
        <p className="page-header__subtitle">Registra ingresos y egresos. Los ingresos suman al balance y los egresos lo restan.</p>
      </header>

      <section className="panel">
        <form className="transaction-form" onSubmit={handleSubmit}>
          <label className="field">
            <span>Tipo de movimiento</span>
            <select name="type" value={form.type} onChange={handleChange} required>
              <option value="INCOME">Ingreso</option>
              <option value="EXPENSE">Egreso</option>
            </select>
          </label>
          <label className="field">
            <span>Monto</span>
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
          </label>
          <label className="field field--wide">
            <span>Descripción</span>
            <input
              type="text"
              name="description"
              placeholder="Ej. Almuerzo en restaurante"
              value={form.description}
              onChange={handleChange}
              required
            />
          </label>
          <label className="field">
            <span>Categoría</span>
            <input
              type="text"
              name="category"
              placeholder="Opcional, se autodetecta"
              value={form.category}
              onChange={handleChange}
            />
          </label>
          <button type="submit" className="btn btn--primary" disabled={saving}>
            {saving ? 'Guardando…' : 'Agregar movimiento'}
          </button>
        </form>
      </section>

      <section className="panel">
        {loading ? (
          <p className="panel__empty">Cargando transacciones…</p>
        ) : transactions.length === 0 ? (
          <p className="panel__empty">No tienes transacciones registradas todavía.</p>
        ) : (
          <div className="table-wrap">
            <table className="data-table transactions-table">
              <thead>
                <tr>
                  <th>Fecha</th>
                  <th>Descripción</th>
                  <th>Categoría</th>
                  <th>Tipo</th>
                  <th>Valor</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((t) => {
                  const income = isIncome(t);
                  return (
                    <tr key={t.id}>
                      <td data-label="Fecha">{formatDate(t.date)}</td>
                      <td data-label="Descripción">{t.description}</td>
                      <td data-label="Categoría">{t.category}</td>
                      <td data-label="Tipo">
                        <span className={`badge ${income ? 'badge--income' : 'badge--expense'}`}>
                          {income ? TYPE_LABELS.INCOME : TYPE_LABELS.EXPENSE}
                        </span>
                      </td>
                      <td data-label="Valor" className={income ? 'amount amount--income' : 'amount amount--expense'}>
                        {income ? '+ ' : '- '}
                        {formatCOP(t.amount)}
                      </td>
                      <td className="data-table__actions">
                        <button type="button" className="link-button" onClick={() => handleDelete(t.id)}>
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

