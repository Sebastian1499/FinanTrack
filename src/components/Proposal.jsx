import { ScanIcon, MLIcon, ChatIcon, SearchIcon } from './icons';

const features = [
  {
    Icon: ScanIcon,
    title: 'Escaneo automático (OCR)',
    text: 'Toma una foto de tus recibos y facturas: la IA extrae los datos sin que tengas que digitar nada.',
  },
  {
    Icon: MLIcon,
    title: 'Clasificación con Machine Learning',
    text: 'Un modelo de ML categoriza automáticamente cada gasto y genera reportes simples de en qué se va tu dinero.',
  },
  {
    Icon: ChatIcon,
    title: 'ChatBot financiero con IA',
    text: 'Pregúntale cuánto deberías ahorrar para una meta (un carro, un viaje) y te dirá cuánto gastar o guardar cada mes.',
  },
  {
    Icon: SearchIcon,
    title: 'Recomendaciones inteligentes',
    text: 'El ChatBot navega por internet y te recomienda planes o artículos relacionados con lo que buscas.',
  },
];

export default function Proposal() {
  return (
    <section id="propuesta" className="section">
      <h2>Propuesta del proyecto</h2>
      <p className="section__intro">
        FinanTrack es una app que usa inteligencia artificial para que
        controlar tus finanzas sea automático, no una tarea manual. Así se ve
        la situación futura para nuestros usuarios:
      </p>
      <div className="cards-grid">
        {features.map((feature) => (
          <div className="card" key={feature.title}>
            <feature.Icon />
            <h3>{feature.title}</h3>
            <p>{feature.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
