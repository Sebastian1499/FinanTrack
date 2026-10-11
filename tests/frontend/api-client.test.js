import { api } from '../../finantrack-landing/src/api/client';

function mockFetchOnce(status, body) {
  global.fetch = vi.fn().mockResolvedValue({
    status,
    ok: status >= 200 && status < 300,
    json: () => Promise.resolve(body),
  });
}

afterEach(() => {
  vi.restoreAllMocks();
});

describe('api client', () => {
  it('login envía método POST con el body correcto y sin token', async () => {
    mockFetchOnce(200, { token: 'abc', user: { id: 1 } });
    const result = await api.login({ email: 'a@test.com', password: '123456' });

    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/auth/login'),
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ email: 'a@test.com', password: '123456' }),
      }),
    );
    const [, options] = global.fetch.mock.calls[0];
    expect(options.headers.Authorization).toBeUndefined();
    expect(result.token).toBe('abc');
  });

  it('agrega el header Authorization cuando se pasa un token', async () => {
    mockFetchOnce(200, { transactions: [] });
    await api.getTransactions('mi-token');

    const [, options] = global.fetch.mock.calls[0];
    expect(options.headers.Authorization).toBe('Bearer mi-token');
  });

  it('lanza un error con el mensaje del servidor cuando la respuesta no es ok', async () => {
    mockFetchOnce(401, { error: 'Credenciales inválidas' });
    await expect(api.login({ email: 'x@test.com', password: 'bad' })).rejects.toThrow(
      'Credenciales inválidas',
    );
  });

  it('lanza un error genérico si la respuesta no trae JSON válido', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      status: 500,
      ok: false,
      json: () => Promise.reject(new Error('no json')),
    });
    await expect(api.login({ email: 'x@test.com', password: 'bad' })).rejects.toThrow(
      'Ocurrió un error inesperado',
    );
  });

  it('scanReceipt envía FormData sin forzar Content-Type JSON', async () => {
    mockFetchOnce(200, { amount: 1000 });
    const formData = new FormData();
    await api.scanReceipt('token', formData);

    const [, options] = global.fetch.mock.calls[0];
    expect(options.headers['Content-Type']).toBeUndefined();
    expect(options.body).toBe(formData);
  });
});
