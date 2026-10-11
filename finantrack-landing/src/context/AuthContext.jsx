import { useEffect, useState } from 'react';
import { api } from '../api/client';
import { AuthContext } from './auth-context';

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('finantrack_token'));
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }
    api
      .me(token)
      .then((data) => setUser(data.user))
      .catch(() => {
        setToken(null);
        localStorage.removeItem('finantrack_token');
      })
      .finally(() => setLoading(false));
  }, [token]);

  function persistSession({ token: newToken, user: newUser }) {
    localStorage.setItem('finantrack_token', newToken);
    setToken(newToken);
    setUser(newUser);
  }

  async function login(email, password) {
    const data = await api.login({ email, password });
    persistSession(data);
  }

  async function register(name, email, password) {
    const data = await api.register({ name, email, password });
    persistSession(data);
  }

  function logout() {
    localStorage.removeItem('finantrack_token');
    setToken(null);
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ token, user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
