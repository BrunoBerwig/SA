import React from 'react';
import { Link } from 'react-router-dom';

const AtendimentoList = ({ atendimentos = [] }) => {
  // Se atendimentos for undefined, usamos array vazio como fallback
  const listaAtendimentos = atendimentos || [];

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Atendimentos do Dia</h2>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Paciente
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Médico
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Hora
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {listaAtendimentos.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-500">
                  Nenhum atendimento registrado para hoje
                </td>
              </tr>
            ) : (
              listaAtendimentos.map((atendimento) => (
                <tr key={atendimento.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {atendimento.paciente_nome}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {atendimento.medico_nome}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(atendimento.hora).toLocaleTimeString('pt-BR', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      atendimento.status === 'Agendado' ? 'bg-blue-100 text-blue-800' :
                      atendimento.status === 'Concluído' ? 'bg-green-100 text-green-800' :
                      atendimento.status === 'Cancelado' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {atendimento.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <Link
                      to={`/atendimentos/${atendimento.id}`}
                      className="text-indigo-600 hover:text-indigo-900 hover:underline"
                    >
                      Ver detalhes
                    </Link>
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

export default AtendimentoList;