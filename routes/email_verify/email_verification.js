const expires = require('express');
const nodemailer = require('nodemailer');

const router = expires.Router();



// import { userInfo } from "os";

// create a random character token
let chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ',
    token = '';

    for (let i = 16; i > 0; --i) {
        token += chars[Math.round(Math.random() * (chars.length - 1))];
    }




// --------------------- SMTP mail server ---------------------------------- //
let smtpTransport = nodemailer.createTransport({
    service: "Gmail",
    auth: {
        user: 'digyspab123@gmail.com',
        pass: '@321digyspab'
    }
});

const mailOptions, host, link;
/* -------------------------- SMTP OVER ------------------------------------ */

// this is route is for signup
router.get('/send', (req, res, next) => {
    host = req.get('host');
    console.log('Host: ' + host);
    
    link = `http:// ${req.get('host')}/verify?id=${token}`;

    mailOptions = {
        to: req.query.to,
        subject: 'Please confirm your Email account',
        html: 'Hello, <br> Please Click on the link to verify your email. <br><a href='+ link + '> Click here to verify'
    }

    console.log(mailOptions);
    smtpTransport.sendMail(mailOptions, (err, res) => {
        if (err) {
            console.log(err);
            res.end('error');
        } else {
            console.log(`Message sent: ${res.mess}`)
        }
    });
    console.log(`Message sent: ${res.message}`);
    res.end('sent');
});

// verify router
router.get('/verify', (req, res, next) => {
    console.log(`${req.protocol}:/${req.get('host')}`);

    if((req.protocol + "://" + req.get('host')) == ("http://" + host)) {
        console.log('Domain is matched. Information is from Authentic email.');

        if (req.query.id == token) {
            console.log('email is verified');

            res.end(`<h1> Email ${mailOptions.to} is been successfully verified.`);
        } else {
            console.log('Email is not verified.');
        }
    } else {
        res.end('<h1> Request is from unknown souce.');
    }
});

















// create expiration date
/* let expires = new Date();
expires.setHours(expires.getHours() + 6);

 user.resetToken = {
     token: token,
     expires: expires
 }; */
