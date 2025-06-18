import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaPlus, FaPencilAlt, FaTrash } from 'react-icons/fa';

const MedicoList = ({ medicos = [], onEdit, onDelete }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">Médicos</h2>
        <button
          onClick={() => navigate('/medicos/novo')}
          className="flex items-center bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition"
        >
          <FaPlus className="mr-2" />
          Novo Médico
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300 dark:border-slate-700 rounded-lg overflow-hidden">
          <thead className="bg-gray-50 dark:bg-slate-700">
            <tr>
              <th className="text-left px-6 py-3 text-gray-700 dark:text-gray-300 font-medium">Nome</th>
              <th className="text-left px-6 py-3 text-gray-700 dark:text-gray-300 font-medium">Especialidade</th>
              <th className="text-left px-6 py-3 text-gray-700 dark:text-gray-300 font-medium">Email</th>
              <th className="text-left px-6 py-3 text-gray-700 dark:text-gray-300 font-medium">Telefone</th>
              <th className="text-center px-6 py-3 text-gray-700 dark:text-gray-300 font-medium">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-slate-700">
            {medicos.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center py-6 text-gray-500 dark:text-gray-400 italic">
                  Nenhum médico cadastrado
                </td>
              </tr>
            ) : (
              medicos.map((medico) => (
                <tr key={medico.id} className="hover:bg-gray-100 dark:hover:bg-slate-700/50 transition-colors">
                  <td className="px-6 py-4 text-gray-700 dark:text-gray-300">{medico.nome}</td>
                  <td className="px-6 py-4 text-gray-700 dark:text-gray-300">{medico.especialidade}</td>
                  <td className="px-6 py-4 text-gray-700 dark:text-gray-300">{medico.email}</td>
                  <td className="px-6 py-4 text-gray-700 dark:text-gray-300">{medico.telefone}</td>
                  <td className="px-6 py-4 text-center">
                    <button
                      title="Editar"
                      aria-label={`Editar médico ${medico.nome}`}
                      className="text-blue-600 hover:text-blue-800 dark:hover:text-blue-400 mr-4 transition transform hover:scale-110"
                      onClick={() => onEdit(medico)}
                    >
                      <FaPencilAlt size={16} />
                    </button>
                    <button
                      title="Excluir"
                      aria-label={`Excluir médico ${medico.nome}`}
                      className="text-red-600 hover:text-red-800 dark:hover:text-red-400 transition transform hover:scale-110"
                      onClick={() => onDelete(medico.id)}
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

export default MedicoList;