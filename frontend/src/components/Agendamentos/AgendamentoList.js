import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaPlus } from 'react-icons/fa';

const AgendamentoList = ({ agendamentos = [], onDelete }) => {
    const navigate = useNavigate();

    return (
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-gray-800">Agendamentos</h2>
                <button
                    onClick={() => navigate('/agendamentos/novo')}
                    className="flex items-center bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition"
                >
                    <FaPlus className="mr-2" />
                    Novo Agendamento
                </button>
            </div>
            
            <table className="min-w-full border border-gray-300 rounded-lg overflow-hidden">
                <thead className="bg-gray-50 dark:bg-slate-700">
                    <tr>
                        <th className="text-left px-6 py-3 text-gray-700 dark:text-gray-300 font-medium">Paciente</th>
                        <th className="text-left px-6 py-3 text-gray-700 dark:text-gray-300 font-medium">Médico</th>
                        <th className="text-left px-6 py-3 text-gray-700 dark:text-gray-300 font-medium">Data/Hora</th>
                        <th className="text-left px-6 py-3 text-gray-700 dark:text-gray-300 font-medium">Status</th>
                        <th className="text-center px-6 py-3 text-gray-700 dark:text-gray-300 font-medium">Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {agendamentos.length === 0 ? (
                        <tr>
                            <td colSpan="5" className="text-center py-6 text-gray-500 italic">
                                Nenhum agendamento registrado
                            </td>
                        </tr>
                    ) : (
                        agendamentos.map((agendamento) => (
                            <tr key={agendamento.id} className="border-gray-200 hover:bg-gray-100 dark:hover:bg-slate-700/50 transition-colors">
                                <td className="px-6 py-4 text-gray-700 dark:text-gray-300">{agendamento.paciente_nome}</td>
                                <td className="px-6 py-4 text-gray-700 dark:text-gray-300">{agendamento.medico_nome}</td>
                                <td className="px-6 py-4 text-gray-700 dark:text-gray-300">
                                    {new Date(agendamento.data_hora).toLocaleString('pt-BR')}
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800`}>
                                        {agendamento.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <button
                                        className="text-red-600 hover:underline"
                                        onClick={() => onDelete(agendamento.id)}
                                    >
                                        Cancelar
                                    </button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default AgendamentoList;