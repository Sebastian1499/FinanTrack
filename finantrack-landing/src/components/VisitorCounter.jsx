import { useEffect, useState } from 'react';

// Contador simple basado en localStorage (solo cuenta visitas de este navegador).
// Para estadísticas agregadas de todos los visitantes, esta landing tambien envia
// datos a GoatCounter (ver index.html) que puedes revisar aparte al presentar el proyecto.
export default function VisitorCounter() {
  const [visits, setVisits] = useState(0);

  useEffect(() => {
    const key = 'finantrack_visits';
    const current = Number(localStorage.getItem(key) || '0') + 1;
    localStorage.setItem(key, String(current));
    setVisits(current);
  }, []);

  return (
    <div className="stat-card">
      <span className="stat-card__number">{visits}</span>
      <span className="stat-card__label">Visitas en este navegador</span>
    </div>
  );
}
