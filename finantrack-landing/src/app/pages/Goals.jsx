import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '../../context/useAuth';
import { api } from '../../api/client';

const formatCOP = (amount) =>
  amount.toLocaleString('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 });

const EMPTY_FORM = { name: '', targetAmount: '', targetDate: '' };

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

  async function handleSavedChange(goal, value) {
    await api.updateGoal(token, goal.id, { savedAmount: Number(value) });
    await loadGoals();
  }

  async function handleDelete(id) {
    await api.deleteGoal(token, id);
    setGoals((prev) => prev.filter((g) => g.id !== id));
  }

  return (
    <div className="goals-page">
      <h1>Metas de ahorro</h1>

      <form className="goal-form" onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Nombre de la meta (ej. Viaje a Cartagena)"
          value={form.name}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="targetAmount"
          placeholder="Monto objetivo"
          value={form.targetAmount}
          onChange={handleChange}
          min="0"
          required
        />
        <input type="date" name="targetDate" value={form.targetDate} onChange={handleChange} required />
        <button type="submit" className="btn btn--primary" disabled={saving}>
          {saving ? 'Creando…' : 'Crear meta'}
        </button>
      </form>

      {loading ? (
        <p>Cargando metas…</p>
      ) : goals.length === 0 ? (
        <p>Aún no tienes metas. Crea la primera arriba.</p>
      ) : (
        <div className="goals-list">
          {goals.map((goal) => {
            const progress = Math.min(100, (goal.savedAmount / goal.targetAmount) * 100);
            return (
              <div key={goal.id} className="goal-card">
                <div className="goal-card__header">
                  <h3>{goal.name}</h3>
                  <button type="button" className="link-button" onClick={() => handleDelete(goal.id)}>
                    Eliminar
                  </button>
                </div>
                <div className="category-bar__track">
                  <div className="category-bar__fill" style={{ width: `${progress}%` }} />
                </div>
                <p>
                  {formatCOP(goal.savedAmount)} de {formatCOP(goal.targetAmount)}
                </p>
                <p className="goal-card__plan">
                  Te faltan {goal.monthsLeft} {goal.monthsLeft === 1 ? 'mes' : 'meses'}: ahorra{' '}
                  {formatCOP(goal.monthlySavingNeeded)} al mes para lograrlo.
                </p>
                <label className="goal-card__saved-input">
                  Ahorrado hasta ahora
                  <input
                    type="number"
                    defaultValue={goal.savedAmount}
                    onBlur={(e) => handleSavedChange(goal, e.target.value)}
                  />
                </label>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
