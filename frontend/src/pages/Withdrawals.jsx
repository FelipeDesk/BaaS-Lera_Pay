import { useState } from 'react';

import api from '../services/api';

function Withdrawals() {

  const [amount, setAmount] = useState('');
  const [pixKey, setPixKey] = useState('');
  const [description, setDescription] = useState('');
  const [document, setDocument] = useState('');

  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      setLoading(true);
      setError('');
      setResult(null);

      const response = await api.post(
        '/withdrawals',
        {
          amount: Number(amount),
          pixKey,
          description,
          document,
        },
      );

      setResult(response.data);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          'Erro ao solicitar saque',
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page">
      <div className="page-header">
      <h1>Solicitar saque</h1>
      </div>

      <form className="card form-card" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Valor em centavos</label>

          <input
            className="input"
            type="number"
            min="1"
            value={amount}
            onChange={(event) =>
              setAmount(event.target.value)
            }
            placeholder="Ex: 5000"
            required
          />
        </div>

        <div className="form-group">
          <label>Chave PIX</label>

          <input
            className="input"
            type="text"
            value={pixKey}
            onChange={(event) =>
              setPixKey(event.target.value)
            }
            placeholder="Chave PIX"
            required
          />
        </div>

        <div className="form-group">
          <label>Documento</label>

          <input
            className="input"
            type="text"
            value={document}
            onChange={(event) =>
              setDocument(event.target.value)
            }
            placeholder="12345678901"
            required
          />
        </div>

        <div className="form-group">
          <label>Descrição</label>

          <input
            className="input"
            type="text"
            value={description}
            onChange={(event) =>
              setDescription(
                event.target.value,
              )
            }
            placeholder="Saque para conta pessoal"
            required
          />
        </div>

        {error && (
          <div className="error-message">
            {Array.isArray(error)
              ? error.join(', ')
              : error}
          </div>
        )}

        <button
          className="button button-primary"
          type="submit"
          disabled={loading}
        >
          {loading
            ? 'Processando saque...'
            : 'Solicitar saque'}
        </button>
      </form>

      {result && (
        <div className="card form-card">
          <h2>Resultado do saque</h2>

          <p>
            <strong>Status:</strong>{' '}
            <span
              className={`status status-${
                result.status === 'APPROVED'
                  ? 'approved'
                  : result.status === 'PENDING'
                    ? 'pending'
                    : 'denied'
              }`}
            >
              {result.status}
            </span>
          </p>

          <p>
            <strong>Valor:</strong>{' '}
            {result.amountFormatted}
          </p>

          <p>
            <strong>Descrição:</strong>{' '}
            {result.description}
          </p>

          <p>
            <strong>Referência:</strong>{' '}
            {result.externalReference}
          </p>

          {result.denialReason && (
            <p>
              <strong>
                Motivo da recusa:
              </strong>{' '}
              {result.denialReason}
            </p>
          )}

          {result.walletBalanceFormatted && (
            <p>
              <strong>
                Saldo após operação:
              </strong>{' '}
              {
                result.walletBalanceFormatted
              }
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export default Withdrawals;
