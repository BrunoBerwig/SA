import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/auth';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); 
    try {
      const success = await login(username, password);
      if (success) {
        navigate('/dashboard');
      } else {
        setError('Usuário ou senha incorretos');
      }
    } catch (err) {
      setError(err.message || 'Falha no login. Tente novamente.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-slate-900">
      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-slate-800 p-8 rounded-lg shadow-xl w-full max-w-sm border border-transparent dark:border-slate-700"
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-blue-700 dark:text-blue-400">
          Login
        </h2>

        {error && (
          <div className="bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300 p-3 mb-4 rounded-md text-center text-sm">
            {error}
          </div>
        )}

        <label className="block mb-2 text-gray-700 dark:text-gray-300 font-semibold" htmlFor="username">
          Usuário
        </label>
        <input
          type="text"
          id="username"
          className="w-full p-2 border border-gray-300 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-slate-700 dark:border-slate-600 dark:text-white dark:placeholder-gray-400"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />

        <label className="block mb-2 text-gray-700 dark:text-gray-300 font-semibold" htmlFor="password">
          Senha
        </label>
        <input
          type="password"
          id="password"
          className="w-full p-2 border border-gray-300 rounded mb-6 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-slate-700 dark:border-slate-600 dark:text-white dark:placeholder-gray-400"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition font-semibold"
        >
          Entrar
        </button>
      </form>
    </div>
  );
};

export default Login;