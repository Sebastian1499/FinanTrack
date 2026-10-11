import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Dashboard from '../../finantrack-landing/src/app/pages/Dashboard';

vi.mock('../../finantrack-landing/src/context/useAuth', () => ({
  useAuth: () => ({ token: 'fake-token' }),
}));

vi.mock('../../finantrack-landing/src/api/client', () => ({
  api: {
    getTransactions: vi.fn(),
    getGoals: vi.fn(),
  },
}));

import { api } from '../../finantrack-landing/src/api/client';

describe('Dashboard', () => {
  it('calcula y muestra el total y el desglose por categoría', async () => {
    api.getTransactions.mockResolvedValue({
      transactions: [
        { id: 1, amount: 40000, category: 'Alimentación', description: 'Almuerzo', date: '2026-01-01' },
        { id: 2, amount: 60000, category: 'Transporte', description: 'Taxi', date: '2026-01-02' },
      ],
    });
    api.getGoals.mockResolvedValue({ goals: [] });

    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>,
    );

    await waitFor(() => expect(screen.getByText(/\$\s?100\.000/)).toBeInTheDocument());
    expect(screen.getByText('2')).toBeInTheDocument(); // cantidad de transacciones
    expect(screen.getAllByText('Alimentación').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Transporte').length).toBeGreaterThan(0);
  });

  it('muestra un mensaje cuando no hay transacciones', async () => {
    api.getTransactions.mockResolvedValue({ transactions: [] });
    api.getGoals.mockResolvedValue({ goals: [] });

    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>,
    );

    expect(await screen.findByText('Aún no tienes gastos registrados.')).toBeInTheDocument();
  });
});
