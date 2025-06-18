import React from 'react';
import { NavLink } from 'react-router-dom';
import ThemeSwitcher from './common/ThemeSwitcher';

const Sidebar = () => {
  const baseStyle = "flex items-center py-3 px-5 rounded-lg mb-2 transition-colors duration-200 font-medium";
  const activeStyle = "bg-blue-600 text-white shadow-lg";
  const inactiveStyle = "text-gray-700 dark:text-gray-300 hover:bg-blue-100 dark:hover:bg-slate-700";

  return (
    <nav className="bg-white dark:bg-slate-800 w-64 h-screen p-6 shadow-lg flex flex-col">
      <h1 className="text-2xl font-bold mb-8 text-blue-700 dark:text-blue-400">Clínica Saúde</h1>
      <div className="flex-grow">
        <NavLink to="/dashboard" className={({ isActive }) => `${baseStyle} ${isActive ? activeStyle : inactiveStyle}`}>
            Dashboard
        </NavLink>
        <NavLink to="/medicos" className={({ isActive }) => `${baseStyle} ${isActive ? activeStyle : inactiveStyle}`}>
            Médicos
        </NavLink>
        <NavLink to="/pacientes" className={({ isActive }) => `${baseStyle} ${isActive ? activeStyle : inactiveStyle}`}>
            Pacientes
        </NavLink>
        <NavLink to="/agendamentos" className={({ isActive }) => `${baseStyle} ${isActive ? activeStyle : inactiveStyle}`}>
            Agendamentos
        </NavLink>
      </div>
      <div className="mt-auto flex justify-center">
        <ThemeSwitcher />
      </div>
    </nav>
  );
};

export default Sidebar;