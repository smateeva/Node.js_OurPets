const express = require('express');
const router = express.Router();
const { loginUser, registerUser } = require('../lib/auth');

router.get('/register', (req, res) => {
    res.render('register');
});

router.post('/register', async (req, res) => {
    const { name, username, email, password, pet } = req.body;  
    try {
        const userId = await registerUser({ name, username, email, password, pet });
        req.session.userId = userId;
        res.redirect('/');  
    } catch (error) {
        console.error(error);
        res.status(500).send(error.message);
    }
});

router.get('/login', (req, res) => {
    res.render('login');
});


router.post('/login', async (req, res) => {
    const { identifier, password } = req.body;
    try {
        const user = await loginUser(identifier, password);
        if (!user) {
            res.status(401).send('Invalid credentials');
            return;
        }
        req.session.user = user; 

        if (user.isAdmin) {
            res.redirect('/admin');
        } else {
            res.render('index', { user: req.session.user });
        }
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).send('Login failed: ' + error.message);
    }
});

router.use((req, res, next) => {
    if (req.session.userId) { 
        res.locals.user = {
            id: req.session.userId,
            isAdmin: req.session.isAdmin,
        };
    }
    next();
});




module.exports = router;
