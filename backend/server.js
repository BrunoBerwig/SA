
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 20225;

// Middlewares
app.use(cors());
app.use(express.json());

// Importar as rotas
const authRoutes = require('./routes/auth');
const pacientesRoutes = require('./routes/pacientes');
const medicosRoutes = require('./routes/medicos');
const agendamentosRoutes = require('./routes/agendamentos');

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