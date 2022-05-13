require('dotenv').config();
const express = require('express');
// const expressLayouts = require('express-ejs-layouts');
const methodOverride = require('method-override');
const path = require('path');
const mongoose = require('mongoose');
const passport = require('passport');
const flash = require('connect-flash');
const session = require('express-session');
const bodyParser = require('body-parser');
var fs = require('fs');

const app = express();

// PASSPORT CONFIG
require('./config/passport')(passport);

// CONNECT TO MongoDB
mongoose.connect(process.env.DB_CONN_STRING2, {
    useNewUrlParser : true,
    useUnifiedTopology : true,
    family : 4},
    () => {console.log("mongoose connected.")}
  );

// EJS SETUP
app.set('view engine', 'ejs')
app.set('views', __dirname + '/views')
// app.use(expressLayouts)
// app.set('layout', 'layouts/layout')

// EXPRESS BODY PARSER
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: false }))
// app.use(bodyParser.urlencoded({ limit: '10mb', extended: false }))
app.use(bodyParser.json());
app.use(express.static('public'));
app.use('/static', express.static(path.join(__dirname, 'public')))

// METHOD OVERRIDE
app.use(methodOverride('_method'))


// EXPRESS SESSION
app.use(
    session({
      secret: process.env.SESSION_SECRET,
      resave: true,
      saveUninitialized: true
    })
);

// PASSPORT MIDDLEWARE
app.use(passport.initialize());
app.use(passport.session());

// CONNECT FLASH
app.use(flash());

// GLOBAL VARIABLES
app.use(function(req, res, next) {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
  });

app.use(function(req, res, next) {
    res.locals.user = req.session.user;
    next();
});

// ROUTES
// const recipeRouter = require('./routes/recipe.js')
app.use('/', require('./routes/index.js'));
app.use('/users', require('./routes/users.js'));
app.use('/recipes', require('./routes/recipe.js'));



app.listen(process.env.PORT , () => {
    console.log("connected on 3003")
})