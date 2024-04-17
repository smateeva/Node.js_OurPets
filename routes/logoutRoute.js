const express = require('express');
const router = express.Router();


router.get('/logout', (req, res) => {

    req.session.destroy((err) => {
        if (err) {

            console.log('Session destruction error:', err);
            return res.status(500).send('Failed to log out');
        }
        res.clearCookie('connect.sid'); 

        res.redirect('/login');
    });
});

module.exports = router;
