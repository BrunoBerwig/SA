import React, { useEffect, useState, useCallback } from 'react';
import AgendamentoList from './AgendamentoList';
import api from '../../services/api';
import toast from 'react-hot-toast';
import ConfirmationModal from '../common/ConfirmationModal';
import Spinner from '../common/Spinner';

const AgendamentoController = () => {
    const [agendamentos, setAgendamentos] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [agendamentoToDelete, setAgendamentoToDelete] = useState(null);

    const fetchAgendamentos = useCallback(async () => {
        setIsLoading(true);
        try {
            const res = await api.get('/agendamentos');
            setAgendamentos(res.data);
        } catch (err) {
            toast.error("Não foi possível carregar os agendamentos.");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchAgendamentos();
    }, [fetchAgendamentos]);

    const handleDeleteRequest = (id) => {
        setAgendamentoToDelete(id);
        setIsModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!agendamentoToDelete) return;
        
        try {
            await api.delete(`/agendamentos/${agendamentoToDelete}`);
            toast.success('Agendamento excluído com sucesso!');
            fetchAgendamentos();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Não foi possível excluir o agendamento.');
        } finally {
            setIsModalOpen(false);
            setAgendamentoToDelete(null);
        }
    };

    if (isLoading) {
        return <div className="flex justify-center p-10"><Spinner size="lg" /></div>;
    }

    return (
        <>
            <AgendamentoList
                agendamentos={agendamentos}
                onDelete={handleDeleteRequest}
            />
            <ConfirmationModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onConfirm={handleConfirmDelete}
                title="Confirmar Exclusão"
                message="Você tem certeza que deseja excluir este agendamento? Esta ação não pode ser desfeita."
            />
        </>
    );
};

export default AgendamentoController;