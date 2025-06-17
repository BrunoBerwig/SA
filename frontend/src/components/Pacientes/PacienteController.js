import React, { useEffect, useState } from 'react';
import PacienteList from './PacienteList';
import api from '../../services/api';
import { useNavigate } from 'react-router-dom';

const PacienteController = () => {
    const [pacientes, setPacientes] = useState([]);
    const navigate = useNavigate();

    const fetchPacientes = async () => {
        try {
            const res = await api.get('/pacientes');
            setPacientes(res.data);
        } catch (err) {
            console.error('Erro ao buscar pacientes:', err);
        }
    };

    useEffect(() => {
        fetchPacientes();
    }, []);

    const handleEdit = (paciente) => {
        navigate(`/pacientes/editar/${paciente.id}`);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Tem certeza que deseja excluir este paciente?')) {
            try {
                await api.delete(`/pacientes/${id}`);
                fetchPacientes();
            } catch (err) {
                console.error('Erro ao excluir paciente:', err);
                alert('Não foi possível excluir o paciente.');
            }
        }
    };

    return (
        <PacienteList
            pacientes={pacientes}
            onEdit={handleEdit}
            onDelete={handleDelete}
        />
    );
};

export default PacienteController;