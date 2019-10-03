const express = require('express');
const mysql = require('mysql');
const router = express.Router();



router.get('/all_users', (req, res) => {
    let userid = req.params.id;
    // console.log("userid",userid);

    // let searchuser = "SELECT name, email FROM users WHERE name LIKE '%" + req.query.key + "%' OR email LIKE '%" + req.query.key + "%' ";
    let searchuser = "SELECT id, email, username, avtar  FROM users";
    // console.log('search' + searchuser)
    
    db.query(searchuser, (err, results, fields) => {

      if (err) {
          return res.status(500).send(err);
      } else {
          res.end(JSON.stringify(results));
      }
    });
});

module.exports = router;