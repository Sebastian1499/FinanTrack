import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/useAuth';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(form.email, form.password);
      navigate('/app');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-screen">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h1>Iniciar sesión</h1>
        <p className="auth-card__subtitle">Entra a tu cuenta de FinanTrack</p>

        <label>
          Email
          <input type="email" name="email" value={form.email} onChange={handleChange} required />
        </label>
        <label>
          Contraseña
          <input type="password" name="password" value={form.password} onChange={handleChange} required />
        </label>

        {error && <p className="auth-card__error">{error}</p>}

        <button type="submit" className="btn btn--primary" disabled={loading}>
          {loading ? 'Ingresando…' : 'Ingresar'}
        </button>

        <p className="auth-card__footer">
          ¿No tienes cuenta? <Link to="/register">Regístrate</Link>
        </p>
        <p className="auth-card__footer">
          <Link to="/">Volver al sitio</Link>
        </p>
      </form>
    </div>
  );
}
