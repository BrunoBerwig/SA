const express = require('express');
const router = express.Router();
const pool = require('../config/database');
const verifyToken = require('../middleware/authMiddleware');

// GET all pacientes
router.get('/', verifyToken, async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM pacientes ORDER BY nome ASC');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET paciente by ID
router.get('/:id', verifyToken, async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('SELECT * FROM pacientes WHERE id = $1', [id]);
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST a new paciente
router.post('/', verifyToken, async (req, res) => {
    try {
        const { nome, email, telefone } = req.body;
        const newPaciente = await pool.query(
            'INSERT INTO pacientes (nome, email, telefone) VALUES ($1, $2, $3) RETURNING *',
            [nome, email, telefone]
        );
        res.status(201).json(newPaciente.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// PUT (update) a paciente
router.put('/:id', verifyToken, async (req, res) => {
    try {
        const { id } = req.params;
        const { nome, email, telefone } = req.body;
        const updatedPaciente = await pool.query(
            'UPDATE pacientes SET nome = $1, email = $2, telefone = $3 WHERE id = $4 RETURNING *',
            [nome, email, telefone, id]
        );
        res.json(updatedPaciente.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// DELETE a paciente
router.delete('/:id', verifyToken, async (req, res) => {
    try {
        const { id } = req.params;
        await pool.query('DELETE FROM pacientes WHERE id = $1', [id]);
        res.status(204).send(); // No content
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;