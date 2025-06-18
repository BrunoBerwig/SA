import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaPlus, FaPencilAlt, FaTrash } from 'react-icons/fa';

const PacienteList = ({ pacientes = [], onEdit, onDelete }) => {
    const navigate = useNavigate();

    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-gray-800">Pacientes</h2>
                <button
                    onClick={() => navigate('/pacientes/novo')}
                    className="flex items-center bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition"
                >
                    <FaPlus className="mr-2" />
                    Novo Paciente
                </button>
            </div>
            
            <table className="min-w-full border border-gray-300 rounded-lg overflow-hidden">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="text-left px-6 py-3 text-gray-700 font-medium">Nome</th>
                        <th className="text-left px-6 py-3 text-gray-700 font-medium">Telefone</th>
                        <th className="text-left px-6 py-3 text-gray-700 font-medium">Email</th>
                        <th className="text-left px-6 py-3 text-gray-700 font-medium">Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {pacientes.length === 0 ? (
                        <tr>
                            <td colSpan="4" className="text-center py-6 text-gray-500 italic">
                                Nenhum paciente cadastrado
                            </td>
                        </tr>
                    ) : (
                        pacientes.map((paciente) => (
                            <tr key={paciente.id} className="border-t border-gray-200 hover:bg-gray-100 transition-colors">
                                <td className="px-6 py-4 text-gray-700">{paciente.nome}</td>
                                <td className="px-6 py-4 text-gray-700">{paciente.telefone}</td>
                                <td className="px-6 py-4 text-gray-700">{paciente.email}</td>
                                <td className="px-6 py-4 text-center">
                                    <button
                                        title="Editar"
                                        aria-label={`Editar paciente ${paciente.nome}`}
                                        className="text-blue-600 hover:text-blue-800 mr-4 transition transform hover:scale-110"
                                        onClick={() => onEdit(paciente)}
                                    >
                                        <FaPencilAlt size={16} />
                                    </button>
                                    <button
                                        title="Excluir"
                                        aria-label={`Excluir paciente ${paciente.nome}`}
                                        className="text-red-600 hover:text-red-800 transition transform hover:scale-110"
                                        onClick={() => onDelete(paciente.id)}
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
    );
};

export default PacienteList;