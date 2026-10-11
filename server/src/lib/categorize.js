const CATEGORY_KEYWORDS = {
  Alimentación: ['restaurante', 'supermercado', 'comida', 'almuerzo', 'desayuno', 'cena', 'mercado', 'panaderia', 'panadería', 'cafe', 'café'],
  Transporte: ['uber', 'taxi', 'bus', 'transmilenio', 'gasolina', 'combustible', 'parqueadero', 'peaje', 'metro'],
  Entretenimiento: ['cine', 'netflix', 'spotify', 'juego', 'concierto', 'bar', 'discoteca', 'streaming'],
  Servicios: ['luz', 'agua', 'internet', 'telefono', 'teléfono', 'arriendo', 'gas', 'energia', 'energía', 'factura'],
  Salud: ['farmacia', 'droguería', 'drogueria', 'medico', 'médico', 'eps', 'hospital', 'clinica', 'clínica'],
  Educación: ['universidad', 'matricula', 'matrícula', 'curso', 'libro', 'colegio'],
  Compras: ['ropa', 'tienda', 'almacen', 'almacén', 'amazon', 'mercadolibre'],
};

function categorize(text) {
  const normalized = (text || '').toLowerCase();
  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    if (keywords.some((keyword) => normalized.includes(keyword))) {
      return category;
    }
  }
  return 'Otro';
}

module.exports = { categorize };
