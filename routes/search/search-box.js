

// module.exports = function(search) {
//     search: ('/search', function (req, res) {
//         connection.query('SELECT first_name from TABLE_NAME where first_name like "%' + req.query.key + '%"',
//             function (err, rows, fields) {
//                 if (err) throw err;
//                 var data = [];
//                 for (i = 0; i < rows.length; i++) {
//                     data.push(rows[i].first_name);
//                 }
//                 res.end(JSON.stringify(data));
//             });
//     });
// }