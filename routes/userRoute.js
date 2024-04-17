const express = require('express');
const router = express.Router();
const db = require('../db/database'); 

function isAuthenticated(req, res, next) {
  if (!req.session.user) {
    return res.redirect('/login');
  }
  next();
}


router.get('/editProfile', isAuthenticated, (req, res) => {
  const userId = req.session.user.id;


  db.get('SELECT * FROM users WHERE id = ?', [userId], (err, user) => {
    if (err) {
      return res.status(500).send('Database error');
    }
    res.render('editProfile', { user: user });
  });
});


router.post('/editProfile', isAuthenticated, (req, res) => {
  const { name, username, email, currentPassword, newPassword } = req.body;
  const userId = req.session.user.id;



  db.run('UPDATE users SET name = ?, username = ?, email = ? WHERE id = ?', [name, username, email, userId], err => {
    if (err) {
      return res.status(500).send('Failed to update profile');
    }
    res.redirect('/editProfile');
  });
});

module.exports = router;
