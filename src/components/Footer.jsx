import SocialLinks from './SocialLinks';
import VisitorCounter from './VisitorCounter';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__top">
        <div>
          <h3>FinanTrack</h3>
          <p>Prototipo académico — Control financiero personal con IA.</p>
        </div>
        <SocialLinks />
      </div>
      <VisitorCounter />
      <p className="footer__copy">
        © {new Date().getFullYear()} FinanTrack. Proyecto de práctica académica.
      </p>
    </footer>
  );
}
