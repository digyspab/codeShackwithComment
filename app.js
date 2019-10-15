const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const flash = require('connect-flash');
const fileUpload = require('express-fileupload');
const logger = require('morgan');
const bcrypt = require('bcrypt');


const app = express();

const keys = require('./config/keys');
const db = require('./config/db');

// Database connection
db.connect((err) => {
    if(err) throw err;
    else console.log('Connected to database..');
});
global.db = db;


// Configure middleware
app.use(express.static('./public'));

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.use(session({
	secret: 'secret',
	resave: true,
    saveUninitialized: true,
    // cookie: { maxAge: 60000}
}));

app.use(logger('dev'));
app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());
app.use(fileUpload());

// Connect flash
app.use(flash());

// Global Vairables
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    next();
});


// Routes
app.use('/users', require('./routes/users'));
app.use('/admin', require('./routes/admin'));
app.use('/profile', require('./routes/setting/profile_setting'));
app.use('/search', require('./routes/setting/search'));
// app.use('/comment', require('./routes/setting/post_comment'));
app.use('/email', require('./routes/email_verify/email_verification'));
app.use('/', require('./routes/index'));





app.listen(keys.PORT, (err) => {
    console.log(`Server is running on PORT: ${keys.PORT}`);
});

