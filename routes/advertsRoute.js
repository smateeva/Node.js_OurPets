const express = require('express');
const router = express.Router();
const db = require('../db/database'); 


function isAuthenticated(req, res, next) {
    if (!req.session.user) {
        return res.redirect('/login');
    }
    next();
}


router.get('/newAdvert', isAuthenticated, (req, res) => {
    res.render('newAdvert', { title: 'Create New Advert' });
});


router.post('/', isAuthenticated, (req, res) => {
    const { title, description, image, created } = req.body;
    const pictureUrl = image || 'path/to/default/image.jpg';
    const userId = req.session.user.id;
    const sql = 'INSERT INTO adverts (title, description, image, userId, created) VALUES (?, ?, ?, ?, ?)';
    db.run(sql, [title, description,  image, userId, created], function(err) {
        if (err) {
            console.error('Failed to create new advert:', err);
            res.status(500).send('Failed to create new advert: ' + err.message);
        } else {
            console.log(`A new advert has been created with ID ${this.lastID}`);
            res.redirect('/adverts');
        }
    });
});


router.get('/', isAuthenticated, (req, res) => {
    const userId = req.session.user.id;
    console.log(`Fetching adverts for user ID: ${userId}`);
    const sql = 'SELECT * FROM adverts WHERE userId = ?';
    db.all(sql, [userId], (err, adverts) => {
        if (err) {
            console.error('Failed to retrieve adverts:', err);
            res.status(500).send('Failed to retrieve adverts: ' + err.message);
        } else {
            if (adverts.length === 0) {
                console.log('No adverts found for this user.');
                res.render('adverts', { adverts: [], message: 'No adverts found.' });
            } else {
                res.render('adverts', { adverts: adverts, user: req.session.user });
            }
        }
    });
});


router.get('/edit/:id', isAuthenticated, (req, res) => {
    const sql = 'SELECT * FROM adverts WHERE id = ? AND userId = ?';
    db.get(sql, [req.params.id, req.session.user.id], (err, advert) => {
        if (err) {
            console.error('Error fetching advert:', err);
            return res.status(500).send('Error fetching advert for edit');
        }
        if (!advert) {
            return res.status(404).send('Advert not found');
        }
        res.render('editAdvert', { advert: advert });
    });
});


router.post('/update/:id', isAuthenticated, (req, res) => {
    const { title, description, image } = req.body;
    const sql = 'UPDATE adverts SET title = ?, description = ?, image = ? WHERE id = ? AND userId = ?';
    db.run(sql, [title, description, image, req.params.id, req.session.user.id], (err) => {
        if (err) {
            console.error('Failed to update advert:', err);
            return res.status(500).send('Failed to update advert');
        }
        res.redirect('/adverts');
    });
});


router.post('/delete/:id', isAuthenticated, (req, res) => {
    const sql = 'DELETE FROM adverts WHERE id = ? AND userId = ?';
    db.run(sql, [req.params.id, req.session.user.id], (err) => {
        if (err) {
            console.error('Error deleting advert:', err);
            return res.status(500).send('Failed to delete advert');
        }
        res.redirect('adverts');
    });
});

module.exports = router;
