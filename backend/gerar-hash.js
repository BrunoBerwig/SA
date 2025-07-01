const bcrypt = require('bcrypt');

const senhaEmTextoPuro = 'senha'; 
const saltRounds = 10;


bcrypt.hash(senhaEmTextoPuro, saltRounds, function(err, hash) {
    if (err) {
        console.error("Erro ao gerar hash:", err);
        return;
    }
    console.log(hash);
});