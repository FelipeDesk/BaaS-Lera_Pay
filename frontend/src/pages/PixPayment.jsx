import { useState } from 'react';
import {
  useNavigate,
  useParams,
} from 'react-router-dom';

import api from '../services/api';

function PixPayment() {
  const { checkoutId } = useParams();
  const navigate = useNavigate();

  const [payerDocument, setPayerDocument] =
    useState('');

  const [payment, setPayment] =
    useState(null);

  const [error, setError] =
    useState('');

  const [loading, setLoading] =
    useState(false);

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      setLoading(true);
      setError('');

      const response = await api.post(
        `/checkout-links/${checkoutId}/pix`,
        {
          payerDocument,
        },
      );

      setPayment(response.data);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          'Erro ao processar PIX',
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h1>Pagamento PIX</h1>

      <p>
        Checkout #{checkoutId}
      </p>

      {!payment && (
        <form onSubmit={handleSubmit}>
          <div>
            <label>CPF/CNPJ do pagador</label>

            <input
              type="text"
              value={payerDocument}
              onChange={(event) =>
                setPayerDocument(
                  event.target.value,
                )
              }
              placeholder="12345678901"
              required
            />
          </div>

          {error && <p>{error}</p>}

          <button
            type="submit"
            disabled={loading}
          >
            {loading
              ? 'Gerando PIX...'
              : 'Gerar PIX'}
          </button>
        </form>
      )}

      {payment && (
        <div>
          <h2>
            Status: {payment.status}
          </h2>

          <p>
            Valor:{' '}
            {payment.amountFormatted}
          </p>

          <p>
            Referência:{' '}
            {payment.externalReference}
          </p>

          {payment.copyPaste && (
            <>
              <h3>PIX Copia e Cola</h3>

              <textarea
                value={payment.copyPaste}
                readOnly
                rows="6"
              />
            </>
          )}

          {payment.qrCodeBase64 && (
            <>
              <h3>QR Code</h3>

              <img
                src={
                  payment.qrCodeBase64.startsWith(
                    'data:',
                  )
                    ? payment.qrCodeBase64
                    : `data:image/png;base64,${payment.qrCodeBase64}`
                }
                alt="QR Code PIX"
                width="250"
              />
            </>
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

export default PixPayment;