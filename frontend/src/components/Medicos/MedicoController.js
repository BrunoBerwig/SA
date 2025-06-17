import React, { useEffect, useState } from 'react';
import MedicoList from './MedicoList';
import api from '../../services/api';
import { useNavigate } from 'react-router-dom';

const MedicoController = () => {
    const [medicos, setMedicos] = useState([]);
    const navigate = useNavigate();

    const fetchMedicos = async () => {
        try {
            const res = await api.get('/medicos');
            setMedicos(res.data);
        } catch (err) {
            console.error('Erro ao buscar médicos:', err);
        }
    };

    useEffect(() => {
        fetchMedicos();
    }, []);

    const handleEdit = (medico) => {
        navigate(`/medicos/editar/${medico.id}`);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Tem certeza que deseja excluir este médico?')) {
            try {
                await api.delete(`/medicos/${id}`);
                fetchMedicos();
            } catch (err) {
                console.error('Erro ao excluir médico:', err);
                alert('Não foi possível excluir o médico.');
            }
        }
    };

    return (
        <MedicoList
            medicos={medicos}
            onEdit={handleEdit}
            onDelete={handleDelete}
        />
    );
};

export default MedicoController;