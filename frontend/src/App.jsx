import {
  Navigate,
  Route,
  Routes,
} from 'react-router-dom';

import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import Checkout from './pages/Checkout';
import PixPayment from './pages/PixPayment';
import CardPayment from './pages/CardPayment';
import Withdrawals from './pages/Withdrawals';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={<Navigate to="/login" />}
      />

      <Route
        path="/login"
        element={<Login />}
      />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/transactions"
        element={
          <ProtectedRoute>
            <Transactions />
          </ProtectedRoute>
        }
      />

      <Route
        path="/checkout"
        element={
          <ProtectedRoute>
            <Checkout />
          </ProtectedRoute>
        }
      />

      <Route
        path="/checkout/:checkoutId/pix"
        element={
          <ProtectedRoute>
            <PixPayment />
          </ProtectedRoute>
        }
      />

      <Route
        path="/checkout/:checkoutId/card"
        element={
          <ProtectedRoute>
            <CardPayment />
          </ProtectedRoute>
        }
      />

      <Route
        path="/withdrawals"
        element={
          <ProtectedRoute>
            <Withdrawals />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;