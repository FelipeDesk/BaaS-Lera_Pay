import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import api from '../services/api';

function CardPayment() {
  const { checkoutId } = useParams();

  const [cardNumber, setCardNumber] =
    useState('');

  const [cardHolder, setCardHolder] =
    useState('');

  const [expiryMonth, setExpiryMonth] =
    useState('');

  const [expiryYear, setExpiryYear] =
    useState('');

  const [cvv, setCvv] =
    useState('');

  const [installments, setInstallments] =
    useState(1);

  const [fees, setFees] =
    useState([]);

  const [payment, setPayment] =
    useState(null);

  const [loadingFees, setLoadingFees] =
    useState(false);

  const [loadingPayment, setLoadingPayment] =
    useState(false);

  const [error, setError] =
    useState('');

  useEffect(() => {
    async function loadFees() {
      try {
        setLoadingFees(true);
        setError('');

        const response =
          await api.get(
            '/gateway/fees?brand=VISA',
          );

        setFees(
          response.data.fees || [],
        );
      } catch (error) {
        setError(
          error.response?.data?.message ||
          'Erro ao carregar taxas',
        );
      } finally {
        setLoadingFees(false);
      }
    }

    loadFees();
  }, []);

  const selectedFee =
    fees.find(
      (fee) =>
        Number(fee.installments) ===
        Number(installments),
    );

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      setLoadingPayment(true);
      setError('');

      const response =
        await api.post(
          `/checkout-links/${checkoutId}/card`,
          {
            cardNumber,
            cardHolder,
            expiryMonth,
            expiryYear,
            cvv,
            installments:
              Number(installments),
          },
        );

      setPayment(response.data);
    } catch (error) {
      setError(
        error.response?.data?.message ||
        'Erro ao processar pagamento',
      );
    } finally {
      setLoadingPayment(false);
    }
  }

  return (
    <div className="page">
      <div className="page-header">
        <h1>Pagamento com cartão</h1>

        <p>
          Checkout #{checkoutId}
        </p>
      </div>

      {!payment && (
        <form className="card form-card" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>
              Número do cartão
            </label>

            <input
              className="input"
              type="text"
              value={cardNumber}
              onChange={(event) =>
                setCardNumber(
                  event.target.value,
                )
              }
              placeholder="4111111111111111"
              required
            />
          </div>

          <div className="form-group">
            <label>
              Nome no cartão
            </label>

            <input
              className="input"
              type="text"
              value={cardHolder}
              onChange={(event) =>
                setCardHolder(
                  event.target.value,
                )
              }
              placeholder="MARIA SILVA"
              required
            />
          </div>

          <div className="form-group">
            <label>Mês</label>

            <input
              className="input"
              type="text"
              value={expiryMonth}
              onChange={(event) =>
                setExpiryMonth(
                  event.target.value,
                )
              }
              placeholder="12"
              maxLength="2"
              required
            />
          </div>

          <div className="form-group">
            <label>Ano</label>

            <input
              className="input"
              type="text"
              value={expiryYear}
              onChange={(event) =>
                setExpiryYear(
                  event.target.value,
                )
              }
              placeholder="2030"
              maxLength="4"
              required
            />
          </div>

          <div className="form-group">
            <label>CVV</label>

            <input
              className="input"
              type="password"
              value={cvv}
              onChange={(event) =>
                setCvv(event.target.value)
              }
              placeholder="123"
              maxLength="4"
              required
            />
          </div>

          <div className="form-group">
            <label>Parcelas</label>

            {loadingFees ? (
              <p>
                Carregando parcelas...
              </p>
            ) : (
              <select
                className="input"
                value={installments}
                onChange={(event) =>
                  setInstallments(
                    Number(
                      event.target.value,
                    ),
                  )
                }
              >
                {fees.map((fee) => (
                  <option
                    key={fee.installments}
                    value={
                      fee.installments
                    }
                  >
                    {fee.installments}x -{' '}
                    {fee.feePercent}%
                  </option>
                ))}
              </select>
            )}
          </div>

          {selectedFee && (
            <p>
              Taxa aplicada:{' '}
              <strong>
                {selectedFee.feePercent}%
              </strong>
            </p>
          )}

          {error && <div className="error-message">{error}</div>}

          <button
            className="button button-primary"
            type="submit"
            disabled={
              loadingPayment ||
              loadingFees
            }
          >
            {loadingPayment
              ? 'Processando...'
              : 'Pagar'}
          </button>
        </form>
      )}

      {payment && (
        <div className="card form-card">
          <h2>
            Status:{' '}
            <span
              className={`status status-${payment.status === 'APPROVED'
                ? 'approved'
                : payment.status === 'PENDING'
                  ? 'pending'
                  : 'denied'
                }`}
            >
              {payment.status}
            </span>
          </h2>

          <p>
            Valor:{' '}
            {payment.amountFormatted}
          </p>

          <p>
            Referência:{' '}
            {
              payment.externalReference
            }
          </p>

          {payment.metadata && (
            <>
              <p>
                Bandeira:{' '}
                {
                  payment.metadata
                    .cardBrand
                }
              </p>

              <p>
                Final:{' '}
                {
                  payment.metadata
                    .cardLast4
                }
              </p>

              <p>
                Parcelas:{' '}
                {
                  payment.metadata
                    .installments
                }x
              </p>

              <p>
                Taxa:{' '}
                {
                  payment.metadata
                    .feePercent
                }%
              </p>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default CardPayment;
