import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/useAuth';
import { api } from '../../api/client';

const formatCOP = (amount) =>
  amount.toLocaleString('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 });

export default function Dashboard() {
  const { token } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.getTransactions(token), api.getGoals(token)])
      .then(([txData, goalData]) => {
        setTransactions(txData.transactions);
        setGoals(goalData.goals);
      })
      .finally(() => setLoading(false));
  }, [token]);

  const { total, byCategory, recent } = useMemo(() => {
    const totalAmount = transactions.reduce((sum, t) => sum + t.amount, 0);
    const categoryTotals = transactions.reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {});
    return {
      total: totalAmount,
      byCategory: Object.entries(categoryTotals).sort((a, b) => b[1] - a[1]),
      recent: transactions.slice(0, 5),
    };
  }, [transactions]);

  if (loading) return <p>Cargando resumen…</p>;

  return (
    <div className="dashboard">
      <h1>Resumen financiero</h1>

      <div className="dashboard__stats">
        <div className="stat-card">
          <span className="stat-card__label">Total registrado</span>
          <span className="stat-card__value">{formatCOP(total)}</span>
        </div>
        <div className="stat-card">
          <span className="stat-card__label">Transacciones</span>
          <span className="stat-card__value">{transactions.length}</span>
        </div>
        <div className="stat-card">
          <span className="stat-card__label">Metas activas</span>
          <span className="stat-card__value">{goals.length}</span>
        </div>
      </div>

      <section className="dashboard__section">
        <h2>Gasto por categoría</h2>
        {byCategory.length === 0 && <p>Aún no tienes gastos registrados.</p>}
        <div className="category-bars">
          {byCategory.map(([category, amount]) => (
            <div key={category} className="category-bar">
              <div className="category-bar__header">
                <span>{category}</span>
                <span>{formatCOP(amount)}</span>
              </div>
              <div className="category-bar__track">
                <div
                  className="category-bar__fill"
                  style={{ width: `${total ? (amount / total) * 100 : 0}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="dashboard__section">
        <h2>Últimos movimientos</h2>
        {recent.length === 0 ? (
          <p>
            Registra tu primer gasto en <Link to="/app/transacciones">Transacciones</Link>.
          </p>
        ) : (
          <ul className="recent-list">
            {recent.map((t) => (
              <li key={t.id}>
                <span>{t.description}</span>
                <span className="recent-list__category">{t.category}</span>
                <span>{formatCOP(t.amount)}</span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
