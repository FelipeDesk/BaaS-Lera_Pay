import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import api from '../services/api';

function Withdrawals() {
  const navigate = useNavigate();

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
    <div>
      <h1>Solicitar saque</h1>

      <form onSubmit={handleSubmit}>
        <div>
          <label>Valor em centavos</label>

          <input
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

        <div>
          <label>Chave PIX</label>

          <input
            type="text"
            value={pixKey}
            onChange={(event) =>
              setPixKey(event.target.value)
            }
            placeholder="Chave PIX"
            required
          />
        </div>

        <div>
          <label>Documento</label>

          <input
            type="text"
            value={document}
            onChange={(event) =>
              setDocument(event.target.value)
            }
            placeholder="12345678901"
            required
          />
        </div>

        <div>
          <label>Descrição</label>

          <input
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
          <p>
            {Array.isArray(error)
              ? error.join(', ')
              : error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
        >
          {loading
            ? 'Processando saque...'
            : 'Solicitar saque'}
        </button>
      </form>

      {result && (
        <div>
          <h2>Resultado do saque</h2>

          <p>
            <strong>Status:</strong>{' '}
            {result.status}
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

      <button
        onClick={() =>
          navigate('/dashboard')
        }
      >
        Voltar ao dashboard
      </button>
    </div>
  );
}

export default Withdrawals;