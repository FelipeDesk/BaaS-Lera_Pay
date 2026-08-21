import { useState } from 'react';

import api from '../services/api';

function Webhooks() {

  const [event, setEvent] = useState('PAYMENT_PIX');
  const [url, setUrl] = useState('');

  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      setLoading(true);
      setError('');
      setResult(null);

      const response = await api.post(
        '/gateway/webhooks',
        {
          event,
          url,
        },
      );

      setResult(response.data);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          'Erro ao cadastrar webhook',
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page">
      <div className="page-header">
      <h1>Configurar Webhook</h1>
      </div>

      <form className="card form-card" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Evento</label>

          <select
            className="input"
            value={event}
            onChange={(e) =>
              setEvent(e.target.value)
            }
          >
            <option value="PAYMENT_PIX">
              PAYMENT_PIX
            </option>

            <option value="PAYMENT_CARD">
              PAYMENT_CARD
            </option>

            <option value="WITHDRAWAL">
              WITHDRAWAL
            </option>
          </select>
        </div>

        <div className="form-group">
          <label>URL</label>

          <input
            className="input"
            type="url"
            value={url}
            onChange={(e) =>
              setUrl(e.target.value)
            }
            placeholder="https://baas-lerapay-production.up.railway.app/webhooks/lera-box/pix"
            required
          />
        </div>

        {error && <div className="error-message">{error}</div>}

        <button
          className="button button-primary"
          type="submit"
          disabled={loading}
        >
          {loading
            ? 'Cadastrando...'
            : 'Cadastrar webhook'}
        </button>
      </form>

      {result && (
        <div className="card form-card">
          <h2>Webhook cadastrado</h2>

          <p>
            <strong>Evento:</strong>{' '}
            {result.event}
          </p>

          <p>
            <strong>URL:</strong>{' '}
            {result.url}
          </p>

          <p>
            <strong>Ativo:</strong>{' '}
            <span
              className={`status status-${
                result.active ? 'approved' : 'denied'
              }`}
            >
              {result.active ? 'Sim' : 'Não'}
            </span>
          </p>

          <p>
            <strong>Secret configurado:</strong>{' '}
            {result.hasSecret
              ? 'Sim'
              : 'Não'}
          </p>
        </div>
      )}
    </div>
  );
}

export default Webhooks;
