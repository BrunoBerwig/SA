import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../services/api';

const PacienteForm = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [formData, setFormData] = useState({
        nome: '',
        email: '',
        telefone: '',
    });

    useEffect(() => {
        if (id) {
            api.get(`/pacientes/${id}`).then(response => {
                setFormData(response.data);
            });
        }
    }, [id]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (id) {
                await api.put(`/pacientes/${id}`, formData);
            } else {
                await api.post('/pacientes', formData);
            }
            navigate('/pacientes');
        } catch (error) {
            console.error('Erro ao salvar paciente:', error);
            alert('Ocorreu um erro ao salvar o paciente.');
        }
    };
    
    const pageTitle = id ? '📝 Editar Paciente' : '➕ Novo Paciente';

    return (
        <div className="max-w-lg mx-auto bg-white rounded-2xl shadow-md p-6 border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">{pageTitle}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-gray-700 font-medium mb-1">Nome</label>
                    <input
                        type="text"
                        name="nome"
                        value={formData.nome}
                        onChange={handleChange}
                        className="w-full border rounded-lg px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>
                <div>
                    <label className="block text-gray-700 font-medium mb-1">Email</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full border rounded-lg px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>
                <div>
                    <label className="block text-gray-700 font-medium mb-1">Telefone</label>
                    <input
                        type="text"
                        name="telefone"
                        value={formData.telefone}
                        onChange={handleChange}
                        className="w-full border rounded-lg px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>
                <button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition"
                >
                    Salvar Paciente
                </button>
            </form>
        </div>
    );
};

export default PacienteForm;