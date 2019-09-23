const express = require('express');
const mysql = require('mysql');
const fs = require('fs');
const router = express.Router();


const authentication = require('../../config/auth');

// GET profile setting "password, delte account"
router.get('/profile_settings', (req, res, next) => {

    let user = req.session.user;
    let userID = req.session.userId;

    if (userID == null) {
        res.redirect('/users/login');
    }

    let query = "SELECT * FROM `users` WHERE `id` = '" + userID + "'";

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

// POST methdo of profile
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

            } else if (!currentpassword || !retypepassword || !confirmPass) {
                req.flash('error_msg', 'Fill required fields');
                res.redirect('/profile/profile_settings');

            } else {
                req.flash('error_msg', 'Incorrect current password.');
                res.redirect('/profile/profile_settings');
            }
        });

    }

});

// POST method of change profile image
router.post('/avtar/:id', (req, res, next) => {
    let errors = [];

    if (!req.files) {
        req.flash('error_msg', 'select image first')
        res.redirect('/users/profile');
    }

    let user = req.session.user;
    let userId = req.session.userId;
    let uploadedFile = req.files.avtar;
    let image_name = uploadedFile.name;
    let fileExtension = uploadedFile.mimetype.split('/')[1];

    let date = new Date();
    let getTime = date.getTime();

    let query = "SELECT username, avtar FROM `users` WHERE id = '" + userId + "'";

    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).send(err);
        }

        if (uploadedFile.mimetype === 'image/png' || uploadedFile.mimetype === 'image/jpeg' || uploadedFile.mimetype === 'image/gif') {

            image_name = results[0].username + '_' + getTime + '.' + fileExtension;
            
            uploadedFile.mv(`public/assets/img/profile/${image_name}`, (err) => {
                if (err) {
                    return res.status(500).redirect('/users/profile');
                }

                let image = results[0].avtar;
                let username = results[0].username;

                


                let updateImage = "UPDATE users SET avtar = ? WHERE id = ?";
                db.query(mysql.format(updateImage), [image_name, userId], (err, results, fields) => {
                    if (err) {
                        return res.status(500).send(err);
                    } else {
                        req.flash('success_msg', 'profile image updated');
                        res.redirect('/users/profile');
                    }
                });
            });
        } else {
            req.flash('error_msg', `Invalid file format. only '.gif', '.png', '.jpeg'`)
            res.redirect('/users/profile');
        }


    })
});


// GET method user delete account
router.post('/delete/:id', (req, res, next) => {
    let user = req.session.user;
    let userId = req.session.userId;


    let query = "SELECT password FROM `users` WHERE id = '" + userId + "' ";

    db.query(query, (err, results, fields) => {

        console.log('users select: ' + JSON.stringify(results[0]))

        if (err) {
            return res.status(500).send(err);
        }

        if (req.body.currentpassword === results[0].password) {

            let getImage = "SELECT `avtar` FROM `users` WHERE id = '" + userId + "'"
            let deleteAccount = "DELETE FROM `users` WHERE id = '" + userId + "'";
        
            db.query(getImage, (err, results, fields) => {
                if (err) {
                    return res.status(500).send(err)
                }
        
                let image = results[0].avtar;

                fs.unlink(`public/assets/img/profile/${image}`, (err) => {
                    
                    if (err) {
                        return res.status(500).send(err);
                    }

                    db.query(deleteAccount, (err, results, fields) => {
                        if (err) {
                            return res.status(500).send(err)
                        }

                        req.flash('success_msg', 'account deleted.')
                        res.redirect('/users/login')
                    });
                });
            });

        } else {
            req.flash('error_msg', 'password not matched');
            res.redirect('/profile/profile_settings');
        }
    });

    

   
});


module.exports = router;