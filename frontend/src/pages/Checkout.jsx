import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import api from '../services/api';

function Checkout() {
  const navigate = useNavigate();

  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('PIX');

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      setLoading(true);
      setError('');

      const response = await api.post(
        '/checkout-links',
        {
          amount: Number(amount),
          description,
          paymentMethod,
        },
      );

      const checkout = response.data;

      if (paymentMethod === 'PIX') {
        navigate(`/checkout/${checkout.id}/pix`);
      }

      if (paymentMethod === 'CREDIT_CARD') {
        navigate(`/checkout/${checkout.id}/card`);
      }
    } catch (error) {
      setError(
        error.response?.data?.message ||
        'Erro ao criar checkout',
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page">
      <div className="page-header">
        <h1>Criar cobrança</h1>
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
            placeholder="Ex: 15000"
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
              setDescription(event.target.value)
            }
            placeholder="Pedido #123"
            required
          />
        </div>

        <div className="form-group">
          <label>Forma de pagamento</label>

          <select
            className="input"
            value={paymentMethod}
            onChange={(event) =>
              setPaymentMethod(event.target.value)
            }
          >
            <option value="PIX">
              PIX
            </option>

            <option value="CREDIT_CARD">
              Cartão de crédito
            </option>
          </select>
        </div>

        {error && <div className="error-message">{error}</div>}

        <button
          className="button button-primary"
          type="submit"
          disabled={loading}
        >
          {loading
            ? 'Criando...'
            : 'Criar checkout'}
        </button>
      </form>
    </div>
  );
}

export default Checkout;
