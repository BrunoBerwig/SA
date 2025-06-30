import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaPlus, FaPencilAlt, FaTrash, FaSearch } from 'react-icons/fa';
import Spinner from '../common/Spinner';

const MedicoList = ({ medicos = [], especialidades = [], onEdit, onDelete, filters, onFilterChange, isLoading }) => {
    const navigate = useNavigate();

    return (
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6">
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">Médicos</h2>
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
                        name="especialidade_id"
                        value={filters.especialidade_id}
                        onChange={onFilterChange}
                        className="w-full sm:w-auto p-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                    >
                        <option value="">Todas as Especialidades</option>
                        {especialidades.map(e => <option key={e.id} value={e.id}>{e.nome}</option>)}
                    </select>
                    <button onClick={() => navigate('/medicos/novo')} className="w-full sm:w-auto flex-shrink-0 flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition">
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
                            <th className="px-6 py-3 text-left text-gray-700 dark:text-gray-300 font-medium">Especialidade</th>
                            <th className="px-6 py-3 text-left text-gray-700 dark:text-gray-300 font-medium">CRM</th>
                            <th className="px-6 py-3 text-center text-gray-700 dark:text-gray-300 font-medium">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-slate-700">
                        {isLoading ? (
                            <tr><td colSpan="4" className="text-center py-10"><Spinner /></td></tr>
                        ) : medicos.length > 0 ? (
                            medicos.map((medico) => (
                                <tr key={medico.id} className="hover:bg-gray-100 dark:hover:bg-slate-700/50">
                                    <td className="px-6 py-4">
                                        <Link to={`/medicos/${medico.id}`} className="flex items-center group">
                                            <img src={medico.foto_url || `https://ui-avatars.com/api/?name=${medico.nome.replace(/\s/g, '+')}&background=random`} alt={medico.nome} className="w-10 h-10 rounded-full mr-4" />
                                            <span className="font-medium text-gray-900 dark:text-gray-200 group-hover:text-blue-600 dark:group-hover:text-blue-400">{medico.nome}</span>
                                        </Link>
                                    </td>
                                    <td className="px-6 py-4 text-gray-700 dark:text-gray-300">{medico.especialidade}</td>
                                    <td className="px-6 py-4 text-gray-700 dark:text-gray-300">{medico.crm_numero}/{medico.crm_uf}</td>
                                    <td className="px-6 py-4 text-center">
                                        <button onClick={() => onEdit(medico)} title="Editar" className="text-blue-600 hover:text-blue-800 dark:hover:text-blue-400 mr-4 transition transform hover:scale-110"><FaPencilAlt /></button>
                                        <button onClick={() => onDelete(medico.id)} title="Excluir" className="text-red-600 hover:text-red-800 dark:hover:text-red-400 transition transform hover:scale-110"><FaTrash /></button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr><td colSpan="4" className="text-center py-10 text-gray-500 dark:text-gray-400">Nenhum médico encontrado com os filtros atuais.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default MedicoList;