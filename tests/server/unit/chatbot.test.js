const { askChatbot } = require('../../../server/src/lib/chatbot');

describe('askChatbot() - motor de reglas local (sin AI_API_KEY)', () => {
  it('calcula correctamente el ahorro mensual para una meta', async () => {
    const reply = await askChatbot('quiero ahorrar 6000000 para un viaje en 10 meses', { goals: [] });
    expect(reply).toMatch(/6\.000\.000/);
    expect(reply).toMatch(/600\.000/);
  });

  it('interpreta años y los convierte a meses', async () => {
    const reply = await askChatbot('necesito ahorrar 1200000 en 1 año', { goals: [] });
    expect(reply).toMatch(/100\.000/); // 1.200.000 / 12 meses
  });

  it('responde con info de metas cuando se preguntan "mis metas"', async () => {
    const reply = await askChatbot('cuáles son mis metas', {
      goals: [{ name: 'Carro', savedAmount: 1000000, targetAmount: 5000000 }],
    });
    expect(reply).toContain('Carro');
  });

  it('da una respuesta por defecto para mensajes sin patrón reconocido', async () => {
    const reply = await askChatbot('xyz123 sin sentido', { goals: [] });
    expect(reply.length).toBeGreaterThan(0);
  });
});
