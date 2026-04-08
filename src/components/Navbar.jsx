import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import logo from '../assets/logo.png';

export default function Navbar() {
  const location = useLocation();
  const [aberto, setAberto] = useState(null);

  function toggleMenu(nome) {
    setAberto((atual) => (atual === nome ? null : nome));
  }

  function fechar() {
    setAberto(null);
  }

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-success mb-4">
      <div className="container">
        <Link className="navbar-brand" to="/dashboard" onClick={fechar}>
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
          {/* Dashboard */}
          <Link
            className={`nav-link ${location.pathname === '/dashboard' ? 'active' : ''}`}
            to="/dashboard"
            onClick={fechar}
          >
            Dashboard
          </Link>

          {/* Dropdown — Clientes */}
          <div className="nav-item dropdown">
            <button
              className={`nav-link btn btn-link dropdown-toggle text-white ${
                location.pathname.startsWith('/clientes') ? 'active' : ''
              }`}
              style={{ textDecoration: 'none', boxShadow: 'none' }}
              onClick={() => toggleMenu('clientes')}
            >
              Clientes
            </button>
            {aberto === 'clientes' && (
              <ul className="dropdown-menu show">
                <li>
                  <Link className="dropdown-item" to="/clientes" onClick={fechar}>
                    Visualizar
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item" to="/clientes/novo" onClick={fechar}>
                    Adicionar Novo
                  </Link>
                </li>
              </ul>
            )}
          </div>

          {/* Dropdown — Leads */}
          <div className="nav-item dropdown">
            <button
              className={`nav-link btn btn-link dropdown-toggle text-white ${
                location.pathname.startsWith('/leads') ? 'active' : ''
              }`}
              style={{ textDecoration: 'none', boxShadow: 'none' }}
              onClick={() => toggleMenu('leads')}
            >
              Leads
            </button>
            {aberto === 'leads' && (
              <ul className="dropdown-menu show">
                <li>
                  <Link className="dropdown-item" to="/leads" onClick={fechar}>
                    Visualizar
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item" to="/leads/novo" onClick={fechar}>
                    Adicionar Novo
                  </Link>
                </li>
              </ul>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
