import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AuthProvider } from '../../finantrack-landing/src/context/AuthContext';
import { useAuth } from '../../finantrack-landing/src/context/useAuth';

vi.mock('../../finantrack-landing/src/api/client', () => ({
  api: {
    me: vi.fn(),
    login: vi.fn(),
    register: vi.fn(),
  },
}));

import { api } from '../../finantrack-landing/src/api/client';

function Consumer() {
  const { token, user, loading, login, logout } = useAuth();
  if (loading) return <span>cargando</span>;
  return (
    <div>
      <span data-testid="token">{token || 'sin-token'}</span>
      <span data-testid="user">{user?.name || 'sin-usuario'}</span>
      <button onClick={() => login('a@test.com', '123456')}>login</button>
      <button onClick={logout}>logout</button>
    </div>
  );
}

beforeEach(() => {
  localStorage.clear();
  vi.clearAllMocks();
  // Por defecto, cualquier token "válido" (de los tests que llaman login) resuelve con éxito.
  api.me.mockResolvedValue({ user: { name: 'Ana' } });
});

afterEach(() => {
  localStorage.clear();
});

describe('AuthProvider / useAuth', () => {
  it('arranca sin sesión cuando no hay token guardado', async () => {
    render(
      <AuthProvider>
        <Consumer />
      </AuthProvider>,
    );
    await waitFor(() => expect(screen.getByTestId('token')).toHaveTextContent('sin-token'));
  });

  it('inicia sesión y persiste el token en localStorage', async () => {
    api.login.mockResolvedValue({ token: 'nuevo-token', user: { name: 'Ana' } });
    const user = userEvent.setup();

    render(
      <AuthProvider>
        <Consumer />
      </AuthProvider>,
    );
    await waitFor(() => expect(screen.getByTestId('token')).toHaveTextContent('sin-token'));

    await act(() => user.click(screen.getByText('login')));

    await waitFor(() => expect(screen.getByTestId('token')).toHaveTextContent('nuevo-token'));
    expect(screen.getByTestId('user')).toHaveTextContent('Ana');
    expect(localStorage.getItem('finantrack_token')).toBe('nuevo-token');
  });

  it('cierra sesión y limpia localStorage', async () => {
    api.login.mockResolvedValue({ token: 'nuevo-token', user: { name: 'Ana' } });
    const user = userEvent.setup();

    render(
      <AuthProvider>
        <Consumer />
      </AuthProvider>,
    );
    await act(() => user.click(screen.getByText('login')));
    await waitFor(() => expect(screen.getByTestId('token')).toHaveTextContent('nuevo-token'));

    await act(() => user.click(screen.getByText('logout')));

    expect(screen.getByTestId('token')).toHaveTextContent('sin-token');
    expect(localStorage.getItem('finantrack_token')).toBeNull();
  });

  it('si el token guardado es inválido (api.me falla), cierra la sesión automáticamente', async () => {
    localStorage.setItem('finantrack_token', 'token-viejo-invalido');
    api.me.mockRejectedValue(new Error('401'));

    render(
      <AuthProvider>
        <Consumer />
      </AuthProvider>,
    );

    await waitFor(() => expect(screen.getByTestId('token')).toHaveTextContent('sin-token'));
    expect(localStorage.getItem('finantrack_token')).toBeNull();
  });
});
