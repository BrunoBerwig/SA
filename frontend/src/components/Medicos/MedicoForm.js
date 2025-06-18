import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../services/api';
import toast from 'react-hot-toast';
import Spinner from '../common/Spinner';

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
            api.get(`/medicos/${id}`).then(response => {
                setFormData(response.data);
            }).catch(error => {
                toast.error("Não foi possível carregar os dados do médico.");
                console.error(error);
            });
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
            toast.error('Ocorreu um erro ao salvar o médico.');
            console.error('Erro ao salvar médico:', error);
        } finally {
            setIsLoading(false);
        }
    };
    
    const pageTitle = id ? '📝 Editar Médico' : '➕ Novo Médico';

    return (
        <div className="max-w-lg mx-auto bg-white dark:bg-slate-800 rounded-2xl shadow-md p-6 border border-gray-200 dark:border-slate-700">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6">{pageTitle}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-gray-700 dark:text-gray-300 font-medium mb-1">Nome</label>
                    <input type="text" name="nome" value={formData.nome} onChange={handleChange} className="w-full border rounded-lg px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white" required />
                </div>
                <div>
                    <label className="block text-gray-700 dark:text-gray-300 font-medium mb-1">Especialidade</label>
                    <input type="text" name="especialidade" value={formData.especialidade} onChange={handleChange} className="w-full border rounded-lg px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white" required />
                </div>
                <div>
                    <label className="block text-gray-700 dark:text-gray-300 font-medium mb-1">Email</label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full border rounded-lg px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white" required />
                </div>
                <div>
                    <label className="block text-gray-700 dark:text-gray-300 font-medium mb-1">Telefone</label>
                    <input type="text" name="telefone" value={formData.telefone} onChange={handleChange} className="w-full border rounded-lg px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white" required />
                </div>
                
                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-11 flex justify-center items-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition disabled:bg-blue-800 disabled:cursor-not-allowed"
                >
                    {isLoading ? <Spinner size="sm" /> : 'Salvar Médico'}
                </button>
            </form>
        </div>
    );
};

export default MedicoForm;