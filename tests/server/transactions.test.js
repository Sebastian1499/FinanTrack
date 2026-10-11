const { app, request, createUserAndToken } = require('./helpers/testApp');

describe('POST /api/transactions', () => {
  it('crea una transacción y autodetecta la categoría', async () => {
    const { token } = await createUserAndToken();
    const res = await request(app)
      .post('/api/transactions')
      .set('Authorization', `Bearer ${token}`)
      .send({ amount: 45000, description: 'Almuerzo en restaurante' });

    expect(res.status).toBe(201);
    expect(res.body.transaction.category).toBe('Alimentación');
    expect(res.body.transaction.amount).toBe(45000);
  });

  it('respeta una categoría explícita si se envía', async () => {
    const { token } = await createUserAndToken();
    const res = await request(app)
      .post('/api/transactions')
      .set('Authorization', `Bearer ${token}`)
      .send({ amount: 10000, description: 'Algo raro', category: 'Otro' });

    expect(res.body.transaction.category).toBe('Otro');
  });

  it('rechaza montos negativos o cero con 400', async () => {
    const { token } = await createUserAndToken();
    const res = await request(app)
      .post('/api/transactions')
      .set('Authorization', `Bearer ${token}`)
      .send({ amount: -100, description: 'Gasto inválido' });

    expect(res.status).toBe(400);
  });

  it('rechaza sin descripción con 400', async () => {
    const { token } = await createUserAndToken();
    const res = await request(app)
      .post('/api/transactions')
      .set('Authorization', `Bearer ${token}`)
      .send({ amount: 100 });

    expect(res.status).toBe(400);
  });

  it('rechaza sin autenticación con 401', async () => {
    const res = await request(app).post('/api/transactions').send({ amount: 100, description: 'x' });
    expect(res.status).toBe(401);
  });
});

describe('GET /api/transactions', () => {
  it('solo devuelve las transacciones del usuario autenticado (aislamiento entre usuarios)', async () => {
    const userA = await createUserAndToken();
    const userB = await createUserAndToken();

    await request(app)
      .post('/api/transactions')
      .set('Authorization', `Bearer ${userA.token}`)
      .send({ amount: 1000, description: 'Gasto de A' });
    await request(app)
      .post('/api/transactions')
      .set('Authorization', `Bearer ${userB.token}`)
      .send({ amount: 2000, description: 'Gasto de B' });

    const resA = await request(app).get('/api/transactions').set('Authorization', `Bearer ${userA.token}`);
    expect(resA.body.transactions).toHaveLength(1);
    expect(resA.body.transactions[0].description).toBe('Gasto de A');
  });
});

describe('DELETE /api/transactions/:id', () => {
  it('elimina una transacción propia', async () => {
    const { token } = await createUserAndToken();
    const created = await request(app)
      .post('/api/transactions')
      .set('Authorization', `Bearer ${token}`)
      .send({ amount: 500, description: 'Para borrar' });

    const res = await request(app)
      .delete(`/api/transactions/${created.body.transaction.id}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(204);
  });

  it('no permite borrar transacciones de otro usuario (previene IDOR) y devuelve 404', async () => {
    const userA = await createUserAndToken();
    const userB = await createUserAndToken();

    const created = await request(app)
      .post('/api/transactions')
      .set('Authorization', `Bearer ${userA.token}`)
      .send({ amount: 500, description: 'De A' });

    const res = await request(app)
      .delete(`/api/transactions/${created.body.transaction.id}`)
      .set('Authorization', `Bearer ${userB.token}`);

    expect(res.status).toBe(404);
  });

  it('rechaza un id no numérico con 400 en vez de un error 500', async () => {
    const { token } = await createUserAndToken();
    const res = await request(app)
      .delete('/api/transactions/no-es-un-numero')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(400);
  });
});

describe('POST /api/transactions/scan', () => {
  it('rechaza si no se adjunta ninguna imagen', async () => {
    const { token } = await createUserAndToken();
    const res = await request(app)
      .post('/api/transactions/scan')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(400);
  });

  it('rechaza archivos que no sean imágenes', async () => {
    const { token } = await createUserAndToken();
    const res = await request(app)
      .post('/api/transactions/scan')
      .set('Authorization', `Bearer ${token}`)
      .attach('receipt', Buffer.from('no soy una imagen'), {
        filename: 'archivo.txt',
        contentType: 'text/plain',
      });
    expect(res.status).toBe(400);
  });
});
