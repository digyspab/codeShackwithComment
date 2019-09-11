const express = require('express');
const router = express.Router();

const isAdmin = require('../config/auth');

router.get('/login', (req, res) => {
    res.render('controllers/admin_login', {
        title: 'Admin Login',
        user: req.admin
    });
});


router.post('/login', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    let sess = req.session;

    const query = "SELECT * FROM admin WHERE username = ? AND password = ?";

    if (username && password) {
        db.query(query, [username, password], (err, results, fields) => {
            if (results.length > 0) {
                req.session.userId = results[0].id;
                req.session.user = results[0];

                res.render('controllers/dashboard', {
                    title: '',
                    user: req.admin
                });
            } else {
                req.flash( 'error_msg', 'You are not Admin' );
                res.redirect('/admin/login');
            }
            res.end();
        });
    } else {
        req.flash('error_msg', 'Please fill required field');
        res.redirect('/admin/login');
    }
    
});

router.get('/dashboard', (req, res, next) => {
    let user = req.session.user,
    userId = req.session.userId;
    console.log('dashboard: ' + user);

    if(userId == null) {
        res.redirect('/admin/login');
    }

    let query = "SELECT * FROM `admin` WHERE `id` = '" +  id +"'";
    db.query(query, (err, results, fields) => {
        res.render('controllers/dashboard', {
            title: '',
            user: req.users
        });
    });
});

router.get('logout', (req, res, next) => {
    res.session.destroy((err) => {
        if (err) throw err;
        else {
            res.redirect('/admin/login');
        }
    });
});

module.exports = router;