const express = require('express');
const router = express.Router();
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');
const { authUser, authRole, authRoleAdmin } = require('../permissions/basicAuth');
const projectRouter = require('../permissions/project');
const path = require('path');
const ROLE = { ADMIN: 'admin', BASIC: 'basic' }
const User = require('../models/User');
const Recipe = require('../models/Recipe');

const jwt = require('jsonwebtoken');

// Welcome Page
router.get('/', forwardAuthenticated, (req, res) => res.render('welcome'));

// Dashboard
router.get('/dashboard', ensureAuthenticated, async (req, res) => {
    // console.log(req.user)
    let recipes
    try {
      // recipes = await Recipe.find().sort({ createdAt: 'desc' }).limit(10).exec()
      recipes = await Recipe.find().sort({ createdAt: 'desc' }).exec()

    } catch {
      recipes = []
    }
    res.render('dashboard', { user: req.user, recipes: recipes })
    }
  );


  const nodemailer = require('nodemailer');
  var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.SEND_EMAIL,
      pass: process.env.EMAIL_PASSWORD
    }
  });
  
  var mailOptions = {
    from: process.env.SEND_EMAIL,
    to: process.env.SEND_EMAIL,
    subject: 'Sending Email using Node.js',
    text: 'That was easy! new'
  };
  
  
  router.post('/sendEmail', async (req, res) => {
    console.log(mailOptions)
    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
          console.log(error);
      } else {
          console.log('Email sent: ' + info.response);
      }
      });
      res.redirect('/');
  })
 
  
 router.get('/verify', function(req, res) {
    token = req.query.email;
    if (token) {
        try {
            jwt.verify(token, process.env.EMAIL_SECRET, (e, decoded) => {
                if (e) {
                    console.log(e)
                    return res.sendStatus(403)
                } else {
                    email = decoded.email;
                    User.findOne({ email: email }).then(user => {
                      if (user) {
                        user.confirmed = true
                        user
                          .save()
                          .then(user => {
                              req.flash(
                                'success_msg',
                                'You verified your email and can now log in'
                              );
                              res.redirect('/users/login');
                            })
                            .catch(err => console.log(err));
                      }
                     })
                }
              });
              } catch (err) {
                  console.log(err)
                  return res.sendStatus(403)
              }
            } else {
                return res.sendStatus(403)

            }

})



  module.exports = router;