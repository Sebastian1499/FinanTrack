// TODO: reemplaza estos enlaces por los reales del proyecto.
const links = [
  { label: 'GitHub', href: 'https://github.com/', icon: '🐙' },
  { label: 'Instagram', href: 'https://instagram.com/', icon: '📷' },
  { label: 'LinkedIn', href: 'https://linkedin.com/', icon: '💼' },
  { label: 'Noticias / Blog', href: 'https://example.com/noticias', icon: '📰' },
];

export default function SocialLinks() {
  return (
    <div className="social-links">
      {links.map((link) => (
        <a
          key={link.label}
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={link.label}
        >
          <span aria-hidden="true">{link.icon}</span> {link.label}
        </a>
      ))}
    </div>
  );
}
