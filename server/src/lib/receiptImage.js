const sharp = require('sharp');

const TARGET_WIDTH = 1800;
const ANALYSIS_WIDTH = 500;
const MAX_SKEW_DEGREES = 8;
const MIN_SKEW_DEGREES = 0.3;
const SKEW_STEP_DEGREES = 0.25;

// Umbral de Otsu: separa tinta de fondo en una imagen en escala de grises.
function otsuThreshold(pixels) {
  const histogram = new Array(256).fill(0);
  for (const value of pixels) histogram[value] += 1;

  const total = pixels.length;
  let sumAll = 0;
  for (let i = 0; i < 256; i += 1) sumAll += i * histogram[i];

  let weightBackground = 0;
  let sumBackground = 0;
  let bestVariance = -1;
  let threshold = 128;
  for (let t = 0; t < 256; t += 1) {
    weightBackground += histogram[t];
    const weightForeground = total - weightBackground;
    if (weightBackground === 0) continue;
    if (weightForeground === 0) break;

    sumBackground += t * histogram[t];
    const meanBackground = sumBackground / weightBackground;
    const meanForeground = (sumAll - sumBackground) / weightForeground;
    const variance = weightBackground * weightForeground * (meanBackground - meanForeground) ** 2;
    if (variance > bestVariance) {
      bestVariance = variance;
      threshold = t;
    }
  }
  return threshold;
}

// Estima la inclinación del texto en grados. Positivo: el texto desciende hacia la derecha.
// Busca el ángulo que concentra más tinta en pocas filas (perfil de proyecciones).
function estimateSkewDegrees(pixels, width, height) {
  const threshold = otsuThreshold(pixels);
  const ink = [];
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      if (pixels[y * width + x] < threshold) ink.push(x, y);
    }
  }
  if (ink.length < 200) return 0;

  const diagonal = Math.ceil(Math.hypot(width, height));
  let best = { angle: 0, score: -1 };
  const steps = Math.round((2 * MAX_SKEW_DEGREES) / SKEW_STEP_DEGREES);

  for (let i = 0; i <= steps; i += 1) {
    const angle = -MAX_SKEW_DEGREES + i * SKEW_STEP_DEGREES;
    const radians = (angle * Math.PI) / 180;
    const cos = Math.cos(radians);
    const sin = Math.sin(radians);
    const profile = new Uint32Array(2 * diagonal + 1);

    for (let k = 0; k < ink.length; k += 2) {
      const projection = ink[k + 1] * cos - ink[k] * sin;
      profile[Math.round(projection) + diagonal] += 1;
    }

    let score = 0;
    for (const count of profile) score += count * count;
    if (score > best.score) best = { angle, score };
  }

  return Math.abs(best.angle) < MIN_SKEW_DEGREES ? 0 : best.angle;
}

// Prepara la foto de un recibo para el OCR: orientación EXIF, escala de grises,
// contraste, reducción de ruido y corrección de inclinación. Devuelve un PNG.
async function prepareReceiptImage(input) {
  const gray = await sharp(input)
    .rotate()
    .resize({ width: TARGET_WIDTH })
    .grayscale()
    .normalise()
    .median(3)
    .sharpen({ sigma: 1 })
    .png()
    .toBuffer();

  const { data, info } = await sharp(gray)
    .grayscale()
    .resize({ width: ANALYSIS_WIDTH })
    .raw()
    .toBuffer({ resolveWithObject: true });

  const skew = estimateSkewDegrees(data, info.width, info.height);
  if (skew === 0) return gray;

  return sharp(gray)
    .rotate(-skew, { background: '#ffffff' })
    .png()
    .toBuffer();
}

module.exports = { prepareReceiptImage, estimateSkewDegrees, otsuThreshold };
