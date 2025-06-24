// src/components/PacienteDetails.js

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import toast from 'react-hot-toast';
import Spinner from '../common/Spinner';

const PacienteDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [paciente, setPaciente] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPaciente = async () => {
            try {
                setIsLoading(true);
                console.log('PacienteDetails: Buscando detalhes para o ID:', id);
                const response = await api.get(`/pacientes/${id}`);
                console.log('PacienteDetails: Dados recebidos:', response.data);
                setPaciente(response.data);
                setError(null);
            } catch (err) {
                console.error("PacienteDetails: Erro ao carregar detalhes do paciente:", err);
                if (err.response && err.response.status === 404) {
                    setError("Paciente não encontrado ou o ID está incorreto.");
                    toast.error("Paciente não encontrado.");
                } else {
                    setError("Não foi possível carregar os detalhes do paciente. Por favor, tente novamente.");
                    toast.error("Erro ao carregar detalhes do paciente.");
                }
            } finally {
                setIsLoading(false);
            }
        };

        if (id) {
            fetchPaciente();
        } else {
            // Caso não haja ID na URL, o que pode indicar um problema de rota
            setError("ID do paciente não fornecido na URL. Por favor, volte e selecione um paciente.");
            setIsLoading(false);
        }
    }, [id]);

    const calcularIdade = (dataNascimentoString) => {
        if (!dataNascimentoString) return 'Não informada';
        const dataNascimento = new Date(dataNascimentoString);
        const hoje = new Date();

        let idade = hoje.getFullYear() - dataNascimento.getFullYear();
        const mes = hoje.getMonth() - dataNascimento.getMonth();

        if (mes < 0 || (mes === 0 && hoje.getDate() < dataNascimento.getDate())) {
            idade--;
        }
        return `${idade} anos`;
    };

    // Função para formatar a data de nascimento para exibição
    const formatarData = (dataString) => {
        if (!dataString) return 'Não informada';
        const date = new Date(dataString);
        return new Date(date.toISOString().split('T')[0] + 'T00:00:00').toLocaleDateString('pt-BR');
    };


    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-48">
                <Spinner size="lg" />
                <p className="ml-3 text-gray-700 dark:text-gray-300">Carregando detalhes do paciente...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-xl mx-auto p-6 bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-300 rounded-lg shadow-md">
                <p className="text-lg font-semibold mb-2">Erro:</p>
                <p>{error}</p>
                <button
                    onClick={() => navigate('/pacientes')}
                    className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
                >
                    Voltar para a Lista de Pacientes
                </button>
            </div>
        );
    }

    if (!paciente) {
        return (
            <div className="max-w-xl mx-auto p-6 bg-yellow-100 dark:bg-yellow-900 border border-yellow-400 dark:border-yellow-700 text-yellow-700 dark:text-yellow-300 rounded-lg shadow-md">
                <p className="text-lg font-semibold mb-2">Paciente não encontrado.</p>
                <p>O ID pode estar incorreto ou o paciente foi removido.</p>
                <button
                    onClick={() => navigate('/pacientes')}
                    className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
                >
                    Voltar para a Lista de Pacientes
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 border border-gray-200 dark:border-slate-700">
            <h1 className="text-3xl font-extrabold text-gray-900 dark:text-gray-100 mb-6 border-b pb-4 border-gray-200 dark:border-slate-700">
                Detalhes do Paciente: {paciente.nome}
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8 text-gray-700 dark:text-gray-300">
                <div className="mb-4">
                    <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">Email</p>
                    <p className="text-lg font-medium">{paciente.email}</p>
                </div>
                <div className="mb-4">
                    <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">Telefone</p>
                    <p className="text-lg font-medium">{paciente.telefone}</p>
                </div>
                <div className="mb-4">
                    <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">Convênio</p>
                    <p className="text-lg font-medium">{paciente.convenio || 'Não informado'}</p>
                </div>

                {/* Novos Campos */}
                <div className="mb-4">
                    <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">Data de Nascimento</p>
                    <p className="text-lg font-medium">{formatarData(paciente.data_nascimento)}</p>
                </div>
                <div className="mb-4">
                    <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">Idade</p>
                    <p className="text-lg font-medium">{calcularIdade(paciente.data_nascimento)}</p>
                </div>
                <div className="md:col-span-2 mb-4">
                    <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">Alergias</p>
                    <p className="text-lg font-medium whitespace-pre-wrap">{paciente.alergias || 'Nenhuma alergia informada.'}</p>
                </div>
                <div className="md:col-span-2 mb-4">
                    <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">Condições Médicas</p>
                    <p className="text-lg font-medium whitespace-pre-wrap">{paciente.condicoes_medicas || 'Nenhuma condição médica informada.'}</p>
                </div>
                <div className="mb-4">
                    <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">Nome Contato de Emergência</p>
                    <p className="text-lg font-medium">{paciente.contato_emergencia_nome || 'Não informado'}</p>
                </div>
                {/* Adicionar mais campos aqui conforme for adicionado no DB e no formulário */}
            </div>

            <div className="flex justify-end gap-4 mt-8 pt-4 border-t border-gray-200 dark:border-slate-700">
                <button
                    onClick={() => navigate(`/pacientes/edit/${id}`)}
                    className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition"
                >
                    Editar Paciente
                </button>
                <button
                    onClick={() => navigate('/pacientes')}
                    className="px-6 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold rounded-lg transition dark:bg-slate-700 dark:text-white dark:hover:bg-slate-600"
                >
                    Voltar para a Lista
                </button>
            </div>
        </div>
    );
};

export default PacienteDetails;