const fs = require('fs');
const express = require('express');
const mysql = require('mysql');

const router = express.Router()

// Registration GET Method
router.get('/register', (req, res) => {
    res.render('layouts/registration', {
        title: 'Register Page',
        user: req.users
    });
});

// Registration POST Method
router.post ('/register', (req, res) => {
    // push all errors
    const errors = [];

    if (!req.files) {
        errors.push({ msg: 'Please select profile image'})
        return res.status(400).render('layouts/registration', {
            title: '',
            user: req.users,
            errors
        });
    }

    let name = req.body.name.toLocaleLowerCase();
    let username = req.body.username.toLocaleLowerCase();
    let email = req.body.email.toLocaleLowerCase();
    let password = req.body.password;
    let confirmPass = req.body.confirmPass;
    let maritalstatus = req.body.maritalstatus;
    let hobbies = req.body.hobbies;
    let gender = req.body.gender;
    let dob = req.body.dob;
    let contactnumber = req.body.contactnumber;
    let house = req.body.house;
    let street = req.body.street.toLocaleLowerCase();
    let city = req.body.city.toLocaleLowerCase();
    let country = req.body.country.toLocaleLowerCase();
    let zip = req.body.zip;
    let textareawrite = req.body.textareawrite.toLocaleLowerCase();
    let uploadedFile = req.files.avtar;


    let image_name = uploadedFile.name;
    let fileExtension = uploadedFile.mimetype.split('/')[1];
    image_name = username + '.' + fileExtension;
    
    

    // validation checking
    const illegalChars = /^\w+$/; // allow letters, numbers, and underscores
    const emailValid = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
    const phoneNum = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;

    
    if (!name || !username || !email || !password || !maritalstatus || !hobbies || !gender || !dob || !contactnumber || !house || !street || !city || !country || !zip || !textareawrite) {
        errors.push({ msg: 'Please select all required fields'})
    }

    if (username.length < 5 || username.length > 15) {
        errors.push({ msg: 'username in between 5-15 characters'})
    }

    if (!illegalChars.test(username)) {
        errors.push({ msg: 'username must be alphanumeric'});
    }

    if(!emailValid.test(email)) {
        errors.push({ msg: 'Not a valid email'})
    }

    if (password != confirmPass) {
        errors.push({ msg: 'Password not match.'})
    }

    if (!hobbies) {
        errors.push({ msg: 'select hobbies'})
    }

    if (!phoneNum.test(contactnumber)) {
        errors.push({ msg: 'Valid contact number'});
    }

    // if(!hobbies)
    
    if (errors.length > 0) {
        res.render('layouts/registration', {
            title: '',
            user: req.users,
            errors
        });
    } else {
        const usernameQuery = "SELECT * FROM users WHERE username = '" + username + "'";
        db.query(usernameQuery, (err, results, fields) => {
            if (err) {
                return res.status(500).send(err);
            }

            if (results.length > 0) {
                errors({ msg: 'Username already exists'});
                res.render('layouts/registration', {
                    title: '',
                    errors
                });
            } else {
                // check the filetype before uploading it
                if(uploadedFile.mimetype === 'image/png' || uploadedFile.mimetype === 'image/jpeg' || uploadedFile.mimetype === 'image/gif') {
                    // upload the image in public folder
                    uploadedFile.mv(`public/assets/img/profile/${image_name}`, (err) => {
                        hobbiesEmpty = '';
                        if (err) {
                            return res.status(500).redirect('/users/register')
                        }

                        if (hobbies.length > 0) {
                            hobbies = hobbiesEmpty.concat(hobbies)
                        }

                        // save users details in database
                        const insertUser = "INSERT INTO `users`(name, username, email, password, maritalstatus, hobbies, gender, dob, contactnumber, house, street, city, country, zip, textareawrite, avtar) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
                        db.query(insertUser, [name, username, email,  password, maritalstatus, hobbies, gender, dob, contactnumber, house, street, city, country,  zip, textareawrite, image_name], (err, results, fields) => {
                            if (err) {
                                return res.status(500).send(err);
                            }

                            req.flash('success_msg', 'You can login')
                            res.redirect('/users/login');
                        });
                    });
                } else {
                    errors.push({ msg: `Invalid file format. only '.gif', '.png', '.jpeg'`})
                    res.render('layouts/registration', {
                        title: '',
                        user: req.users
                    });
                }
            }
        });
    }

});

router.get('/login', (req, res, next) => {
    res.render('layouts/login', {
        title: 'Login Page',
        user: req.users
    });
});

router.post('/login', (req, res, next) => {
    const username = req.body.username;
    const password = req.body.password;
    let sess = req.session;

    const selectUser = "SELECT * FROM users WHERE username = ? AND password = ?";

    if (username && password) {
        db.query(selectUser, [ username, password ], (err, results, fields) => {
            if (results.length > 0) {
                req.session.userId = results[0].id;
                req.session.user = results[0];
 
                res.redirect('/users/profile');
            } else {
                req.flash('error_msg', 'Incorrect username and password');
                res.redirect('/users/login');
            }
            res.end();
        });
        
    } else {

        req.flash('error_msg', 'Please enter username and password')
        res.redirect('/users/login');
    }
});

router.get('/profile', (req, res) => {
    let user = req.session.user,
    userId = req.session.userId;

    if(userId == null) {
        res.redirect('/users/login');
    }

    let query = "SELECT * FROM `users` WHERE `id` = '" +  userId +"'";
    db.query(query, (err, results, fields) => {
        res.render('pages/profile', {
            title: 'User Profile',
            user: results[0]
        });
    });
});

router.get('/logout', (req, res, next) => {
    req.session.destroy((err) => {
        if (err) throw err;
        else {
            res.redirect('/users/login');
        }
    });
});

module.exports = router;