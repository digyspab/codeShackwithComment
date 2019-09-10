const express = require('express');
const router = express.Router();


// require('./users');

router.get('/', (req, res) => {
    
    
    res.render('layouts/welcome', {
        title: 'Welcome Page',
        user: req.users
    });
});


module.exports = router;