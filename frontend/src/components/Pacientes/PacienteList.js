import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaPlus, FaPencilAlt, FaTrash } from 'react-icons/fa';

const PacienteList = ({ pacientes = [], onEdit, onDelete }) => {
    const navigate = useNavigate();

    const handleRowClick = (pacienteId) => {
        navigate(`/pacientes/${pacienteId}`);
    };

    const handleEditClick = (event, paciente) => {
        event.stopPropagation();
        if (onEdit) {
            onEdit(paciente);
        } else {
            console.warn("Prop 'onEdit' não foi fornecida ao PacienteList. Implementando navegação padrão.");
            navigate(`/pacientes/edit/${paciente.id}`);
        }
    };

    const handleDeleteClick = (event, pacienteId) => {
        event.stopPropagation();
        onDelete(pacienteId);
    };

    return (
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">Pacientes</h2>
                <button
                    onClick={() => navigate('/pacientes/novo')}
                    className="flex items-center bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition"
                >
                    <FaPlus className="mr-2" />
                    Novo Paciente
                </button>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full border border-gray-300 dark:border-slate-700 rounded-lg overflow-hidden">
                    <thead className="bg-gray-50 dark:bg-slate-700">
                        <tr>
                            <th className="text-left px-6 py-3 text-gray-700 dark:text-gray-300 font-medium">Nome</th>
                            <th className="text-left px-6 py-3 text-gray-700 dark:text-gray-300 font-medium">Telefone</th>
                            <th className="text-left px-6 py-3 text-gray-700 dark:text-gray-300 font-medium">Email</th>
                            <th className="text-center px-6 py-3 text-gray-700 dark:text-gray-300 font-medium">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-slate-700">
                        {pacientes.length === 0 ? (
                            <tr>
                                <td colSpan="4" className="text-center py-6 text-gray-500 dark:text-gray-400 italic">
                                    Nenhum paciente cadastrado
                                </td>
                            </tr>
                        ) : (
                            pacientes.map((paciente) => (
                                <tr
                                    key={paciente.id}
                                    className="hover:bg-gray-100 dark:hover:bg-slate-700/50 transition-colors cursor-pointer"
                                    onClick={() => handleRowClick(paciente.id)}
                                >
                                    <td className="px-6 py-4 text-gray-700 dark:text-gray-300">{paciente.nome}</td>
                                    <td className="px-6 py-4 text-gray-700 dark:text-gray-300">{paciente.telefone}</td>
                                    <td className="px-6 py-4 text-gray-700 dark:text-gray-300">{paciente.email}</td>
                                    <td className="px-6 py-4 text-center">
                                        <button
                                            title="Editar"
                                            aria-label={`Editar paciente ${paciente.nome}`}
                                            className="text-blue-600 hover:text-blue-800 dark:hover:text-blue-400 mr-4 transition transform hover:scale-110"
                                            onClick={(e) => handleEditClick(e, paciente)}
                                        >
                                            <FaPencilAlt size={16} />
                                        </button>
                                        <button
                                            title="Excluir"
                                            aria-label={`Excluir paciente ${paciente.nome}`}
                                            className="text-red-600 hover:text-red-800 dark:hover:text-red-400 transition transform hover:scale-110"
                                            onClick={(e) => handleDeleteClick(e, paciente.id)}
                                        >
                                            <FaTrash size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default PacienteList;