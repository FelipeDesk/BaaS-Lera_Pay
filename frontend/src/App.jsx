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
import Webhooks from './pages/Webhooks';

import ProtectedRoute from './components/ProtectedRoute';
import AppLayout from './components/AppLayout';

function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <Navigate
            to="/dashboard"
            replace
          />
        }
      />

      <Route
        path="/login"
        element={<Login />}
      />

      <Route
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route
          path="/dashboard"
          element={<Dashboard />}
        />

        <Route
          path="/transactions"
          element={<Transactions />}
        />

        <Route
          path="/checkout"
          element={<Checkout />}
        />

        <Route
          path="/checkout/:checkoutId/pix"
          element={<PixPayment />}
        />

        <Route
          path="/checkout/:checkoutId/card"
          element={<CardPayment />}
        />

        <Route
          path="/withdrawals"
          element={<Withdrawals />}
        />

        <Route
          path="/webhooks"
          element={<Webhooks />}
        />
      </Route>
    </Routes>
  );
}

export default App;