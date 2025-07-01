import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import toast from 'react-hot-toast';
import { FaUserInjured, FaUserMd, FaCalendarCheck, FaPlus } from 'react-icons/fa';
import Spinner from './common/Spinner';
import { jwtDecode } from 'jwt-decode';
import { getToken } from '../services/auth';

const StatCard = ({ icon, title, value, color, to }) => {
    const cardContent = (
        <div className={`bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md flex items-center border-l-4 ${color} transition transform hover:-translate-y-1`}>
            <div className="mr-4 text-3xl">{icon}</div>
            <div>
                <p className="text-gray-500 dark:text-gray-400 font-medium">{title}</p>
                <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">{value}</p>
            </div>
        </div>
    );
    return to ? <Link to={to}>{cardContent}</Link> : <div>{cardContent}</div>;
};

const DashboardHome = () => {
    const [stats, setStats] = useState({ pacientes: 0, medicos: 0, agendamentos: 0 });
    const [proximosAgendamentos, setProximosAgendamentos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [username, setUsername] = useState('');

    useEffect(() => {
        const token = getToken();
        if (token) {
            try {
                const decodedToken = jwtDecode(token);
                setUsername(decodedToken.username);
            } catch (error) {
                console.error("Erro ao decodificar token:", error);
            }
        }

        const fetchData = async () => {
            setLoading(true);
            try {
                const [resPacientes, resMedicos, resAgendamentos] = await Promise.all([
                    api.get('/pacientes'),
                    api.get('/medicos'),
                    api.get('/agendamentos?limit=5')
                ]);
                setStats({
                    pacientes: resPacientes.data.pagination.totalItems,
                    medicos: resMedicos.data.pagination.totalItems,
                    agendamentos: resAgendamentos.data.pagination.totalItems,
                });
                const hoje = new Date();
                hoje.setHours(0, 0, 0, 0);
                const agendamentosFuturos = resAgendamentos.data.data
                    .filter(ag => new Date(ag.data_hora) >= hoje)
                    .sort((a, b) => new Date(a.data_hora) - new Date(b.data_hora));
                setProximosAgendamentos(agendamentosFuturos);
            } catch (error) {
                console.error("Erro ao carregar dados do dashboard:", error);
                toast.error("Falha ao carregar dados do dashboard.");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour >= 5 && hour < 12) return "Bom dia";
        if (hour >= 12 && hour < 18) return "Boa tarde";
        return "Boa noite";
    };

    const todayFormatted = new Date().toLocaleDateString('pt-BR', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Spinner size="lg" />
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
                        {getGreeting()}, {username || 'Usuário'}!
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-1 capitalize">{todayFormatted}</p>
                </div>
                <div className="flex gap-2">
                     <Link to="/agendamentos/novo" className="flex items-center bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg transition transform active:scale-95">
                        <FaPlus className="mr-2" /> Novo Agendamento
                    </Link>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <StatCard to="/pacientes" icon={<FaUserInjured className="text-blue-500"/>} title="Total de Pacientes" value={stats.pacientes} color="border-blue-500" />
                <StatCard to="/medicos" icon={<FaUserMd className="text-green-500"/>} title="Total de Médicos" value={stats.medicos} color="border-green-500" />
                <StatCard to="/agendamentos" icon={<FaCalendarCheck className="text-purple-500"/>} title="Total de Agendamentos" value={stats.agendamentos} color="border-purple-500" />
            </div>
            <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">Próximos 5 Agendamentos</h2>
                <div className="overflow-x-auto">
                    {proximosAgendamentos.length > 0 ? (
                        <table className="min-w-full">
                            <thead className="bg-gray-50 dark:bg-slate-700">
                                <tr>
                                    <th className="text-left px-4 py-2 text-gray-600 dark:text-gray-300 font-medium">Data e Hora</th>
                                    <th className="text-left px-4 py-2 text-gray-600 dark:text-gray-300 font-medium">Paciente</th>
                                    <th className="text-left px-4 py-2 text-gray-600 dark:text-gray-300 font-medium">Médico</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-slate-700">
                                {proximosAgendamentos.map(ag => (
                                    <tr key={ag.id} className="hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors">
                                        <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{new Date(ag.data_hora).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })}</td>
                                        <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{ag.paciente_nome}</td>
                                        <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{ag.medico_nome}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <p className="text-center text-gray-500 dark:text-gray-400 py-4">Nenhum agendamento futuro encontrado.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DashboardHome;