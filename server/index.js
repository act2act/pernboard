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
        const tokenResponse = await fetch('https://kauth.kakao.com/oauth/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: params
            });

        const tokenData = await tokenResponse.json();
        req.session.key = tokenData.access_token;
        
        const profileResponse = await fetch('https://kapi.kakao.com/v2/user/me', {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${req.session.key}`,
                'Content-Type': 'application/x-www-form-urlencoded'
            },
        });
        
        const userData = await profileResponse.json();
        req.session.userId = userData.id;
        
        const checkUserExists = await pool.query('SELECT * FROM users WHERE user_id = $1', [userData.id]);
        if (checkUserExists.rows.length === 0) {
            const response = await pool.query('INSERT INTO users (user_id, username, created_at) VALUES ($1, $2, $3) RETURNING *', [userData.id, userData.properties.nickname, userData.connected_at]);
        }

        res.status(302).redirect(`${process.env.ORIGIN_URL}`);
    } catch (error) {
        res.send(error.message);
    }
});

app.get('/profile', async (req, res) => {
    try {
        const response = await pool.query('SELECT * FROM users WHERE user_id = $1', [req.session.userId]);
        const currentUser = response.rows[0];

        res.status(200).send(currentUser);
    } catch (error) {
        res.send(error.message);
    }
});

app.get('/logout', async (req, res) => {
    try {
        req.session.destroy();
        const response = await fetch(`https://kauth.kakao.com/oauth/logout?client_id=${process.env.CLIENT_ID}&logout_redirect_uri=${process.env.ORIGIN_URL}`);

        res.status(302).redirect(`${process.env.ORIGIN_URL}`);
    } catch (error) {
        res.send(error.message);
    }
});

app.get('/posts', async (req, res) => {
    try {
        const response = await pool.query('SELECT * FROM posts');
        const posts = response.rows;

        res.status(200).send(posts);
    } catch (error) {
        req.send(error.message);
    }
});

app.post('/posts', async (req, res) => {
    try {
        const { title, author, post_content } = req.body;
        const response = await pool.query('INSERT INTO posts (title, author, post_content) VALUES ($1, $2, $3)', [title, author, post_content]);

        res.status(201).send({message: 'Post created successfully'});
    } catch (error) {
        res.send(error.message);
    }
});

app.listen(process.env.PORT, () => {
    console.log(`Server is listening on port ${process.env.PORT}`);
});