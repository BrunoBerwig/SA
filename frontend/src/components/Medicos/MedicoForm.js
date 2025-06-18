import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../services/api';
import toast from 'react-hot-toast';

const MedicoForm = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [formData, setFormData] = useState({
        nome: '',
        especialidade: '',
        email: '',
        telefone: '',
    });

    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (id) {
            const fetchMedico = async () => {
                setIsLoading(true);
                try {
                    const response = await api.get(`/medicos/${id}`);
                    setFormData(response.data);
                } catch (error) {
                    toast.error('Não foi possível carregar os dados do médico.');
                } finally {
                    setIsLoading(false);
                }
            };
            fetchMedico();
        }
    }, [id]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            if (id) {
                await api.put(`/medicos/${id}`, formData);
                toast.success('Médico atualizado com sucesso!');
            } else {
                await api.post('/medicos', formData);
                toast.success('Médico cadastrado com sucesso!');
            }
            navigate('/medicos');
        } catch (error) {
            console.error('Erro ao salvar médico:', error);
            toast.error('Ocorreu um erro ao salvar o médico.');
        } finally {
            setIsLoading(false);
        }
    };

    const pageTitle = id ? '📝 Editar Médico' : '➕ Novo Médico';

    return (
        <div className="max-w-lg mx-auto bg-white rounded-2xl shadow-md p-6 border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">{pageTitle}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label>Nome</label>
                    <input type="text" name="nome" value={formData.nome} onChange={handleChange} className="w-full border rounded-lg px-4 py-2" required />
                </div>
                <div>
                    <label>Especialidade</label>
                    <input type="text" name="especialidade" value={formData.especialidade} onChange={handleChange} className="w-full border rounded-lg px-4 py-2" required />
                </div>
                <div>
                    <label>Email</label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full border rounded-lg px-4 py-2" required />
                </div>
                <div>
                    <label>Telefone</label>
                    <input type="text" name="telefone" value={formData.telefone} onChange={handleChange} className="w-full border rounded-lg px-4 py-2" required />
                </div>
                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition disabled:bg-blue-300 disabled:cursor-not-allowed"
                >
                    {isLoading ? 'Salvando...' : 'Salvar Médico'}
                </button>
            </form>
        </div>
    );
};

export default MedicoForm;