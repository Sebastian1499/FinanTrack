import { Link } from 'react-router-dom';
import Logo from './Logo';

export default function Hero() {
  return (
    <section className="hero">
      <div className="hero__text">
        <h1 className="hero__logo">
          <Logo height={200} />
        </h1>
        <p className="hero__eyebrow">Prototipo de finanzas personales con IA</p>
        <p className="hero__subtitle">
          Escanea tus recibos, olvídate de digitar tus gastos y descubre en
          qué se va tu dinero cada mes. FinanTrack usa visión por computador y
          un chatbot con IA para ayudarte a ahorrar para lo que realmente
          quieres.
        </p>
        <div className="hero__cta">
          <Link to="/register" className="btn btn--primary">
            Quiero registrarme
          </Link>
          <a href="#propuesta" className="btn btn--ghost">
            Conocer la propuesta
          </a>
        </div>
      </div>
      <div className="hero__image" aria-hidden="true">
        <img src={`${import.meta.env.BASE_URL}images/hero-mockup.svg`} alt="Mockup de la app FinanTrack" />
      </div>
    </section>
  );
}
