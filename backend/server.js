require('dotenv').config();

const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware para o corpo da requisição
app.use(cors());
app.use(express.json());

// Importar as rotas com os caminhos corretos
const authRoutes = require('./routes/auth'); // Corrigido
const pacientesRoutes = require('./routes/pacientes'); // Corrigido
const medicosRoutes = require('./routes/medicos'); // Corrigido
const agendamentosRoutes = require('./routes/agendamentos'); // Corrigido

// Rotas da API
app.use('/api', authRoutes);
app.use('/api/pacientes', pacientesRoutes);
app.use('/api/medicos', medicosRoutes);
app.use('/api/agendamentos', agendamentosRoutes);

// Rota de teste
app.get('/', (req, res) => {
    res.send('API da Clínica funcionando!');
});

// Iniciar o servidor
app.listen(PORT, () => {
    console.log(`Servidor backend rodando na porta ${PORT}`);
});