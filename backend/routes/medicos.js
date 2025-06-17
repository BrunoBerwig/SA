const express = require('express');
const router = express.Router();
const pool = require('../config/database'); // <-- CAMINHO CORRIGIDO
const verifyToken = require('../middleware/authMiddleware');

// GET all medicos
router.get('/', verifyToken, async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM medicos ORDER BY nome ASC');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET medico by ID
router.get('/:id', verifyToken, async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('SELECT * FROM medicos WHERE id = $1', [id]);
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST a new medico
router.post('/', verifyToken, async (req, res) => {
    try {
        const { nome, especialidade, email, telefone } = req.body;
        const newMedico = await pool.query(
            'INSERT INTO medicos (nome, especialidade, email, telefone) VALUES ($1, $2, $3, $4) RETURNING *',
            [nome, especialidade, email, telefone]
        );
        res.status(201).json(newMedico.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// PUT (update) a medico
router.put('/:id', verifyToken, async (req, res) => {
    try {
        const { id } = req.params;
        const { nome, especialidade, email, telefone } = req.body;
        const updatedMedico = await pool.query(
            'UPDATE medicos SET nome = $1, especialidade = $2, email = $3, telefone = $4 WHERE id = $5 RETURNING *',
            [nome, especialidade, email, telefone, id]
        );
        res.json(updatedMedico.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// DELETE a medico
router.delete('/:id', verifyToken, async (req, res) => {
    try {
        const { id } = req.params;
        await pool.query('DELETE FROM medicos WHERE id = $1', [id]);
        res.status(204).send();
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


module.exports = router;