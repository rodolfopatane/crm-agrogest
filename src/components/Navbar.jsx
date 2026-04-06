import { Link, useLocation } from 'react-router-dom';
import logo from '../assets/logo.png';

export default function Navbar() {
  const location = useLocation();

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-success mb-4">
      <div className="container">
        <Link className="navbar-brand" to="/dashboard">
          <img
            src={logo}
            alt="Logo AgroGest"
            width="32"
            height="32"
            className="me-2 rounded-circle"
          />
          AgroGest
        </Link>
        <div className="navbar-nav">
          <Link
            className={`nav-link ${location.pathname === '/dashboard' ? 'active' : ''}`}
            to="/dashboard"
          >
            Dashboard
          </Link>
          <Link
            className={`nav-link ${location.pathname === '/clientes' ? 'active' : ''}`}
            to="/clientes"
          >
            Clientes
          </Link>
          <Link
            className={`nav-link ${location.pathname === '/clientes/novo' ? 'active' : ''}`}
            to="/clientes/novo"
          >
            Novo Cliente
          </Link>
        </div>
      </div>
    </nav>
  );
}
