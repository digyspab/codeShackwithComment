const express = require('express');
const mysql = require('mysql');
const router = express.Router();


const authentication = require('../../config/auth');

router.get('/profile_settings', (req, res, next) => {

    let user = req.session.user;
    let  userID = req.session.userId;

    if (userID == null) {
        res.redirect('/users/login');
    }

    let query = "SELECT * FROM `users` WHERE `id` = '" +  userID +"'";

    db.query(query, (err, results, fields) => {
        if (err) {
            res.status(500).send(err);
        }
        else {
            res.render('pages/profile_setting', {
                title: 'Register Page',
                user: results[0],
                user_id: userID,
            });
        }
    });
    
});

router.post('/profile_settings', (req, res, next) => {

    let user = req.session.user;
    let userId = req.session.userId;

    let currentpassword = req.body.currentpassword;
    let retypepassword = req.body.password;
    let confirmPass = req.body.confirmPass;

    if (retypepassword != confirmPass) {
        req.flash('error_msg', 'Confirm password are not match ');
        res.redirect('/profile/profile_settings');
        
    } else {

    let query = "SELECT * FROM `users` WHERE id = '" + userId + "' ";
    db.query(query, (err, results, fields) => {

        
        if (currentpassword == results[0].password) {
            
            let updatePass = "UPDATE `users` SET password = ? WHERE id = ?";

            db.query(mysql.format(updatePass), [retypepassword, userId], (err, results, fields) => {

                if (err) {
                    res.status(500).send(err);

                } else {
                    req.flash('success_msg', 'Password changed');
                    res.redirect('/profile/profile_settings');
                }
            });

        } else if (!currentpassword || ! retypepassword || !confirmPass) {
            req.flash('error_msg', 'Fill required fields');
            res.redirect('/profile/profile_settings');

        }  else {
            req.flash('error_msg', 'Incorrect current password.');
            res.redirect('/profile/profile_settings');
        }
    });
        
    }

});

router.post('/profile/avtar/:id', (req, res, next) => {

    let user = req.session.user;
    let userId = req.session.userId;

    let username = req.user.username;

    let date = new Date();
    let getTime = date.getTime();

    
    console.log(`username: ${username}, getTime: ${getTime}:= ${username}.${getTime}`)


});



module.exports = router;