const { Client } = require('pg');
const client = new Client({ connectionString: 'postgresql://postgres:postgres@localhost:5432/chessDB?sslmode=disable' });

client.connect()
    .then(() => client.query("SELECT id, name FROM \"User\" WHERE email = 'student@test.com';"))
    .then(res => {
        console.log('STUDENT_ID_START');
        console.log(res.rows[0].id);
        console.log('STUDENT_ID_END');
        client.end();
    })
    .catch(err => {
        console.error(err);
        process.exit(1);
    });
