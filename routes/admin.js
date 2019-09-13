const express = require('express');
const fs = require('fs');
const mysql = require('mysql');

const router = express.Router();

const isAdmin = require('../config/auth');

// Login GET Route
router.get('/login', (req, res) => {
    res.render('controllers/admin_login', {
        title: 'Admin Login',
        user: req.admin
    });
});


// Login POST Route
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

                res.render('controllers/admin_dash', {
                    title: 'Admin Dashboard',
                    user: results
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

// Admin Dashboard GET route
router.get('/dashboard', (req, res, next) => {
    let user = req.session.user,
    userId = req.session.userId;

    if(userId == null) {
        res.redirect('/admin/login');
    }

    let query = "SELECT * FROM `users` ORDER BY id ASC";
    db.query(query, (err, results, fields) => {
        res.render('controllers/dashboard', {
            title: 'User Info',
            user: results
        });
    });
});


// Admin delete user
router.get('/delete/:id', (req, res, next) => {
    let userID = req.params.id;

    let getImageQuery = "SELECT avtar FROM `users` WHERE id = '" + userID + "'";
    let deleteUser = "DELETE FROM `users` WHERE id = '" + req.params.id + "'";

    db.query(getImageQuery, (err, results, fields) => {
        if (err) {
            return res.status(500).send(err);
        }
        
        let image = results[0].avtar;
        console.log('Delete user: ' + image);

        fs.unlink(`public/assets/img/profile/${image}`, (err) => {
            if (err) {
                return res.status(500).send(err);
            }

            db.query(deleteUser, (err, results, fields) => {
                if (err) {
                    return res.status(500).send(err)
                }

                res.redirect('/admin/dashboard');
            });
        });
    });    
});


// Blocked users
router.post('/blocked', (req, res, next) => {
    let x = req.body.hiddenx;
    let y = req.body.hiddeny;

    let query = mysql.format("UPDATE users SET status = ? WHERE id = ?", [y, x]);

    db.query(query, (err, results, fields) => {

        if (err) {
            return res.status(500).send(err)
        } else {
            res.redirect('/admin/dashboard');
        }
    });
});

// Admin Logout GET route
router.get('logout', (req, res, next) => {
    req.session.destroy((err) => {
        if (err) throw err;
        else {
            req.flash('success_msg', 'user deleted')
            res.redirect('/admin/login');
        }
    });
});

module.exports = router;