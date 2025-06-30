import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../services/api';
import toast from 'react-hot-toast';
import Spinner from '../common/Spinner';

const PacienteForm = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [formData, setFormData] = useState({
        nome: '', email: '', telefone: '', convenio: '', data_nascimento: '',
        alergias: '', condicoes_medicas: '', contato_emergencia_nome: '', 
        contato_emergencia_numero: '', foto_url: ''
    });
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (id) {
            api.get(`/pacientes/${id}`).then(response => {
                const paciente = response.data;
                if (paciente.data_nascimento) {
                    paciente.data_nascimento = paciente.data_nascimento.split('T')[0];
                }
                setFormData(paciente);
            });
        }
    }, [id]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        const promise = id ? api.put(`/pacientes/${id}`, formData) : api.post('/pacientes', formData);
        
        toast.promise(promise, {
            loading: 'Salvando...',
            success: () => {
                navigate('/pacientes');
                return `Paciente ${id ? 'atualizado' : 'cadastrado'} com sucesso!`;
            },
            error: (err) => err.response?.data?.message || 'Ocorreu um erro.'
        });
        promise.catch(() => {}).finally(() => setIsLoading(false));
    };
    
    const pageTitle = id ? '📝 Editar Paciente' : '➕ Novo Paciente';

    return (
        <div className="max-w-2xl mx-auto bg-white dark:bg-slate-800 rounded-2xl shadow-md p-6 border border-gray-200 dark:border-slate-700">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6">{pageTitle}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input name="foto_url" value={formData.foto_url || ''} onChange={handleChange} placeholder="URL da Foto de Perfil" className="w-full p-2 border rounded dark:bg-slate-700 dark:border-slate-600 dark:text-white" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input name="nome" value={formData.nome || ''} onChange={handleChange} placeholder="Nome Completo" required className="w-full p-2 border rounded dark:bg-slate-700 dark:border-slate-600 dark:text-white" />
                    <input name="email" type="email" value={formData.email || ''} onChange={handleChange} placeholder="Email" required className="w-full p-2 border rounded dark:bg-slate-700 dark:border-slate-600 dark:text-white" />
                    <input name="telefone" value={formData.telefone || ''} onChange={handleChange} placeholder="Telefone" className="w-full p-2 border rounded dark:bg-slate-700 dark:border-slate-600 dark:text-white" />
                    <input name="convenio" value={formData.convenio || ''} onChange={handleChange} placeholder="Convênio" className="w-full p-2 border rounded dark:bg-slate-700 dark:border-slate-600 dark:text-white" />
                    <input name="data_nascimento" type="date" value={formData.data_nascimento || ''} onChange={handleChange} className="w-full p-2 border rounded dark:bg-slate-700 dark:border-slate-600 dark:text-white" />
                </div>
                <textarea name="alergias" value={formData.alergias || ''} onChange={handleChange} placeholder="Alergias conhecidas" rows="3" className="w-full p-2 border rounded dark:bg-slate-700 dark:border-slate-600 dark:text-white"></textarea>
                <textarea name="condicoes_medicas" value={formData.condicoes_medicas || ''} onChange={handleChange} placeholder="Condições médicas pré-existentes" rows="3" className="w-full p-2 border rounded dark:bg-slate-700 dark:border-slate-600 dark:text-white"></textarea>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <input name="contato_emergencia_nome" value={formData.contato_emergencia_nome || ''} onChange={handleChange} placeholder="Nome do Contato de Emergência" className="w-full p-2 border rounded dark:bg-slate-700 dark:border-slate-600 dark:text-white" />
                     <input name="contato_emergencia_numero" value={formData.contato_emergencia_numero || ''} onChange={handleChange} placeholder="Telefone de Emergência" className="w-full p-2 border rounded dark:bg-slate-700 dark:border-slate-600 dark:text-white" />
                </div>
                <button type="submit" disabled={isLoading} className="w-full h-11 flex justify-center items-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition disabled:bg-blue-800">
                    {isLoading ? <Spinner size="sm" /> : 'Salvar Paciente'}
                </button>
            </form>
        </div>
    );
};

export default PacienteForm;