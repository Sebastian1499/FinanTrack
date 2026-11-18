const { categorize } = require('./categorize');

const REVIEW_THRESHOLD = 0.7;
const LOW_OCR_CONFIDENCE = 60;
const MAX_DIGITS_IN_AMOUNT = 9;

// Monto: separadores de miles (.) o decimales (,) o al revés; no pegado a letras ni a otros números.
const MONEY_REGEX = /(?<![\w.,])(\d{1,3}(?:[.,]\d{3})+|\d+)(?:[.,](\d{1,2}))?(?!\d)/g;
const DATE_OR_TIME_PATTERN = '\\b\\d{1,4}[/\\-.]\\d{1,2}[/\\-.]\\d{2,4}\\b|\\b\\d{1,2}:\\d{2}(?::\\d{2})?\\b';
const DATE_OR_TIME_REGEX = new RegExp(DATE_OR_TIME_PATTERN, 'g');
const DATE_OR_TIME_TEST = new RegExp(DATE_OR_TIME_PATTERN);

// Líneas que contienen identificadores, códigos, direcciones, cantidades o pagos que no son el total.
const NON_AMOUNT_LINE = /\b(NIT|RUT|CC|TEL|TELEFONO|CEL|CELULAR|FAX|FACTURA|REF|REFERENCIA|CONSECUTIVO|CUFE|RESOLUCION|AUTORIZACION|CODIGO|COD|CAJA|CAJERO|TICKET|TIQUETE|MESA|PLACA|ITEMS?|CANT|CANTIDAD|UND|UNIDADES?|ARTICULOS?|DIRECCION|DIR|CALLE|CRA|CARRERA|CL|AV|BARRIO|TARJETA|IVA|PROPINA|CAMBIO|EFECTIVO|RECIBIDO|DESCUENTO|DESC|BASE|SUBTOTAL|FECHA|HORA)\b/;

const STRONG_TOTAL = /\b(TOTAL\s+A\s+PAGAR|VALOR\s+A\s+PAGAR|TOTAL\s+PAGADO|VALOR\s+TOTAL|TOTAL\s+COMPRA|IMPORTE\s+TOTAL|MONTO\s+TOTAL)\b/;
const PLAIN_TOTAL = /\bTOTAL\b/;
const TOTAL_EXCLUDE = /\bSUB\s?TOTAL\b|\bTOTAL\s+(ITEMS?|ARTICULOS?|UNIDADES|CANTIDAD|IVA|IMPUESTOS?|DESCUENTOS?|BASE|PRODUCTOS|CAMBIO|PROPINA|AHORRO)\b/;

const MERCHANT_EXCLUDE = /\b(FACTURA|RECIBO|TIQUETE|TICKET|COMPROBANTE|DOCUMENTO|EQUIVALENTE|POS|VENTA|CAJERO|NIT|RUT|TEL|FECHA|HORA|REF|DIRECCION|CALLE|CRA|CARRERA|CL|AV|IVA|RESOLUCION|GRACIAS|WWW)\b|@|\.COM\b|HTTP/;

// Quita acentos y pasa a mayúsculas para comparar palabras clave.
function normalizeText(value) {
  return value.normalize('NFD').replace(/\p{M}/gu, '').toUpperCase();
}

// Corrige confusiones típicas del OCR dentro de tokens numéricos (4O.OOO -> 40.000).
function fixDigitLookalikes(line) {
  return line.replace(/\S+/g, (token) => {
    if (!/\d/.test(token) || !/^\$?[\dOolI|.,]+$/.test(token)) return token;
    return token.replace(/[Oo]/g, '0').replace(/[lI|]/g, '1');
  });
}

// Convierte un monto con separadores colombianos o anglosajones en número.
// "45.000" -> 45000, "3.000,50" -> 3000.5, "1,234.56" -> 1234.56, "12.50" -> 12.5.
function parseMoney(token) {
  const clean = token.replace(/[^\d.,]/g, '');
  if (!clean) return NaN;

  const lastSeparator = Math.max(clean.lastIndexOf('.'), clean.lastIndexOf(','));
  if (lastSeparator === -1) return Number(clean);

  const decimals = clean.length - lastSeparator - 1;
  const integerPart = clean.slice(0, lastSeparator).replace(/[.,]/g, '');
  const decimalPart = clean.slice(lastSeparator + 1);

  if (decimals === 3) return Number(integerPart + decimalPart);
  return Number(`${integerPart}.${decimalPart}`);
}

function extractMoneyValues(text) {
  const cleaned = fixDigitLookalikes(text).replace(DATE_OR_TIME_REGEX, ' ');
  const values = [];
  for (const match of cleaned.matchAll(MONEY_REGEX)) {
    if (match[0].replace(/\D/g, '').length > MAX_DIGITS_IN_AMOUNT) continue;
    const value = parseMoney(match[0]);
    if (Number.isFinite(value) && value > 0) values.push(value);
  }
  return values;
}

function buildLines(ocrLines, text) {
  const source = ocrLines.length
    ? ocrLines
    : text.split('\n').map((line) => ({ text: line, confidence: 100, bbox: null }));

  return source
    .map((line, index) => {
      const clean = String(line.text || '').replace(/\s+/g, ' ').trim();
      const bbox = line.bbox;
      return {
        text: clean,
        norm: normalizeText(clean),
        confidence: Number(line.confidence) || 0,
        top: bbox ? bbox.y0 : index,
        height: bbox ? bbox.y1 - bbox.y0 : 0,
      };
    })
    .filter((line) => line.text.length > 0);
}

// Busca el total: primero rótulos fuertes (TOTAL A PAGAR...), luego TOTAL.
// Dentro del grupo ganador toma el valor más alto de la línea o de las dos siguientes.
function findTotal(lines) {
  let best = null;

  lines.forEach((line, index) => {
    if (TOTAL_EXCLUDE.test(line.norm)) return;

    const strong = STRONG_TOTAL.exec(line.norm);
    if (!strong && !PLAIN_TOTAL.test(line.norm)) return;

    const weight = strong ? 3 : 2;
    let values = extractMoneyValues(line.text);

    if (values.length === 0) {
      for (const next of lines.slice(index + 1, index + 3)) {
        if (NON_AMOUNT_LINE.test(next.norm)) break;
        values = extractMoneyValues(next.text);
        if (values.length > 0) break;
      }
    }
    if (values.length === 0) return;

    const candidate = {
      value: Math.max(...values),
      weight,
      label: strong ? strong[1] : 'TOTAL',
    };
    if (
      !best ||
      candidate.weight > best.weight ||
      (candidate.weight === best.weight && candidate.value > best.value)
    ) {
      best = candidate;
    }
  });

  return best;
}

// Respaldo sin palabra TOTAL: el valor más alto entre líneas que no son identificadores ni cantidades.
function findLargestAmount(lines) {
  let largest = null;
  for (const line of lines) {
    if (NON_AMOUNT_LINE.test(line.norm)) continue;
    for (const value of extractMoneyValues(line.text)) {
      if (largest === null || value > largest) largest = value;
    }
  }
  return largest;
}

function isMerchantCandidate(line) {
  const letters = (line.norm.match(/[A-Z]/g) || []).length;
  if (letters < 3) return false;

  const nonSpace = line.text.replace(/\s/g, '').length;
  if (letters / nonSpace < 0.6) return false;
  if (line.confidence < 40) return false;
  if (MERCHANT_EXCLUDE.test(line.norm)) return false;
  if (PLAIN_TOTAL.test(line.norm)) return false;
  if (/\d{4,}/.test(line.text)) return false;
  if (DATE_OR_TIME_TEST.test(line.text)) return false;
  if (extractMoneyValues(line.text).some((value) => value >= 1000)) return false;

  return true;
}

// Comercio: el texto más grande de la parte superior. Entre las líneas casi tan grandes como la
// mayor, se toma la más alta del recibo.
function findMerchantLine(lines) {
  const candidates = lines.filter(isMerchantCandidate);
  if (candidates.length === 0) return null;

  const maxHeight = Math.max(...candidates.map((line) => line.height));
  const largest = candidates
    .filter((line) => line.height >= maxHeight * 0.85)
    .sort((a, b) => a.top - b.top);
  return largest[0];
}

function findFallbackMerchantLine(lines) {
  return (
    lines.find(
      (line) =>
        (line.norm.match(/[A-Z]/g) || []).length >= 3 &&
        !NON_AMOUNT_LINE.test(line.norm) &&
        !PLAIN_TOTAL.test(line.norm)
    ) || null
  );
}

// Presenta el nombre del comercio en formato legible (CAFE LOS ANDES -> Cafe Los Andes).
function formatMerchantName(text) {
  const clean = text
    .replace(/[^\p{L}\p{N}&'.\- ]/gu, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 80);

  if (clean === clean.toUpperCase()) {
    return clean
      .toLowerCase()
      .replace(/(^|\s)(\p{L})/gu, (_, space, letter) => space + letter.toUpperCase());
  }
  return clean;
}

function clamp01(value) {
  return Math.min(1, Math.max(0, value));
}

// Lee el texto OCR (texto completo, líneas y cajas) y devuelve comercio, total y confianza.
function parseReceipt({ text = '', lines: ocrLines = [], confidence = 0 } = {}) {
  const lines = buildLines(ocrLines, text);
  const warnings = [];

  const merchantLine = findMerchantLine(lines);
  const fallbackLine = merchantLine ? null : findFallbackMerchantLine(lines);
  const merchant = merchantLine
    ? formatMerchantName(merchantLine.text)
    : fallbackLine
      ? formatMerchantName(fallbackLine.text)
      : null;

  const total = findTotal(lines);
  let amount = null;
  let totalKeyword = null;
  let totalSource = null;

  if (total) {
    amount = total.value;
    totalKeyword = total.label;
    totalSource = 'keyword';
  } else {
    const largest = findLargestAmount(lines);
    if (largest !== null) {
      amount = largest;
      totalSource = 'largest';
      warnings.push('No encontramos la palabra TOTAL. Se tomó el valor más alto del recibo; revísalo.');
    } else {
      warnings.push('No pudimos detectar el monto del recibo. Ingrésalo manualmente.');
    }
  }

  if (!merchantLine) {
    warnings.push('No identificamos el nombre del comercio. Revisa la descripción.');
  }
  if (confidence < LOW_OCR_CONFIDENCE) {
    warnings.push('La lectura del texto tiene baja confianza. Revisa la foto o vuelve a tomarla con más luz.');
  }

  const totalScore = totalSource === 'keyword' ? (total.weight === 3 ? 1 : 0.8) : totalSource === 'largest' ? 0.4 : 0;
  const merchantScore = merchantLine ? 1 : merchant ? 0.5 : 0;
  const ocrScore = clamp01(Number(confidence) / 100);
  const score = clamp01(0.4 * totalScore + 0.2 * merchantScore + 0.4 * ocrScore);

  const description = merchant || 'Recibo escaneado';
  const categoryFromName = categorize(description);
  const category = categoryFromName !== 'Otro' ? categoryFromName : categorize(text);

  return {
    amount,
    description,
    category,
    rawText: text,
    confidence: Math.round(score * 100) / 100,
    needsReview: score < REVIEW_THRESHOLD || totalSource !== 'keyword' || amount === null,
    warnings,
    detected: {
      merchant,
      total: amount,
      totalKeyword,
      totalSource,
    },
  };
}

module.exports = { parseReceipt, parseMoney, fixDigitLookalikes, normalizeText };
