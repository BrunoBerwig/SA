import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Login from './components/Login';
import Layout from './components/Layout';
import DashboardHome from './components/DashboardHome';
import PacienteController from './components/Pacientes/PacienteController';
import PacienteForm from './components/Pacientes/PacienteForm';
import PacienteDetails from './components/Pacientes/PacienteDetails';
import MedicoController from './components/Medicos/MedicoController';
import MedicoForm from './components/Medicos/MedicoForm';
import MedicoDetails from './components/Medicos/MedicoDetails';
import AgendamentoController from './components/Agendamentos/AgendamentoController';
import AgendamentoForm from './components/Agendamentos/AgendamentoForm';
import AgendamentoDetails from './components/Agendamentos/AgendamentoDetails';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
      <BrowserRouter>
        <Toaster position="top-right" toastOptions={{ duration: 3000 }} />

        <Routes>
          <Route path="/" element={<><title>Login</title><Login /></>} />
          <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
            <Route path="/dashboard" element={<><title>Dashboard</title><DashboardHome /></>} />
            
            <Route path="/pacientes" element={<><title>Pacientes</title><PacienteController /></>} />
            <Route path="/pacientes/novo" element={<><title>Novo Paciente</title><PacienteForm /></>} />
            <Route path="/pacientes/editar/:id" element={<><title>Editar Paciente</title><PacienteForm /></>} />
            <Route path="/pacientes/:id" element={<><title>Detalhes do Paciente</title><PacienteDetails /></>} />
            
            <Route path="/medicos" element={<><title>Médicos</title><MedicoController /></>} />
            <Route path="/medicos/novo" element={<><title>Novo Médico</title><MedicoForm /></>} />
            <Route path="/medicos/editar/:id" element={<><title>Editar Médico</title><MedicoForm /></>} />
            <Route path="/medicos/:id" element={<><title>Detalhes do Médico</title><MedicoDetails /></>} />

            <Route path="/agendamentos" element={<><title>Agendamentos</title><AgendamentoController /></>} />
            <Route path="/agendamentos/novo" element={<><title>Novo Agendamento</title><AgendamentoForm /></>} />
            <Route path="/agendamentos/editar/:id" element={<><title>Editar Agendamento</title><AgendamentoForm /></>} />
            <Route path="/agendamentos/:id" element={<><title>Detalhes do Agendamento</title><AgendamentoDetails /></>} />
          
          </Route>
        </Routes>
      </BrowserRouter>
  );
}

export default App;