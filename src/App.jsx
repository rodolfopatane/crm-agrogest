import { HashRouter, Routes, Route } from 'react-router-dom'
import IndexPage from './pages/IndexPage'
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'
import ClientesPage from './pages/ClientesPage'
import ClienteFormPage from './pages/ClienteFormPage'
import ClienteDetalhesPage from './pages/ClienteDetalhesPage'
import LeadsPage from './pages/LeadsPage'
import LeadFormPage from './pages/LeadFormPage'
import LeadDetalhesPage from './pages/LeadDetalhesPage'

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<IndexPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/clientes" element={<ClientesPage />} />
        <Route path="/clientes/novo" element={<ClienteFormPage />} />
        <Route path="/clientes/editar/:id" element={<ClienteFormPage />} />
        <Route path="/clientes/:id" element={<ClienteDetalhesPage />} />
        <Route path="/leads" element={<LeadsPage />} />
        <Route path="/leads/novo" element={<LeadFormPage />} />
        <Route path="/leads/editar/:id" element={<LeadFormPage />} />
        <Route path="/leads/:id" element={<LeadDetalhesPage />} />
      </Routes>
    </HashRouter>
  )
}

export default App

