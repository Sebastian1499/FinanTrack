const { app, request, createUserAndToken } = require('./helpers/testApp');

describe('Cabeceras de seguridad (helmet)', () => {
  it('incluye cabeceras de seguridad estándar en las respuestas', async () => {
    const res = await request(app).get('/api/health');
    expect(res.headers['x-content-type-options']).toBe('nosniff');
    expect(res.headers['x-powered-by']).toBeUndefined();
  });
});

describe('CORS', () => {
  it('permite el origen configurado', async () => {
    const res = await request(app).get('/api/health').set('Origin', 'http://localhost:5173');
    expect(res.headers['access-control-allow-origin']).toBe('http://localhost:5173');
  });

  it('bloquea un origen no permitido', async () => {
    const res = await request(app).get('/api/health').set('Origin', 'http://sitio-malicioso.com');
    expect(res.headers['access-control-allow-origin']).toBeUndefined();
  });
});

describe('Validación de entradas', () => {
  it('no permite registrar campos extra inesperados más allá del esquema', async () => {
    const { token } = await createUserAndToken();
    // Un intento de "mass assignment": no debe poder forzar su propio id o el de otro recurso.
    const res = await request(app)
      .post('/api/transactions')
      .set('Authorization', `Bearer ${token}`)
      .send({ amount: 1000, description: 'Prueba', userId: 999999, id: 1 });

    expect(res.status).toBe(201);
    expect(res.body.transaction.userId).not.toBe(999999);
  });
});

describe('Rate limiting en autenticación', () => {
  // Va al final: agota el límite de intentos en /api/auth para el resto del archivo.
  it('bloquea después de demasiados intentos de login fallidos (anti fuerza bruta)', async () => {
    const attempts = Array.from({ length: 21 }, () =>
      request(app).post('/api/auth/login').send({ email: 'nadie@test.com', password: 'incorrecta' }),
    );
    const results = await Promise.all(attempts);
    const blocked = results.filter((r) => r.status === 429);
    expect(blocked.length).toBeGreaterThan(0);
  });
});
