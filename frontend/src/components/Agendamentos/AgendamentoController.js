import React, { useEffect, useState, useCallback } from 'react';
import AgendamentoList from './AgendamentoList';
import api from '../../services/api';
import toast from 'react-hot-toast';
import ConfirmationModal from '../common/ConfirmationModal';
import Spinner from '../common/Spinner';
import useDebounce from '../../hooks/useDebounce';
import Pagination from '../common/Pagination';

const AgendamentoController = () => {
    const [agendamentos, setAgendamentos] = useState([]);
    const [paginationInfo, setPaginationInfo] = useState({});
    const [medicos, setMedicos] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [agendamentoToDelete, setAgendamentoToDelete] = useState(null);

    const [filters, setFilters] = useState({
        search: '',
        status: '',
        medico_id: '',
        page: 1,
        limit: 10
    });

    const debouncedSearch = useDebounce(filters.search, 500);

    const fetchAgendamentos = useCallback(async () => {
        setIsLoading(true);
        try {
            const params = new URLSearchParams({
                search: debouncedSearch,
                status: filters.status,
                medico_id: filters.medico_id,
                page: filters.page,
                limit: filters.limit
            });
            const res = await api.get(`/agendamentos?${params.toString()}`);
            setAgendamentos(res.data.data);
            setPaginationInfo(res.data.pagination);
        } catch (err) {
            toast.error("Não foi possível carregar os agendamentos.");
        } finally {
            setIsLoading(false);
        }
    }, [debouncedSearch, filters.status, filters.medico_id, filters.page, filters.limit]);

    useEffect(() => {
        const fetchMedicos = async () => {
            try {
                const res = await api.get('/medicos');
                setMedicos(res.data.data || res.data);
            } catch (error) {
                toast.error("Não foi possível carregar a lista de médicos para o filtro.");
            }
        };
        fetchMedicos();
    }, []);
    
    useEffect(() => {
        fetchAgendamentos();
    }, [fetchAgendamentos]);
    
    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value, page: 1 }));
    };

    const handlePageChange = (newPage) => {
        setFilters(prev => ({ ...prev, page: newPage }));
    };

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

    return (
        <>
            <AgendamentoList
                agendamentos={agendamentos}
                medicos={medicos}
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
                message="Você tem certeza que deseja excluir este agendamento?"
            />
        </>
    );
};

export default AgendamentoController;