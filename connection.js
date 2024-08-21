const mysql = require('mysql');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
require('dotenv').config();
const port = process.env.port||3000;
const db_host=process.env.db_host;
const db_user= process.env.db_user;
const db_password= process.env.db_password;
const db= process.env.db;
const sql2=process.env.qry2;
const sql1=process.env.qry1;
app.use(cors());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
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
    connection.query(sql1, (err, results) => {
        if (err) {
            console.error('Error fetching items:', err);
            res.status(500).send('Error fetching items');
            return;
        }
        res.json(results);
    });
});
app.post('/submit', (req, res) => {
    const quantity = parseInt(req.body.Quantity, 10);
    const price = parseFloat(req.body.Price,10);
    const { category, search} = req.body;
    console.log(req.body.Quantity);
    connection.query(sql2, [category, search, quantity, price], (err, result) => {
        if (err) throw err;
        res.send('Product added to database');
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