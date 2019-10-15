const express = require('express');
const mysql = require('mysql');

const router = express.Router();

router.get('/users/posts_comment/:id', (req, res, next) => {

    let post_ID = req.params.id;

    // console.log('user ID: ', user_ID)
    // console.log('post Id: ', post_ID)

    let display_comments = "SELECT users.*, comments.* FROM users INNER JOIN comments on users.id = comments.comment_id WHERE comment_id = '" + user_ID + "' "
    db.query(display_comments, (err, results) => {

        console.log('comment')
        console.log(results)

        res.redirect('layouts/all_users_profile_post')
    });   
    
});


module.exports = router;