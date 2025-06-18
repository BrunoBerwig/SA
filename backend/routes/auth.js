const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const pool = require('../config/database'); // Importando sua conexão com o banco

// --- ROTA DE CADASTRO DE NOVO USUÁRIO ---
router.post('/register', async (req, res) => {
    const { username, password, role } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Nome de usuário e senha são obrigatórios.' });
    }

    try {
        // Gera o "salt" e o "hash" da senha. O número 10 indica a "força" da criptografia.
        const salt = await bcrypt.genSalt(10);
        const password_hash = await bcrypt.hash(password, salt);

        // Insere o novo usuário no banco de dados
        const newUserQuery = `
            INSERT INTO usuarios (username, password_hash, role) 
            VALUES ($1, $2, $3) 
            RETURNING id, username, role, created_at
        `;
        
        const newUser = await pool.query(newUserQuery, [username, password_hash, role || 'user']);

        res.status(201).json({
            message: 'Usuário criado com sucesso!',
            user: newUser.rows[0]
        });

    } catch (error) {
        // Trata o caso de o username já existir (erro de violação de chave única)
        if (error.code === '23505') { 
            return res.status(409).json({ message: 'Este nome de usuário já está em uso.' });
        }
        console.error('Erro no registro:', error);
        res.status(500).json({ message: 'Erro interno do servidor.' });
    }
});


// --- ROTA DE LOGIN ---
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Nome de usuário e senha são obrigatórios.' });
    }

    try {
        // 1. Encontrar o usuário no banco de dados pelo username
        const userQuery = 'SELECT * FROM usuarios WHERE username = $1';
        const result = await pool.query(userQuery, [username]);
        const userFromDb = result.rows[0];

        // 2. Se o usuário não for encontrado, retorne um erro
        if (!userFromDb) {
            return res.status(401).json({ message: 'Usuário ou senha inválidos.' });
        }

        // 3. Comparar a senha enviada com o hash salvo no banco
        const isPasswordMatch = await bcrypt.compare(password, userFromDb.password_hash);

        // 4. Se a senha não corresponder, retorne um erro
        if (!isPasswordMatch) {
            return res.status(401).json({ message: 'Usuário ou senha inválidos.' });
        }

        // 5. Se a senha estiver correta, crie o payload e o token JWT
        const payload = {
            id: userFromDb.id,
            username: userFromDb.username,
            role: userFromDb.role
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.json({ token });

    } catch (error) {
        console.error('Erro no login:', error);
        res.status(500).json({ message: 'Erro interno do servidor.' });
    }
});

module.exports = router;