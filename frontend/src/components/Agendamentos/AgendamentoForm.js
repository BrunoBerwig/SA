import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { registerLocale } from 'react-datepicker';
import ptBR from 'date-fns/locale/pt-BR';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import Spinner from '../common/Spinner';

registerLocale('pt-BR', ptBR);

const AgendamentoForm = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEditing = !!id;

    const [formData, setFormData] = useState({
        paciente_id: '',
        medico_id: '',
        data: '',
        horario: '',
        tipo_consulta: 'Consulta Padrão',
        status_confirmacao: 'Pendente',
        motivo_consulta: '', 
        observacoes_recepcao: '',
        status: 'Agendado'
    });

    const [pacientes, setPacientes] = useState([]);
    const [medicos, setMedicos] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isFetchingData, setIsFetchingData] = useState(true);

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const [resPacientes, resMedicos] = await Promise.all([
                    api.get('/pacientes'),
                    api.get('/medicos?ativo=true')
                ]);
                setPacientes(resPacientes.data);
                setMedicos(resMedicos.data);

                if (isEditing) {
                    const resAgendamento = await api.get(`/agendamentos/${id}`);
                    const dadosAgendamento = resAgendamento.data;
                    
                    const [dataPart, timePart] = dadosAgendamento.data_hora.split('T');
                    
                    setFormData({
                        ...dadosAgendamento,
                        data: dataPart,
                        horario: timePart.substring(0, 5)
                    });
                }
            } catch (error) {
                toast.error('Erro ao buscar dados iniciais.');
            } finally {
                setIsFetchingData(false);
            }
        };
        fetchInitialData();
    }, [id, isEditing]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleDateChange = (date) => {
        setFormData({ ...formData, data: date ? date.toISOString().split('T')[0] : '' });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        const submissionData = {
            ...formData,
            data_hora: `${formData.data}T${formData.horario}:00`
        };

        const promise = isEditing 
            ? api.put(`/agendamentos/${id}`, submissionData) 
            : api.post('/agendamentos', submissionData);

        toast.promise(promise, {
            loading: 'Salvando agendamento...',
            success: () => {
                navigate('/agendamentos');
                return `Agendamento ${isEditing ? 'atualizado' : 'criado'} com sucesso!`;
            },
            error: (err) => {
                return err.response?.data?.message || 'Ocorreu um erro ao salvar.';
            }
        });
        
        promise.catch(() => {}).finally(() => setIsLoading(false));
    };

    if (isFetchingData) {
        return <div className="flex justify-center p-10"><Spinner size="lg" /></div>;
    }

    return (
        <div className="max-w-2xl mx-auto bg-white dark:bg-slate-800 rounded-2xl shadow-md p-6 border border-gray-200 dark:border-slate-700">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6">{isEditing ? '📝 Editar Agendamento' : '📅 Novo Agendamento'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <select name="paciente_id" value={formData.paciente_id} onChange={handleChange} required className="w-full p-2 border rounded dark:bg-slate-700 dark:border-slate-600 dark:text-white">
                        <option value="">Selecione um paciente</option>
                        {pacientes.map(p => <option key={p.id} value={p.id}>{p.nome}</option>)}
                    </select>
                    <select name="medico_id" value={formData.medico_id} onChange={handleChange} required className="w-full p-2 border rounded dark:bg-slate-700 dark:border-slate-600 dark:text-white">
                        <option value="">Selecione um médico</option>
                        {medicos.map(m => <option key={m.id} value={m.id}>{m.nome}</option>)}
                    </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <DatePicker selected={formData.data ? new Date(formData.data + 'T00:00:00') : null} onChange={handleDateChange} dateFormat="dd/MM/yyyy" locale="pt-BR" minDate={new Date()} placeholderText="Selecione uma data" required className="w-full p-2 border rounded dark:bg-slate-700 dark:border-slate-600 dark:text-white"/>
                    <input type="time" name="horario" value={formData.horario} onChange={handleChange} required className="w-full p-2 border rounded dark:bg-slate-700 dark:border-slate-600 dark:text-white"/>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tipo de Consulta</label>
                        <select name="tipo_consulta" value={formData.tipo_consulta} onChange={handleChange} className="w-full p-2 border rounded dark:bg-slate-700 dark:border-slate-600 dark:text-white">
                            <option>Consulta Padrão</option>
                            <option>Primeira Consulta</option>
                            <option>Retorno</option>
                            <option>Exame</option>
                            <option>Telemedicina</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status de Confirmação</label>
                        <select name="status_confirmacao" value={formData.status_confirmacao} onChange={handleChange} className="w-full p-2 border rounded dark:bg-slate-700 dark:border-slate-600 dark:text-white">
                            <option>Pendente</option>
                            <option>Confirmado pelo Paciente</option>
                            <option>Lembrete Enviado</option>
                        </select>
                    </div>
                </div>

                {/* Novo campo para o Motivo da Consulta */}
                <div>
                    <label htmlFor="motivo_consulta" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Motivo da Consulta</label>
                    <textarea 
                        name="motivo_consulta" 
                        id="motivo_consulta" 
                        value={formData.motivo_consulta} 
                        onChange={handleChange} 
                        rows="3" 
                        placeholder="Ex: Dor de cabeça frequente, check-up anual, retorno para avaliação de exames..." 
                        className="w-full p-2 border rounded dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                    ></textarea>
                </div>
                
                {isEditing && (
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status do Agendamento</label>
                        <select name="status" value={formData.status} onChange={handleChange} className="w-full p-2 border rounded dark:bg-slate-700 dark:border-slate-600 dark:text-white">
                            <option>Agendado</option>
                            <option>Concluído</option>
                            <option>Cancelado</option>
                            <option>Não Compareceu</option>
                        </select>
                    </div>
                )}

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Observações (Recepção)</label>
                    <textarea name="observacoes_recepcao" value={formData.observacoes_recepcao} onChange={handleChange} rows="3" placeholder="Ex: Paciente tem preferência pelo horário da manhã, trazer exames anteriores..." className="w-full p-2 border rounded dark:bg-slate-700 dark:border-slate-600 dark:text-white"></textarea>
                </div>
                
                <button type="submit" disabled={isLoading} className="w-full h-11 flex justify-center items-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition disabled:bg-blue-800">
                    {isLoading ? <Spinner size="sm" /> : (isEditing ? 'Atualizar Agendamento' : 'Criar Agendamento')}
                </button>
            </form>
        </div>
    );
};

export default AgendamentoForm;