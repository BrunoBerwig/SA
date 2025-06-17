import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaPlus } from 'react-icons/fa';

const MedicoList = ({ medicos = [], onEdit, onDelete }) => {
  const navigate = useNavigate();
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">Médicos</h2>
        <button
          onClick={() => navigate('/medicos/novo')}
          className="flex items-center bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition"
        >
          <FaPlus className="mr-2" />
          Novo Médico
        </button>
      </div>
      <table className="min-w-full border border-gray-300 rounded-lg overflow-hidden">
        <thead className="bg-gray-50">
          <tr>
            <th className="text-left px-6 py-3 text-gray-700 font-medium">Nome</th>
            <th className="text-left px-6 py-3 text-gray-700 font-medium">Especialidade</th>
            <th className="text-left px-6 py-3 text-gray-700 font-medium">Email</th> 
            {/* NOVA COLUNA: Telefone */}
            <th className="text-left px-6 py-3 text-gray-700 font-medium">Telefone</th> 
            <th className="text-left px-6 py-3 text-gray-700 font-medium">Ações</th>
          </tr>
        </thead>
        <tbody>
          {medicos.length === 0 ? (
            <tr>
              <td colSpan="5" className="text-center py-6 text-gray-500 italic"> {/* Aumenta o colSpan */}
                Nenhum médico cadastrado
              </td>
            </tr>
          ) : (
            medicos.map((medico) => (
              <tr
                key={medico.id}
                className="border-t border-gray-200 hover:bg-gray-100 transition-colors"
              >
                <td className="px-6 py-4 text-gray-700">{medico.nome}</td>
                <td className="px-6 py-4 text-gray-700">{medico.especialidade}</td>
                <td className="px-6 py-4 text-gray-700">{medico.email}</td> 
                {/* NOVO CAMPO: Exibe o telefone */}
                <td className="px-6 py-4 text-gray-700">{medico.telefone}</td> 
                <td className="px-6 py-4">
                  <button
                    className="text-blue-600 hover:underline mr-4"
                    onClick={() => onEdit(medico)}
                  >
                    Editar
                  </button>
                  <button
                    className="text-red-600 hover:underline"
                    onClick={() => onDelete(medico.id)}
                  >
                    Excluir
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

export default MedicoList;
