const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

async function request(path, { method = 'GET', body, token, isFormData } = {}) {
  const headers = {};
  if (!isFormData) headers['Content-Type'] = 'application/json';
  if (token) headers.Authorization = `Bearer ${token}`;

  const response = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: isFormData ? body : body ? JSON.stringify(body) : undefined,
  });

  const data = response.status === 204 ? null : await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.error || 'Ocurrió un error inesperado');
  }
  return data;
}

export const api = {
  register: (payload) => request('/auth/register', { method: 'POST', body: payload }),
  login: (payload) => request('/auth/login', { method: 'POST', body: payload }),
  me: (token) => request('/auth/me', { token }),

  getTransactions: (token) => request('/transactions', { token }),
  createTransaction: (token, payload) => request('/transactions', { method: 'POST', body: payload, token }),
  deleteTransaction: (token, id) => request(`/transactions/${id}`, { method: 'DELETE', token }),
  scanReceipt: (token, formData) => request('/transactions/scan', { method: 'POST', body: formData, token, isFormData: true }),

  getGoals: (token) => request('/goals', { token }),
  createGoal: (token, payload) => request('/goals', { method: 'POST', body: payload, token }),
  updateGoal: (token, id, payload) => request(`/goals/${id}`, { method: 'PATCH', body: payload, token }),
  deleteGoal: (token, id) => request(`/goals/${id}`, { method: 'DELETE', token }),

  sendChatMessage: (token, message, history) => request('/chat', { method: 'POST', body: { message, history }, token }),
};
