const sharp = require('sharp');
const { prepareReceiptImage, estimateSkewDegrees } = require('../../../server/src/lib/receiptImage');

const WIDTH = 600;
const HEIGHT = 800;

// Imagen sintética: barras horizontales negras sobre fondo blanco, simulando líneas de texto.
function createStripedRaw() {
  const raw = Buffer.alloc(WIDTH * HEIGHT, 255);
  for (let y = 60; y < HEIGHT - 60; y += 40) {
    for (let row = y; row < y + 10; row += 1) {
      for (let x = 60; x < WIDTH - 60; x += 1) {
        raw[row * WIDTH + x] = 0;
      }
    }
  }
  return raw;
}

async function toGrayRaw(buffer) {
  const { data, info } = await sharp(buffer)
    .grayscale()
    .raw()
    .toBuffer({ resolveWithObject: true });
  return { data, width: info.width, height: info.height };
}

describe('estimateSkewDegrees', () => {
  it('devuelve 0 para una imagen sin inclinación', async () => {
    const png = await sharp(createStripedRaw(), { raw: { width: WIDTH, height: HEIGHT, channels: 1 } })
      .png()
      .toBuffer();
    const { data, width, height } = await toGrayRaw(png);

    expect(Math.abs(estimateSkewDegrees(data, width, height))).toBeLessThan(0.5);
  });

  it('detecta una inclinación de unos 5 grados', async () => {
    const png = await sharp(createStripedRaw(), { raw: { width: WIDTH, height: HEIGHT, channels: 1 } })
      .png()
      .toBuffer();
    const tilted = await sharp(png).rotate(5, { background: '#ffffff' }).png().toBuffer();
    const { data, width, height } = await toGrayRaw(tilted);

    expect(Math.abs(estimateSkewDegrees(data, width, height))).toBeGreaterThan(3.5);
    expect(Math.abs(estimateSkewDegrees(data, width, height))).toBeLessThan(6.5);
  });
});

describe('prepareReceiptImage', () => {
  it('corrige la inclinación y devuelve un PNG de escala de grises', async () => {
    const png = await sharp(createStripedRaw(), { raw: { width: WIDTH, height: HEIGHT, channels: 1 } })
      .png()
      .toBuffer();
    const tilted = await sharp(png).rotate(5, { background: '#ffffff' }).png().toBuffer();

    const prepared = await prepareReceiptImage(tilted);
    const metadata = await sharp(prepared).metadata();
    expect(metadata.format).toBe('png');
    expect(metadata.width).toBeGreaterThanOrEqual(1800);

    const { data, width, height } = await toGrayRaw(prepared);
    expect(Math.abs(estimateSkewDegrees(data, width, height))).toBeLessThan(1);
  }, 30000);

  it('rechaza un buffer que no es una imagen', async () => {
    await expect(prepareReceiptImage(Buffer.from('no es una imagen'))).rejects.toThrow();
  });
});
