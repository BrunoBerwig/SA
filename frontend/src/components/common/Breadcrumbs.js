import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { FaChevronRight, FaHome } from 'react-icons/fa';

const breadcrumbNameMap = {
    'dashboard': 'Dashboard',
    'medicos': 'Médicos',
    'pacientes': 'Pacientes',
    'agendamentos': 'Agendamentos',
    'novo': 'Novo',
    'editar': 'Editar',
    'register': 'Criar Conta',
    'meu-dashboard': 'Meu Painel'
};

const Breadcrumbs = () => {
    const location = useLocation();
    const pathnames = location.pathname.split('/').filter(x => x);

    if (pathnames.length === 0 || location.pathname === '/dashboard') {
        return null; 
    }

    return (
        <nav className="mb-6" aria-label="Breadcrumb">
            <ol className="list-none p-0 inline-flex items-center space-x-2 text-sm font-medium text-gray-500 dark:text-gray-400">
                <li>
                    <Link to="/dashboard" className="hover:text-blue-600 dark:hover:text-blue-400">
                        <FaHome className="h-4 w-4" />
                    </Link>
                </li>
                {pathnames.map((value, index) => {
                    const last = index === pathnames.length - 1;
                    const to = `/${pathnames.slice(0, index + 1).join('/')}`;
                    const name = breadcrumbNameMap[value] || value.charAt(0).toUpperCase() + value.slice(1).replace(/-/g, ' ');

                    return (
                        <li key={to} className="inline-flex items-center">
                            <FaChevronRight className="h-3 w-3" />
                            {last ? (
                                <span className="ml-2 text-gray-700 dark:text-gray-200">{name}</span>
                            ) : (
                                <Link to={to} className="ml-2 hover:text-blue-600 dark:hover:text-blue-400">
                                    {name}
                                </Link>
                            )}
                        </li>
                    );
                })}
            </ol>
        </nav>
    );
};

export default Breadcrumbs;