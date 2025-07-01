
const { Pool } = require('pg');


if (typeof process.env.DB_PASSWORD !== 'string') {
    console.error('ERROR');
    process.exit(1); 
}

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
    ssl: {
        require: true,
        rejectUnauthorized: false
    }
});

pool.connect((err, client, release) => {
    if (err) {
        console.error('ERRO (pool.connect):', err.stack);
        return;
    }
    client.query('SELECT NOW()', (err, result) => {
        release();
        if (err) {
            console.error('Erro ao executar query de teste', err.stack);
            return;
        }
        console.log('Conectado ao PostgreSQL. Hora do servidor:', result.rows[0].now);
    });
});

module.exports = pool;