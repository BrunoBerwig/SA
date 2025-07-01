import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../../services/api';
import toast from 'react-hot-toast';
import Spinner from '../common/Spinner';
import { FaUserInjured, FaEnvelope, FaPhone, FaCalendarAlt, FaAllergies, FaNotesMedical, FaUserShield, FaBirthdayCake, FaCopy } from 'react-icons/fa';

const PacienteDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [paciente, setPaciente] = useState(null);
    const [agendamentos, setAgendamentos] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const [resPaciente, resAgendamentos] = await Promise.all([
                    api.get(`/pacientes/${id}`),
                    api.get(`/pacientes/${id}/agendamentos`)
                ]);
                setPaciente(resPaciente.data);
                setAgendamentos(resAgendamentos.data);
            } catch (error) {
                toast.error("Paciente não encontrado ou erro ao carregar dados.");
                navigate('/pacientes');
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [id, navigate]);

    const calcularIdade = (dataNasc) => {
        if (!dataNasc) return 'N/A';
        const hoje = new Date();
        const nascimento = new Date(dataNasc);
        let idade = hoje.getFullYear() - nascimento.getFullYear();
        const m = hoje.getMonth() - nascimento.getMonth();
        if (m < 0 || (m === 0 && hoje.getDate() < nascimento.getDate())) {
            idade--;
        }
        return idade;
    };
    
    const handleCopy = (text) => {
        navigator.clipboard.writeText(text);
        toast.success('Copiado!');
    };

    if (isLoading) {
        return <div className="flex justify-center items-center h-64"><Spinner size="lg" /></div>;
    }
    if (!paciente) {
        return <div className="text-center p-10 dark:text-white">Paciente não encontrado.</div>;
    }

    return (
        <div className="space-y-8">
            <div className="max-w-4xl mx-auto bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 border border-gray-200 dark:border-slate-700">
                <div className="flex flex-col md:flex-row items-center gap-8 mb-6">
                    <img src={paciente.foto_url || `https://ui-avatars.com/api/?name=${paciente.nome.replace(/\s/g, '+')}&background=random&size=128`} alt={`Foto de ${paciente.nome}`} className="w-32 h-32 rounded-full object-cover border-4 border-blue-500" />
                    <div className="text-center md:text-left flex-1">
                        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-gray-100">{paciente.nome}</h1>
                        <p className="text-lg text-gray-600 dark:text-gray-400 mt-2"><FaBirthdayCake className="inline mr-2" />{calcularIdade(paciente.data_nascimento)} anos</p>
                        <div className="flex items-center justify-center md:justify-start gap-2 mt-1 text-gray-600 dark:text-gray-400">
                            <FaEnvelope />
                            <a href={`mailto:${paciente.email}`} className="hover:underline">{paciente.email}</a>
                            <button onClick={() => handleCopy(paciente.email)} title="Copiar email" className="text-gray-400 hover:text-blue-500 transition"><FaCopy /></button>
                        </div>
                        <div className="flex items-center justify-center md:justify-start gap-2 mt-1 text-gray-600 dark:text-gray-400">
                            <FaPhone />
                            <a href={`tel:${paciente.telefone}`} className="hover:underline">{paciente.telefone}</a>
                            <button onClick={() => handleCopy(paciente.telefone)} title="Copiar telefone" className="text-gray-400 hover:text-blue-500 transition"><FaCopy /></button>
                        </div>
                    </div>
                </div>
                <div className="flex justify-end gap-4 border-t border-gray-200 dark:border-slate-700 pt-6">
                    <button onClick={() => navigate('/pacientes')} className="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold rounded-lg transition dark:bg-slate-600 dark:text-white dark:hover:bg-slate-500 transform active:scale-95">Voltar</button>
                    <button onClick={() => navigate(`/pacientes/editar/${paciente.id}`)} className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition transform active:scale-95">Editar Paciente</button>
                </div>
            </div>

            <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-6 border border-gray-200 dark:border-slate-700">
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">Informações Médicas</h2>
                    <div className="space-y-4">
                        <div><h3 className="font-semibold flex items-center gap-2"><FaAllergies /> Alergias</h3><p className="pl-6 text-gray-600 dark:text-gray-300">{paciente.alergias || 'Nenhuma informada'}</p></div>
                        <div><h3 className="font-semibold flex items-center gap-2"><FaNotesMedical /> Condições Pré-existentes</h3><p className="pl-6 text-gray-600 dark:text-gray-300">{paciente.condicoes_medicas || 'Nenhuma informada'}</p></div>
                    </div>
                     <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mt-6 mb-4">Contato de Emergência</h2>
                     <div className="space-y-4">
                        <div><h3 className="font-semibold flex items-center gap-2"><FaUserShield /> Nome</h3><p className="pl-6 text-gray-600 dark:text-gray-300">{paciente.contato_emergencia_nome || 'Não informado'}</p></div>
                        <div><h3 className="font-semibold flex items-center gap-2"><FaPhone /> Telefone</h3><p className="pl-6 text-gray-600 dark:text-gray-300">{paciente.contato_emergencia_numero || 'Não informado'}</p></div>
                     </div>
                </div>
                <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-6 border border-gray-200 dark:border-slate-700">
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">Histórico de Agendamentos</h2>
                    <div className="space-y-3 h-80 overflow-y-auto pr-2">
                        {agendamentos.length > 0 ? agendamentos.map(ag => (
                            <div key={ag.id} className="p-3 bg-gray-50 dark:bg-slate-700/50 rounded-lg">
                                <p className="font-semibold text-gray-800 dark:text-gray-200">{new Date(ag.data_hora).toLocaleDateString('pt-BR', {dateStyle: 'long'})}</p>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Dr(a). {ag.medico_nome} - {ag.medico_especialidade}</p>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Status: {ag.status}</p>
                            </div>
                        )) : <p className="text-gray-500 dark:text-gray-400 italic">Nenhum histórico de agendamentos.</p>}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PacienteDetails;