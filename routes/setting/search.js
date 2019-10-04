const express = require('express');
const mysql = require('mysql');
const router = express.Router();



router.post('/all_users', (req, res) => {
    let userid = req.params.id;
    console.log("userid",userid, req.body);

    let searchuser = "SELECT id, email, username, avtar FROM users WHERE name OR username LIKE '%" + req.body.searchTerm + "%'  ";
    // let searchuser = "SELECT id, email, username, avtar  FROM users ";

    console.log('search: ' , searchuser);
    
    db.query(searchuser, (err, results, fields) => {

      if (err) {
          return res.status(500).send(err);
      } else {
          res.send(JSON.stringify(results));
      }
    });
});

router.get('/all_users_profile/:id', (req, res) => {
    
    let user_ID = req.params.id;

    let query = "SELECT posts_content.* FROM `users` INNER JOIN `posts_content` ON users.id = posts_content.user_ID WHERE users.id = '" + user_ID + "' "
    let username = "SELECT * FROM `users` WHERE users.id = '" + user_ID + "' ";

    db.query(username, (err, resultsName) => {

        db.query(query, (err, results) => {
            res.render('layouts/all_users_profile_post', {
                title: 'All users Profile',
                user: results,
                userName: resultsName[0]
            });
        });
    });
});


module.exports = router;