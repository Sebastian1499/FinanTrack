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
        <span className="navbar__logo">💸</span>
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
