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
    <div>
      <h1>Transações</h1>

      <form onSubmit={handleFilter}>
        <div>
          <label>Status</label>

          <select
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

        <div>
          <label>Tipo</label>

          <select
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

        <div>
          <label>Limite</label>

          <select
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

        <button type="submit">
          Filtrar
        </button>
      </form>

      {error && <p>{error}</p>}

      {loading ? (
        <p>Carregando...</p>
      ) : (
        <div>
          {transactions.length === 0 ? (
            <p>
              Nenhuma transação encontrada.
            </p>
          ) : (
            transactions.map(
              (transaction) => (
                <div key={transaction.id}>
                  <hr />

                  <p>
                    <strong>Tipo:</strong>{' '}
                    {transaction.type}
                  </p>

                  <p>
                    <strong>Status:</strong>{' '}
                    {transaction.status}
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