const mysql = require('mysql2');

// Create a connection pool to the MySQL database
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',   // default MySQL user on WAMP
    password: '',   // default is no password, but change if you set one
    database: 'buildvis'
});

// Export the promise-based connection
module.exports = pool.promise();
