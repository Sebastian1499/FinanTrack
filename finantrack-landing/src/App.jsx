import { Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import Login from './app/pages/Login';
import Register from './app/pages/Register';
import AppLayout from './app/AppLayout';
import ProtectedRoute from './app/ProtectedRoute';
import Dashboard from './app/pages/Dashboard';
import Transactions from './app/pages/Transactions';
import ScanReceipt from './app/pages/ScanReceipt';
import Goals from './app/pages/Goals';
import Chatbot from './app/pages/Chatbot';
import './App.css';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/app"
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="transacciones" element={<Transactions />} />
        <Route path="escanear" element={<ScanReceipt />} />
        <Route path="metas" element={<Goals />} />
        <Route path="chat" element={<Chatbot />} />
      </Route>
    </Routes>
  );
}

export default App;
