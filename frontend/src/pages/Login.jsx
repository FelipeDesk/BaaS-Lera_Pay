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
    <div>
      <h1>Login BaaS</h1>

      <form onSubmit={handleSubmit}>
        <div>
          <label>E-mail</label>

          <input
            type="email"
            value={email}
            onChange={(event) =>
              setEmail(event.target.value)
            }
          />
        </div>

        <div>
          <label>Senha</label>

          <input
            type="password"
            value={password}
            onChange={(event) =>
              setPassword(event.target.value)
            }
          />
        </div>

        {error && <p>{error}</p>}

        <button type="submit">
          Entrar
        </button>
      </form>
    </div>
  );
}

export default Login;