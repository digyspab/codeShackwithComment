const express = require('express');
const mysql = require('mysql');
const router = express.Router();



router.get('/all_users', (req, res) => {
    let userid = req.params.id;

    console.log("userid",userid);
    // let searchuser = "SELECT name, email FROM users WHERE name LIKE '%" + req.query.key + "%' OR email LIKE '%" + req.query.key + "%' ";
    let searchuser = "SELECT name, email FROM users";
    console.log('search' + searchuser)

    db.query(searchuser, (err, results, fields) => {
        console.log(results);

       let str = '';
       for(let i = 0; i < fields; i++) {
            str = str + fields[i].name;
            res.end(str);
       };
    });
});

module.exports = router;