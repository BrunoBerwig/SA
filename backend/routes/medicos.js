const express = require('express');
const router = express.Router();
const pool = require('../config/database');
const verifyToken = require('../middleware/authMiddleware');

router.get('/', verifyToken, async (req, res) => {
    try {
        const result = await pool.query('SELECT id, nome, especialidade, crm_numero, crm_uf, foto_url, ativo FROM medicos ORDER BY nome ASC');
        res.json(result.rows);
    } catch (err) {
        console.error('Erro ao buscar médicos:', err.message);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

router.get('/:id', verifyToken, async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('SELECT * FROM medicos WHERE id = $1', [id]);
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
            SELECT 
                a.id, 
                a.data_hora, 
                a.tipo_consulta, 
                p.id as paciente_id, 
                p.nome as paciente_nome
            FROM 
                agendamentos a
            JOIN 
                pacientes p ON a.paciente_id = p.id
            WHERE 
                a.medico_id = $1 
                AND a.data_hora >= DATE_TRUNC('day', NOW())
            ORDER BY 
                a.data_hora ASC;
        `;
        const result = await pool.query(query, [id]);
        res.json(result.rows);
    } catch (err) {
        console.error(`Erro ao buscar agendamentos para o médico ${id}:`, err.message);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

router.post('/', verifyToken, async (req, res) => {

});

router.put('/:id', verifyToken, async (req, res) => {

});

router.delete('/:id', verifyToken, async (req, res) => {
    const { id } = req.params;
    try {
        const deleteResult = await pool.query('DELETE FROM medicos WHERE id = $1 RETURNING id', [id]);
        
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
