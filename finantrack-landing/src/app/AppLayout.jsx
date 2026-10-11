import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import Logo from '../components/Logo';
import { useAuth } from '../context/useAuth';
import './app.css';

const NAV_ITEMS = [
  { to: '/app', label: 'Resumen', end: true },
  { to: '/app/transacciones', label: 'Transacciones' },
  { to: '/app/escanear', label: 'Escanear recibo' },
  { to: '/app/metas', label: 'Metas de ahorro' },
  { to: '/app/chat', label: 'Asistente IA' },
];

export default function AppLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <div className="app-shell">
      <aside className="app-sidebar">
        <div className="app-sidebar__brand">
          <span className="logo-chip">
            <Logo height={72} />
          </span>
        </div>
        <nav className="app-sidebar__nav">
          {NAV_ITEMS.map((item) => (
            <NavLink key={item.to} to={item.to} end={item.end}>
              {item.label}
            </NavLink>
          ))}
        </nav>
        <button type="button" className="app-sidebar__logout" onClick={handleLogout}>
          Cerrar sesión
        </button>
      </aside>
      <div className="app-content">
        <header className="app-topbar">
          <span>Hola, {user?.name?.split(' ')[0] || 'usuario'}</span>
        </header>
        <main className="app-main">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
