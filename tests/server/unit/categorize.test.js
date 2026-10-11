const { categorize } = require('../../../server/src/lib/categorize');

describe('categorize()', () => {
  it.each([
    ['Almuerzo en restaurante', 'Alimentación'],
    ['Viaje en Uber al trabajo', 'Transporte'],
    ['Suscripción de Netflix', 'Entretenimiento'],
    ['Factura de internet', 'Servicios'],
    ['Compra en la farmacia', 'Salud'],
    ['Matrícula universidad', 'Educación'],
    ['Compra de ropa en el centro comercial', 'Compras'],
  ])('clasifica "%s" como %s', (description, expected) => {
    expect(categorize(description)).toBe(expected);
  });

  it('devuelve "Otro" cuando no reconoce ninguna palabra clave', () => {
    expect(categorize('xyz sin ninguna pista')).toBe('Otro');
  });

  it('no distingue mayúsculas/minúsculas', () => {
    expect(categorize('RESTAURANTE El Buen Sabor')).toBe('Alimentación');
  });
});
