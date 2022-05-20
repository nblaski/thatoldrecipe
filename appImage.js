if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config({ path: '.env' });
};

const express = require('express');
// const expressLayouts = require('express-ejs-layouts');
const methodOverride = require('method-override');
const path = require('path');
const mongoose = require('mongoose');
const passport = require('passport');
const flash = require('connect-flash');
// const session = require('express-session');
const bodyParser = require('body-parser');
var fs = require('fs');
const cookieSession = require('cookie-session');
const keys = require('./config/keys');

const app = express();
// const aws = require('aws-sdk');

// PASSPORT CONFIG
require('./config/passport')(passport);

// CONNECT TO MongoDB
mongoose.connect(process.env.DATABASE_URL, {
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
app.use(bodyParser.urlencoded({ limit: '10mb', extended: false }))
app.use(bodyParser.json());
app.use(express.static('public'));
app.use('/static', express.static(path.join(__dirname, 'public')))

// METHOD OVERRIDE
app.use(methodOverride('_method'))


// COOKIE-SESSION
app.use(cookieSession ({
  maxAge: 24 * 60 * 60 * 1000, //a day
  keys: [keys.session.cookieKey] //encrypts the id
}))

// EXPRESS SESSION
// app.use(
//     session({
//       secret: process.env.SESSION_SECRET,
//       resave: true,
//       saveUninitialized: true,
      
//     })
// );

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
app.use('/profile', require('./routes/profile.js'));

// const AWS_S3_BUCKET = process.env.AWS_S3_BUCKET

// app.get('/sign-s3', (req, res) => {
//   const s3 = new aws.S3();
//   const fileName = req.query['file-name'];
//   const fileType = req.query['file-type'];
//   const s3Params = {
//     Bucket: process.env.AWS_BUCKET_NAME,
//     Key: fileName,
//     Expires: 1000000,
//     ContentType: fileType,
//     ACL: 'public-read'
//   };

//   s3.getSignedUrl('putObject', s3Params, (err, data) => {
//     if(err){
//       console.log(err);
//       return res.end();
//     }
//     const returnData = {
//       signedRequest: data,
//       url: `https://${AWS_S3_BUCKET}.s3.amazonaws.com/${fileName}`
//     };
//     res.write(JSON.stringify(returnData));
//     res.end();
//   });
// });


// app listening on port
app.listen(process.env.PORT || 3003 , () => {
    console.log("connected on 3003")
})