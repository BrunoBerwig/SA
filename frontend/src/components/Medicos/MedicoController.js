import React, { useEffect, useState } from 'react';
import MedicoList from './MedicoList';
import api from '../../services/api';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import ConfirmationModal from '../common/ConfirmationModal';

const MedicoController = () => {
    const [medicos, setMedicos] = useState([]);
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [medicoToDelete, setMedicoToDelete] = useState(null);

    const fetchMedicos = async () => {
        try {
            const res = await api.get('/medicos');
            setMedicos(res.data);
        } catch (err) {
            console.error('Erro ao buscar médicos:', err);
            toast.error("Não foi possível carregar os médicos.");
        }
    };

    useEffect(() => {
        fetchMedicos();
    }, []);

    const handleEdit = (medico) => {
        navigate(`/medicos/editar/${medico.id}`);
    };

    const handleDeleteRequest = (id) => {
        setMedicoToDelete(id);
        setIsModalOpen(true);
    };
    const handleConfirmDelete = async () => {
        if (!medicoToDelete) return;

        try {
            await api.delete(`/medicos/${medicoToDelete}`);
            toast.success('Médico excluído com sucesso!');
            fetchMedicos();
        } catch (err) {
            console.error('Erro ao excluir médico:', err);
            toast.error('Não foi possível excluir o médico.');
        } finally {
            setIsModalOpen(false);
            setMedicoToDelete(null);
        }
    };

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
                message="Você tem certeza que deseja excluir este médico? Esta ação não pode ser desfeita."
            />
        </>
    );
};

export default MedicoController;