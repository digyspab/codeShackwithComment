const express = require('express');
const mysql = require('mysql');

const router = express.Router();

router.get('/users/posts_comment', (req, res, next) => {

    let post_ID = req.params.id;

    // console.log('user ID: ', user_ID)
    // console.log('post Id: ', post_ID)

    let display_comments = "SELECT users.*, comments.* FROM users INNER JOIN comments on users.id = comments.user_id WHERE comments.post_id = '" + user_ID + "' "
    db.query(display_comments, (err, results) => {

        console.log('comment')
        console.log(results)

        res.render('layouts/all_users_profile_post', {
            user: results 
        });
    });   
    
});


module.exports = router;