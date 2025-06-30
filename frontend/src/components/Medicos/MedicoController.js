import React, { useEffect, useState, useCallback } from 'react';
import MedicoList from './MedicoList';
import api from '../../services/api';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import ConfirmationModal from '../common/ConfirmationModal';
import Spinner from '../common/Spinner';
import useDebounce from '../../hooks/useDebounce';
import Pagination from '../common/Pagination';

const MedicoController = () => {
    const [medicos, setMedicos] = useState([]);
    const [especialidades, setEspecialidades] = useState([]);
    const [paginationInfo, setPaginationInfo] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [medicoToDelete, setMedicoToDelete] = useState(null);

    const [filters, setFilters] = useState({
        search: '',
        especialidade_id: '',
        page: 1,
        limit: 10,
    });
    
    const debouncedSearch = useDebounce(filters.search, 500);

    const fetchMedicos = useCallback(async () => {
        setIsLoading(true);
        try {
            const params = new URLSearchParams({
                search: debouncedSearch,
                especialidade_id: filters.especialidade_id,
                page: filters.page,
                limit: filters.limit,
            });
            const res = await api.get(`/medicos?${params.toString()}`);
            setMedicos(res.data.data);
            setPaginationInfo(res.data.pagination);
        } catch (err) {
            toast.error("Não foi possível carregar a lista de médicos.");
        } finally {
            setIsLoading(false);
        }
    }, [debouncedSearch, filters.especialidade_id, filters.page, filters.limit]);
    
    useEffect(() => {
        const fetchEspecialidades = async () => {
            try {
                const res = await api.get('/especialidades');
                setEspecialidades(res.data);
            } catch (error) {
                toast.error("Não foi possível carregar as especialidades.");
            }
        };
        
        fetchEspecialidades();
    }, []);

    useEffect(() => {
        fetchMedicos();
    }, [fetchMedicos]);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value, page: 1 }));
    };

    const handlePageChange = (newPage) => {
        setFilters(prev => ({ ...prev, page: newPage }));
    };

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
            fetchMedicos(filters.page);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Não foi possível excluir o médico.');
        } finally {
            setIsModalOpen(false);
            setMedicoToDelete(null);
        }
    };

    return (
        <>
            <MedicoList
                medicos={medicos}
                especialidades={especialidades}
                onEdit={handleEdit}
                onDelete={handleDeleteRequest}
                filters={filters}
                onFilterChange={handleFilterChange}
                isLoading={isLoading}
            />
            {paginationInfo?.totalPages > 1 && (
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
                message="Você tem certeza que deseja excluir este médico?"
            />
        </>
    );
};

export default MedicoController;