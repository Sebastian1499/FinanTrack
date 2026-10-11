import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import Login from '../../finantrack-landing/src/app/pages/Login';
import { AuthProvider } from '../../finantrack-landing/src/context/AuthContext';

vi.mock('../../finantrack-landing/src/api/client', () => ({
  api: {
    login: vi.fn(),
    me: vi.fn(),
  },
}));

import { api } from '../../finantrack-landing/src/api/client';

function renderLogin() {
  return render(
    <AuthProvider>
      <MemoryRouter initialEntries={['/login']}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/app" element={<div>Dashboard protegido</div>} />
        </Routes>
      </MemoryRouter>
    </AuthProvider>,
  );
}

beforeEach(() => {
  localStorage.clear();
  vi.clearAllMocks();
  api.me.mockResolvedValue({ user: { name: 'Ana' } });
});

describe('Login', () => {
  it('navega a /app tras iniciar sesión correctamente', async () => {
    api.login.mockResolvedValue({ token: 'tok', user: { name: 'Ana' } });
    const user = userEvent.setup();
    renderLogin();

    await user.type(screen.getByLabelText('Email'), 'ana@test.com');
    await user.type(screen.getByLabelText('Contraseña'), 'password123');
    await user.click(screen.getByRole('button', { name: /ingresar/i }));

    await waitFor(() => expect(screen.getByText('Dashboard protegido')).toBeInTheDocument());
    expect(api.login).toHaveBeenCalledWith({ email: 'ana@test.com', password: 'password123' });
  });

  it('muestra el error del servidor si las credenciales son incorrectas', async () => {
    api.login.mockRejectedValue(new Error('Credenciales inválidas'));
    const user = userEvent.setup();
    renderLogin();

    await user.type(screen.getByLabelText('Email'), 'ana@test.com');
    await user.type(screen.getByLabelText('Contraseña'), 'mala-clave');
    await user.click(screen.getByRole('button', { name: /ingresar/i }));

    expect(await screen.findByText('Credenciales inválidas')).toBeInTheDocument();
  });
});
