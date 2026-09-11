const BASE = import.meta.env.BASE_URL;

const images = [
  { src: `${BASE}images/screen-home.svg`, alt: 'Pantalla de inicio de FinanTrack con resumen de gastos' },
  { src: `${BASE}images/screen-scan.svg`, alt: 'Escaneo de un recibo con la cámara usando OCR' },
  { src: `${BASE}images/screen-reports.svg`, alt: 'Reporte de gastos categorizados automáticamente' },
  { src: `${BASE}images/screen-chatbot.svg`, alt: 'Conversación con el ChatBot de ahorro de FinanTrack' },
];

export default function Gallery() {
  return (
    <section id="galeria" className="section section--alt">
      <h2>Imágenes del prototipo</h2>
      <p className="section__intro">
        Vista previa del prototipo de FinanTrack. (Reemplaza estas imágenes de
        ejemplo por capturas reales del prototipo en{' '}
        <code>public/images</code>).
      </p>
      <div className="gallery-grid">
        {images.map((image) => (
          <figure className="gallery-item" key={image.src}>
            <img src={image.src} alt={image.alt} loading="lazy" />
          </figure>
        ))}
      </div>
    </section>
  );
}
