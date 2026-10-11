const { createWorker } = require('tesseract.js');
const { NUMBER_REGEX, parseAmountToken, extractAmounts } = require('./numbers');

// Busca el monto total del recibo: prioriza líneas con "total" y, si no hay,
// toma el número más grande detectado en el texto.
function extractAmount(text) {
  const lines = text.split('\n');
  const totalLine = lines.find((line) => /total/i.test(line) && !/sub ?total/i.test(line));

  if (totalLine) {
    const matches = totalLine.match(NUMBER_REGEX);
    if (matches && matches.length) {
      const value = parseAmountToken(matches[matches.length - 1]);
      if (!Number.isNaN(value)) return value;
    }
  }

  const values = extractAmounts(text);
  return values.length ? Math.max(...values) : null;
}

function extractDescription(text) {
  const firstLine = text
    .split('\n')
    .map((line) => line.trim())
    .find((line) => line.length > 2);
  return firstLine || 'Recibo escaneado';
}

async function recognizeReceipt(buffer) {
  const worker = await createWorker('spa');
  try {
    const { data } = await worker.recognize(buffer);
    return data.text;
  } finally {
    await worker.terminate();
  }
}

function parseReceipt(text) {
  return {
    amount: extractAmount(text),
    description: extractDescription(text),
    rawText: text,
  };
}

module.exports = { recognizeReceipt, parseReceipt };
