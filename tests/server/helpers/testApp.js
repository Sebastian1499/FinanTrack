const request = require('supertest');
const app = require('../../../server/src/index');

let counter = 0;

// Crea un usuario único y devuelve su token + datos, listo para usar en pruebas de rutas protegidas.
async function createUserAndToken(overrides = {}) {
  counter += 1;
  const payload = {
    name: 'Usuario de Prueba',
    email: `user${Date.now()}_${counter}@test.com`,
    password: 'password123',
    ...overrides,
  };
  const res = await request(app).post('/api/auth/register').send(payload);
  return { token: res.body.token, user: res.body.user, payload, response: res };
}

module.exports = { app, request, createUserAndToken };
