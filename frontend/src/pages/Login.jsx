import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import api from '../services/api';

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      setError('');

      const response = await api.post('/auth/login', {
        email,
        password,
      });

      localStorage.setItem(
        'accessToken',
        response.data.accessToken,
      );

      localStorage.setItem(
        'user',
        JSON.stringify(response.data.user),
      );

      navigate('/dashboard');
    } catch (error) {
      setError(
        error.response?.data?.message ||
          'Erro ao realizar login',
      );
    }
  }

  return (
    <div className="login-page">
      <div className="card form-card login-card">
        <div className="login-brand">
          <span className="logo-symbol">B</span>

          <div>
            <strong>BaaS Lera Pay</strong>
            <span>Banking as a Service</span>
          </div>
        </div>

        <div className="page-header">
          <h1>Acesse sua conta</h1>
          <p>Entre com suas credenciais para continuar.</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>E-mail</label>

            <input
              className="input"
              type="email"
              value={email}
              onChange={(event) =>
                setEmail(event.target.value)
              }
            />
          </div>

          <div className="form-group">
            <label>Senha</label>

            <input
              className="input"
              type="password"
              value={password}
              onChange={(event) =>
                setPassword(event.target.value)
              }
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button
            className="button button-primary login-button"
            type="submit"
          >
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
