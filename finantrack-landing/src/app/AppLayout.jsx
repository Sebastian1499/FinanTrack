import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import Logo from '../components/Logo';
import { useAuth } from '../context/useAuth';
import './app.css';
import './theme.css';

function Icon({ children }) {
  return (
    <svg
      className="app-icon"
      viewBox="0 0 24 24"
      width="20"
      height="20"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

const NAV_ITEMS = [
  {
    to: '/app',
    label: 'Resumen',
    end: true,
    icon: (
      <>
        <rect x="3" y="3" width="7" height="9" />
        <rect x="14" y="3" width="7" height="5" />
        <rect x="14" y="12" width="7" height="9" />
        <rect x="3" y="16" width="7" height="5" />
      </>
    ),
  },
  {
    to: '/app/transacciones',
    label: 'Transacciones',
    icon: (
      <>
        <path d="M7 16V4m0 0L3 8m4-4 4 4" />
        <path d="M17 8v12m0 0 4-4m-4 4-4-4" />
      </>
    ),
  },
  {
    to: '/app/escanear',
    label: 'Escanear recibo',
    icon: (
      <>
        <path d="M4 7V5a1 1 0 0 1 1-1h2M17 4h2a1 1 0 0 1 1 1v2M20 17v2a1 1 0 0 1-1 1h-2M7 20H5a1 1 0 0 1-1-1v-2" />
        <circle cx="12" cy="12" r="3" />
      </>
    ),
  },
  {
    to: '/app/metas',
    label: 'Metas de ahorro',
    icon: (
      <>
        <circle cx="12" cy="12" r="9" />
        <circle cx="12" cy="12" r="5" />
        <circle cx="12" cy="12" r="1" />
      </>
    ),
  },
  {
    to: '/app/chat',
    label: 'Asistente IA',
    icon: <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />,
  },
];

export default function AppLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  function closeMenu() {
    setMenuOpen(false);
  }

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <div className={`app-shell${menuOpen ? ' app-shell--menu-open' : ''}`}>
      <aside className="app-sidebar" id="app-sidebar">
        <div className="app-sidebar__brand">
          <span className="logo-chip">
            <Logo height={72} />
          </span>
        </div>
        <nav className="app-sidebar__nav">
          {NAV_ITEMS.map((item) => (
            <NavLink key={item.to} to={item.to} end={item.end} onClick={closeMenu}>
              <Icon>{item.icon}</Icon>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
        <button type="button" className="app-sidebar__logout" onClick={handleLogout}>
          <Icon>
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <path d="m16 17 5-5-5-5M21 12H9" />
          </Icon>
          <span>Cerrar sesión</span>
        </button>
      </aside>

      {menuOpen && <div className="app-overlay" onClick={closeMenu} aria-hidden="true" />}

      <div className="app-content">
        <header className="app-topbar">
          <button
            type="button"
            className="app-topbar__menu"
            aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
            aria-expanded={menuOpen}
            aria-controls="app-sidebar"
            onClick={() => setMenuOpen((open) => !open)}
          >
            <Icon>
              <path d="M3 6h18M3 12h18M3 18h18" />
            </Icon>
          </button>
          <span className="app-topbar__greeting">Hola, {user?.name?.split(' ')[0] || 'usuario'}</span>
        </header>
        <main className="app-main">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
