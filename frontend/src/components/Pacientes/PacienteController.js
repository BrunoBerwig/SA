import React, { useEffect, useState } from 'react';
import PacienteList from './PacienteList';
import api from '../../services/api';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import ConfirmationModal from '../common/ConfirmationModal';

const PacienteController = () => {
    const [pacientes, setPacientes] = useState([]);
    const navigate = useNavigate();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [patientToDelete, setPatientToDelete] = useState(null);

    const fetchPacientes = async () => {
        try {
            const res = await api.get('/pacientes');
            setPacientes(res.data);
        } catch (err) {
            console.error('Erro ao buscar pacientes:', err);
            toast.error("Não foi possível carregar os pacientes.");
        }
    };

    useEffect(() => {
        fetchPacientes();
    }, []);

    const handleEdit = (paciente) => {
        navigate(`/pacientes/editar/${paciente.id}`);
    };

    const handleDeleteRequest = (id) => {
        setPatientToDelete(id);
        setIsModalOpen(true);  
    };
    const handleConfirmDelete = async () => {
        if (!patientToDelete) return;

        try {
            await api.delete(`/pacientes/${patientToDelete}`);
            toast.success('Paciente excluído com sucesso!');
            fetchPacientes();
        } catch (err) {
            console.error('Erro ao excluir paciente:', err);
            toast.error('Não foi possível excluir o paciente.');
        } finally {
            setIsModalOpen(false);
            setPatientToDelete(null);
        }
    };

    return (
        <>
            <PacienteList
                pacientes={pacientes}
                onEdit={handleEdit}
                onDelete={handleDeleteRequest}
            />
            <ConfirmationModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onConfirm={handleConfirmDelete}
                title="Confirmar Exclusão"
                message="Você tem certeza que deseja excluir este paciente? Esta ação não pode ser desfeita."
            />
        </>
    );
};

export default PacienteController;