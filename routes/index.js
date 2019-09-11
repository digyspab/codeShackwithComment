const express = require('express');
const router = express.Router();

const authentication = require('../config/auth');



// require('./users');

router.get('/', authentication.is_login, (req, res) => {
    
    
    res.render('layouts/welcome', {
        title: 'Welcome Page',
        user: req.users
    });
});


module.exports = router;