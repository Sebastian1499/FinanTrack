const { parseReceipt, parseMoney, fixDigitLookalikes } = require('../../../server/src/lib/receiptParser');

function box(top, height) {
  return { x0: 10, y0: top, x1: 300, y1: top + height };
}

describe('parseMoney', () => {
  it('interpreta separadores de miles y decimales', () => {
    expect(parseMoney('45.000')).toBe(45000);
    expect(parseMoney('3.000,50')).toBe(3000.5);
    expect(parseMoney('1,234.56')).toBe(1234.56);
    expect(parseMoney('12.50')).toBe(12.5);
    expect(parseMoney('12,5')).toBe(12.5);
  });
});

describe('fixDigitLookalikes', () => {
  it('corrige letras O y l que el OCR confunde con cero y uno dentro de números', () => {
    expect(fixDigitLookalikes('TOTAL 4O.OOO')).toBe('TOTAL 40.000');
    expect(fixDigitLookalikes('TOTAL l2.5OO')).toBe('TOTAL 12.500');
    expect(fixDigitLookalikes('OTRO TEXTO')).toBe('OTRO TEXTO');
  });
});

describe('parseReceipt', () => {
  it('toma el total con palabra clave, ignora subtotal, impuestos y cambio, y resalta el comercio', () => {
    const result = parseReceipt({
      confidence: 88,
      lines: [
        { text: 'CAFE LOS ANDES', confidence: 90, bbox: box(20, 40) },
        { text: 'NIT 900.123.456-7', confidence: 90, bbox: box(70, 15) },
        { text: 'Fecha 12/11/2026 10:45', confidence: 90, bbox: box(90, 12) },
        { text: 'Capuchino 1 8.500', confidence: 90, bbox: box(110, 12) },
        { text: 'SUBTOTAL 15.500', confidence: 90, bbox: box(130, 12) },
        { text: 'IVA 19% 2.945', confidence: 90, bbox: box(150, 12) },
        { text: 'TOTAL A PAGAR 18.445', confidence: 90, bbox: box(170, 14) },
        { text: 'Efectivo 20.000', confidence: 90, bbox: box(190, 12) },
        { text: 'Cambio 1.555', confidence: 90, bbox: box(210, 12) },
      ],
      text: '',
    });

    expect(result.amount).toBe(18445);
    expect(result.detected.total).toBe(18445);
    expect(result.detected.totalSource).toBe('keyword');
    expect(result.detected.merchant).toBe('Cafe Los Andes');
    expect(result.description).toBe('Cafe Los Andes');
    expect(result.needsReview).toBe(false);
    expect(result.warnings).toEqual([]);
  });

  it('ignora NIT, teléfonos y códigos, y toma el monto de la línea siguiente al rótulo TOTAL', () => {
    const result = parseReceipt({
      confidence: 85,
      text: 'SUPERMERCADO EL SOL\nTel 3001234567\nCod 884512\nFactura 00012345\nTotal\n$ 23.500\nGracias',
    });

    expect(result.amount).toBe(23500);
    expect(result.detected.totalKeyword).toBe('TOTAL');
    expect(result.detected.merchant).toBe('Supermercado El Sol');
  });

  it('usa el valor de un TOTAL A PAGAR corregido por OCR (4O.OOO)', () => {
    const result = parseReceipt({ confidence: 90, text: 'TIENDA ABC\nTOTAL A PAGAR 4O.OOO' });
    expect(result.amount).toBe(40000);
  });

  it('marca para revisión y avisa cuando no hay palabra TOTAL', () => {
    const result = parseReceipt({
      confidence: 90,
      text: 'TIENDA ABC\n12/05/2026\nArroz 4.500\nLeche 3.200\nPan 2.800',
    });

    expect(result.amount).toBe(4500);
    expect(result.detected.totalSource).toBe('largest');
    expect(result.needsReview).toBe(true);
    expect(result.warnings.length).toBeGreaterThan(0);
  });

  it('marca para revisión cuando la confianza del OCR es baja', () => {
    const result = parseReceipt({ confidence: 20, text: 'TIENDA ABC\nTOTAL 12.000' });

    expect(result.amount).toBe(12000);
    expect(result.needsReview).toBe(true);
    expect(result.warnings.some((warning) => warning.includes('baja confianza'))).toBe(true);
  });

  it('elige como comercio el texto más grande de la parte superior', () => {
    const result = parseReceipt({
      confidence: 90,
      lines: [
        { text: 'Pan 3.000', confidence: 90, bbox: box(0, 12) },
        { text: 'MERCADO CENTRAL', confidence: 90, bbox: box(40, 50) },
        { text: 'ALMACEN LUNA', confidence: 90, bbox: box(100, 45) },
        { text: 'TOTAL A PAGAR 3.000', confidence: 90, bbox: box(200, 12) },
      ],
      text: '',
    });

    expect(result.detected.merchant).toBe('Mercado Central');
    expect(result.amount).toBe(3000);
  });

  it('no supera el valor de un total con palabra clave aunque haya cifras mayores de otras líneas', () => {
    const result = parseReceipt({
      confidence: 90,
      text: 'TIENDA ABC\nTOTAL 45.000\nSUBTOTAL 99.000',
    });
    expect(result.amount).toBe(45000);
  });

  it('devuelve monto nulo y revisión obligatoria cuando el recibo no tiene cifras', () => {
    const result = parseReceipt({ confidence: 90, text: 'GRACIAS POR SU COMPRA' });

    expect(result.amount).toBeNull();
    expect(result.needsReview).toBe(true);
    expect(result.warnings.length).toBeGreaterThan(0);
  });
});
