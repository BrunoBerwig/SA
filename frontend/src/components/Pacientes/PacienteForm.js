import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../services/api';
import toast from 'react-hot-toast';
import Spinner from '../common/Spinner';

const PacienteForm = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [formData, setFormData] = useState({
        nome: '',
        email: '',
        telefone: '',
        convenio: '',
        dataNascimento: '',
        alergias: '',
        condicoesMedicas: '',
        contatoEmergenciaNome: '',
        contatoEmergenciaNumero: ''
    });
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (id) {
            api.get(`/pacientes/${id}`).then(response => {
                const pacienteData = response.data;
                setFormData({
                    ...pacienteData,
                    dataNascimento: pacienteData.data_nascimento ? new Date(pacienteData.data_nascimento).toISOString().split('T')[0] : '',
                    alergias: pacienteData.alergias || '',
                    condicoesMedicas: pacienteData.condicoes_medicas || '',
                    contatoEmergenciaNome: pacienteData.contato_emergencia_nome || '',
                    contatoEmergenciaNumero: pacienteData.contato_emergencia_numero || ''
                });
            }).catch(error => {
                toast.error("Não foi possível carregar os dados do paciente.");
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

        // Adicione estas duas linhas para tratar os espaços e transformar em null
        const nomeContato = formData.contatoEmergenciaNome.trim();
        const numeroContato = formData.contatoEmergenciaNumero.trim();

        // Validação: Se um campo de contato de emergência está preenchido, o outro também é obrigatório
        const nomePreenchidoENumeroVazio = nomeContato !== '' && numeroContato === '';
        const numeroPreenchidoENomeVazio = nomeContato === '' && numeroContato !== '';

        if (nomePreenchidoENumeroVazio || numeroPreenchidoENomeVazio) {
            toast.error("Se você preencher um campo de contato de emergência, o outro também é obrigatório.");
            setIsLoading(false);
            return; // Impede o envio do formulário
        }

        const dataToSend = {
            nome: formData.nome,
            email: formData.email,
            telefone: formData.telefone,
            convenio: formData.convenio,
            data_nascimento: formData.dataNascimento || null,
            alergias: formData.alergias,
            condicoes_medicas: formData.condicoesMedicas,
            contato_emergencia_nome: nomeContato === '' ? null : nomeContato,
            contato_emergencia_numero: numeroContato === '' ? null : numeroContato
        };
        
        if (formData.dataNascimento === '' && id === undefined) {
             toast.error("Data de Nascimento é obrigatória.");
             setIsLoading(false);
             return;
        }

        try {
            if (id) {
                await api.put(`/pacientes/${id}`, dataToSend);
                toast.success('Paciente atualizado com sucesso!');
            } else {
                await api.post('/pacientes', dataToSend);
                toast.success('Paciente cadastrado com sucesso!');
            }
            navigate('/pacientes');
        } catch (error) {
            toast.error('Ocorreu um erro ao salvar o paciente.');
            console.error('Erro ao salvar paciente:', error);
            if (error.response && error.response.data) {
                console.error('Detalhes do erro do backend:', error.response.data);
            }
        } finally {
            setIsLoading(false);
        }
    };

    const pageTitle = id ? '📝 Editar Paciente' : '➕ Novo Paciente';

    return (
        <div className="max-w-lg mx-auto bg-white dark:bg-slate-800 rounded-2xl shadow-md p-6 border border-gray-200 dark:border-slate-700">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6">{pageTitle}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                {/* ... (restante do seu formulário) ... */}
                <div>
                    <label className="block text-gray-700 dark:text-gray-300 font-medium mb-1">Nome</label>
                    <input type="text" name="nome" value={formData.nome} onChange={handleChange} className="w-full border rounded-lg px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white" required />
                </div>
                <div>
                    <label className="block text-gray-700 dark:text-gray-300 font-medium mb-1">Email</label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full border rounded-lg px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white" required />
                </div>
                <div>
                    <label className="block text-gray-700 dark:text-gray-300 font-medium mb-1">Telefone</label>
                    <input type="text" name="telefone" value={formData.telefone} onChange={handleChange} className="w-full border rounded-lg px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white" required />
                </div>
                <div>
                    <label className="block text-gray-700 dark:text-gray-300 font-medium mb-1">Convênio</label>
                    <input type="text" name="convenio" value={formData.convenio} onChange={handleChange} className="w-full border rounded-lg px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white" required />
                </div>

                <div>
                    <label className="block text-gray-700 dark:text-gray-300 font-medium mb-1">Data de Nascimento</label>
                    <input
                        type="date"
                        name="dataNascimento"
                        value={formData.dataNascimento}
                        onChange={handleChange}
                        className="w-full border rounded-lg px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                        required={!id}
                    />
                </div>
                <div>
                    <label className="block text-gray-700 dark:text-gray-300 font-medium mb-1">Alergias</label>
                    <textarea
                        name="alergias"
                        value={formData.alergias}
                        onChange={handleChange}
                        rows="3"
                        className="w-full border rounded-lg px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                    ></textarea>
                </div>
                <div>
                    <label className="block text-gray-700 dark:text-gray-300 font-medium mb-1">Condições Médicas</label>
                    <textarea
                        name="condicoesMedicas"
                        value={formData.condicoesMedicas}
                        onChange={handleChange}
                        rows="3"
                        className="w-full border rounded-lg px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                    ></textarea>
                </div>
                <div>
                    <label className="block text-gray-700 dark:text-gray-300 font-medium mb-1">Contato de Emergência (Nome)</label>
                    <input
                        type="text"
                        name="contatoEmergenciaNome"
                        value={formData.contatoEmergenciaNome}
                        onChange={handleChange}
                        className="w-full border rounded-lg px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                    />
                </div>
                <div>
                    <label className="block text-gray-700 dark:text-gray-300 font-medium mb-1">Contato de Emergência (Numero)</label>
                    <input
                        type="text"
                        name="contatoEmergenciaNumero"
                        value={formData.contatoEmergenciaNumero}
                        onChange={handleChange}
                        className="w-full border rounded-lg px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                    />
                </div>
                
                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-11 flex justify-center items-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition disabled:bg-blue-800 disabled:cursor-not-allowed"
                >
                    {isLoading ? <Spinner size="sm" /> : 'Salvar Paciente'}
                </button>
            </form>
        </div>
    );
};

export default PacienteForm;