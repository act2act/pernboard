const express = require('express');
const session = require('express-session');
const cors = require('cors');
const qs = require('qs');
const crypto = require('crypto');
const pool = require('./db');

const app = express();
require('dotenv').config();

// Middleware

app.use(express.json());
app.use(cors({
    origin: process.env.ORIGIN_URL,
    credentials: true
}));
app.use(session({
    secret: crypto.createHmac('sha256', process.env.SECRET_KEY).update(process.env.BASE_STR).digest('hex'),
    resave: false,
    saveUninitialized: true,
    cookie: {secure: false}
}))

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

app.get('/authorize', async (req, res) => {
    try {
        res.status(302).redirect(`https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${process.env.KAKAO_CLIENT_ID}&redirect_uri=${process.env.KAKAO_REDIRECT_URI}`);
    } catch (error) {
        res.send(error.message);
    }
});

app.get('/redirect', async (req, res) => {
    const params = qs.stringify({
        grant_type: 'authorization_code',
        client_id: process.env.KAKAO_CLIENT_ID,
        redirect_uri: process.env.KAKAO_REDIRECT_URI,
        code: req.query.code,
        client_secret: process.env.KAKAO_CLIENT_SECRET
    })

    try {
        const response = await fetch('https://kauth.kakao.com/oauth/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: params
            });

        const data = await response.json();
        // console.log('This is a token: ', data);
        req.session.key = data.access_token;
        res.status(302).redirect(`${process.env.ORIGIN_URL}`);
    } catch (error) {
        res.send(error.message);
    }
});

app.get('/profile', async (req, res) => {
    try {
        if (!req.session.key) return res.status(401).send({message: 'Unauthorized!'})

        const response = await fetch('https://kapi.kakao.com/v2/user/me', {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${req.session.key}`,
                'Content-Type': 'application/x-www-form-urlencoded'
            },
        });

        const data = await response.json();
        // console.log('This is a user profile: ', data);
        res.status(200).send(data);
    } catch (error) {
        res.send(error.message);
    }
});

app.listen(process.env.PORT, () => {
    console.log(`Server is listening on port ${process.env.PORT}`);
});