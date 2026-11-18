import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '../../context/useAuth';
import { api } from '../../api/client';
import { dateInputToIso, formatCOP, formatDate, todayInputValue } from '../utils/format';

const EMPTY_FORM = { name: '', targetAmount: '', targetDate: '' };

function GoalCard({ goal, onChanged, onDelete }) {
  const { token } = useAuth();
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(todayInputValue);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const progress = Math.min(100, Math.max(0, goal.progress ?? 0));
  const savings = goal.savings || [];
  const reached = goal.remaining <= 0;

  async function handleAddSaving(e) {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      await api.addGoalSaving(token, goal.id, { amount: Number(amount), date: dateInputToIso(date) });
      setAmount('');
      await onChanged();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteSaving(savingId) {
    setError('');
    try {
      await api.deleteGoalSaving(token, goal.id, savingId);
      await onChanged();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <article className="goal-card">
      <header className="goal-card__header">
        <h3>{goal.name}</h3>
        <button type="button" className="link-button" onClick={() => onDelete(goal.id)}>
          Eliminar
        </button>
      </header>

      <div className="goal-card__stats">
        <div>
          <span className="goal-card__stat-label">Ahorrado</span>
          <strong>{formatCOP(goal.savedAmount)}</strong>
        </div>
        <div>
          <span className="goal-card__stat-label">Restante</span>
          <strong>{formatCOP(goal.remaining)}</strong>
        </div>
        <div>
          <span className="goal-card__stat-label">Meta</span>
          <strong>{formatCOP(goal.targetAmount)}</strong>
        </div>
      </div>

      <div
        className="progress"
        role="progressbar"
        aria-label={`Progreso de ${goal.name}`}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(progress)}
      >
        <div className="progress__fill" style={{ width: `${progress}%` }} />
      </div>
      <p className="goal-card__progress-text">{Math.round(progress)}% completado</p>

      <p className="goal-card__plan">
        {reached
          ? '¡Meta cumplida!'
          : `Te faltan ${goal.monthsLeft} ${goal.monthsLeft === 1 ? 'mes' : 'meses'}: ahorra ${formatCOP(
              goal.monthlySavingNeeded,
            )} al mes para lograrla.`}
      </p>

      <form className="goal-card__saving-form" onSubmit={handleAddSaving}>
        <label className="field">
          <span>Valor del ahorro</span>
          <input
            type="number"
            min="1"
            step="any"
            placeholder="Ej. 100000"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
        </label>
        <label className="field">
          <span>Fecha</span>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
        </label>
        <button type="submit" className="btn btn--primary" disabled={saving}>
          {saving ? 'Guardando…' : 'Registrar ahorro'}
        </button>
      </form>

      {error && <p className="auth-card__error">{error}</p>}

      <details className="goal-card__history">
        <summary>Historial de ahorros ({savings.length})</summary>
        {savings.length === 0 ? (
          <p className="panel__empty">Aún no has registrado ahorros para esta meta.</p>
        ) : (
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Fecha</th>
                  <th>Valor</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {savings.map((s) => (
                  <tr key={s.id}>
                    <td data-label="Fecha">{formatDate(s.date)}</td>
                    <td data-label="Valor" className="amount amount--income">
                      + {formatCOP(s.amount)}
                    </td>
                    <td className="data-table__actions">
                      <button type="button" className="link-button" onClick={() => handleDeleteSaving(s.id)}>
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </details>
    </article>
  );
}

export default function Goals() {
  const { token } = useAuth();
  const [goals, setGoals] = useState([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const loadGoals = useCallback(() => api.getGoals(token).then((data) => setGoals(data.goals)), [token]);

  useEffect(() => {
    loadGoals().finally(() => setLoading(false));
  }, [loadGoals]);

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    try {
      await api.createGoal(token, form);
      setForm(EMPTY_FORM);
      await loadGoals();
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    await api.deleteGoal(token, id);
    setGoals((prev) => prev.filter((g) => g.id !== id));
  }

  return (
    <div className="goals-page">
      <header className="page-header">
        <h1>Metas de ahorro</h1>
        <p className="page-header__subtitle">Define una meta, registra cada ahorro y sigue tu progreso.</p>
      </header>

      <section className="panel">
        <h2 className="panel__title">Nueva meta</h2>
        <form className="goal-form" onSubmit={handleSubmit}>
          <label className="field field--wide">
            <span>Nombre</span>
            <input
              type="text"
              name="name"
              placeholder="Ej. Viaje a Cartagena"
              value={form.name}
              onChange={handleChange}
              required
            />
          </label>
          <label className="field">
            <span>Monto objetivo</span>
            <input
              type="number"
              name="targetAmount"
              placeholder="Ej. 2000000"
              value={form.targetAmount}
              onChange={handleChange}
              min="0"
              required
            />
          </label>
          <label className="field">
            <span>Fecha objetivo</span>
            <input type="date" name="targetDate" value={form.targetDate} onChange={handleChange} required />
          </label>
          <button type="submit" className="btn btn--primary" disabled={saving}>
            {saving ? 'Creando…' : 'Crear meta'}
          </button>
        </form>
      </section>

      {loading ? (
        <p className="page-status">Cargando metas…</p>
      ) : goals.length === 0 ? (
        <p className="panel__empty">Aún no tienes metas. Crea la primera arriba.</p>
      ) : (
        <div className="goals-list">
          {goals.map((goal) => (
            <GoalCard key={goal.id} goal={goal} onChanged={loadGoals} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </div>
  );
}

