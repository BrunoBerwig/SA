import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../services/api';
import toast from 'react-hot-toast';
import Spinner from '../common/Spinner';

const PacienteForm = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    // 1. Atualizar o estado formData para incluir todos os novos campos
    // Use nomes de variáveis em camelCase no JS para consistência (ex: dataNascimento para data_nascimento)
    const [formData, setFormData] = useState({
        nome: '',
        email: '',
        telefone: '',
        convenio: '',
        dataNascimento: '', // Para input type="date", o valor inicial deve ser string vazia ou data formatada 'YYYY-MM-DD'
        alergias: '',
        condicoesMedicas: '',
        contatoEmergenciaNome: ''
    });
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (id) {
            api.get(`/pacientes/${id}`).then(response => {
                const pacienteData = response.data;
                setFormData({
                    ...pacienteData,
                    // Formatar data_nascimento para 'YYYY-MM-DD' para o input type="date"
                    dataNascimento: pacienteData.data_nascimento ? new Date(pacienteData.data_nascimento).toISOString().split('T')[0] : '',
                    // Backend retorna 'alergias', 'condicoes_medicas', 'contato_emergencia_nome'
                    // Mapeie para os nomes camelCase no formData
                    alergias: pacienteData.alergias || '',
                    condicoesMedicas: pacienteData.condicoes_medicas || '',
                    contatoEmergenciaNome: pacienteData.contato_emergencia_nome || ''
                });
            }).catch(error => {
                toast.error("Não foi possível carregar os dados do paciente.");
                console.error(error);
            });
        }
    }, [id]);

    const handleChange = (e) => {
        // Para inputs normais e textareas
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        // Prepara os dados para envio, mapeando de camelCase (frontend) para snake_case (backend/DB)
        const dataToSend = {
            nome: formData.nome,
            email: formData.email,
            telefone: formData.telefone,
            convenio: formData.convenio,
            // Ajuste para dataNascimento: se vazio, envia null. Caso contrário, envia o valor.
            // Isso é importante para colunas DATE que podem ser NULL ou para NOT NULL com DEFAULT.
            data_nascimento: formData.dataNascimento || null, // Mapeia para data_nascimento no DB
            alergias: formData.alergias,
            condicoes_medicas: formData.condicoesMedicas, // Mapeia para condicoes_medicas no DB
            contato_emergencia_nome: formData.contatoEmergenciaNome // Mapeia para contato_emergencia_nome no DB
        };

        // Se data_nascimento for NOT NULL no DB e não tiver um DEFAULT,
        // e você não quer permitir nulos no frontend, adicione uma validação aqui:
        if (formData.dataNascimento === '' && id === undefined) { // Apenas para novos pacientes
             toast.error("Data de Nascimento é obrigatória.");
             setIsLoading(false);
             return;
        }

        try {
            if (id) {
                await api.put(`/pacientes/${id}`, dataToSend); // Usar dataToSend
                toast.success('Paciente atualizado com sucesso!');
            } else {
                await api.post('/pacientes', dataToSend); // Usar dataToSend
                toast.success('Paciente cadastrado com sucesso!');
            }
            navigate('/pacientes');
        } catch (error) {
            toast.error('Ocorreu um erro ao salvar o paciente.');
            console.error('Erro ao salvar paciente:', error);
            // Se você quiser ver a resposta de erro do backend para depuração:
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
                {/* Campos existentes */}
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

                {/* Novos Campos */}
                <div>
                    <label className="block text-gray-700 dark:text-gray-300 font-medium mb-1">Data de Nascimento</label>
                    <input
                        type="date"
                        name="dataNascimento"
                        value={formData.dataNascimento}
                        onChange={handleChange}
                        className="w-full border rounded-lg px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                        // Adicione 'required' AQUI se você quer que seja obrigatório no frontend
                        // Mas lembre-se: se a coluna no DB é NOT NULL, o backend também precisa garantir um valor
                        required={!id} // Exemplo: campo obrigatório apenas ao CRIAR novo paciente
                    />
                </div>
                <div>
                    <label className="block text-gray-700 dark:text-gray-300 font-medium mb-1">Alergias</label>
                    <textarea
                        name="alergias"
                        value={formData.alergias}
                        onChange={handleChange}
                        rows="3" // Ajuste o número de linhas conforme necessário
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