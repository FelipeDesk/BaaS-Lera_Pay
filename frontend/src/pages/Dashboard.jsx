import { useEffect, useState } from 'react';

import api from '../services/api';

function Dashboard() {
  const [wallet, setWallet] =
    useState(null);

  const [transactions, setTransactions] =
    useState([]);

  const [error, setError] =
    useState('');

  const user = JSON.parse(
    localStorage.getItem('user') || '{}',
  );

  useEffect(() => {
    async function loadDashboard() {
      try {
        const walletResponse =
          await api.get('/gateway/wallet');

        setWallet(walletResponse.data);

        const transactionResponse =
          await api.get(
            '/gateway/transactions?limit=5',
          );

        setTransactions(
          transactionResponse.data
            .transactions || [],
        );
      } catch (error) {
        setError(
          error.response?.data?.message ||
            'Erro ao carregar dashboard',
        );
      }
    }

    loadDashboard();
  }, []);

  return (
    <div className="page">
      <div className="page-header">
        <h1>
          Olá, {user.name || 'usuário'}
        </h1>

        <p>
          Acompanhe suas movimentações financeiras.
        </p>
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      <div className="cards-grid">
        <div className="card">
          <span className="metric-title">
            Saldo disponível
          </span>

          <div className="metric-value">
            {wallet?.balanceFormatted ||
              'R$ 0,00'}
          </div>
        </div>

        <div className="card">
          <span className="metric-title">
            Últimas transações
          </span>

          <div className="metric-value">
            {transactions.length}
          </div>
        </div>
      </div>

      <div
        className="card"
        style={{ marginTop: 24 }}
      >
        <h2>Movimentações recentes</h2>

        {transactions.length === 0 ? (
          <p>
            Nenhuma transação encontrada.
          </p>
        ) : (
          transactions.map(
            (transaction) => (
              <div
                key={transaction.id}
                style={{
                  padding: '12px 0',
                  borderBottom:
                    '1px solid #e5e7eb',
                }}
              >
                <strong>
                  {
                    transaction
                      .amountFormatted
                  }
                </strong>

                <p>
                  {transaction.type} —{' '}
                  {transaction.status}
                </p>
              </div>
            ),
          )
        )}
      </div>
    </div>
  );
}

export default Dashboard;