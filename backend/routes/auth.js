const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

// A autenticação de usuário/senha aqui é um MOCK (exemplo).
// Você deve substituir isso por uma consulta ao seu banco de dados
// para verificar um usuário e senha reais.
router.post('/login', (req, res) => {
    const { username, password } = req.body;

    if (username === 'admin' && password === 'password') {
        const user = { id: 1, username: 'admin' };
        const token = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });
    } else {
        res.status(401).json({ message: 'Usuário ou senha inválidos' });
    }
});

module.exports = router;