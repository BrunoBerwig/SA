import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../../services/api';
import toast from 'react-hot-toast';
import Spinner from '../common/Spinner';

const AgendamentoDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [agendamento, setAgendamento] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAgendamento = async () => {
            try {
                setIsLoading(true);
                setError(null);
                console.log('AgendamentoDetails: Buscando detalhes para o ID:', id);
                const response = await api.get(`/agendamentos/${id}`);
                console.log('AgendamentoDetails: Dados recebidos:', response.data);
                setAgendamento(response.data);
            } catch (err) {
                console.error("AgendamentoDetails: Erro ao carregar detalhes do agendamento:", err);
                if (err.response && err.response.status === 404) {
                    setError("Agendamento não encontrado ou o ID está incorreto.");
                    toast.error("Agendamento não encontrado.");
                } else {
                    setError("Não foi possível carregar os detalhes do agendamento. Por favor, tente novamente.");
                    toast.error("Erro ao carregar detalhes do agendamento.");
                }
            } finally {
                setIsLoading(false);
            }
        };

        if (id) {
            fetchAgendamento();
        } else {
            setError("ID do agendamento não fornecido na URL. Por favor, volte e selecione um agendamento.");
            setIsLoading(false);
        }
    }, [id]);

    const formatarDataHora = (dataHoraString) => {
        if (!dataHoraString) return 'Não informada';
        const date = new Date(dataHoraString);
        return date.toLocaleString('pt-BR', { 
            day: '2-digit', 
            month: '2-digit', 
            year: 'numeric', 
            hour: '2-digit', 
            minute: '2-digit' 
        });
    };

    const isFieldEmpty = (value) => {
        return value === undefined || value === null || (typeof value === 'string' && value.trim() === '');
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-48">
                <Spinner size="lg" />
                <p className="ml-3 text-gray-700 dark:text-gray-300">Carregando detalhes do agendamento...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-xl mx-auto p-6 bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-300 rounded-lg shadow-md">
                <p className="text-lg font-semibold mb-2">Erro:</p>
                <p>{error}</p>
                <button
                    onClick={() => navigate('/agendamentos')}
                    className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
                >
                    Voltar para a Lista de Agendamentos
                </button>
            </div>
        );
    }

    if (!agendamento) {
        return (
            <div className="max-w-xl mx-auto p-6 bg-yellow-100 dark:bg-yellow-900 border border-yellow-400 dark:border-yellow-700 text-yellow-700 dark:text-yellow-300 rounded-lg shadow-md">
                <p className="text-lg font-semibold mb-2">Agendamento não encontrado.</p>
                <p>O ID pode estar incorreto ou o agendamento foi removido.</p>
                <button
                    onClick={() => navigate('/agendamentos')}
                    className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
                >
                    Voltar para a Lista de Agendamentos
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 border border-gray-200 dark:border-slate-700">
            <h1 className="text-3xl font-extrabold text-gray-900 dark:text-gray-100 mb-6 border-b pb-4 border-gray-200 dark:border-slate-700">
                Detalhes do Agendamento
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8 text-gray-700 dark:text-gray-300">
                <div className="mb-4">
                    <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">Paciente</p>
                    {/* Link para os detalhes do paciente - apenas texto */}
                    <Link
                        to={`/pacientes/${agendamento.paciente_id}`}
                        // Removido 'hover:underline' daqui
                        className="font-medium text-gray-900 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition"
                        >
                            {agendamento.paciente_nome}
                        </Link>
                </div>
                <div className="mb-4">
                    <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">Médico</p>
                    {/* Link para os detalhes do médico - apenas texto */}
                    <Link 
                        to={`/medicos/${agendamento.medico_id}`} 
                        // Removido 'hover:underline' daqui
                        className="font-medium text-gray-900 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition"
                    >
                        {agendamento.medico_nome}
                    </Link>
                </div>
                <div className="mb-4">
                    <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">Data e Hora</p>
                    <p className="text-lg font-medium">{formatarDataHora(agendamento.data_hora)}</p>
                </div>
                <div className="mb-4">
                    <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">Tipo de Consulta</p>
                    <p className="text-lg font-medium">{agendamento.tipo_consulta}</p>
                </div>
                <div className="mb-4">
                    <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">Status do Agendamento</p>
                    <p className="text-lg font-medium">{agendamento.status}</p>
                </div>
                <div className="mb-4">
                    <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">Status de Confirmação</p>
                    <p className="text-lg font-medium">{agendamento.status_confirmacao}</p>
                </div>
                
                <div className="md:col-span-2 mb-4">
                    <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">Motivo da Consulta</p>
                    <p className="text-lg font-medium whitespace-pre-wrap">
                        {isFieldEmpty(agendamento.motivo_consulta) ? 'Não informado' : agendamento.motivo_consulta}
                    </p>
                </div>

                <div className="md:col-span-2 mb-4">
                    <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">Observações (Recepção)</p>
                    <p className="text-lg font-medium whitespace-pre-wrap">
                        {isFieldEmpty(agendamento.observacoes_recepcao) ? 'Nenhuma observação' : agendamento.observacoes_recepcao}
                    </p>
                </div>
            </div>

            <div className="flex justify-end gap-4 mt-8 pt-4 border-t border-gray-200 dark:border-slate-700">
                <button
                    onClick={() => navigate(`/agendamentos/editar/${agendamento.id}`)}
                    className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition"
                >
                    Editar Agendamento
                </button>
                <button
                    onClick={() => navigate('/agendamentos')}
                    className="px-6 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold rounded-lg transition dark:bg-slate-700 dark:text-white dark:hover:bg-slate-600"
                >
                    Voltar para a Lista
                </button>
            </div>
        </div>
    );
};

export default AgendamentoDetails;