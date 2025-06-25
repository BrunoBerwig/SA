import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../../services/api';
import toast from 'react-hot-toast';
import Spinner from '../common/Spinner';
import { FaUserMd, FaEnvelope, FaPhone, FaIdCard, FaCheckCircle, FaTimesCircle, FaCalendarDay, FaClock, FaTag, FaUserCircle } from 'react-icons/fa';
import Calendar from 'react-calendar';

const MedicoDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [medico, setMedico] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [agendamentos, setAgendamentos] = useState([]);
    const [dataSelecionada, setDataSelecionada] = useState(new Date());

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const [resMedico, resAgendamentos] = await Promise.all([
                    api.get(`/medicos/${id}`),
                    api.get(`/medicos/${id}/agendamentos`)
                ]);
                setMedico(resMedico.data);
                setAgendamentos(resAgendamentos.data);
            } catch (error) {
                toast.error("Médico não encontrado ou erro ao carregar dados.");
                navigate('/medicos');
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [id, navigate]);

    const isSameDay = (a, b) => a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
    const agendamentosDoDia = agendamentos.filter(ag => isSameDay(new Date(ag.data_hora), dataSelecionada));
    const diasComAgendamento = new Set(agendamentos.map(ag => new Date(ag.data_hora).toDateString()));
    const marcarDias = ({ date, view }) => view === 'month' && diasComAgendamento.has(date.toDateString()) ? <div className="dia-com-agendamento"></div> : null;

    if (isLoading) {
        return <div className="flex justify-center items-center h-64"><Spinner size="lg" /></div>;
    }
    if (!medico) {
        return <div className="text-center p-10 dark:text-white">Médico não encontrado.</div>;
    }

    return (
        <div className="space-y-8">
            <div className="max-w-4xl mx-auto bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 border border-gray-200 dark:border-slate-700">
                <div className="flex flex-col md:flex-row items-center gap-8 mb-6">
                    <img 
                        src={medico.foto_url || `https://ui-avatars.com/api/?name=${medico.nome.replace(/\s/g, '+')}&background=random&size=128`} 
                        alt={`Foto de ${medico.nome}`} 
                        className="w-32 h-32 rounded-full object-cover border-4 border-blue-500 dark:border-blue-400" 
                    />
                    <div className="text-center md:text-left flex-1">
                        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-gray-100">{medico.nome}</h1>
                        <p className="text-xl text-blue-600 dark:text-blue-400 font-semibold">{medico.especialidade}</p>
                        <p className="text-md text-gray-600 dark:text-gray-400 mt-1"><FaIdCard className="inline mr-2" />CRM: {medico.crm_numero}/{medico.crm_uf}</p>
                        <div className={`mt-2 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${medico.ativo ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300' : 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300'}`}>
                            {medico.ativo ? <FaCheckCircle className="mr-2"/> : <FaTimesCircle className="mr-2"/>}
                            {medico.ativo ? 'Ativo' : 'Inativo'}
                        </div>
                    </div>
                </div>
                 {medico.biografia && (
                    <div className="my-6 border-t border-gray-200 dark:border-slate-700 pt-6">
                        <p className="text-gray-600 dark:text-gray-300 whitespace-pre-wrap">{medico.biografia}</p>
                    </div>
                )}
                <div className="flex justify-end gap-4 border-t border-gray-200 dark:border-slate-700 pt-6">
                     <button onClick={() => navigate('/medicos')} className="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold rounded-lg transition dark:bg-slate-600 dark:text-white dark:hover:bg-slate-500">Voltar</button>
                    <button onClick={() => navigate(`/medicos/editar/${id}`)} className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition">Editar Médico</button>
                </div>
            </div>

            <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-6 border border-gray-200 dark:border-slate-700">
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">Agenda de Consultas</h2>
                    <Calendar
                        onChange={setDataSelecionada}
                        value={dataSelecionada}
                        locale="pt-BR"
                        tileContent={marcarDias}
                        minDate={new Date()}
                    />
                </div>
                <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-6 border border-gray-200 dark:border-slate-700">
                    <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2">
                        <FaCalendarDay />
                        {dataSelecionada.toLocaleDateString('pt-BR', { day: 'numeric', month: 'long' })}
                    </h3>
                    <div className="space-y-4 h-[350px] overflow-y-auto pr-2">
                        {agendamentosDoDia.length > 0 ? (
                            agendamentosDoDia.map(ag => (
                                <div key={ag.id} className="bg-gray-50 dark:bg-slate-700/50 p-4 rounded-lg border-l-4 border-blue-500 shadow-sm">
                                    <div className="flex justify-between items-start">
                                        <p className="flex items-center gap-2 text-lg font-bold text-blue-700 dark:text-blue-400">
                                            <FaClock />
                                            {new Date(ag.data_hora).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                                        </p>
                                        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/70 dark:text-blue-300">
                                            {ag.tipo_consulta}
                                        </span>
                                    </div>
                                    <div className="mt-3 flex items-center gap-3">
                                        <FaUserCircle className="text-2xl text-gray-400"/>
                                        <span className="font-medium text-gray-800 dark:text-gray-200">{ag.paciente_nome}</span>
                                    </div>
                                    <div className="mt-4 text-right">
                                        <Link 
                                            to={`/pacientes/${ag.paciente_id}`} 
                                            className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline"
                                        >
                                            Ver Prontuário →
                                        </Link>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full text-center">
                                <FaCalendarDay className="text-4xl text-gray-400 mb-4" />
                                <p className="text-gray-500 dark:text-gray-400 italic">Nenhum agendamento para este dia.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MedicoDetails;
