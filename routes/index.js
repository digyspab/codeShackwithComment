const express = require('express');
const mysql = require('mysql');
const router = express.Router();

const authentication = require('../config/auth');


router.get('/index', authentication.is_login, (req, res, next) => {
    res.statusCode = 404;
    res.setHeader('Content-Type', 'text/html');
    res.write('<p>hello</p>')
    res.end();
    res.redirect('/users/profile');
    
});

router.get('/',  (req, res) => {


    res.render('layouts/welcome', {
        title: 'Welcome Page',
        user: req.users
    });
});

router.all('*', (req, res, next) => {
    res.render('middleware/error_page.ejs', {
        title: 'Page not found'
    });
});



module.exports = router;