import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaPlus, FaPencilAlt, FaTrash, FaSearch } from 'react-icons/fa';
import Spinner from '../common/Spinner';

const AgendamentoList = ({ agendamentos = [], medicos = [], onDelete, filters, onFilterChange, isLoading }) => {
    const navigate = useNavigate();

    const getStatusClass = (status) => {
        switch (status) {
            case 'Agendado':
                return 'bg-blue-100 text-blue-800 dark:bg-blue-900/70 dark:text-blue-300';
            case 'Concluído':
                return 'bg-green-100 text-green-800 dark:bg-green-900/70 dark:text-green-300';
            case 'Cancelado':
                return 'bg-red-100 text-red-800 dark:bg-red-900/70 dark:text-red-300';
            case 'Não Compareceu':
                return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/70 dark:text-yellow-300';
            default:
                return 'bg-gray-100 text-gray-800 dark:bg-gray-900/70 dark:text-gray-300';
        }
    };

    return (
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6">
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">Agendamentos</h2>
                <div className="w-full md:w-auto flex flex-col sm:flex-row items-center gap-2">
                    <div className="relative w-full sm:w-48">
                        <input
                            type="text"
                            name="search"
                            placeholder="Buscar paciente ou médico..."
                            value={filters.search}
                            onChange={onFilterChange}
                            className="w-full pl-10 pr-4 py-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                        />
                        <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    </div>
                    <select name="medico_id" value={filters.medico_id} onChange={onFilterChange} className="w-full sm:w-auto p-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600 dark:text-white">
                        <option value="">Todos os Médicos</option>
                        {medicos.map(m => <option key={m.id} value={m.id}>{m.nome}</option>)}
                    </select>
                    <select name="status" value={filters.status} onChange={onFilterChange} className="w-full sm:w-auto p-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600 dark:text-white">
                        <option value="">Todos os Status</option>
                        <option value="Agendado">Agendado</option>
                        <option value="Concluído">Concluído</option>
                        <option value="Cancelado">Cancelado</option>
                        <option value="Não Compareceu">Não Compareceu</option>
                    </select>
                    <button onClick={() => navigate('/agendamentos/novo')} className="w-full sm:w-auto flex-shrink-0 flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition">
                        <FaPlus className="mr-2" />
                        Novo
                    </button>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full border border-gray-300 dark:border-slate-700 rounded-lg">
                    <thead className="bg-gray-50 dark:bg-slate-700">
                        <tr>
                            <th className="px-6 py-3 text-left text-gray-700 dark:text-gray-300 font-medium">Paciente</th>
                            <th className="px-6 py-3 text-left text-gray-700 dark:text-gray-300 font-medium">Médico</th>
                            <th className="px-6 py-3 text-left text-gray-700 dark:text-gray-300 font-medium">Data/Hora</th>
                            <th className="px-6 py-3 text-left text-gray-700 dark:text-gray-300 font-medium">Status</th>
                            <th className="px-6 py-3 text-center text-gray-700 dark:text-gray-300 font-medium">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-slate-700">
                        {isLoading ? (
                            <tr><td colSpan="5" className="text-center py-10"><Spinner /></td></tr>
                        ) : agendamentos.length > 0 ? (
                            agendamentos.map((ag) => (
                                <tr key={ag.id} className="hover:bg-gray-100 dark:hover:bg-slate-700/50">
                                    <td className="px-6 py-4 text-gray-700 dark:text-gray-300">{ag.paciente_nome}</td>
                                    <td className="px-6 py-4 text-gray-700 dark:text-gray-300">{ag.medico_nome}</td>
                                    <td className="px-6 py-4 text-gray-700 dark:text-gray-300">{new Date(ag.data_hora).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(ag.status)}`}>
                                            {ag.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <button onClick={() => navigate(`/agendamentos/editar/${ag.id}`)} title="Editar" className="text-blue-600 hover:text-blue-800 dark:hover:text-blue-400 mr-4 transition transform hover:scale-110"><FaPencilAlt /></button>
                                        <button onClick={() => onDelete(ag.id)} title="Excluir" className="text-red-600 hover:text-red-800 dark:hover:text-red-400 transition transform hover:scale-110"><FaTrash /></button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                             <tr><td colSpan="5" className="text-center py-10 text-gray-500 dark:text-gray-400">Nenhum agendamento encontrado com os filtros atuais.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AgendamentoList;