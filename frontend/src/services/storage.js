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
