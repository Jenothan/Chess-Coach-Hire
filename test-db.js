const { Client } = require('pg');

// We use the same connection string as in your .env file.
const connectionString = 'postgresql://postgres:postgres@localhost:5432/chessDB?sslmode=disable';

const client = new Client({
    connectionString: connectionString,
});

console.log('Testing connection to chessDB using pg library...');

client.connect()
    .then(() => {
        console.log('Connected successfully!');
        return client.query('SELECT NOW()');
    })
    .then(res => {
        console.log('Current time from database:', res.rows[0].now);
        return client.end();
    })
    .catch(err => {
        console.error('Connection error:', err.message);
        process.exit(1);
    });
