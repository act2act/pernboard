const express = require('express');
const cors = require('cors');
const pool = require('./db');

const app = express();

const PORT = process.env.PORT || 4000;

// Middleware

app.use(express.json());
app.use(cors());

// Routes

app.get('/', (req, res) => {
    res.status(200).send({message: 'Welcome to the API'});
});

app.get('/setup', async (req, res) => {
    try {
        const response = await pool.query('CREATE TABLE IF NOT EXISTS users (id SERIAL NOT NULL PRIMARY KEY, username VARCHAR(20), profile VARCHAR(100), created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)');

        res.status(200).send({message: 'Table created successfully'});
    } catch (error) {
        res.send(error.message);
    }
});

app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});