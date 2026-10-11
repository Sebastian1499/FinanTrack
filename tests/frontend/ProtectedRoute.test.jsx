import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import ProtectedRoute from '../../finantrack-landing/src/app/ProtectedRoute';

const mockUseAuth = vi.fn();
vi.mock('../../finantrack-landing/src/context/useAuth', () => ({
  useAuth: () => mockUseAuth(),
}));

function renderWithAuthState(authState) {
  mockUseAuth.mockReturnValue(authState);
  return render(
    <MemoryRouter initialEntries={['/app']}>
      <Routes>
        <Route path="/login" element={<div>Pantalla de login</div>} />
        <Route
          path="/app"
          element={
            <ProtectedRoute>
              <div>Contenido protegido</div>
            </ProtectedRoute>
          }
        />
      </Routes>
    </MemoryRouter>,
  );
}

describe('ProtectedRoute', () => {
  it('muestra un loader mientras se verifica la sesión', () => {
    renderWithAuthState({ loading: true, token: null });
    expect(screen.getByText('Cargando…')).toBeInTheDocument();
  });

  it('redirige a /login si no hay token', () => {
    renderWithAuthState({ loading: false, token: null });
    expect(screen.getByText('Pantalla de login')).toBeInTheDocument();
  });

  it('renderiza el contenido si hay token', () => {
    renderWithAuthState({ loading: false, token: 'abc' });
    expect(screen.getByText('Contenido protegido')).toBeInTheDocument();
  });
});
