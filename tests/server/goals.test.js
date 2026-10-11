const { app, request, createUserAndToken } = require('./helpers/testApp');

function monthsFromNow(n) {
  const d = new Date();
  d.setMonth(d.getMonth() + n);
  return d.toISOString().slice(0, 10);
}

describe('POST /api/goals', () => {
  it('crea una meta y calcula el ahorro mensual necesario', async () => {
    const { token } = await createUserAndToken();
    const res = await request(app)
      .post('/api/goals')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Viaje', targetAmount: 2000000, targetDate: monthsFromNow(6) });

    expect(res.status).toBe(201);
    expect(res.body.goal.monthsLeft).toBeGreaterThanOrEqual(5);
    expect(res.body.goal.monthlySavingNeeded).toBeCloseTo(2000000 / res.body.goal.monthsLeft, 0);
  });

  it('rechaza monto objetivo negativo con 400', async () => {
    const { token } = await createUserAndToken();
    const res = await request(app)
      .post('/api/goals')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Meta inválida', targetAmount: -500, targetDate: monthsFromNow(3) });
    expect(res.status).toBe(400);
  });
});

describe('PATCH /api/goals/:id', () => {
  it('actualiza el monto ahorrado', async () => {
    const { token } = await createUserAndToken();
    const created = await request(app)
      .post('/api/goals')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Meta', targetAmount: 1000000, targetDate: monthsFromNow(4) });

    const res = await request(app)
      .patch(`/api/goals/${created.body.goal.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ savedAmount: 250000 });

    expect(res.status).toBe(200);
    expect(res.body.goal.savedAmount).toBe(250000);
  });

  it('no permite modificar metas de otro usuario (previene IDOR)', async () => {
    const userA = await createUserAndToken();
    const userB = await createUserAndToken();

    const created = await request(app)
      .post('/api/goals')
      .set('Authorization', `Bearer ${userA.token}`)
      .send({ name: 'Meta de A', targetAmount: 500000, targetDate: monthsFromNow(2) });

    const res = await request(app)
      .patch(`/api/goals/${created.body.goal.id}`)
      .set('Authorization', `Bearer ${userB.token}`)
      .send({ savedAmount: 999999 });

    expect(res.status).toBe(404);
  });

  it('rechaza montos ahorrados negativos con 400', async () => {
    const { token } = await createUserAndToken();
    const created = await request(app)
      .post('/api/goals')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Meta', targetAmount: 1000000, targetDate: monthsFromNow(4) });

    const res = await request(app)
      .patch(`/api/goals/${created.body.goal.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ savedAmount: -1 });

    expect(res.status).toBe(400);
  });
});

describe('DELETE /api/goals/:id', () => {
  it('elimina una meta propia', async () => {
    const { token } = await createUserAndToken();
    const created = await request(app)
      .post('/api/goals')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Meta a borrar', targetAmount: 100000, targetDate: monthsFromNow(1) });

    const res = await request(app)
      .delete(`/api/goals/${created.body.goal.id}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(204);
  });
});
