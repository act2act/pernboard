const express = require('express');
const session = require('express-session');
const cors = require('cors');
const qs = require('qs');
const crypto = require('crypto');
const redis = require('redis');
const pool = require('./db');

const app = express();
require('dotenv').config();
const redisClient = redis.createClient();
redisClient.on('connect', () => {console.log('Redis connected')});
redisClient.on('error', (error) => {console.log('Redis error: ' + error)});
(async () => {
    await redisClient.connect();
})();

// Middleware

app.use(express.json());
app.use(cors({
    origin: '*',
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
        const redisResponse = await redisClient.get(req.session.userId.toString());
        if (redisResponse) {
            // console.log('Profile cache hit');
            res.status(200).json(JSON.parse(redisResponse));
        } else {
            // console.log('Profile cache miss');
            const response = await pool.query('SELECT * FROM users WHERE user_id = $1', [req.session.userId]);
            const currentUser = response.rows[0];
            redisClient.setEx(req.session.userId.toString(), 3600, JSON.stringify(currentUser));

            res.status(200).send(currentUser);
        }
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
        const redisResponse = await redisClient.lRange('posts', 0, -1);
        if (redisResponse.length > 0) {
            // console.log('Posts cache hit');
            const posts = redisResponse.map(post => JSON.parse(post));
            res.status(200).json(posts);
        } else {
            // console.log('Posts cache miss');
            const response = await pool.query('SELECT * FROM posts');
            const posts = response.rows;
            await redisClient.del('posts');
            await redisClient.rPush('posts', posts.map(post => JSON.stringify(post)));
    
            res.status(200).send(posts);
        }
    } catch (error) {
        res.send(error.message);
    }
});

app.post('/posts', async (req, res) => {
    try {
        const { title, author, post_content } = req.body;
        const response = await pool.query('INSERT INTO posts (title, author, post_content) VALUES ($1, $2, $3) RETURNING *', [title, author, post_content]); 
        const newPost = response.rows[0];
        await redisClient.rPush('posts', JSON.stringify(newPost));

        res.status(201).send({message: 'Post created successfully', post: newPost});
    } catch (error) {
        res.send(error.message);
    }
});

app.get('/posts/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const response = await pool.query('SELECT * FROM posts WHERE post_id = $1', [id]);

        res.status(200).send(response.rows[0]);
    } catch (error) {
        res.send(error.message);
    }
});

app.put('/posts/:id', async (req, res) => {
    const { id }  = req.params;
    const { title, post_content } = req.body;

    try {
        const response = await pool.query('UPDATE posts SET title = $1, post_content = $2 WHERE post_id = $3 RETURNING *', [title, post_content, id]);
        const updatedPost = response.rows[0];
        const rawPosts = await redisClient.lRange('posts', 0, -1);
        const posts = rawPosts.map(post => JSON.parse(post));
        const idxToUpdate = posts.findIndex(post => post.post_id === parseInt(id));
        await redisClient.lSet('posts', idxToUpdate, JSON.stringify(updatedPost));

        res.status(200).send({message: 'Post updated successfully', post: updatedPost});
    } catch (error) {
        res.send(error.message);
    }
})

app.delete('/posts/:id', async (req, res) => {
    const { id } = req.params;

    try {
        await pool.query('DELETE FROM posts WHERE post_id = $1', [id]);

        const rawPosts = await redisClient.lRange('posts', 0, -1);
        const posts = rawPosts.map(post => JSON.parse(post));
        const idxToDelete = posts.findIndex(post => post.post_id === parseInt(id));
        await redisClient.lSet('posts', idxToDelete, 'TO_DELETE');
        await redisClient.lRem('posts', 0, 'TO_DELETE');

        res.status(200).send({message: 'Post deleted successfully'});
    } catch (error) {
        res.send(error.message);
    }
});

app.listen(process.env.PORT, () => {
    console.log(`Server is listening on port ${process.env.PORT}`);
});