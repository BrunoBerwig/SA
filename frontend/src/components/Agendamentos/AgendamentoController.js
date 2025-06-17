import React, { useEffect, useState } from 'react';
import AgendamentoList from './AgendamentoList';
import api from '../../services/api';

const AgendamentoController = () => {
    const [agendamentos, setAgendamentos] = useState([]);

    const fetchAgendamentos = async () => {
        try {
            const res = await api.get('/agendamentos');
            setAgendamentos(res.data);
        } catch (err) {
            console.error('Erro ao buscar agendamentos:', err);
        }
    };

    useEffect(() => {
        fetchAgendamentos();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm('Tem certeza que deseja cancelar este agendamento?')) {
            try {
                await api.delete(`/agendamentos/${id}`);
                fetchAgendamentos();
            } catch (err) {
                console.error('Erro ao excluir agendamento:', err);
                alert('Não foi possível excluir o agendamento.');
            }
        }
    };
    
    return (
        <AgendamentoList
            agendamentos={agendamentos}
            onDelete={handleDelete}
        />
    );
};

export default AgendamentoController;