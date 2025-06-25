const express = require('express');
const router = express.Router();
const pool = require('../config/database');
const verifyToken = require('../middleware/authMiddleware');

// GET all pacientes
router.get('/', verifyToken, async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT
                id,
                nome,
                email,
                telefone,
                convenio,
                data_nascimento,
                alergias,
                condicoes_medicas,
                contato_emergencia_nome,
                contato_emergencia_numero,
                created_at
            FROM pacientes
            ORDER BY nome ASC
        `);
        res.json(result.rows);
    } catch (err) {
        console.error('Erro ao buscar todos os pacientes:', err.message);
        res.status(500).json({ error: err.message });
    }
});

// GET paciente by ID
router.get('/:id', verifyToken, async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query(`
            SELECT
                id,
                nome,
                email,
                telefone,
                convenio,
                data_nascimento,
                alergias,
                condicoes_medicas,
                contato_emergencia_nome,
                contato_emergencia_numero,
                created_at
            FROM pacientes
            WHERE id = $1
        `, [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Paciente não encontrado.' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error('Erro ao buscar paciente por ID:', err.message);
        res.status(500).json({ error: err.message });
    }
});

// POST a new paciente
router.post('/', verifyToken, async (req, res) => {
    const { nome, email, telefone, convenio, data_nascimento, alergias, condicoes_medicas, contato_emergencia_nome, contato_emergencia_numero } = req.body;

    // Log para depuração
    console.log('Dados recebidos para POST de paciente:', req.body);

    try {
        const newPaciente = await pool.query(
            'INSERT INTO pacientes (nome, email, telefone, convenio, data_nascimento, alergias, condicoes_medicas, contato_emergencia_nome, contato_emergencia_numero) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *',
            [nome, email, telefone, convenio, data_nascimento, alergias, condicoes_medicas, contato_emergencia_nome, contato_emergencia_numero]
        );
        res.status(201).json(newPaciente.rows[0]);
    } catch (err) {
        console.error('Erro ao criar novo paciente:', err.message);
        res.status(500).json({ error: err.message });
    }
});

// PUT (update) a paciente
router.put('/:id', verifyToken, async (req, res) => {
    const { id } = req.params;
    const { nome, email, telefone, convenio, data_nascimento, alergias, condicoes_medicas, contato_emergencia_nome, contato_emergencia_numero } = req.body;

    // Log para depuração
    console.log(`Dados recebidos para PUT do paciente ${id}:`, req.body);

    try {
        const updatedPaciente = await pool.query(
            'UPDATE pacientes SET nome = $1, email = $2, telefone = $3, convenio = $4, data_nascimento = $5, alergias = $6, condicoes_medicas = $7, contato_emergencia_nome = $8, contato_emergencia_numero = $9 WHERE id = $10 RETURNING *',
            [nome, email, telefone, convenio, data_nascimento, alergias, condicoes_medicas, contato_emergencia_nome, contato_emergencia_numero, id]
        );
        if (updatedPaciente.rows.length === 0) {
            return res.status(404).json({ message: 'Paciente não encontrado para atualização.' });
        }
        res.json(updatedPaciente.rows[0]);
    } catch (err) {
        console.error(`Erro ao atualizar paciente ${id}:`, err.message);
        res.status(500).json({ error: err.message });
    }
});

// DELETE a paciente
router.delete('/:id', verifyToken, async (req, res) => {
    try {
        const { id } = req.params;
        const deleteResult = await pool.query('DELETE FROM pacientes WHERE id = $1 RETURNING id', [id]);
        if (deleteResult.rows.length === 0) {
            return res.status(404).json({ message: 'Paciente não encontrado para exclusão.' });
        }
        res.status(204).send(); // No content
    } catch (err) {
        console.error(`Erro ao deletar paciente ${req.params.id}:`, err.message);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;