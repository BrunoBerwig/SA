const express = require('express');
const router = express.Router();
const pool = require('../config/database');
const verifyToken = require('../middleware/authMiddleware');

router.get('/', verifyToken, async (req, res) => {
    const { search = '', convenio = '', page = 1, limit = 10 } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);
    let whereClauses = [];
    const params = [];
    let paramIndex = 1;
    if (search) {
        whereClauses.push(`(nome ILIKE $${paramIndex} OR email ILIKE $${paramIndex})`);
        params.push(`%${search}%`);
        paramIndex++;
    }
    if (convenio) {
        whereClauses.push(`convenio = $${paramIndex}`);
        params.push(convenio);
        paramIndex++;
    }
    const whereString = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';
    try {
        const countQuery = `SELECT COUNT(*) FROM pacientes ${whereString}`;
        const countResult = await pool.query(countQuery, params.slice(0, paramIndex - 1));
        const totalItems = parseInt(countResult.rows[0].count);
        const totalPages = Math.ceil(totalItems / limit);
        const dataQuery = `
            SELECT id, nome, email, telefone, convenio, foto_url
            FROM pacientes ${whereString} ORDER BY nome ASC
            LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
        const dataParams = [...params.slice(0, paramIndex - 1), limit, offset];
        const dataResult = await pool.query(dataQuery, dataParams);
        res.json({
            data: dataResult.rows,
            pagination: { totalItems, totalPages, currentPage: parseInt(page), itemsPerPage: parseInt(limit) }
        });
    } catch (err) {
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

router.get('/:id', verifyToken, async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('SELECT * FROM pacientes WHERE id = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Paciente não encontrado.' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

router.get('/:id/agendamentos', verifyToken, async (req, res) => {
    const { id } = req.params;
    try {
        const query = `
            SELECT a.id, a.data_hora, a.status, a.tipo_consulta, m.nome as medico_nome, e.nome as medico_especialidade
            FROM agendamentos a
            JOIN medicos m ON a.medico_id = m.id
            JOIN especialidades e ON m.especialidade_id = e.id
            WHERE a.paciente_id = $1
            ORDER BY a.data_hora DESC;
        `;
        const result = await pool.query(query, [id]);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

router.post('/', verifyToken, async (req, res) => {
    const { nome, email, telefone, convenio, data_nascimento, alergias, condicoes_medicas, contato_emergencia_nome, contato_emergencia_numero, foto_url } = req.body;
    try {
        const newPaciente = await pool.query(
            'INSERT INTO pacientes (nome, email, telefone, convenio, data_nascimento, alergias, condicoes_medicas, contato_emergencia_nome, contato_emergencia_numero, foto_url) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *',
            [nome, email, telefone, convenio, data_nascimento, alergias, condicoes_medicas, contato_emergencia_nome, contato_emergencia_numero, foto_url]
        );
        res.status(201).json(newPaciente.rows[0]);
    } catch (err) {
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

router.put('/:id', verifyToken, async (req, res) => {
    const { id } = req.params;
    const { nome, email, telefone, convenio, data_nascimento, alergias, condicoes_medicas, contato_emergencia_nome, contato_emergencia_numero, foto_url } = req.body;
    try {
        const updatedPaciente = await pool.query(
            'UPDATE pacientes SET nome = $1, email = $2, telefone = $3, convenio = $4, data_nascimento = $5, alergias = $6, condicoes_medicas = $7, contato_emergencia_nome = $8, contato_emergencia_numero = $9, foto_url = $10 WHERE id = $11 RETURNING *',
            [nome, email, telefone, convenio, data_nascimento, alergias, condicoes_medicas, contato_emergencia_nome, contato_emergencia_numero, foto_url, id]
        );
        if (updatedPaciente.rows.length === 0) {
            return res.status(404).json({ message: 'Paciente não encontrado para atualização.' });
        }
        res.json(updatedPaciente.rows[0]);
    } catch (err) {
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

router.delete('/:id', verifyToken, async (req, res) => {
    const { id } = req.params;
    try {
        const deleteResult = await pool.query('DELETE FROM pacientes WHERE id = $1 RETURNING id', [id]);
        if (deleteResult.rowCount === 0) {
            return res.status(404).json({ message: 'Paciente não encontrado para exclusão.' });
        }
        res.status(204).send();
    } catch (err) {
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

module.exports = router;