require('dotenv').config();

const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 20225;

const iniciarAgendadorDeEmails = require('./emailScheduler');

app.use(cors());
app.use(express.json());

const authRoutes = require('./routes/auth');
const pacientesRoutes = require('./routes/pacientes');
const medicosRoutes = require('./routes/medicos');
const agendamentosRoutes = require('./routes/agendamentos');
const especialidadesRoutes = require('./routes/especialidades');
const conveniosRoutes = require('./routes/convenios');

app.use('/api', authRoutes);
app.use('/api/pacientes', pacientesRoutes);
app.use('/api/medicos', medicosRoutes);
app.use('/api/agendamentos', agendamentosRoutes);
app.use('/api/especialidades', especialidadesRoutes);
app.use('/api/convenios', conveniosRoutes);

app.get('/', (req, res) => {
    res.send('API da Clínica funcionando!');
});

app.listen(PORT, () => {
    console.log(`Servidor backend rodando na porta ${PORT}`);
    iniciarAgendadorDeEmails();
});