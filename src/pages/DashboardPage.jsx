import { useEffect, useState } from 'react';
import { getLeads, getClientes } from '../services/storage';
import Navbar from '../components/Navbar';

export default function DashboardPage() {
  const [contagemLeads, setContagemLeads] = useState({});
  const [totalClientes, setTotalClientes] = useState(0);

  useEffect(() => {
    getLeads().then((leads) => {
      const contagem = leads.reduce((acc, l) => {
        acc[l.etapa] = (acc[l.etapa] || 0) + 1;
        return acc;
      }, {});
      setContagemLeads(contagem);
    });
    getClientes().then((c) => setTotalClientes(c.length));
  }, []);

  const etapasResumo = [
    { key: 'novo',       label: 'Novos',       color: 'secondary' },
    { key: 'contato',    label: 'Em Contato',  color: 'info'      },
    { key: 'negociacao', label: 'Negociação',  color: 'warning'   },
    { key: 'ganho',      label: 'Ganhos',      color: 'success'   },
    { key: 'perdido',    label: 'Perdidos',    color: 'danger'    },
  ];

  return (
    <>
      <Navbar />
      <div className="container mt-4">
        <h1 className="mb-4">Dashboard</h1>

        {/* Resumo de leads por etapa */}
        <h5 className="text-muted mb-3">Pipeline de Leads</h5>
        <div className="row g-3 mb-4">
          {etapasResumo.map((e) => (
            <div key={e.key} className="col-6 col-sm-4 col-md-2">
              <div className={`card text-center border-${e.color}`}>
                <div className={`card-header bg-${e.color} text-white py-1`}>
                  <small>{e.label}</small>
                </div>
                <div className="card-body py-2">
                  <span className="fs-3 fw-bold">{contagemLeads[e.key] || 0}</span>
                </div>
              </div>
            </div>
          ))}
          <div className="col-6 col-sm-4 col-md-2">
            <div className="card text-center border-primary">
              <div className="card-header bg-primary text-white py-1">
                <small>Clientes</small>
              </div>
              <div className="card-body py-2">
                <span className="fs-3 fw-bold">{totalClientes}</span>
              </div>
            </div>
          </div>
        </div>


      </div>
    </>
  );
}
