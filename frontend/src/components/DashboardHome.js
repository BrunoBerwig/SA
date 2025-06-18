import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api'; // Corrigido para o caminho relativo a partir de src/
import { FaUserInjured, FaUserMd, FaCalendarCheck, FaPlus } from 'react-icons/fa';
import Spinner from './common/Spinner'; // CORREÇÃO: O caminho correto a partir desta pasta

// Componente para os cards de estatística
const StatCard = ({ icon, title, value, color }) => {
    return (
        <div className={`bg-white p-6 rounded-lg shadow-md flex items-center border-l-4 ${color}`}>
            <div className="mr-4 text-3xl">{icon}</div>
            <div>
                <p className="text-gray-500 font-medium">{title}</p>
                <p className="text-2xl font-bold text-gray-800">{value}</p>
            </div>
        </div>
    );
};

const DashboardHome = () => {
    // Estados para armazenar os dados
    const [stats, setStats] = useState({ pacientes: 0, medicos: 0, agendamentos: 0 });
    const [proximosAgendamentos, setProximosAgendamentos] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                // Usamos Promise.all para buscar todos os dados em paralelo
                const [resPacientes, resMedicos, resAgendamentos] = await Promise.all([
                    api.get('/pacientes'),
                    api.get('/medicos'),
                    api.get('/agendamentos')
                ]);

                // Atualiza as estatísticas
                setStats({
                    pacientes: resPacientes.data.length,
                    medicos: resMedicos.data.length,
                    agendamentos: resAgendamentos.data.length,
                });

                // Filtra os agendamentos para mostrar apenas os de hoje em diante
                const hoje = new Date();
                hoje.setHours(0, 0, 0, 0); // Zera a hora para comparar apenas a data

                const agendamentosFuturos = resAgendamentos.data
                    .filter(ag => new Date(ag.data_hora) >= hoje)
                    .sort((a, b) => new Date(a.data_hora) - new Date(b.data_hora));

                setProximosAgendamentos(agendamentosFuturos.slice(0, 5)); // Pega apenas os 5 próximos

            } catch (error) {
                console.error("Erro ao carregar dados do dashboard:", error);
                // Você pode adicionar um toast de erro aqui se quiser
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Se estiver carregando, mostra o spinner centralizado
    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Spinner size="lg" />
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Saudação e Ações Rápidas */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">
                        Bem-vindo(a) ao Dashboard!
                    </h1>
                    <p className="text-gray-600 mt-1">Aqui está um resumo da atividade da sua clínica.</p>
                </div>
                <div className="flex gap-2">
                     <Link to="/agendamentos/novo" className="flex items-center bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg transition">
                        <FaPlus className="mr-2" /> Novo Agendamento
                    </Link>
                </div>
            </div>

            {/* Cards de Estatísticas */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <StatCard icon={<FaUserInjured className="text-blue-500"/>} title="Total de Pacientes" value={stats.pacientes} color="border-blue-500" />
                <StatCard icon={<FaUserMd className="text-green-500"/>} title="Total de Médicos" value={stats.medicos} color="border-green-500" />
                <StatCard icon={<FaCalendarCheck className="text-purple-500"/>} title="Agendamentos Futuros" value={proximosAgendamentos.length} color="border-purple-500" />
            </div>

            {/* Próximos Agendamentos */}
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Próximos 5 Agendamentos</h2>
                <div className="overflow-x-auto">
                    {proximosAgendamentos.length > 0 ? (
                        <table className="min-w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="text-left px-4 py-2 text-gray-600 font-medium">Data e Hora</th>
                                    <th className="text-left px-4 py-2 text-gray-600 font-medium">Paciente</th>
                                    <th className="text-left px-4 py-2 text-gray-600 font-medium">Médico</th>
                                </tr>
                            </thead>
                            <tbody>
                                {proximosAgendamentos.map(ag => (
                                    <tr key={ag.id} className="border-b hover:bg-gray-50">
                                        <td className="px-4 py-3 text-gray-700">{new Date(ag.data_hora).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })}</td>
                                        <td className="px-4 py-3 text-gray-700">{ag.paciente_nome}</td>
                                        <td className="px-4 py-3 text-gray-700">{ag.medico_nome}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <p className="text-center text-gray-500 py-4">Nenhum agendamento futuro encontrado.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DashboardHome;