import { useEffect, useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
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
  const location = useLocation();
  const isEditing = Boolean(id);

  const leadState = location.state?.fromLead ? location.state : null;

  const [form, setForm] = useState(
    leadState
      ? {
          nome: leadState.nome || '',
          telefone: leadState.telefone || '',
          email: leadState.email || '',
          razaosocial: leadState.razaosocial || '',
          cnpj: '',
          cpf: '',
          cidade: '',
          estado: '',
        }
      : EMPTY_FORM
  );

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
      <div className="container mt-4">
        <div className="card shadow p-4" style={{ maxWidth: 700, margin: '0 auto' }}>
          <h3 className="mb-4 text-center">
            {isEditing ? 'Editar Cliente' : 'Cadastrar Cliente'}
          </h3>

          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-md-6 mb-2">
                <label className="form-label">Nome *</label>
                <input
                  type="text"
                  name="nome"
                  className="form-control"
                  placeholder="Nome do cliente"
                  value={form.nome}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col-md-6 mb-2">
                <label className="form-label">Razão Social *</label>
                <input
                  type="text"
                  name="razaosocial"
                  className="form-control"
                  placeholder="Razão Social"
                  value={form.razaosocial}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="row">
              <div className="col-md-6 mb-2">
                <label className="form-label">CNPJ *</label>
                <input
                  type="text"
                  name="cnpj"
                  className="form-control"
                  placeholder="00.000.000/0000-00"
                  maxLength={18}
                  value={form.cnpj}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col-md-6 mb-2">
                <label className="form-label">CPF</label>
                <input
                  type="text"
                  name="cpf"
                  className="form-control"
                  placeholder="000.000.000-00"
                  maxLength={14}
                  value={form.cpf}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="row">
              <div className="col-md-6 mb-2">
                <label className="form-label">Cidade *</label>
                <input
                  type="text"
                  name="cidade"
                  className="form-control"
                  placeholder="Cidade"
                  value={form.cidade}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col-md-6 mb-2">
                <label className="form-label">Estado</label>
                <input
                  type="text"
                  name="estado"
                  className="form-control"
                  placeholder="UF"
                  value={form.estado}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="row">
              <div className="col-md-6 mb-2">
                <label className="form-label">Telefone *</label>
                <input
                  type="text"
                  name="telefone"
                  className="form-control"
                  placeholder="(00) 00000-0000"
                  maxLength={15}
                  value={form.telefone}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col-md-6 mb-2">
                <label className="form-label">E-mail *</label>
                <input
                  type="email"
                  name="email"
                  className="form-control"
                  placeholder="email@exemplo.com"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="d-flex gap-2 justify-content-end">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => navigate('/clientes')}
              >
                Cancelar
              </button>
              <button className="btn btn-success" type="submit">
                {isEditing ? 'Salvar Alterações' : 'Cadastrar Cliente'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
