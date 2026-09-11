import { GithubIcon, InstagramIcon, LinkedinIcon, NewsIcon } from './icons';

// TODO: reemplaza estos enlaces por los reales del proyecto.
const links = [
  { label: 'GitHub', href: 'https://github.com/', Icon: GithubIcon },
  { label: 'Instagram', href: 'https://instagram.com/', Icon: InstagramIcon },
  { label: 'LinkedIn', href: 'https://linkedin.com/', Icon: LinkedinIcon },
  { label: 'Noticias / Blog', href: 'https://example.com/noticias', Icon: NewsIcon },
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
          <link.Icon />
          {link.label}
        </a>
      ))}
    </div>
  );
}
