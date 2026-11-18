import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/useAuth';
import { api } from '../../api/client';
import { formatCOP, formatDate, isIncome, TYPE_LABELS } from '../utils/format';

const RECENT_LIMIT = 8;

export default function Dashboard() {
  const { token } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .getTransactions(token)
      .then((data) => setTransactions(data.transactions))
      .finally(() => setLoading(false));
  }, [token]);

  const summary = useMemo(() => {
    let income = 0;
    let expense = 0;
    const expenseByCategory = {};

    for (const t of transactions) {
      if (isIncome(t)) {
        income += t.amount;
      } else {
        expense += t.amount;
        expenseByCategory[t.category] = (expenseByCategory[t.category] || 0) + t.amount;
      }
    }

    return {
      income,
      expense,
      balance: income - expense,
      byCategory: Object.entries(expenseByCategory).sort((a, b) => b[1] - a[1]),
      recent: transactions.slice(0, RECENT_LIMIT),
    };
  }, [transactions]);

  if (loading) return <p className="page-status">Cargando resumen…</p>;

  const { income, expense, balance, byCategory, recent } = summary;

  return (
    <div className="dashboard">
      <header className="page-header">
        <h1>Resumen financiero</h1>
        <p className="page-header__subtitle">Tu balance con todos tus movimientos.</p>
      </header>

      <div className="summary-cards">
        <article className="summary-card summary-card--income">
          <span className="summary-card__label">Ingresos totales</span>
          <span className="summary-card__value">{formatCOP(income)}</span>
        </article>
        <article className="summary-card summary-card--expense">
          <span className="summary-card__label">Egresos totales</span>
          <span className="summary-card__value">{formatCOP(expense)}</span>
        </article>
        <article className="summary-card summary-card--balance">
          <span className="summary-card__label">Balance total</span>
          <span className="summary-card__value">{formatCOP(balance)}</span>
        </article>
      </div>

      <div className="dashboard__grid">
        <section className="panel">
          <div className="panel__header">
            <h2 className="panel__title">Gasto por categoría</h2>
          </div>
          {byCategory.length === 0 && <p className="panel__empty">Aún no tienes gastos registrados.</p>}
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
                    style={{ width: `${expense ? (amount / expense) * 100 : 0}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="panel">
          <div className="panel__header">
            <h2 className="panel__title">Últimos movimientos</h2>
            <Link to="/app/transacciones" className="panel__link">
              Ver todos
            </Link>
          </div>
          {recent.length === 0 ? (
            <p className="panel__empty">
              Registra tu primer movimiento en <Link to="/app/transacciones">Transacciones</Link>.
            </p>
          ) : (
            <div className="table-wrap">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Fecha</th>
                    <th>Descripción</th>
                    <th>Tipo</th>
                    <th>Valor</th>
                  </tr>
                </thead>
                <tbody>
                  {recent.map((t) => {
                    const income = isIncome(t);
                    return (
                      <tr key={t.id}>
                        <td data-label="Fecha">{formatDate(t.date)}</td>
                        <td data-label="Descripción">{t.description}</td>
                        <td data-label="Tipo">
                          <span className={`badge ${income ? 'badge--income' : 'badge--expense'}`}>
                            {income ? TYPE_LABELS.INCOME : TYPE_LABELS.EXPENSE}
                          </span>
                        </td>
                        <td data-label="Valor" className={income ? 'amount amount--income' : 'amount amount--expense'}>
                          {income ? '+ ' : '- '}
                          {formatCOP(t.amount)}
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
    </div>
  );
}
