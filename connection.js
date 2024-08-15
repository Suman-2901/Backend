const mysql = require('mysql');
const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();
require('dotenv').config();
const port = process.env.port||3000;
const db_host=process.env.db_host;
const db_user= process.env.db_user;
const db_password= process.env.db_password;
const db= process.env.db;
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));
// Create a connection to the MySQL database
const connection = mysql.createConnection({
    host:db_host ,
    user:db_user,
    password: db_password,
    database:db
});

// Connect to the database
connection.connect(err => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Connected to the MySQL database.');
        
});

// Endpoint to get items
app.get('/items', (req, res) => {
    connection.query('SELECT * FROM product', (err, results) => {
        if (err) {
            console.error('Error fetching items:', err);
            res.status(500).send('Error fetching items');
            return;
        }
        res.json(results);
    });
});

// // Start the server
app.listen(port, () => {
    console.log(`Server running on port${port}`);
});
process.on('SIGINT', () => {
    connection.end(err => {
        if (err) {
            console.error('Error closing MySQL connection:', err);
        } else {
            console.log('MySQL connection closed.');
        }
        process.exit();
    });
});