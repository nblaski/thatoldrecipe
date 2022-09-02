const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
// Load User model
const User = require('../models/User');
const { forwardAuthenticated } = require('../config/auth');


const jwt = require('jsonwebtoken');
const nodemailer = require("nodemailer");

// Login Page
router.get('/login', forwardAuthenticated, (req, res) => res.render('login'));

// Register Page
router.get('/register', forwardAuthenticated, (req, res) => res.render('register'));

// Register
router.post('/register', async (req, res) => {
  const { name, email, password, password2 } = req.body;
  let errors = [];

  if (!name || !email || !password || !password2) {
    errors.push({ msg: 'Please enter all fields' });
  }

  if (password != password2) {
    errors.push({ msg: 'Passwords do not match' });
  }

  if (password.length < 6) {
    errors.push({ msg: 'Password must be at least 6 characters' });
  }

  if (errors.length > 0) {
    res.render('register', {
      errors,
      name,
      email,
      password,
      password2
    });
  } else {
    User.findOne({ email: email }).then(user => {
      if (user) {
        errors.push({ msg: 'Email already exists' });
        res.render('register', {
          errors,
          name,
          email,
          password,
          password2
        });
      } else {
        const newUser = new User({
          name,
          email,
          password
        });

        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            console.log("confirmed " + newUser.confirmed)
            newUser
              .save()
              .then( async (user) => {

                // Encode the user id in a jwt token with an expiration date
                var date = new Date();
                var mail = {
                            "email": user.email,
                            "created": date.toString()
                            }
                var sender = process.env.SEND_EMAIL;
                var senderPassword = process.env.EMAIL_PASSWORD;
                console.log("SENDER INFO" + sender + senderPassword)

                const token_mail_verification = jwt.sign(mail, process.env.EMAIL_SECRET, { expiresIn: '1d' });

                var url = process.env.BASE_URL + "verify?email=" + token_mail_verification;

                // Send the token to the user email address using nodemailer library
                let transporter = nodemailer.createTransport({
                  // name: sender,
                  service: 'gmail',
                  debug: true,
                  auth: {
                      user: sender, // username for your mail server
                      pass: senderPassword, // password
                  },
          
              });
          
              // send mail with defined transport object
              let info = await transporter.sendMail({
                  from: sender, // sender address
                  to: user.email, // list of receivers seperated by comma
                  subject: "Account Verification", // Subject line
                  text: "Click on the link below to verify your account " + url, // plain text body
              }, (error, info) => {
          
                  if (error) {
                      console.log(error)
                      return;
                  }
                  console.log('Message sent successfully!');
                  console.log(info);
                  transporter.close();
              });

                req.flash(
                  'success_msg',
                  'An email was sent for email verification. Please verify then login in.'
                );
                res.redirect('/users/login');
              })
              .catch(err => console.log(err));
          });
        });
      }
    });
  }
});

// Login
router.post('/login', async (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/users/login',
    failureFlash: true
  })(req, res, next);
});

// Logout
router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success_msg', 'You are logged out');
  res.redirect('/users/login');
});



// Register
// router.post('/register', (req, res) => {
//   const { name, email, password, password2 } = req.body;
//   let errors = [];

//   if (!name || !email || !password || !password2) {
//     errors.push({ msg: 'Please enter all fields' });
//   }

//   if (password != password2) {
//     errors.push({ msg: 'Passwords do not match' });
//   }

//   if (password.length < 6) {
//     errors.push({ msg: 'Password must be at least 6 characters' });
//   }

//   if (errors.length > 0) {
//     res.render('register', {
//       errors,
//       name,
//       email,
//       password,
//       password2
//     });
//   } else {
//     User.findOne({ email: email }).then(user => {
//       if (user) {
//         errors.push({ msg: 'Email already exists' });
//         res.render('register', {
//           errors,
//           name,
//           email,
//           password,
//           password2
//         });
//       } else {
//         const newUser = new User({
//           name,
//           email,
//           password
//         });

//         bcrypt.genSalt(10, (err, salt) => {
//           bcrypt.hash(newUser.password, salt, (err, hash) => {
//             if (err) throw err;
//             newUser.password = hash;
//             newUser
//               .save()
//               .then(user => {
//                 req.flash(
//                   'success_msg',
//                   'You are now registered and can log in'
//                 );
//                 res.redirect('/users/login');
//               })
//               .catch(err => console.log(err));
//           });
//         });
//       }
//     });
//   }
// });

module.exports = router;
