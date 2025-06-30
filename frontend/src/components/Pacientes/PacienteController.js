import React, { useEffect, useState, useCallback } from 'react';
import PacienteList from './PacienteList';
import api from '../../services/api';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import ConfirmationModal from '../common/ConfirmationModal';
import Spinner from '../common/Spinner';
import useDebounce from '../../hooks/useDebounce';
import Pagination from '../common/Pagination';

const PacienteController = () => {
    const [pacientes, setPacientes] = useState([]);
    const [paginationInfo, setPaginationInfo] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [pacienteToDelete, setPacienteToDelete] = useState(null);

    const [filters, setFilters] = useState({
        search: '',
        convenio: '',
        page: 1,
        limit: 10,
    });
    
    const debouncedSearch = useDebounce(filters.search, 500);

    const fetchPacientes = useCallback(async (page = 1) => {
        setIsLoading(true);
        try {
            const params = new URLSearchParams({
                search: debouncedSearch,
                convenio: filters.convenio,
                page,
                limit: filters.limit,
            });
            const res = await api.get(`/pacientes?${params.toString()}`);
            setPacientes(res.data.data);
            setPaginationInfo(res.data.pagination);
        } catch (err) {
            toast.error("Não foi possível carregar a lista de pacientes.");
        } finally {
            setIsLoading(false);
        }
    }, [debouncedSearch, filters.convenio, filters.limit]);

    useEffect(() => {
        fetchPacientes(filters.page);
    }, [fetchPacientes, filters.page]);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value, page: 1 }));
    };

    const handlePageChange = (newPage) => {
        setFilters(prev => ({ ...prev, page: newPage }));
    };

    const handleEdit = (paciente) => {
        navigate(`/pacientes/editar/${paciente.id}`);
    };

    const handleDeleteRequest = (id) => {
        setPacienteToDelete(id);
        setIsModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!pacienteToDelete) return;
        try {
            await api.delete(`/pacientes/${pacienteToDelete}`);
            toast.success('Paciente excluído com sucesso!');
            fetchPacientes(filters.page);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Não foi possível excluir o paciente.');
        } finally {
            setIsModalOpen(false);
            setPacienteToDelete(null);
        }
    };

    return (
        <>
            <PacienteList
                pacientes={pacientes}
                onEdit={handleEdit}
                onDelete={handleDeleteRequest}
                filters={filters}
                onFilterChange={handleFilterChange}
                isLoading={isLoading}
            />
            {paginationInfo.totalPages > 1 && (
                <Pagination
                    currentPage={paginationInfo.currentPage}
                    totalPages={paginationInfo.totalPages}
                    onPageChange={handlePageChange}
                />
            )}
            <ConfirmationModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onConfirm={handleConfirmDelete}
                title="Confirmar Exclusão"
                message="Você tem certeza que deseja excluir este paciente?"
            />
        </>
    );
};

export default PacienteController;