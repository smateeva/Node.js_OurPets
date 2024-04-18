const { db } = require('../index');
const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('index', { title: 'Начало' });
});

router.get('/logoutRoute', (req, res) => {
    res.render('logout', { title: 'Изход' });
});

router.get('/login', (req, res) => {
    res.render('login', { title: 'Вход' });
});

router.get('/register', (req, res) => {
    res.render('register', { title: 'Регистрация' });
});

router.get('/articles', (req, res) => {
    res.render('articles', { title: 'Интересни факти' });
});

router.get('/map', (req, res) => {
    res.render('map', { title: 'Любопитни места' });
});

router.get('/adverts/adverts', (req,res) => {
    res.render('adverts', { title: 'Намери любимец'});
});


module.exports = router;

