// Formato típico de pesos colombianos: "." como separador de miles, "," o "." con 2 dígitos como decimales.
const NUMBER_REGEX = /\d+(?:[.,]\d+)*/g;

// Interpreta un token numérico detectado por OCR o texto libre. Si el último grupo
// separado por "." o "," tiene 2 dígitos se asume parte decimal; si tiene 3 o más,
// se asume separador de miles.
function parseAmountToken(token) {
  const cleaned = token.replace(/\s/g, '');
  const parts = cleaned.split(/[.,]/);
  if (parts.length === 1) return parseFloat(parts[0]);

  const lastPart = parts[parts.length - 1];
  if (lastPart.length === 2) {
    const integerPart = parts.slice(0, -1).join('');
    return parseFloat(`${integerPart}.${lastPart}`);
  }
  return parseFloat(parts.join(''));
}

// Extrae todos los montos numéricos válidos de un texto libre.
function extractAmounts(text) {
  const matches = text.match(NUMBER_REGEX) || [];
  return matches.map(parseAmountToken).filter((n) => !Number.isNaN(n));
}

module.exports = { NUMBER_REGEX, parseAmountToken, extractAmounts };
