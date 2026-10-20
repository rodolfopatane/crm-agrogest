import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  getClienteById,
  getInteracoesByEntidade,
  addInteracao,
  deleteInteracao,
} from '../services/storage';
import Navbar from '../components/Navbar';

const TIPOS_INTERACAO = ['Ligação', 'E-mail', 'WhatsApp', 'Reunião', 'Outro'];
const EMPTY_INTERACAO = { tipo: 'Ligação', descricao: '', data: '' };

export default function ClienteDetalhesPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [cliente, setCliente] = useState(null);
  const [interacoes, setInteracoes] = useState([]);
  const [form, setForm] = useState(EMPTY_INTERACAO);
  const [salvando, setSalvando] = useState(false);

  async function carregar() {
    const [clienteData, intData] = await Promise.all([
      getClienteById(id),
      getInteracoesByEntidade('cliente', id),
    ]);
    setCliente(clienteData);
    setInteracoes(intData.sort((a, b) => b.data.localeCompare(a.data)));
  }

  useEffect(() => { carregar(); }, [id]);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleAddInteracao(e) {
    e.preventDefault();
    if (!form.descricao || !form.data) {
      alert('Preencha data e descrição da interação.');
      return;
    }
    setSalvando(true);
    await addInteracao({ ...form, entidadeTipo: 'cliente', entidadeId: id });
    setForm(EMPTY_INTERACAO);
    await carregar();
    setSalvando(false);
  }

  async function handleDeleteInteracao(intId) {
    if (!window.confirm('Excluir esta interação?')) return;
    await deleteInteracao(intId);
    await carregar();
  }

  if (!cliente) {
    return (
      <>
        <Navbar />
        <div className="container mt-5">
          <p>Cliente não encontrado. <Link to="/clientes">Voltar</Link></p>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="container mt-4" style={{ maxWidth: 800 }}>

        {/* Cabeçalho */}
        <div className="d-flex align-items-center gap-3 mb-4 flex-wrap">
          <button className="btn btn-secondary btn-sm" onClick={() => navigate('/clientes')}>
            ← Voltar
          </button>
          <h3 className="mb-0 flex-grow-1">{cliente.nome}</h3>
        </div>

        {/* Dados do cliente */}
        <div className="card mb-4 shadow-sm">
          <div className="card-body">
            <div className="row">
              <div className="col-sm-6 mb-2">
                <small className="text-muted">Razão Social</small>
                <p className="mb-0">{cliente.razaosocial || '—'}</p>
              </div>
              <div className="col-sm-6 mb-2">
                <small className="text-muted">CNPJ</small>
                <p className="mb-0">{cliente.cnpj || '—'}</p>
              </div>
              <div className="col-sm-6 mb-2">
                <small className="text-muted">Telefone</small>
                <p className="mb-0">{cliente.telefone}</p>
              </div>
              <div className="col-sm-6 mb-2">
                <small className="text-muted">E-mail</small>
                <p className="mb-0">{cliente.email}</p>
              </div>
              <div className="col-sm-6 mb-2">
                <small className="text-muted">Cidade / Estado</small>
                <p className="mb-0">
                  {[cliente.cidade, cliente.estado].filter(Boolean).join(' — ') || '—'}
                </p>
              </div>
              {cliente.cpf && (
                <div className="col-sm-6 mb-2">
                  <small className="text-muted">CPF</small>
                  <p className="mb-0">{cliente.cpf}</p>
                </div>
              )}
            </div>
          </div>
          <div className="card-footer">
            <Link to={`/clientes/editar/${cliente.id}`} className="btn btn-warning btn-sm">
              Editar Cliente
            </Link>
          </div>
        </div>

        {/* Interações */}
        <h5 className="mb-3">Interações ({interacoes.length})</h5>

        {/* Formulário de nova interação */}
        <div className="card mb-4 shadow-sm">
          <div className="card-header bg-light">
            <strong>Registrar Interação</strong>
          </div>
          <div className="card-body">
            <form onSubmit={handleAddInteracao}>
              <div className="row g-2">
                <div className="col-sm-4">
                  <select name="tipo" className="form-select" value={form.tipo} onChange={handleChange}>
                    {TIPOS_INTERACAO.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
                <div className="col-sm-3">
                  <input
                    type="date"
                    name="data"
                    className="form-control"
                    value={form.data}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="col-sm-5">
                  <input
                    type="text"
                    name="descricao"
                    className="form-control"
                    placeholder="Descrição da interação"
                    value={form.descricao}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <div className="mt-2 text-end">
                <button type="submit" className="btn btn-primary btn-sm" disabled={salvando}>
                  {salvando ? 'Salvando...' : '+ Adicionar'}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Lista de interações */}
        {interacoes.length === 0 ? (
          <p className="text-muted">Nenhuma interação registrada ainda.</p>
        ) : (
          <div className="list-group mb-5">
            {interacoes.map((int) => (
              <div key={int.id} className="list-group-item d-flex justify-content-between align-items-start">
                <div>
                  <span className="badge bg-secondary me-2">{int.tipo}</span>
                  <small className="text-muted me-2">{int.data}</small>
                  <span>{int.descricao}</span>
                </div>
                <button
                  className="btn btn-outline-danger btn-sm"
                  onClick={() => handleDeleteInteracao(int.id)}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
