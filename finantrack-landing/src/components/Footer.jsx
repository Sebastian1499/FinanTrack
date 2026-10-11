import SocialLinks from './SocialLinks';
import Logo from './Logo';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__top">
        <div className="footer__brand">
          <span className="logo-chip">
            <Logo height={72} />
          </span>
          <div>
            <p>Prototipo académico — Control financiero personal con IA.</p>
          </div>
        </div>
        <SocialLinks />
      </div>
      <p className="footer__copy">
        © {new Date().getFullYear()} FinanTrack. Proyecto de práctica académica.
      </p>
    </footer>
  );
}
