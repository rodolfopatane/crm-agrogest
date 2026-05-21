const BASE_URL = import.meta.env.VITE_API_URL ?? '/api';

function apiUrl(path) {
  return `${BASE_URL}${path}`;
}

async function apiFetch(path, options = {}) {
  const response = await fetch(apiUrl(path), {
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    ...options,
  });
  return response;
}

export async function getClientes() {
  const res = await apiFetch('/clientes');
  if (!res.ok) return [];
  return res.json();
}

export async function getClienteById(id) {
  const res = await apiFetch(`/clientes/${id}`);
  if (res.status === 404) return null;
  if (!res.ok) return null;
  return res.json();
}

export async function addCliente(dados) {
  const res = await apiFetch('/clientes', {
    method: 'POST',
    body: JSON.stringify(dados),
  });
  return res.json();
}

export async function updateCliente(id, dados) {
  const res = await apiFetch(`/clientes/${id}`, {
    method: 'PUT',
    body: JSON.stringify(dados),
  });
  if (res.status === 404) return null;
  return res.json();
}

export async function deleteCliente(id) {
  const res = await apiFetch(`/clientes/${id}`, { method: 'DELETE' });
  return res.status === 204;
}

export async function getLeads() {
  const res = await apiFetch('/leads');
  if (!res.ok) return [];
  return res.json();
}

export async function getLeadById(id) {
  const res = await apiFetch(`/leads/${id}`);
  if (res.status === 404) return null;
  if (!res.ok) return null;
  return res.json();
}

export async function addLead(dados) {
  const res = await apiFetch('/leads', {
    method: 'POST',
    body: JSON.stringify(dados),
  });
  return res.json();
}

export async function updateLead(id, dados) {
  const res = await apiFetch(`/leads/${id}`, {
    method: 'PUT',
    body: JSON.stringify(dados),
  });
  if (res.status === 404) return null;
  return res.json();
}

export async function deleteLead(id) {
  const res = await apiFetch(`/leads/${id}`, { method: 'DELETE' });
  return res.status === 204;
}

export async function getInteracoesByEntidade(entidadeTipo, entidadeId) {
  const res = await apiFetch(`/${entidadeTipo}/${entidadeId}/interacoes`);
  if (!res.ok) return [];
  return res.json();
}

export async function addInteracao(dados) {
  const res = await apiFetch('/interacoes', {
    method: 'POST',
    body: JSON.stringify(dados),
  });
  return res.json();
}

export async function deleteInteracao(id) {
  const res = await apiFetch(`/interacoes/${id}`, { method: 'DELETE' });
  return res.status === 204;
}