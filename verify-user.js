const { Client } = require('pg');
const client = new Client({ connectionString: 'postgresql://postgres:postgres@localhost:5432/chessDB?sslmode=disable' });

client.connect()
    .then(() => client.query('SELECT id, name, email, role FROM "User";'))
    .then(res => {
        console.log('---BEGIN USERS---');
        console.log(JSON.stringify(res.rows, null, 2));
        console.log('---END USERS---');
        client.end();
    })
    .catch(err => {
        console.error(err);
        process.exit(1);
    });
