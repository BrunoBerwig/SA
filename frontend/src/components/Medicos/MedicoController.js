import React, { useEffect, useState, useCallback } from 'react';
import MedicoList from './MedicoList';
import api from '../../services/api';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import ConfirmationModal from '../common/ConfirmationModal';
import Spinner from '../common/Spinner';

const MedicoController = () => {
    const [medicos, setMedicos] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    // Estados para o modal de exclusão
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [medicoToDelete, setMedicoToDelete] = useState(null);

    const fetchMedicos = useCallback(async () => {
        setIsLoading(true);
        try {
            const res = await api.get('/medicos');
            setMedicos(res.data);
        } catch (err) {
            toast.error("Não foi possível carregar a lista de médicos.");
            console.error('Erro ao buscar médicos:', err);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchMedicos();
    }, [fetchMedicos]);

    const handleEdit = (medico) => {
        navigate(`/medicos/editar/${medico.id}`);
    };

    // Abre o modal de confirmação
    const handleDeleteRequest = (id) => {
        setMedicoToDelete(id);
        setIsModalOpen(true);
    };

    // Executa a exclusão após a confirmação
    const handleConfirmDelete = async () => {
        if (!medicoToDelete) return;
        
        try {
            await api.delete(`/medicos/${medicoToDelete}`);
            toast.success('Médico excluído com sucesso!');
            fetchMedicos(); // Atualiza a lista após a exclusão
        } catch (err) {
            toast.error(err.response?.data?.message || 'Não foi possível excluir o médico.');
            console.error('Erro ao excluir médico:', err);
        } finally {
            setIsModalOpen(false);
            setMedicoToDelete(null);
        }
    };

    if (isLoading) {
        return <div className="flex justify-center p-10"><Spinner size="lg" /></div>;
    }

    return (
        <>
            <MedicoList
                medicos={medicos}
                onEdit={handleEdit}
                onDelete={handleDeleteRequest}
            />
            <ConfirmationModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onConfirm={handleConfirmDelete}
                title="Confirmar Exclusão"
                message="Você tem certeza que deseja excluir este médico? Se houver agendamentos vinculados, a exclusão falhará para proteger os dados."
            />
        </>
    );
};

export default MedicoController;