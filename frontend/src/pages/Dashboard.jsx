import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

function Dashboard() {
  const navigate = useNavigate();

  const [wallet, setWallet] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadWallet() {
      try {
        const response =
          await api.get('/gateway/wallet');

        setWallet(response.data);
      } catch (error) {
        setError(
          error.response?.data?.message ||
            'Erro ao carregar carteira',
        );
      }
    }

    loadWallet();
  }, []);

  function handleLogout() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');

    navigate('/login');
  }

  return (
    <div>
      <h1>Dashboard</h1>

      {error && <p>{error}</p>}

      {wallet ? (
        <div>
          <h2>Saldo disponível</h2>

          <strong>
            {wallet.balanceFormatted}
          </strong>
        </div>
      ) : (
        <p>Carregando saldo...</p>
      )}

      <button onClick={() => navigate('/transactions')}>
        Ver transações
      </button>

      <button onClick={() => navigate('/checkout')}>
        Criar cobrança
      </button>

      <button onClick={() => navigate('/withdrawals')}>
        Solicitar saque
        </button>

      <button onClick={handleLogout}>
        Sair
      </button>

    </div>
  );
}

export default Dashboard;