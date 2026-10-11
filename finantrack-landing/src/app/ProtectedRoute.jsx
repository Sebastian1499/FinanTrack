import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';

export default function ProtectedRoute({ children }) {
  const { token, loading } = useAuth();

  if (loading) return <div className="app-loading">Cargando…</div>;
  if (!token) return <Navigate to="/login" replace />;
  return children;
}
