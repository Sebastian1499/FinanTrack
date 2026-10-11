const { app, request, createUserAndToken } = require('./helpers/testApp');

describe('POST /api/chat', () => {
  it('calcula el ahorro mensual para una meta expresada en texto libre', async () => {
    const { token } = await createUserAndToken();
    const res = await request(app)
      .post('/api/chat')
      .set('Authorization', `Bearer ${token}`)
      .send({ message: 'quiero ahorrar 6000000 para un viaje en 10 meses' });

    expect(res.status).toBe(200);
    expect(res.body.reply).toMatch(/600\.000/);
    expect(res.body.reply).toMatch(/6\.000\.000/);
  });

  it('responde a un saludo con un mensaje de bienvenida', async () => {
    const { token } = await createUserAndToken();
    const res = await request(app)
      .post('/api/chat')
      .set('Authorization', `Bearer ${token}`)
      .send({ message: 'hola' });

    expect(res.status).toBe(200);
    expect(res.body.reply.length).toBeGreaterThan(0);
  });

  it('rechaza mensajes vacíos con 400', async () => {
    const { token } = await createUserAndToken();
    const res = await request(app)
      .post('/api/chat')
      .set('Authorization', `Bearer ${token}`)
      .send({ message: '' });
    expect(res.status).toBe(400);
  });

  it('rechaza sin autenticación con 401', async () => {
    const res = await request(app).post('/api/chat').send({ message: 'hola' });
    expect(res.status).toBe(401);
  });
});
