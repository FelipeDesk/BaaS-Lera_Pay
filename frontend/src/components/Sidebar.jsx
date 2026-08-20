import {
  NavLink,
  useNavigate,
} from 'react-router-dom';

function Sidebar() {
  const navigate = useNavigate();

  const user = JSON.parse(
    localStorage.getItem('user') || '{}',
  );

  function handleLogout() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');

    navigate('/login');
  }

  return (
    <aside className="sidebar">
      <div>
        <div className="sidebar-logo">
          <span className="logo-symbol">B</span>

          <div>
            <strong>Lera Pay</strong>
            <small>BaaS Platform</small>
          </div>
        </div>

        <nav className="sidebar-nav">
          <NavLink to="/dashboard">
            Dashboard
          </NavLink>

          <NavLink to="/checkout">
            Nova cobrança
          </NavLink>

          <NavLink to="/transactions">
            Transações
          </NavLink>

          <NavLink to="/withdrawals">
            Saques
          </NavLink>

          <NavLink to="/webhooks">
            Webhooks
          </NavLink>
        </nav>
      </div>

      <div className="sidebar-footer">
        <div className="sidebar-user">
          <strong>
            {user.name || 'Usuário'}
          </strong>

          <span>
            {user.email}
          </span>
        </div>

        <button
          className="button button-danger"
          onClick={handleLogout}
        >
          Sair
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;