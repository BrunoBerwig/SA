// arquivo: gerar-hash.js
const bcrypt = require('bcrypt');

// Coloque a senha que você quer criptografar aqui
const senhaEmTextoPuro = 'senha'; // <-- TROQUE AQUI
const saltRounds = 10;

console.log(`Gerando hash para a senha: "${senhaEmTextoPuro}"`);

bcrypt.hash(senhaEmTextoPuro, saltRounds, function(err, hash) {
    if (err) {
        console.error("Erro ao gerar hash:", err);
        return;
    }
    console.log("\n>>> SEU HASH SEGURO: <<<\n");
    console.log(hash);
    console.log("\nCopie a linha de hash acima e cole na coluna 'password_hash' do seu banco de dados.");
});