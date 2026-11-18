const { createWorker } = require('tesseract.js');

// Modo de segmentación de Tesseract: '4' = una columna de texto de tamaño variable.
const PSM_SINGLE_COLUMN = '4';

// Un solo worker reutilizado: crear uno por petición es lento (carga el idioma en cada escaneo).
let workerPromise = null;
// Las peticiones se procesan en serie para no competir por el mismo worker.
let queue = Promise.resolve();

function getWorker() {
  if (!workerPromise) {
    workerPromise = createWorker('spa')
      .then(async (worker) => {
        await worker.setParameters({ tessedit_pageseg_mode: PSM_SINGLE_COLUMN });
        return worker;
      })
      .catch((error) => {
        workerPromise = null;
        throw error;
      });
  }
  return workerPromise;
}

async function resetWorker() {
  const current = workerPromise;
  workerPromise = null;
  if (!current) return;
  try {
    const worker = await current;
    await worker.terminate();
  } catch {
    // El worker ya no estaba disponible; basta con descartarlo.
  }
}

function flattenLines(data) {
  const blocks = data.blocks || [];
  return blocks.flatMap((block) =>
    (block.paragraphs || []).flatMap((paragraph) =>
      (paragraph.lines || []).map((line) => ({
        text: line.text,
        confidence: line.confidence,
        bbox: line.bbox,
      }))
    )
  );
}

// Reconoce el texto de una imagen ya preprocesada.
// Devuelve el texto completo, las líneas con su caja delimitadora y la confianza de la página (0-100).
function recognizeReceipt(imageBuffer) {
  const run = queue.then(async () => {
    try {
      const worker = await getWorker();
      const { data } = await worker.recognize(imageBuffer, {}, { text: true, blocks: true });
      return {
        text: data.text || '',
        confidence: Number(data.confidence) || 0,
        lines: flattenLines(data),
      };
    } catch (error) {
      await resetWorker();
      throw error;
    }
  });
  queue = run.catch(() => {});
  return run;
}

module.exports = { recognizeReceipt };
