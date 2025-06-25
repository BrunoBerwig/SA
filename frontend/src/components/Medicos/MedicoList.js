import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaPlus, FaPencilAlt, FaTrash } from 'react-icons/fa';

const MedicoList = ({ medicos = [], onEdit, onDelete }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">Médicos</h2>
        <button onClick={() => navigate('/medicos/novo')} className="flex items-center bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition">
          <FaPlus className="mr-2" /> Novo Médico
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300 dark:border-slate-700">
          <thead className="bg-gray-50 dark:bg-slate-700">
            <tr>
              <th className="px-6 py-3 text-left text-gray-700 dark:text-gray-300 font-medium">Nome</th>
              <th className="px-6 py-3 text-left text-gray-700 dark:text-gray-300 font-medium">Especialidade</th>
              <th className="px-6 py-3 text-left text-gray-700 dark:text-gray-300 font-medium">CRM</th>
              <th className="px-6 py-3 text-center text-gray-700 dark:text-gray-300 font-medium">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-slate-700">
            {medicos.map((medico) => (
                <tr key={medico.id} className="hover:bg-gray-100 dark:hover:bg-slate-700/50">
                  <td className="px-6 py-4">
                    <Link to={`/medicos/${medico.id}`} className="flex items-center group">
                      <img src={medico.foto_url || `https://ui-avatars.com/api/?name=${medico.nome}&background=random`} alt={medico.nome} className="w-10 h-10 rounded-full mr-4" />
                      <span className="font-medium text-gray-900 dark:text-gray-200 group-hover:text-blue-600 dark:group-hover:text-blue-400">{medico.nome}</span>
                    </Link>
                  </td>
                  <td className="px-6 py-4 text-gray-700 dark:text-gray-300">{medico.especialidade}</td>
                  <td className="px-6 py-4 text-gray-700 dark:text-gray-300">{medico.crm_numero}/{medico.crm_uf}</td>
                  <td className="px-6 py-4 text-center">
                    <button onClick={() => navigate(`/medicos/editar/${medico.id}`)} className="text-blue-600 hover:text-blue-800 dark:hover:text-blue-400 mr-4"><FaPencilAlt /></button>
                    <button onClick={() => onDelete(medico.id)} className="text-red-600 hover:text-red-800 dark:hover:text-red-400"><FaTrash /></button>
                  </td>
                </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MedicoList;