import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  getLeadById,
  getInteracoesByEntidade,
  addInteracao,
  deleteInteracao,
} from '../services/storage';
import Navbar from '../components/Navbar';

const TIPOS_INTERACAO = ['Ligação', 'E-mail', 'WhatsApp', 'Reunião', 'Outro'];

const ETAPA_LABELS = {
  novo:        { label: 'Novo',       color: 'secondary' },
  contato:     { label: 'Contato',    color: 'info'      },
  negociacao:  { label: 'Negociação', color: 'warning'   },
  ganho:       { label: 'Ganho',      color: 'success'   },
  perdido:     { label: 'Perdido',    color: 'danger'    },
};

const EMPTY_INTERACAO = { tipo: 'Ligação', descricao: '', data: '' };

export default function LeadDetalhesPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [lead, setLead] = useState(null);
  const [interacoes, setInteracoes] = useState([]);
  const [form, setForm] = useState(EMPTY_INTERACAO);
  const [salvando, setSalvando] = useState(false);

  async function carregar() {
    const [leadData, intData] = await Promise.all([
      getLeadById(id),
      getInteracoesByEntidade('lead', id),
    ]);
    setLead(leadData);
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
    await addInteracao({ ...form, entidadeTipo: 'lead', entidadeId: id });
    setForm(EMPTY_INTERACAO);
    await carregar();
    setSalvando(false);
  }

  async function handleDeleteInteracao(intId) {
    if (!window.confirm('Excluir esta interação?')) return;
    await deleteInteracao(intId);
    await carregar();
  }

  if (!lead) {
    return (
      <>
        <Navbar />
        <div className="container mt-5">
          <p>Lead não encontrado. <Link to="/leads">Voltar</Link></p>
        </div>
      </>
    );
  }

  const etapaInfo = ETAPA_LABELS[lead.etapa] || { label: lead.etapa, color: 'secondary' };

  return (
    <>
      <Navbar />
      <div className="container mt-4" style={{ maxWidth: 800 }}>

        {/* Cabeçalho */}
        <div className="d-flex align-items-center gap-3 mb-4 flex-wrap">
          <button className="btn btn-secondary btn-sm" onClick={() => navigate('/leads')}>
            ← Voltar
          </button>
          <h3 className="mb-0 flex-grow-1">{lead.nome}</h3>
          <span className={`badge bg-${etapaInfo.color} fs-6`}>{etapaInfo.label}</span>
        </div>

        {/* Dados do lead */}
        <div className="card mb-4 shadow-sm">
          <div className="card-body">
            <div className="row">
              <div className="col-sm-6 mb-2">
                <small className="text-muted">Empresa</small>
                <p className="mb-0">{lead.empresa || '—'}</p>
              </div>
              <div className="col-sm-6 mb-2">
                <small className="text-muted">Origem</small>
                <p className="mb-0">{lead.origem}</p>
              </div>
              {lead.servico && (
                <div className="col-12 mb-2">
                  <small className="text-muted">Serviço Requisitado</small>
                  <p className="mb-0">{lead.servico}</p>
                </div>
              )}
              <div className="col-sm-6 mb-2">
                <small className="text-muted">Telefone</small>
                <p className="mb-0">{lead.telefone}</p>
              </div>
              <div className="col-sm-6 mb-2">
                <small className="text-muted">E-mail</small>
                <p className="mb-0">{lead.email}</p>
              </div>
              {lead.observacoes && (
                <div className="col-12 mb-2">
                  <small className="text-muted">Observações</small>
                  <p className="mb-0">{lead.observacoes}</p>
                </div>
              )}
              <div className="col-12 mt-2">
                <small className="text-muted">Cadastrado em: {lead.dataCriacao}</small>
              </div>
            </div>
          </div>
          <div className="card-footer d-flex gap-2">
            <Link to={`/leads/editar/${lead.id}`} className="btn btn-warning btn-sm">
              Editar Lead
            </Link>
            <button
              className="btn btn-success btn-sm"
              onClick={() =>
                navigate('/clientes/novo', {
                  state: {
                    fromLead: true,
                    nome: lead.nome,
                    telefone: lead.telefone,
                    email: lead.email,
                    razaosocial: lead.empresa || '',
                  },
                })
              }
            >
              ✔ Converter em Cliente
            </button>
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
