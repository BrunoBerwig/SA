const { Pool } = require('pg');

// Esta parte lê as informações do seu arquivo .env
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

// Este trecho testa a conexão quando o servidor inicia
pool.connect((err, client, release) => {
    if (err) {
        return console.error('Erro ao conectar ao banco de dados', err.stack);
    }
    client.query('SELECT NOW()', (err, result) => {
        release();
        if (err) {
            return console.error('Erro ao executar query de teste', err.stack);
        }
        console.log('Conectado ao PostgreSQL com sucesso! Hora do servidor:', result.rows[0].now);
    });
});

module.exports = pool;