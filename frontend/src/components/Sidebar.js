import React from 'react';
import { NavLink } from 'react-router-dom';

const Sidebar = () => {
  const baseStyle =
    "block py-3 px-5 rounded-lg mb-2 transition-colors duration-200 font-medium";
  const activeStyle =
    "bg-blue-600 text-white shadow-lg";

  return (
    <nav className="bg-white w-64 h-screen p-6 shadow-lg flex flex-col">
      <h1 className="text-2xl font-bold mb-6 text-blue-700">Clínica Saúde</h1>
      <NavLink
        to="/dashboard"
        className={({ isActive }) =>
          isActive ? `${baseStyle} ${activeStyle}` : `${baseStyle} text-gray-700 hover:bg-blue-100`
        }
      >
        Dashboard
      </NavLink>
      <NavLink
        to="/medicos"
        className={({ isActive }) =>
          isActive ? `${baseStyle} ${activeStyle}` : `${baseStyle} text-gray-700 hover:bg-blue-100`
        }
      >
        Médicos
      </NavLink>
      <NavLink
        to="/pacientes"
        className={({ isActive }) =>
          isActive ? `${baseStyle} ${activeStyle}` : `${baseStyle} text-gray-700 hover:bg-blue-100`
        }
      >
        Pacientes
      </NavLink>
      <NavLink
        to="/agendamentos"
        className={({ isActive }) =>
          isActive ? `${baseStyle} ${activeStyle}` : `${baseStyle} text-gray-700 hover:bg-blue-100`
        }
      >
        Agendamentos
      </NavLink>
      <NavLink
        to="/atendimentos"
        className={({ isActive }) =>
          isActive ? `${baseStyle} ${activeStyle}` : `${baseStyle} text-gray-700 hover:bg-blue-100`
        }
      >
        Atendimentos
      </NavLink>
    </nav>
  );
};

export default Sidebar;
