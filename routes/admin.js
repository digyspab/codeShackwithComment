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

// Login POST Route
router.post('/dashboard', (req, res) => {
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


router.get('/dashboard/search', function(req,res){
    // let searchQuery = 'SELECT name from users where name like "%'+req.query.key+'%"';
    let searchQuery = 'SELECT name, username, email, avtar FROM users WHERE name LIKE "%' + req.query.key + '%" OR username LIKE "%' + req.query.key + '%" OR username LIKE "%' + req.query.key + '%" OR avtar LIKE "%' + req.query.key + '%" ';                                  
    db.query(searchQuery, function(err, rows, fields) {

        if (err) throw err;
        var data=[];
        for(i=0;i<rows.length;i++) {
            data.push(`${rows[i].name} ,${rows[i].email}, ${rows[i].avtar}`);
          }
          res.end(JSON.stringify(data));
        });
    });

module.exports = router;