import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const navigate = useNavigate();

  function handleSubmit(e) {
    e.preventDefault();
    navigate('/dashboard');
  }

  return (
    <div className="bg-light d-flex justify-content-center align-items-center vh-100">
      <div className="card p-4 shadow" style={{ width: '300px' }}>
        <div className="text-center mb-3">
          <img src={logo} alt="Logo AgroGest" width="72" height="72" className="rounded-circle" />
        </div>
        <h3 className="text-center mb-3">AgroGest</h3>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            className="form-control mb-2"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            className="form-control mb-3"
            placeholder="Senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
          />
          <button className="btn btn-success w-100" type="submit">
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
}
