import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getLeads, deleteLead, updateLead } from '../services/storage';
import Navbar from '../components/Navbar';

const ETAPAS = [
  { key: 'novo',        label: 'Novo',        color: 'secondary' },
  { key: 'contato',     label: 'Contato',     color: 'info'      },
  { key: 'negociacao',  label: 'Negociação',  color: 'warning'   },
  { key: 'ganho',       label: 'Ganho',       color: 'success'   },
  { key: 'perdido',     label: 'Perdido',     color: 'danger'    },
];

const ETAPA_KEYS = ETAPAS.map((e) => e.key);

export default function LeadsPage() {
  const [leads, setLeads] = useState([]);
  const navigate = useNavigate();

  async function carregar() {
    const data = await getLeads();
    setLeads(data);
  }

  useEffect(() => { carregar(); }, []);

  async function handleExcluir(id) {
    if (!window.confirm('Excluir este lead?')) return;
    await deleteLead(id);
    await carregar();
  }

  async function handleMoverEtapa(lead, direcao) {
    const idx = ETAPA_KEYS.indexOf(lead.etapa);
    const novoIdx = idx + direcao;
    if (novoIdx < 0 || novoIdx >= ETAPA_KEYS.length) return;
    await updateLead(lead.id, { etapa: ETAPA_KEYS[novoIdx] });
    await carregar();
  }

  return (
    <>
      <Navbar />
      <div className="container mt-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="mb-0">Leads</h2>
          <Link to="/leads/novo" className="btn btn-success">
            + Novo
          </Link>
        </div>

        {/* Kanban */}
        <div className="d-flex gap-3 align-items-start overflow-auto pb-3">
          {ETAPAS.map((etapa) => {
            const leadsColuna = leads.filter((l) => l.etapa === etapa.key);
            return (
              <div
                key={etapa.key}
                className="flex-shrink-0"
                style={{ width: 240, minWidth: 240 }}
              >
                {/* Cabeçalho da coluna */}
                <div className={`rounded-top bg-${etapa.color} text-white px-3 py-2 d-flex justify-content-between align-items-center`}>
                  <span className="fw-semibold">{etapa.label}</span>
                  <span className="badge bg-white text-dark">{leadsColuna.length}</span>
                </div>

                {/* Cards */}
                <div
                  className="bg-light border border-top-0 rounded-bottom p-2"
                  style={{ minHeight: 120 }}
                >
                  {leadsColuna.length === 0 && (
                    <p className="text-muted small text-center mt-3">Nenhum lead</p>
                  )}
                  {leadsColuna.map((lead) => {
                    const posicaoAtual = ETAPA_KEYS.indexOf(lead.etapa);
                    return (
                      <div key={lead.id} className="card mb-2 shadow-sm">
                        <div className="card-body p-2">
                          <p className="fw-semibold mb-0 text-truncate" title={lead.nome}>
                            {lead.nome}
                          </p>
                          {lead.empresa && (
                            <p className="text-muted small mb-1 text-truncate">
                              {lead.empresa}
                            </p>
                          )}
                          <p className="small mb-2 text-truncate">
                            <span className="text-muted">Origem:</span> {lead.origem}
                          </p>

                          {/* Mover etapa */}
                          <div className="d-flex gap-1 mb-2">
                            <button
                              className="btn btn-outline-secondary btn-sm py-0 px-1"
                              title="Etapa anterior"
                              disabled={posicaoAtual === 0}
                              onClick={() => handleMoverEtapa(lead, -1)}
                            >
                              ◀
                            </button>
                            <button
                              className="btn btn-outline-secondary btn-sm py-0 px-1"
                              title="Próxima etapa"
                              disabled={posicaoAtual === ETAPA_KEYS.length - 1}
                              onClick={() => handleMoverEtapa(lead, +1)}
                            >
                              ▶
                            </button>
                          </div>

                          {/* Ações */}
                          <div className="d-flex gap-1">
                            <button
                              className="btn btn-primary btn-sm flex-fill"
                              onClick={() => navigate(`/leads/${lead.id}`)}
                            >
                              Ver
                            </button>
                            <Link
                              to={`/leads/editar/${lead.id}`}
                              className="btn btn-warning btn-sm flex-fill"
                            >
                              Editar
                            </Link>
                            <button
                              className="btn btn-danger btn-sm flex-fill"
                              onClick={() => handleExcluir(lead.id)}
                            >
                              Excluir
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
