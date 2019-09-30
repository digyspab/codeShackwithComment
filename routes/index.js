const express = require('express');
const mysql = require('mysql');
const router = express.Router();

const authentication = require('../config/auth');


router.get('/', authentication.is_login, (req, res) => {


    res.render('layouts/welcome', {
        title: 'Welcome Page',
        user: req.users
    });
});

// GET method for all posts
router.get('/users_all_posts', (req, res, next) => {
    let user = req.session.user,
        userId = req.session.userId;


    let userName;

    let usersPost = "SELECT DISTINCT users.username, users.avtar, posts_content.user_ID FROM `users` INNER JOIN `posts_content` on users.id = posts_content.user_ID ";
    let get_all_post = "SELECT users.username, users.avtar, posts_content.* FROM `users` INNER JOIN `posts_content` on users.id = posts_content.user_ID ORDER BY date DESC";

    db.query(usersPost, (err, results, fields) => { // filter name
        userName = results;
        console.log("name: " + JSON.stringify(userName, null, 4));
    });

    db.query(get_all_post, (err, results, fields) => { // filter name
        console.log("post: " + JSON.stringify(results, null, 4));
        if (err) {
            return res.status(500).send(err)
        } else {
            res.render('pages/users_posts', {
                title: 'All posts',
                user: results,
                userName
            });
        }
    });

/*     let usernameQuery = "SELECT users.username, users.avtar, posts_content.user_ID FROM `users` INNER JOIN `posts_content` on users.id = posts_content.user_ID";
    db.query(usernameQuery, (err, results) => {
        if (err) {
            return res.status(500).send(err)
        } else {
            res.render('pages/users_posts', {
                title: 'All posts',
                user: results,
                userName
            });
        }
    }); */
});

/* router.all('*', (req, res, next) => {
    res.render('middleware/error_page.ejs', {
        title: 'Page not found'
    });
});
 */


module.exports = router;