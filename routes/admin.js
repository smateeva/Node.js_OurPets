const express = require('express');
const db = require('../db/database');
const router = express.Router();

function adminAuthMiddleware(req, res, next) {
    if (req.session.user && req.session.user.isAdmin) {
        next();
    } else {
        res.redirect('/auth/login');
    }
}

router.get('/', adminAuthMiddleware, (req, res) => {
    res.render('admin');
});

router.get('/articles', adminAuthMiddleware, (req, res) => {
    db.all('SELECT * FROM articles', (err, articles) => {
        if (err) {
            console.error('Failed to retrieve articles:', err);
            return res.status(500).send('Failed to retrieve articles');
        }
        res.render('adminArticles', {
            articles: articles,
            userIsAdmin: req.session.isAdmin
        });
    });
});

router.post('/article/new', adminAuthMiddleware, (req, res) => {
    const { title, content, picture } = req.body;


    const pictureUrl = picture || 'path/to/default/image.jpg'; 

    db.run('INSERT INTO articles (title, content, picture) VALUES (?, ?, ?)', [title, content, pictureUrl], (err) => {
        if (err) {
            console.error('Failed to create new article:', err);
            return res.status(500).send('Failed to create new article due to database error: ' + err.message);
        }
        res.redirect('/admin/articles');
    });
});




router.get('/article/edit/:id', adminAuthMiddleware, (req, res) => {
    const { id } = req.params;
    db.get('SELECT * FROM articles WHERE id = ?', id, (err, article) => {
        if (err) {
            console.error('Error fetching article:', err);
            return res.status(500).send('Error fetching article for edit');
        } else if (!article) {
            return res.status(404).send('Article not found');
        }
        res.render('editArticle', { article: article });
    });
});


router.post('/article/update/:id', adminAuthMiddleware, (req, res) => {
    const { title, content, picture } = req.body;
    const { id } = req.params;

    const pictureUrl = picture || 'path/to/default/image.jpg';

    db.run('UPDATE articles SET title = ?, content = ?, picture = ? WHERE id = ?', [title, content, pictureUrl, id], (err) => {
        if (err) {
            console.error('Failed to update article:', err);
            return res.status(500).send('Failed to update article due to database error: ' + err.message);
        }
        res.redirect('/admin/articles');
    });
});


router.post('/article/delete/:id', adminAuthMiddleware, (req, res) => {
    const { id } = req.params;
    db.run('DELETE FROM articles WHERE id = ?', id, (err) => {
        if (err) {
            console.error('Error deleting article:', err);
            return res.status(500).send('Failed to delete article');
        }
        res.redirect('/admin/articles');
    });
});

router.get('/logout', adminAuthMiddleware, (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Failed to destroy the session during logout:', err);
            return res.status(500).send('Failed to logout');
        }
        res.redirect('/auth/login');  // Redirect to the login page after successfully logging out
    });
});

module.exports = router;
