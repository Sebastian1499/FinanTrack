import { Link } from 'react-router-dom';
import Logo from './Logo';

export default function Navbar() {
  const links = [
    { href: '#problema', label: 'Problemática' },
    { href: '#propuesta', label: 'Propuesta' },
    { href: '#impacto', label: 'Impacto' },
    { href: '#galeria', label: 'Galería' },
    { href: '#nosotros', label: 'Quiénes somos' },
    { href: '#contacto', label: 'Contacto' },
  ];

  return (
    <header className="navbar">
      <Link to="/" className="navbar__brand">
        <Logo height={48} />
      </Link>
      <nav className="navbar__links">
        {links.map((link) => (
          <a key={link.href} href={link.href}>
            {link.label}
          </a>
        ))}
        <Link to="/login" className="btn btn--ghost navbar__cta">
          Iniciar sesión
        </Link>
      </nav>
    </header>
  );
}
