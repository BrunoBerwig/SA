const express = require('express');
const router = express.Router();
const pool = require('../config/database');
const verifyToken = require('../middleware/authMiddleware');

router.get('/', verifyToken, async (req, res) => {
    const { search = '', especialidade_id = '', page = 1, limit = 10 } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);

    let whereClauses = [];
    const params = [];
    let paramIndex = 1;

    if (search) {
        whereClauses.push(`(m.nome ILIKE $${paramIndex} OR m.email ILIKE $${paramIndex})`);
        params.push(`%${search}%`);
        paramIndex++;
    }

    if (especialidade_id) {
        whereClauses.push(`m.especialidade_id = $${paramIndex}`);
        params.push(parseInt(especialidade_id));
        paramIndex++;
    }

    const whereString = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';

    try {
        const countQuery = `SELECT COUNT(m.id) FROM medicos m ${whereString}`;
        const countResult = await pool.query(countQuery, params.slice(0, paramIndex - 1));
        const totalItems = parseInt(countResult.rows[0].count);
        const totalPages = Math.ceil(totalItems / limit);

        const dataQuery = `
            SELECT m.id, m.nome, e.nome as especialidade, m.crm_numero, m.crm_uf, m.foto_url, m.ativo
            FROM medicos m
            LEFT JOIN especialidades e ON m.especialidade_id = e.id
            ${whereString}
            ORDER BY m.nome ASC
            LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
        `;
        const dataParams = [...params.slice(0, paramIndex - 1), limit, offset];
        
        const dataResult = await pool.query(dataQuery, dataParams);

        res.json({
            data: dataResult.rows,
            pagination: {
                totalItems,
                totalPages,
                currentPage: parseInt(page),
                itemsPerPage: parseInt(limit)
            }
        });
    } catch (err) {
        console.error('Erro ao buscar médicos:', err.message);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

router.get('/:id', verifyToken, async (req, res) => {
    try {
        const { id } = req.params;
        const query = `
            SELECT m.*, e.nome as especialidade
            FROM medicos m
            LEFT JOIN especialidades e ON m.especialidade_id = e.id
            WHERE m.id = $1
        `;
        const result = await pool.query(query, [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Médico não encontrado.' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error('Erro ao buscar médico por ID:', err.message);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

router.get('/:id/agendamentos', verifyToken, async (req, res) => {
    const { id } = req.params;
    try {
        const query = `
            SELECT a.id, a.data_hora, a.tipo_consulta, p.id as paciente_id, p.nome as paciente_nome
            FROM agendamentos a
            JOIN pacientes p ON a.paciente_id = p.id
            WHERE a.medico_id = $1 AND a.data_hora >= DATE_TRUNC('day', NOW())
            ORDER BY a.data_hora ASC;
        `;
        const result = await pool.query(query, [id]);
        res.json(result.rows);
    } catch (err) {
        console.error(`Erro ao buscar agendamentos para o médico ${id}:`, err.message);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

router.post('/', verifyToken, async (req, res) => {
    const { nome, especialidade_id, email, telefone, crm_numero, crm_uf, foto_url, biografia, ativo } = req.body;
    if (!nome || !especialidade_id || !email || !crm_numero || !crm_uf) {
        return res.status(400).json({ message: 'Campos obrigatórios (Nome, Especialidade, Email, CRM e UF) não podem ser vazios.' });
    }
    try {
        const newMedico = await pool.query(
            `INSERT INTO medicos (nome, especialidade_id, email, telefone, crm_numero, crm_uf, foto_url, biografia, ativo) 
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
            [nome, especialidade_id, email, telefone, crm_numero, crm_uf.toUpperCase(), foto_url, biografia, ativo]
        );
        res.status(201).json(newMedico.rows[0]);
    } catch (err) {
        if (err.code === '23505') {
            return res.status(409).json({ message: 'Este email ou CRM já está em uso.' });
        }
        console.error('Erro ao criar novo médico:', err.message);
        res.status(500).json({ error: 'Erro interno do servidor ao criar médico.' });
    }
});

router.put('/:id', verifyToken, async (req, res) => {
    const { id } = req.params;
    const { nome, especialidade_id, email, telefone, crm_numero, crm_uf, foto_url, biografia, ativo } = req.body;
    if (!nome || !especialidade_id || !email || !crm_numero || !crm_uf) {
        return res.status(400).json({ message: 'Campos obrigatórios não podem ser vazios.' });
    }
    try {
        const updatedMedico = await pool.query(
            `UPDATE medicos SET nome = $1, especialidade_id = $2, email = $3, telefone = $4, crm_numero = $5, crm_uf = $6, foto_url = $7, biografia = $8, ativo = $9, updated_at = NOW() 
             WHERE id = $10 RETURNING *`,
            [nome, especialidade_id, email, telefone, crm_numero, crm_uf.toUpperCase(), foto_url, biografia, ativo, id]
        );
        if (updatedMedico.rows.length === 0) {
            return res.status(404).json({ message: 'Médico não encontrado para atualização.' });
        }
        res.json(updatedMedico.rows[0]);
    } catch (err) {
        console.error(`Erro ao atualizar médico ${id}:`, err.message);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

router.delete('/:id', verifyToken, async (req, res) => {
    const { id } = req.params;
    try {
        const deleteResult = await pool.query('DELETE FROM medicos WHERE id = $1', [id]);
        if (deleteResult.rowCount === 0) {
            return res.status(404).json({ message: 'Médico não encontrado para exclusão.' });
        }
        res.status(204).send();
    } catch (err) {
        if (err.code === '23503') {
            return res.status(409).json({ message: 'Não é possível excluir este médico pois ele possui agendamentos vinculados.' });
        }
        console.error(`Erro ao deletar médico ${id}:`, err.message);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

module.exports = router;