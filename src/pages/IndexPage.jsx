import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';

export default function IndexPage() {
  return (
    <div className="bg-light d-flex justify-content-center align-items-center vh-100">
      <div className="card p-4 shadow" style={{ width: '300px' }}>
        <div className="text-center mb-3">
          <img src={logo} alt="Logo AgroGest" width="72" height="72" className="rounded-circle" />
        </div>
        <h3 className="text-center mb-3">AgroGest</h3>
        <p className="text-center">Bem-vindo ao AgroGest! 🌱</p>
        <div className="d-grid mt-3">
          <Link to="/login" className="btn btn-success">
            Ir para Login
          </Link>
        </div>
      </div>
    </div>
  );
}
