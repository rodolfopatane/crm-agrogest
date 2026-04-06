import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

export default function DashboardPage() {
  return (
    <>
      <Navbar />
      <div className="container mt-5">
        <h1 className="mb-4">Dashboard</h1>
        <Link to="/clientes" className="btn btn-primary me-2">
          Ver Clientes
        </Link>
        <Link to="/clientes/novo" className="btn btn-success">
          Cadastrar Cliente
        </Link>
      </div>
    </>
  );
}
