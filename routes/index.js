const express = require('express');
const router = express.Router();
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');
const { authUser, authRole, authRoleAdmin } = require('../permissions/basicAuth');
const projectRouter = require('../permissions/project');
const path = require('path');
const ROLE = { ADMIN: 'admin', BASIC: 'basic' }
const User = require('../models/User');
const Recipe = require('../models/Recipe');
const Code = require('../models/Code');
var randomString = require('randomstring');


const jwt = require('jsonwebtoken');


// const multer  = require('multer')
const multer = require('../multerLocal.js');
const upload = multer.single('myImage');
const fs = require('fs');
const sharp = require('sharp');

// Welcome Page
router.get('/', forwardAuthenticated, (req, res) => res.render('welcome'));

router.get('/successCode', ensureAuthenticated, async (req, res) => {
  res.render('code');
});

router.post('/users/successCode', ensureAuthenticated, async (req, res) => {
  try {
      const user = await User.findOne({name: 'Nicole Laski'});
      const string = randomString.generate(7);
      const emailCode = req.body.emailCode;
      console.log("STRING: " + string + " userCode: " + user.code + " email: " + req.body.emailCode)
      user.code = string
      await user.save()

      const date = new Date();
      const mail = {
                  "email": emailCode,
                  "created": date.toString()
                  }
      const sender = process.env.SEND_EMAIL;

      const senderPassword = process.env.EMAIL_PASSWORD;

      let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: sender, // username for your mail server
            pass: senderPassword, // password
        },

      });
    // send mail with defined transport object
    let info = await transporter.sendMail({
        from: sender, // sender address
        to: emailCode, // list of receivers seperated by comma
        subject: "thatOldRecipe.com Register CODE", // Subject line
        html: `use this code when registering: <b>${string}</b>`, // plain text body
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
        'An email was sent for register code.'
      );
      res.redirect('/dashboard');
  } catch(err) {
      console.log(err);
  }
});

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




// NODE MAILER ROUTE AND PARAMS
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

// POST NODEMAILER ROUTE
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
 
// GET VERIFY EMAIL ROUTE
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

});



  module.exports = router;