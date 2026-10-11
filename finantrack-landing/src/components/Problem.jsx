export default function Problem() {
  return (
    <section id="problema" className="section section--alt">
      <h2>La problemática</h2>
      <p className="section__intro">
        Las personas con poca organización financiera tienen dificultades
        para controlar sus gastos y saber en qué utilizan su dinero, lo que
        les impide organizarse y ahorrar para compras importantes como
        viajes o vehículos.
      </p>
      <div className="cards-grid">
        <div className="card">
          <h3>Situación actual</h3>
          <p>
            Gastan su dinero en diferentes cosas durante el mes, pero no
            tienen claro cuánto están gastando ni en qué.
          </p>
        </div>
        <div className="card">
          <h3>Trabajo del cliente</h3>
          <p>
            Cuando reciben su dinero y realizan gastos durante el mes,
            intentan recordar o revisar en qué han gastado para saber cuánto
            dinero les queda.
          </p>
        </div>
        <div className="card">
          <h3>Consecuencia</h3>
          <p>
            La falta de registro y organización hace que pierdan la noción de
            sus gastos y no sepan qué gastos podrían reducir o evitar.
          </p>
        </div>
      </div>
    </section>
  );
}
