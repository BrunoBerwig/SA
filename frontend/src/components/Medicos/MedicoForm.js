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
        especialidade_id: '',
        email: '',
        telefone: '',
        crm_numero: '',
        crm_uf: '',
        foto_url: '',
        biografia: '',
        ativo: true,
    });
    const [especialidades, setEspecialidades] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isFetchingData, setIsFetchingData] = useState(true);

    useEffect(() => {
        const fetchInitialData = async () => {
            setIsFetchingData(true);
            try {
                const resEspecialidades = await api.get('/especialidades');
                setEspecialidades(resEspecialidades.data);

                if (id) {
                    const resMedico = await api.get(`/medicos/${id}`);
                    setFormData(resMedico.data);
                }
            } catch (error) {
                toast.error("Erro ao carregar dados do formulário.");
            } finally {
                setIsFetchingData(false);
            }
        };
        fetchInitialData();
    }, [id]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        const promise = id ? api.put(`/medicos/${id}`, formData) : api.post('/medicos', formData);
        
        toast.promise(promise, {
            loading: 'Salvando...',
            success: () => {
                navigate('/medicos');
                return `Médico ${id ? 'atualizado' : 'cadastrado'} com sucesso!`;
            },
            error: (err) => err.response?.data?.message || 'Ocorreu um erro.',
        });

        promise.catch(() => {}).finally(() => setIsLoading(false));
    };
    
    if (isFetchingData) {
        return <div className="flex justify-center p-10"><Spinner size="lg" /></div>;
    }
    
    const pageTitle = id ? '📝 Editar Médico' : '➕ Novo Médico';

    return (
        <div className="max-w-2xl mx-auto bg-white dark:bg-slate-800 rounded-2xl shadow-md p-6 border border-gray-200 dark:border-slate-700">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6">{pageTitle}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input name="nome" value={formData.nome || ''} onChange={handleChange} placeholder="Nome Completo" required className="w-full p-2 border rounded dark:bg-slate-700 dark:border-slate-600 dark:text-white" />
                    
                    <select
                        name="especialidade_id"
                        value={formData.especialidade_id || ''}
                        onChange={handleChange}
                        required
                        className="w-full p-2 border rounded dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                    >
                        <option value="" disabled>Selecione uma especialidade</option>
                        {especialidades.map(esp => (
                            <option key={esp.id} value={esp.id}>{esp.nome}</option>
                        ))}
                    </select>

                    <input name="email" type="email" value={formData.email || ''} onChange={handleChange} placeholder="Email" required className="w-full p-2 border rounded dark:bg-slate-700 dark:border-slate-600 dark:text-white" />
                    <input name="telefone" value={formData.telefone || ''} onChange={handleChange} placeholder="Telefone" required className="w-full p-2 border rounded dark:bg-slate-700 dark:border-slate-600 dark:text-white" />
                    <input name="crm_numero" value={formData.crm_numero || ''} onChange={handleChange} placeholder="CRM" required className="w-full p-2 border rounded dark:bg-slate-700 dark:border-slate-600 dark:text-white" />
                    <input name="crm_uf" value={formData.crm_uf || ''} onChange={handleChange} placeholder="UF do CRM" maxLength="2" required className="w-full p-2 border rounded dark:bg-slate-700 dark:border-slate-600 dark:text-white" />
                </div>
                <input name="foto_url" value={formData.foto_url || ''} onChange={handleChange} placeholder="URL da Foto de Perfil" className="w-full p-2 border rounded dark:bg-slate-700 dark:border-slate-600 dark:text-white" />
                <textarea name="biografia" value={formData.biografia || ''} onChange={handleChange} placeholder="Mini Biografia" rows="3" className="w-full p-2 border rounded dark:bg-slate-700 dark:border-slate-600 dark:text-white"></textarea>
                
                <div className="flex items-center">
                    <input id="ativo" name="ativo" type="checkbox" checked={formData.ativo} onChange={handleChange} className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                    <label htmlFor="ativo" className="ml-2 block text-sm text-gray-900 dark:text-gray-300">Médico Ativo</label>
                </div>
                
                <button type="submit" disabled={isLoading} className="w-full h-11 flex justify-center items-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition disabled:bg-blue-800">
                    {isLoading ? <Spinner size="sm" /> : 'Salvar Médico'}
                </button>
            </form>
        </div>
    );
};

export default MedicoForm;