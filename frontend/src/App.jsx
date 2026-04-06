import { BrowserRouter, Routes, Route } from 'react-router-dom'
import IndexPage from './pages/IndexPage'
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'
import ClientesPage from './pages/ClientesPage'
import ClienteFormPage from './pages/ClienteFormPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<IndexPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/clientes" element={<ClientesPage />} />
        <Route path="/clientes/novo" element={<ClienteFormPage />} />
        <Route path="/clientes/editar/:id" element={<ClienteFormPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App

