import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getClientes, deleteCliente } from '../services/storage';
import Navbar from '../components/Navbar';

export default function ClientesPage() {
  const [clientes, setClientes] = useState([]);

  useEffect(() => {
    getClientes().then(setClientes);
  }, []);

  async function handleExcluir(id) {
    await deleteCliente(id);
    const atualizados = await getClientes();
    setClientes(atualizados);
  }

  return (
    <>
      <Navbar />
      <div className="container mt-5">
        <h2 className="mb-4">Clientes</h2>

        <div className="mb-3">
          <Link to="/dashboard" className="btn btn-secondary me-2">
            Voltar
          </Link>
          <Link to="/clientes/novo" className="btn btn-success">
            Novo Cliente
          </Link>
        </div>

        <div className="table-responsive">
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Nome</th>
                <th>Telefone</th>
                <th>Email</th>
                <th>Razão Social</th>
                <th>CNPJ</th>
                <th>CPF</th>
                <th>Cidade</th>
                <th>Estado</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {clientes.map((c) => (
                <tr key={c.id}>
                  <td>{c.nome}</td>
                  <td>{c.telefone}</td>
                  <td>{c.email}</td>
                  <td>{c.razaosocial}</td>
                  <td>{c.cnpj}</td>
                  <td>{c.cpf}</td>
                  <td>{c.cidade}</td>
                  <td>{c.estado}</td>
                  <td>
                    <Link
                      to={`/clientes/editar/${c.id}`}
                      className="btn btn-warning btn-sm me-1"
                    >
                      Editar
                    </Link>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleExcluir(c.id)}
                    >
                      Excluir
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
