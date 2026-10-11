import SocialLinks from './SocialLinks';
import { LogoIcon } from './icons';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__top">
        <div className="footer__brand">
          <LogoIcon size={32} />
          <div>
            <h3>FinanTrack</h3>
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
