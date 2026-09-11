const authors = [
  {
    name: 'Javier Montero',
    role: 'Integrante del equipo',
  },
  {
    name: 'Estefania Malagon',
    role: 'Integrante del equipo',
  },
  {
    name: 'Sebastian Buitrago',
    role: 'Integrante del equipo',
  },
];

export default function AboutUs() {
  return (
    <section id="nosotros" className="section">
      <h2>¿Quiénes somos?</h2>
      <p className="section__intro">
        Somos un equipo de estudiantes que diseñó FinanTrack como prototipo
        para resolver un problema cotidiano: la falta de control sobre los
        gastos personales. Combinamos conocimientos de desarrollo de software
        e inteligencia artificial para construir una solución simple y útil.
      </p>
      <div className="authors-grid">
        {authors.map((author) => (
          <div className="author-card" key={author.name}>
            <div className="author-card__avatar" aria-hidden="true">
              {author.name
                .split(' ')
                .map((word) => word[0])
                .join('')}
            </div>
            <h3>{author.name}</h3>
            <p>{author.role}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
