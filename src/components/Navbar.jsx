import { LogoIcon } from './icons';

export default function Navbar() {
  const links = [
    { href: '#problema', label: 'Problemática' },
    { href: '#propuesta', label: 'Propuesta' },
    { href: '#galeria', label: 'Galería' },
    { href: '#nosotros', label: 'Quiénes somos' },
    { href: '#contacto', label: 'Contacto' },
  ];

  return (
    <header className="navbar">
      <div className="navbar__brand">
        <LogoIcon />
        <span>FinanTrack</span>
      </div>
      <nav className="navbar__links">
        {links.map((link) => (
          <a key={link.href} href={link.href}>
            {link.label}
          </a>
        ))}
      </nav>
    </header>
  );
}
