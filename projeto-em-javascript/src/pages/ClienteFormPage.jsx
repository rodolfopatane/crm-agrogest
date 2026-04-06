import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getClienteById, addCliente, updateCliente } from '../services/storage';
import { formatarCPF, formatarCNPJ, formatarTelefone } from '../utils/mascaras';
import Navbar from '../components/Navbar';

const EMPTY_FORM = {
  nome: '',
  telefone: '',
  email: '',
  razaosocial: '',
  cnpj: '',
  cpf: '',
  cidade: '',
  estado: '',
};

export default function ClienteFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const [form, setForm] = useState(EMPTY_FORM);

  useEffect(() => {
    if (isEditing) {
      getClienteById(id).then((cliente) => {
        if (cliente) {
          setForm({
            nome: cliente.nome || '',
            telefone: cliente.telefone || '',
            email: cliente.email || '',
            razaosocial: cliente.razaosocial || '',
            cnpj: cliente.cnpj || '',
            cpf: cliente.cpf || '',
            cidade: cliente.cidade || '',
            estado: cliente.estado || '',
          });
        }
      });
    }
  }, [id, isEditing]);

  function handleChange(e) {
    const { name, value } = e.target;
    let formatted = value;

    if (name === 'cpf') formatted = formatarCPF(value);
    else if (name === 'cnpj') formatted = formatarCNPJ(value);
    else if (name === 'telefone') formatted = formatarTelefone(value);

    setForm((prev) => ({ ...prev, [name]: formatted }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!form.nome || !form.telefone || !form.email) {
      alert('Preencha todos os campos obrigatórios');
      return;
    }

    if (isEditing) {
      await updateCliente(id, form);
    } else {
      await addCliente(form);
    }

    navigate('/clientes');
  }

  return (
    <>
      <Navbar />
      <div className="container mt-5">
        <div className="card shadow p-4">
          <h3 className="mb-3 text-center">
            {isEditing ? 'Editar Cliente' : 'Cadastrar Cliente'}
          </h3>

          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-md-6">
                <input
                  type="text"
                  name="nome"
                  className="form-control mb-2"
                  placeholder="Nome"
                  value={form.nome}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col-md-6">
                <input
                  type="text"
                  name="razaosocial"
                  className="form-control mb-2"
                  placeholder="Razão Social"
                  value={form.razaosocial}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="row">
              <div className="col-md-6">
                <input
                  type="text"
                  name="cnpj"
                  className="form-control mb-2"
                  placeholder="CNPJ"
                  maxLength={18}
                  value={form.cnpj}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col-md-6">
                <input
                  type="text"
                  name="cpf"
                  className="form-control mb-2"
                  placeholder="CPF"
                  maxLength={14}
                  value={form.cpf}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="row">
              <div className="col-md-6">
                <input
                  type="text"
                  name="cidade"
                  className="form-control mb-2"
                  placeholder="Cidade"
                  value={form.cidade}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col-md-6">
                <input
                  type="text"
                  name="estado"
                  className="form-control mb-2"
                  placeholder="Estado"
                  value={form.estado}
                  onChange={handleChange}
                />
              </div>
            </div>

            <input
              type="text"
              name="telefone"
              className="form-control mb-2"
              placeholder="Telefone"
              maxLength={15}
              value={form.telefone}
              onChange={handleChange}
              required
            />

            <input
              type="email"
              name="email"
              className="form-control mb-3"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              required
            />

            <div className="d-flex justify-content-between">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => navigate('/clientes')}
              >
                Voltar
              </button>
              <button className="btn btn-success" type="submit">
                {isEditing ? 'Atualizar' : 'Salvar'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
