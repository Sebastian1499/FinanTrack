import { useEffect, useState } from 'react';

// Contador simple basado en localStorage (solo cuenta visitas de este navegador).
// Para estadísticas reales de todos los visitantes, integra Google Analytics o Plausible.
export default function VisitorCounter() {
  const [visits, setVisits] = useState(0);

  useEffect(() => {
    const key = 'finantrack_visits';
    const current = Number(localStorage.getItem(key) || '0') + 1;
    localStorage.setItem(key, String(current));
    setVisits(current);
  }, []);

  return (
    <div className="visitor-counter">
      <span className="visitor-counter__number">{visits}</span>
      <span className="visitor-counter__label">
        visitas registradas en este navegador
      </span>
    </div>
  );
}
