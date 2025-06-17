import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { registerLocale } from 'react-datepicker';
import ptBR from 'date-fns/locale/pt-BR';
// Importa useNavigate do react-router-dom
import { useNavigate } from 'react-router-dom';

registerLocale('pt-BR', ptBR);

// Remove a prop 'onAgendamentoAdicionado' da desestruturação
const AgendamentoForm = () => {
  // Inicializa o hook de navegação
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    paciente_id: '',
    medico_id: '',
    data: '',
    horario: '',
  });

  const [pacientes, setPacientes] = useState([]);
  const [medicos, setMedicos] = useState([]);
  const [horarioValido, setHorarioValido] = useState(true);
  const [mensagemErroHorario, setMensagemErroHorario] = useState('');

  useEffect(() => {
    async function fetchDados() {
      try {
        const resPacientes = await api.get('/pacientes');
        const resMedicos = await api.get('/medicos');
        setPacientes(resPacientes.data);
        setMedicos(resMedicos.data);
      } catch (error) {
        console.error('Erro ao buscar dados de pacientes ou médicos:', error);
        // Opcional: exibir uma mensagem de erro para o usuário
      }
    }
    fetchDados();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'horario') {
      const [hora, minuto] = value.split(':').map(Number);
      if (hora < 7 || hora > 19 || (hora === 19 && minuto > 0)) {
        setHorarioValido(false);
        setMensagemErroHorario('Horário deve estar entre 07:00 e 19:00');
      } else {
        setHorarioValido(true);
        setMensagemErroHorario('');
      }
    }

    setFormData({ ...formData, [name]: value });
  };

  const handleDateChange = (date) => {
    // Garante que a data seja um objeto Date antes de chamar toISOString
    if (date instanceof Date && !isNaN(date)) {
      const dataFormatada = date.toISOString().split('T')[0];
      setFormData({ ...formData, data: dataFormatada });
    } else {
      setFormData({ ...formData, data: '' }); // Limpa a data se for inválida
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/agendamentos', formData);
      // Remove a chamada para onAgendamentoAdicionado()
      // Navega de volta para a lista de agendamentos após o sucesso
      navigate('/agendamentos');
      
      // Limpa o formulário apenas se não estiver navegando para outra página imediatamente
      // Se você quiser que o formulário limpe antes de navegar, mantenha as linhas abaixo
      setFormData({ paciente_id: '', medico_id: '', data: '', horario: '' });
      setHorarioValido(true);
      setMensagemErroHorario('');

    } catch (error) {
      console.error('Erro ao agendar consulta:', error);
      // Opcional: exibir uma mensagem de erro para o usuário (ex: horário já ocupado)
      if (error.response && error.response.status === 409) {
        setMensagemErroHorario('Horário já agendado para o médico selecionado.');
        setHorarioValido(false);
      } else {
        setMensagemErroHorario('Ocorreu um erro ao agendar. Tente novamente.');
        setHorarioValido(false);
      }
    }
  };

  return (
    <div className="max-w-lg mx-auto bg-white rounded-2xl shadow-md p-6 border border-gray-200">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">📅 Novo Agendamento</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Paciente */}
        <div>
          <label className="block text-gray-700 font-medium mb-1">Paciente</label>
          <select
            name="paciente_id"
            value={formData.paciente_id}
            onChange={handleChange}
            className="w-full border rounded-lg px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Selecione um paciente</option>
            {pacientes.map(p => (
              <option key={p.id} value={p.id}>{p.nome}</option>
            ))}
          </select>
        </div>

        {/* Médico */}
        <div>
          <label className="block text-gray-700 font-medium mb-1">Médico</label>
          <select
            name="medico_id"
            value={formData.medico_id}
            onChange={handleChange}
            className="w-full border rounded-lg px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Selecione um médico</option>
            {medicos.map(m => (
              <option key={m.id} value={m.id}>{m.nome} - {m.especialidade}</option>
            ))}
          </select>
        </div>

        {/* Data e Hora */}
        <div className="grid grid-cols-2 gap-4">
          {/* Data com react-datepicker */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">Data</label>
            <DatePicker
              selected={formData.data ? new Date(formData.data) : null}
              onChange={handleDateChange}
              dateFormat="yyyy-MM-dd"
              locale="pt-BR"
              minDate={new Date()}
              filterDate={(date) => date.getDay() !== 0} // Bloqueia domingos
              placeholderText="Selecione uma data"
              className="w-full border rounded-lg px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Hora com validação */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">Hora</label>
            <input
              type="time"
              name="horario"
              value={formData.horario} // Corrigido de formData.hora para formData.horario
              onChange={handleChange}
              min="07:00"
              max="19:00"
              className="w-full border rounded-lg px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            {!horarioValido && (
              <p className="text-red-600 text-sm mt-1">{mensagemErroHorario}</p>
            )}
          </div>
        </div>

        {/* Botão */}
        <button
          type="submit"
          disabled={!horarioValido}
          className={`w-full font-semibold py-2 px-4 rounded-lg transition ${
            horarioValido
              ? 'bg-indigo-600 hover:bg-indigo-700 text-white'
              : 'bg-gray-400 cursor-not-allowed text-white'
          }`}
        >
          Agendar Consulta
        </button>
      </form>
    </div>
  );
};

export default AgendamentoForm;
