const STORAGE_KEY = 'agrogest_clientes';

const SEED_DATA = [
  {
    id: 1,
    nome: 'João',
    telefone: '(11) 99999-9999',
    email: 'joao@email.com',
    razaosocial: 'Empresa X',
    cnpj: '12.345.678/0001-00',
    cpf: '123.456.789-00',
    cidade: 'São Paulo',
    estado: 'SP',
  },
  {
    id: 2,
    nome: 'Maria',
    telefone: '(11) 88888-8888',
    email: 'maria@email.com',
    razaosocial: 'Empresa Y',
    cnpj: '98.765.432/0001-00',
    cpf: '987.654.321-00',
    cidade: 'Rio de Janeiro',
    estado: 'RJ',
  },
];

function readAll() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  return JSON.parse(raw);
}

function writeAll(clientes) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(clientes));
}

function nextId(clientes) {
  if (clientes.length === 0) return 1;
  return Math.max(...clientes.map((c) => c.id)) + 1;
}

export async function seedClientes() {
  const existing = readAll();
  if (!existing) {
    writeAll(SEED_DATA);
  }
}

export async function getClientes() {
  const clientes = readAll();
  return clientes || [];
}

export async function getClienteById(id) {
  const clientes = await getClientes();
  return clientes.find((c) => c.id === Number(id)) || null;
}

export async function addCliente(dados) {
  const clientes = await getClientes();
  const cliente = { ...dados, id: nextId(clientes) };
  clientes.push(cliente);
  writeAll(clientes);
  return cliente;
}

export async function updateCliente(id, dados) {
  const clientes = await getClientes();
  const index = clientes.findIndex((c) => c.id === Number(id));
  if (index === -1) return null;
  clientes[index] = { ...clientes[index], ...dados, id: Number(id) };
  writeAll(clientes);
  return clientes[index];
}

export async function deleteCliente(id) {
  const clientes = await getClientes();
  const filtered = clientes.filter((c) => c.id !== Number(id));
  if (filtered.length === clientes.length) return false;
  writeAll(filtered);
  return true;
}

// ─── LEADS ──────────────────────────────────────────────────────────────────

const LEADS_KEY = 'agrogest_leads';

const SEED_LEADS = [
  {
    id: 1,
    nome: 'Carlos Mendes',
    empresa: 'Fazenda Boa Vista',
    telefone: '(62) 99123-4567',
    email: 'carlos@boavista.com',
    origem: 'Indicação',
    etapa: 'contato',
    observacoes: 'Interessado em defensivos para soja.',
    dataCriacao: '2026-04-01',
  },
  {
    id: 2,
    nome: 'Ana Ribeiro',
    empresa: 'Agro Cerrado Ltda',
    telefone: '(64) 98765-4321',
    email: 'ana@agrocerrado.com.br',
    origem: 'Site',
    etapa: 'negociacao',
    observacoes: 'Solicitou proposta para insumos de milho.',
    dataCriacao: '2026-04-03',
  },
];

function readLeads() {
  const raw = localStorage.getItem(LEADS_KEY);
  if (!raw) return null;
  return JSON.parse(raw);
}

function writeLeads(leads) {
  localStorage.setItem(LEADS_KEY, JSON.stringify(leads));
}

export async function seedLeads() {
  const existing = readLeads();
  if (!existing) {
    writeLeads(SEED_LEADS);
  }
}

export async function getLeads() {
  return readLeads() || [];
}

export async function getLeadById(id) {
  const leads = await getLeads();
  return leads.find((l) => l.id === Number(id)) || null;
}

export async function addLead(dados) {
  const leads = await getLeads();
  const nextId = leads.length === 0 ? 1 : Math.max(...leads.map((l) => l.id)) + 1;
  const lead = { ...dados, id: nextId, dataCriacao: new Date().toISOString().slice(0, 10) };
  leads.push(lead);
  writeLeads(leads);
  return lead;
}

export async function updateLead(id, dados) {
  const leads = await getLeads();
  const index = leads.findIndex((l) => l.id === Number(id));
  if (index === -1) return null;
  leads[index] = { ...leads[index], ...dados, id: Number(id) };
  writeLeads(leads);
  return leads[index];
}

export async function deleteLead(id) {
  const leads = await getLeads();
  const filtered = leads.filter((l) => l.id !== Number(id));
  if (filtered.length === leads.length) return false;
  writeLeads(filtered);
  return true;
}

// ─── INTERAÇÕES ──────────────────────────────────────────────────────────────

const INTERACOES_KEY = 'agrogest_interacoes';

function readInteracoes() {
  const raw = localStorage.getItem(INTERACOES_KEY);
  if (!raw) return [];
  return JSON.parse(raw);
}

function writeInteracoes(interacoes) {
  localStorage.setItem(INTERACOES_KEY, JSON.stringify(interacoes));
}

export async function getInteracoesByEntidade(entidadeTipo, entidadeId) {
  const todas = readInteracoes();
  return todas.filter(
    (i) => i.entidadeTipo === entidadeTipo && i.entidadeId === Number(entidadeId)
  );
}

export async function addInteracao(dados) {
  const todas = readInteracoes();
  const nextId = todas.length === 0 ? 1 : Math.max(...todas.map((i) => i.id)) + 1;
  const interacao = {
    ...dados,
    id: nextId,
    entidadeId: Number(dados.entidadeId),
    data: dados.data || new Date().toISOString().slice(0, 10),
  };
  todas.push(interacao);
  writeInteracoes(todas);
  return interacao;
}

export async function deleteInteracao(id) {
  const todas = readInteracoes();
  const filtered = todas.filter((i) => i.id !== Number(id));
  if (filtered.length === todas.length) return false;
  writeInteracoes(filtered);
  return true;
}
