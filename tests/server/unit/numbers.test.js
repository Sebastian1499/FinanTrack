const { parseAmountToken, extractAmounts } = require('../../../server/src/lib/numbers');

describe('parseAmountToken()', () => {
  it('interpreta números simples sin separadores', () => {
    expect(parseAmountToken('6000000')).toBe(6000000);
  });

  it('interpreta "." como separador de miles (formato COP)', () => {
    expect(parseAmountToken('45.000')).toBe(45000);
  });

  it('interpreta 2 dígitos finales como decimales', () => {
    expect(parseAmountToken('3.000,50')).toBeCloseTo(3000.5);
  });

  it('interpreta comas como separador de miles cuando el último grupo tiene 3 dígitos', () => {
    expect(parseAmountToken('1,234,567')).toBe(1234567);
  });
});

describe('extractAmounts()', () => {
  it('no fragmenta números largos sin separadores (regresión del bug original)', () => {
    const amounts = extractAmounts('quiero ahorrar 6000000 para un viaje en 10 meses');
    expect(amounts).toContain(6000000);
    expect(Math.max(...amounts)).toBe(6000000);
  });

  it('extrae todos los montos de un texto con varios números', () => {
    const amounts = extractAmounts('Total: 45.000 Subtotal: 40.000 Propina: 5.000');
    expect(amounts).toEqual(expect.arrayContaining([45000, 40000, 5000]));
  });
});
