import VisitorCounter from './VisitorCounter';

export default function ImpactStats() {
  return (
    <section id="impacto" className="section stats-section">
      <h2>Impacto esperado</h2>
      <p className="section__intro">
        Cifras que respaldan la propuesta de FinanTrack, basadas en el diseño
        del producto y en las visitas reales a esta landing.
      </p>
      <div className="stats-grid">
        <VisitorCounter />
        <div className="stat-card">
          <span className="stat-card__number">0 min</span>
          <span className="stat-card__label">Digitando gastos a mano (registro automatico con OCR)</span>
        </div>
        <div className="stat-card">
          <span className="stat-card__number">$180k</span>
          <span className="stat-card__label">Ahorro mensual estimado con las metas del ChatBot</span>
        </div>
        <div className="stat-card">
          <span className="stat-card__number">3</span>
          <span className="stat-card__label">Tecnologias de IA integradas: OCR, ML y ChatBot</span>
        </div>
      </div>
    </section>
  );
}
