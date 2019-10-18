const express = require('express');
const mysql = require('mysql');
const router = express.Router();



router.post('/all_users', (req, res) => {

    let user = req.session.user;
    let userId = req.session.userId;
    let user_ID = req.params.id;

    if(userId === null) {
        res.redirect('/users/login')
    }

    let searchuser = "SELECT id, email, username, avtar FROM users WHERE name OR username LIKE '%" + req.body.searchTerm + "%'  LIMIT 5";
    // let searchuser = "SELECT id, email, username, avtar  FROM users ";
    
    db.query(searchuser, (err, results, fields) => {

      if (err) {
          return res.status(500).send(err);
      } else {
          res.send(JSON.stringify(results));
      }
    });
});

// GET Method of specific user search
router.get('/all_users_profile/:id', (req, res) => {
    
    let user = req.session.user;
    let userId = req.session.userId;
    let user_ID = req.params.id;

    if(userId === null) {
        res.redirect('/users/login')
    }
    
    let query = "SELECT posts_content.* FROM `users` INNER JOIN `posts_content` ON users.id = posts_content.user_ID WHERE users.id = '" + user_ID + "' ";
    let username = "SELECT * FROM `users` WHERE users.id = '" + user_ID + "' ";

    db.query(username, (err, resultsName) => {


        db.query(query, (err, results) => {
            console.log('from all_users_profile: ');
            console.log(results);

            res.render('layouts/all_users_profile_post', {
                title: 'All users Profile',
                user: results,
                userName: resultsName[0]
            });
        });

        // let display_comments = "SELECT users.*, comments.* FROM users INNER JOIN comments on users.id = comments.comment_id WHERE comment_id = '" + user_ID + "' "
       
    });
});


module.exports = router;