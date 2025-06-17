const express = require('express');
const router = express.Router();
const pool = require('../database');
const verifyToken = require('../middleware/authMiddleware');

// GET all agendamentos with patient and medico names
router.get('/', verifyToken, async (req, res) => {
    try {
        const query = `
            SELECT 
                a.id, 
                a.data_hora, 
                a.status, 
                p.nome as paciente_nome, 
                m.nome as medico_nome
            FROM agendamentos a
            JOIN pacientes p ON a.paciente_id = p.id
            JOIN medicos m ON a.medico_id = m.id
            ORDER BY a.data_hora DESC
        `;
        const result = await pool.query(query);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST a new agendamento
router.post('/', verifyToken, async (req, res) => {
    try {
        const { paciente_id, medico_id, data, horario } = req.body;
        const data_hora = `${data}T${horario}:00`;
        
        const conflictCheck = await pool.query(
            'SELECT id FROM agendamentos WHERE medico_id = $1 AND data_hora = $2',
            [medico_id, data_hora]
        );

        if (conflictCheck.rows.length > 0) {
            return res.status(409).json({ message: 'Horário já agendado para este médico.' });
        }

        const newAgendamento = await pool.query(
            'INSERT INTO agendamentos (paciente_id, medico_id, data_hora, status) VALUES ($1, $2, $3, $4) RETURNING *',
            [paciente_id, medico_id, data_hora, 'Agendado']
        );
        res.status(201).json(newAgendamento.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// DELETE an agendamento
router.delete('/:id', verifyToken, async (req, res) => {
    try {
        const { id } = req.params;
        await pool.query('DELETE FROM agendamentos WHERE id = $1', [id]);
        res.status(204).send();
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;