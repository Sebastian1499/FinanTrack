const { app, request, createUserAndToken } = require('./helpers/testApp');

describe('POST /api/auth/register', () => {
  it('crea un usuario y devuelve token + datos públicos (sin password)', async () => {
    const res = await request(app).post('/api/auth/register').send({
      name: 'Ana Pruebas',
      email: 'ana@test.com',
      password: 'password123',
    });

    expect(res.status).toBe(201);
    expect(res.body.token).toEqual(expect.any(String));
    expect(res.body.user).toMatchObject({ name: 'Ana Pruebas', email: 'ana@test.com' });
    expect(res.body.user.password).toBeUndefined();
  });

  it('rechaza emails duplicados con 409', async () => {
    await request(app).post('/api/auth/register').send({
      name: 'Ana',
      email: 'dup@test.com',
      password: 'password123',
    });

    const res = await request(app).post('/api/auth/register').send({
      name: 'Otra Ana',
      email: 'dup@test.com',
      password: 'password123',
    });

    expect(res.status).toBe(409);
  });

  it('rechaza contraseñas cortas con 400', async () => {
    const res = await request(app).post('/api/auth/register').send({
      name: 'Ana',
      email: 'corta@test.com',
      password: '123',
    });
    expect(res.status).toBe(400);
  });

  it('rechaza emails con formato inválido (incluye intentos de inyección) con 400', async () => {
    const res = await request(app).post('/api/auth/register').send({
      name: 'Ana',
      email: "not-an-email' OR 1=1 --",
      password: 'password123',
    });
    expect(res.status).toBe(400);
  });

  it('no guarda la contraseña en texto plano', async () => {
    const { user } = await createUserAndToken({ password: 'password123' });
    const prisma = require('../../server/src/lib/prisma');
    const stored = await prisma.user.findUnique({ where: { id: user.id } });
    expect(stored.password).not.toBe('password123');
    expect(stored.password.length).toBeGreaterThan(20);
  });
});

describe('POST /api/auth/login', () => {
  it('inicia sesión con credenciales correctas', async () => {
    const { payload } = await createUserAndToken({ email: 'login@test.com', password: 'password123' });

    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: payload.email, password: payload.password });

    expect(res.status).toBe(200);
    expect(res.body.token).toEqual(expect.any(String));
  });

  it('rechaza contraseña incorrecta con 401', async () => {
    const { payload } = await createUserAndToken({ email: 'wrongpass@test.com' });

    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: payload.email, password: 'contraseña-incorrecta' });

    expect(res.status).toBe(401);
  });

  it('rechaza email inexistente con 401', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'no-existe@test.com', password: 'password123' });

    expect(res.status).toBe(401);
  });
});

describe('GET /api/auth/me', () => {
  it('devuelve el usuario con un token válido', async () => {
    const { token, user } = await createUserAndToken();
    const res = await request(app).get('/api/auth/me').set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.user.email).toBe(user.email);
  });

  it('rechaza sin token con 401', async () => {
    const res = await request(app).get('/api/auth/me');
    expect(res.status).toBe(401);
  });

  it('rechaza con token inválido con 401', async () => {
    const res = await request(app).get('/api/auth/me').set('Authorization', 'Bearer token-invalido');
    expect(res.status).toBe(401);
  });
});
