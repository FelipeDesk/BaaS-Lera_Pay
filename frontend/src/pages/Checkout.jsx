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
    <div>
      <h1>Criar cobrança</h1>

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
            placeholder="Ex: 15000"
            required
          />
        </div>

        <div>
          <label>Descrição</label>

          <input
            type="text"
            value={description}
            onChange={(event) =>
              setDescription(event.target.value)
            }
            placeholder="Pedido #123"
            required
          />
        </div>

        <div>
          <label>Forma de pagamento</label>

          <select
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

        {error && <p>{error}</p>}

        <button
          type="submit"
          disabled={loading}
        >
          {loading
            ? 'Criando...'
            : 'Criar checkout'}
        </button>
      </form>

      <button
        onClick={() =>
          navigate('/dashboard')
        }
      >
        Voltar
      </button>
    </div>
  );
}

export default Checkout;