const express = require('express');
const router = express.Router();
const pool = require('../config/database');
const verifyToken = require('../middleware/authMiddleware');

router.get('/', verifyToken, async (req, res) => {
    const { search = '', status = '', medico_id = '', page = 1, limit = 10 } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);

    let whereClauses = [];
    const params = [];
    let paramIndex = 1;

    if (search) {
        whereClauses.push(`(p.nome ILIKE $${paramIndex} OR m.nome ILIKE $${paramIndex})`);
        params.push(`%${search}%`);
        paramIndex++;
    }

    if (status) {
        whereClauses.push(`a.status = $${paramIndex}`);
        params.push(status);
        paramIndex++;
    }

    if (medico_id) {
        whereClauses.push(`a.medico_id = $${paramIndex}`);
        params.push(parseInt(medico_id));
        paramIndex++;
    }
    
    const whereString = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';

    try {
        const countQuery = `
            SELECT COUNT(a.id) 
            FROM agendamentos a
            JOIN pacientes p ON a.paciente_id = p.id
            JOIN medicos m ON a.medico_id = m.id
            ${whereString}
        `;
        const countResult = await pool.query(countQuery, params.slice(0, paramIndex - 1));
        const totalItems = parseInt(countResult.rows[0].count);
        const totalPages = Math.ceil(totalItems / limit);

        const dataQuery = `
            SELECT a.id, a.data_hora, a.status, a.tipo_consulta,
                   p.nome as paciente_nome, p.id as paciente_id,
                   m.nome as medico_nome, m.id as medico_id
            FROM agendamentos a
            JOIN pacientes p ON a.paciente_id = p.id
            JOIN medicos m ON a.medico_id = m.id
            ${whereString}
            ORDER BY a.data_hora DESC
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
        console.error('Erro ao buscar agendamentos:', err.message);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

router.get('/:id', verifyToken, async (req, res) => {
    const { id } = req.params;
    try {
        const query = `
            SELECT a.*, p.nome as paciente_nome, m.nome as medico_nome
            FROM agendamentos a
            LEFT JOIN pacientes p ON a.paciente_id = p.id
            LEFT JOIN medicos m ON a.medico_id = m.id
            WHERE a.id = $1
        `;
        const result = await pool.query(query, [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Agendamento não encontrado.' });
        }
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Erro ao buscar agendamento por ID:', error.message);
        res.status(500).json({ error: error.message });
    }
});

router.post('/', verifyToken, async (req, res) => {
    try {
        const { paciente_id, medico_id, data, horario, tipo_consulta, observacoes_recepcao, status_confirmacao, motivo_consulta } = req.body;
        
        if (!paciente_id || !medico_id || !data || !horario) {
            return res.status(400).json({ message: 'Paciente, médico, data e horário são obrigatórios.' });
        }
        
        const data_hora = `${data}T${horario}:00`;
        
        const conflictCheck = await pool.query(
            'SELECT id FROM agendamentos WHERE medico_id = $1 AND data_hora = $2 AND status <> \'Cancelado\'',
            [medico_id, data_hora]
        );

        if (conflictCheck.rows.length > 0) {
            return res.status(409).json({ message: 'Horário já agendado para este médico.' });
        }

        const newAgendamento = await pool.query(
            `INSERT INTO agendamentos (paciente_id, medico_id, data_hora, status, tipo_consulta, observacoes_recepcao, status_confirmacao, motivo_consulta) 
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
            [paciente_id, medico_id, data_hora, 'Agendado', tipo_consulta, observacoes_recepcao, status_confirmacao, motivo_consulta]
        );
        res.status(201).json(newAgendamento.rows[0]);
    } catch (err) {
        console.error("Erro ao criar agendamento:", err.message);
        res.status(500).json({ error: 'Erro interno do servidor.' });
    }
});

router.put('/:id', verifyToken, async (req, res) => {
    const { id } = req.params;
    const { paciente_id, medico_id, data_hora, status, tipo_consulta, observacoes_recepcao, status_confirmacao, motivo_consulta } = req.body;

    if (!paciente_id || !medico_id || !data_hora || !status) {
        return res.status(400).json({ message: 'Campos essenciais para atualização estão faltando.' });
    }

    try {
        const updatedAgendamento = await pool.query(
            `UPDATE agendamentos 
             SET paciente_id = $1, medico_id = $2, data_hora = $3, status = $4, tipo_consulta = $5, observacoes_recepcao = $6, status_confirmacao = $7, motivo_consulta = $8, updated_at = NOW() 
             WHERE id = $9 
             RETURNING *`,
            [paciente_id, medico_id, data_hora, status, tipo_consulta, observacoes_recepcao, status_confirmacao, motivo_consulta, id]
        );

        if (updatedAgendamento.rows.length === 0) {
            return res.status(404).json({ message: 'Agendamento não encontrado.' });
        }
        res.json(updatedAgendamento.rows[0]);
    } catch (err) {
        console.error("Erro ao atualizar agendamento:", err.message);
        res.status(500).json({ error: err.message });
    }
});

router.delete('/:id', verifyToken, async (req, res) => {
    const { id } = req.params;
    try {
        const deleteResult = await pool.query('DELETE FROM agendamentos WHERE id = $1', [id]);
        if (deleteResult.rowCount === 0) {
            return res.status(404).json({ message: "Agendamento não encontrado para exclusão." });
        }
        res.status(204).send();
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;