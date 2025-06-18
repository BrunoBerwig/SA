import React from 'react';
import { useTheme } from '../../hooks/useTheme';
import { FaSun, FaMoon } from 'react-icons/fa';

const ThemeSwitcher = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition"
      aria-label="Alternar tema"
      title="Alternar tema"
    >
      {theme === 'light' ? <FaMoon size={20} /> : <FaSun size={20} className="text-yellow-400" />}
    </button>
  );
};

export default ThemeSwitcher;