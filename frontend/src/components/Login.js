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
    const success = await login(username, password);
    if (success) {
      navigate('/dashboard');
    } else {
      setError('Usuário ou senha incorretos');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-blue-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm"
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-blue-700">
          Login
        </h2>

        {error && (
          <div className="bg-red-100 text-red-700 p-2 mb-4 rounded">
            {error}
          </div>
        )}

        <label className="block mb-2 text-gray-700 font-semibold" htmlFor="username">
          Usuário
        </label>
        <input
          type="text"
          id="username"
          className="w-full p-2 border border-gray-300 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />

        <label className="block mb-2 text-gray-700 font-semibold" htmlFor="password">
          Senha
        </label>
        <input
          type="password"
          id="password"
          className="w-full p-2 border border-gray-300 rounded mb-6 focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-3 rounded hover:bg-blue-700 transition"
        >
          Entrar
        </button>
      </form>
    </div>
  );
};

export default Login;
