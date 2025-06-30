import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaPlus, FaPencilAlt, FaTrash, FaSearch } from 'react-icons/fa';
import Spinner from '../common/Spinner';

const PacienteList = ({ pacientes = [], onEdit, onDelete, filters, onFilterChange, isLoading }) => {
    const navigate = useNavigate();

    const conveniosParaFiltro = ['SulAmérica', 'Bradesco Saúde', 'Amil', 'Unimed', 'Outro'];

    return (
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6">
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">Pacientes</h2>
                <div className="w-full md:w-auto flex flex-col sm:flex-row items-center gap-2">
                    <div className="relative w-full sm:w-48">
                        <input
                            type="text"
                            name="search"
                            placeholder="Buscar por nome ou email..."
                            value={filters.search}
                            onChange={onFilterChange}
                            className="w-full pl-10 pr-4 py-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                        />
                        <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    </div>
                    <select
                        name="convenio"
                        value={filters.convenio}
                        onChange={onFilterChange}
                        className="w-full sm:w-auto p-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                    >
                        <option value="">Todos os Convênios</option>
                        {conveniosParaFiltro.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                    <button onClick={() => navigate('/pacientes/novo')} className="w-full sm:w-auto flex-shrink-0 flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition">
                        <FaPlus className="mr-2" />
                        Novo
                    </button>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full border border-gray-300 dark:border-slate-700 rounded-lg">
                    <thead className="bg-gray-50 dark:bg-slate-700">
                        <tr>
                            <th className="px-6 py-3 text-left text-gray-700 dark:text-gray-300 font-medium">Nome</th>
                            <th className="px-6 py-3 text-left text-gray-700 dark:text-gray-300 font-medium">Email</th>
                            <th className="px-6 py-3 text-left text-gray-700 dark:text-gray-300 font-medium">Telefone</th>
                            <th className="px-6 py-3 text-left text-gray-700 dark:text-gray-300 font-medium">Convênio</th>
                            <th className="px-6 py-3 text-center text-gray-700 dark:text-gray-300 font-medium">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-slate-700">
                        {isLoading && pacientes.length === 0 ? (
                            <tr><td colSpan="5" className="text-center py-10"><Spinner /></td></tr>
                        ) : pacientes.length > 0 ? (
                            pacientes.map((paciente) => (
                                <tr key={paciente.id} className="hover:bg-gray-100 dark:hover:bg-slate-700/50">
                                    <td className="px-6 py-4">
                                        <Link to={`/pacientes/${paciente.id}`} className="font-medium text-gray-900 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400">
                                            {paciente.nome}
                                        </Link>
                                    </td>
                                    <td className="px-6 py-4 text-gray-700 dark:text-gray-300">{paciente.email}</td>
                                    <td className="px-6 py-4 text-gray-700 dark:text-gray-300">{paciente.telefone}</td>
                                    <td className="px-6 py-4 text-gray-700 dark:text-gray-300">{paciente.convenio}</td>
                                    <td className="px-6 py-4 text-center">
                                        <button onClick={(e) => { e.stopPropagation(); onEdit(paciente); }} title="Editar" className="text-blue-600 hover:text-blue-800 dark:hover:text-blue-400 mr-4 transition transform hover:scale-110"><FaPencilAlt /></button>
                                        <button onClick={(e) => { e.stopPropagation(); onDelete(paciente.id); }} title="Excluir" className="text-red-600 hover:text-red-800 dark:hover:text-red-400 transition transform hover:scale-110"><FaTrash /></button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr><td colSpan="5" className="text-center py-10 text-gray-500 dark:text-gray-400">Nenhum paciente encontrado com os filtros atuais.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default PacienteList;