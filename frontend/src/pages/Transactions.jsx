import { useEffect, useState } from 'react';
import api from '../services/api';

function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [status, setStatus] = useState('');
  const [type, setType] = useState('');
  const [limit, setLimit] = useState(10);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function loadTransactions() {
    try {
      setLoading(true);
      setError('');

      const params = {};

      if (status) {
        params.status = status;
      }

      if (type) {
        params.type = type;
      }

      if (limit) {
        params.limit = limit;
      }

      const response = await api.get(
        '/gateway/transactions',
        {
          params,
        },
      );

      setTransactions(
        response.data.transactions || [],
      );
    } catch (error) {
      setError(
        error.response?.data?.message ||
          'Erro ao carregar transações',
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadTransactions();
  }, []);

  function handleFilter(event) {
    event.preventDefault();

    loadTransactions();
  }

  return (
    <div className="page">
      <div className="page-header">
      <h1>Transações</h1>
      </div>

      <form className="card form-card" onSubmit={handleFilter}>
        <div className="form-group">
          <label>Status</label>

          <select
            className="input"
            value={status}
            onChange={(event) =>
              setStatus(event.target.value)
            }
          >
            <option value="">
              Todos
            </option>

            <option value="APPROVED">
              Aprovado
            </option>

            <option value="DENIED">
              Negado
            </option>

            <option value="PENDING">
              Pendente
            </option>

            <option value="EXPIRED">
              Expirado
            </option>

            <option value="CANCELLED">
              Cancelado
            </option>
          </select>
        </div>

        <div className="form-group">
          <label>Tipo</label>

          <select
            className="input"
            value={type}
            onChange={(event) =>
              setType(event.target.value)
            }
          >
            <option value="">
              Todos
            </option>

            <option value="PIX">
              PIX
            </option>

            <option value="CREDIT_CARD">
              Cartão
            </option>

            <option value="WITHDRAWAL">
              Saque
            </option>
          </select>
        </div>

        <div className="form-group">
          <label>Limite</label>

          <select
            className="input"
            value={limit}
            onChange={(event) =>
              setLimit(event.target.value)
            }
          >
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="50">50</option>
          </select>
        </div>

        <button className="button button-primary" type="submit">
          Filtrar
        </button>
      </form>

      {error && <div className="error-message">{error}</div>}

      {loading ? (
        <p>Carregando...</p>
      ) : (
        <div className="cards-grid">
          {transactions.length === 0 ? (
            <div className="card">
              Nenhuma transação encontrada.
            </div>
          ) : (
            transactions.map(
              (transaction) => (
                <div className="card" key={transaction.id}>

                  <p>
                    <strong>Tipo:</strong>{' '}
                    {transaction.type}
                  </p>

                  <p>
                    <strong>Status:</strong>{' '}
                    <span
                      className={`status status-${
                        transaction.status === 'APPROVED'
                          ? 'approved'
                          : transaction.status === 'PENDING'
                            ? 'pending'
                            : 'denied'
                      }`}
                    >
                      {transaction.status}
                    </span>
                  </p>

                  <p>
                    <strong>Valor:</strong>{' '}
                    {transaction.amountFormatted}
                  </p>

                  <p>
                    <strong>Descrição:</strong>{' '}
                    {transaction.description}
                  </p>

                  <p>
                    <strong>
                      Referência:
                    </strong>{' '}
                    {
                      transaction.externalReference
                    }
                  </p>
                </div>
              ),
            )
          )}
        </div>
      )}
    </div>
  );
}

export default Transactions;
