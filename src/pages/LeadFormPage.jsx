import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getLeadById, addLead, updateLead } from '../services/storage';
import { formatarTelefone } from '../utils/mascaras';
import Navbar from '../components/Navbar';

const ETAPAS = ['novo', 'contato', 'negociacao', 'ganho', 'perdido'];
const ORIGENS = ['Indicação', 'Site', 'Rede Social', 'Ligação Fria', 'Outro'];
const SERVICOS = [
  '',
  'Regularização para produção de mudas (RENASEM)',
  'Registro de estabelecimento (SIPEAGRO)',
  'IBAMA – CTF (Cadastro Técnico Federal)',
  'Licenças para Produtos Controlados',
  'Registro de produtos (SIPEAGRO)',
  'Responsabilidade Técnica',
  'Implantação de normas ISO (ISO 9001, ISO 14001, ISO 45001, ESG)',
  'Auditoria interna',
  'Business Intelligence',
  'Automação agropecuária',
  'Projetos de implementação de IA',
  'Parceria com produtores de mudas de cana de açúcar',
];

const EMPTY_FORM = {
  nome: '',
  empresa: '',
  telefone: '',
  email: '',
  origem: 'Indicação',
  etapa: 'novo',
  servico: '',
  observacoes: '',
};

export default function LeadFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const [form, setForm] = useState(EMPTY_FORM);

  useEffect(() => {
    if (isEditing) {
      getLeadById(id).then((lead) => {
        if (lead) {
          setForm({
            nome: lead.nome || '',
            empresa: lead.empresa || '',
            telefone: lead.telefone || '',
            email: lead.email || '',
            origem: lead.origem || 'Indicação',
            etapa: lead.etapa || 'novo',
            servico: lead.servico || '',
            observacoes: lead.observacoes || '',
          });
        }
      });
    }
  }, [id, isEditing]);

  function handleChange(e) {
    const { name, value } = e.target;
    const formatted = name === 'telefone' ? formatarTelefone(value) : value;
    setForm((prev) => ({ ...prev, [name]: formatted }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.nome || !form.telefone || !form.email) {
      alert('Preencha os campos obrigatórios: nome, telefone e e-mail.');
      return;
    }
    if (isEditing) {
      await updateLead(id, form);
    } else {
      await addLead(form);
    }
    navigate('/leads');
  }

  return (
    <>
      <Navbar />
      <div className="container mt-4">
        <div className="card shadow p-4" style={{ maxWidth: 700, margin: '0 auto' }}>
          <h3 className="mb-4 text-center">
            {isEditing ? 'Editar Lead' : 'Novo Lead'}
          </h3>

          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-md-6 mb-2">
                <label className="form-label">Nome *</label>
                <input
                  type="text"
                  name="nome"
                  className="form-control"
                  placeholder="Nome do contato"
                  value={form.nome}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col-md-6 mb-2">
                <label className="form-label">Empresa</label>
                <input
                  type="text"
                  name="empresa"
                  className="form-control"
                  placeholder="Nome da empresa"
                  value={form.empresa}
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

            <div className="row">
              <div className="col-md-6 mb-2">
                <label className="form-label">Origem</label>
                <select name="origem" className="form-select" value={form.origem} onChange={handleChange}>
                  {ORIGENS.map((o) => (
                    <option key={o} value={o}>{o}</option>
                  ))}
                </select>
              </div>
              <div className="col-md-6 mb-2">
                <label className="form-label">Etapa</label>
                <select name="etapa" className="form-select" value={form.etapa} onChange={handleChange}>
                  {ETAPAS.map((e) => (
                    <option key={e} value={e}>{e.charAt(0).toUpperCase() + e.slice(1)}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label">Serviço Requisitado</label>
              <select name="servico" className="form-select" value={form.servico} onChange={handleChange}>
                {SERVICOS.map((s) => (
                  <option key={s} value={s}>{s === '' ? '— Selecione um serviço —' : s}</option>
                ))}
              </select>
            </div>

            <div className="mb-3">
              <label className="form-label">Observações</label>
              <textarea
                name="observacoes"
                className="form-control"
                rows={3}
                placeholder="Notas sobre o lead..."
                value={form.observacoes}
                onChange={handleChange}
              />
            </div>

            <div className="d-flex gap-2 justify-content-end">
              <button type="button" className="btn btn-secondary" onClick={() => navigate('/leads')}>
                Cancelar
              </button>
              <button type="submit" className="btn btn-success">
                {isEditing ? 'Salvar Alterações' : 'Cadastrar Lead'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
