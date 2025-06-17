import React from 'react';

const DashboardHome = () => {
    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <h1 className="text-3xl font-semibold mb-4 text-gray-800">
                Bem-vindo(a) ao Dashboard
            </h1>
            <p className="text-gray-600">
                Selecione uma opção no menu lateral para começar a gerenciar a clínica.
            </p>
        </div>
    );
};

export default DashboardHome;