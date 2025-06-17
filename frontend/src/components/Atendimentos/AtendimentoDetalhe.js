import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../services/api';

const AtendimentoDetalhe = () => {
  const { id } = useParams();
  const [atendimento, setAtendimento] = useState(null);

  useEffect(() => {
    async function fetchAtendimento() {
      try {
        const response = await api.get(`/atendimentos/${id}`);
        setAtendimento(response.data);
      } catch (error) {
        console.error('Erro ao buscar atendimento:', error);
      }
    }

    fetchAtendimento();
  }, [id]);

  if (!atendimento) {
    return (
      <div className="p-6">
        <p className="text-gray-500">Carregando atendimento...</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">📄 Detalhes do Atendimento</h2>
      <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
        <p className="mb-3">
          <span className="font-semibold text-gray-700">Paciente:</span> {atendimento.paciente_nome}
        </p>
        <p className="mb-3">
          <span className="font-semibold text-gray-700">Médico:</span> {atendimento.medico_nome}
        </p>
        <p className="mb-3">
          <span className="font-semibold text-gray-700">Data:</span> {atendimento.data}
        </p>
        <p className="mb-3">
          <span className="font-semibold text-gray-700">Hora:</span> {atendimento.hora}
        </p>
        <p className="mb-3">
          <span className="font-semibold text-gray-700">Observações:</span>{' '}
          {atendimento.observacoes || 'Nenhuma'}
        </p>
      </div>
    </div>
  );
};

export default AtendimentoDetalhe;
