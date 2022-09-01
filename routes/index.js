const express = require('express');
const router = express.Router();
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');
const { authUser, authRole, authRoleAdmin } = require('../permissions/basicAuth');
const projectRouter = require('../permissions/project');
const path = require('path');
const ROLE = { ADMIN: 'admin', BASIC: 'basic' }
const User = require('../models/User');
const Recipe = require('../models/Recipe');

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
      user: 'thatoldreceipe@gmail.com',
      pass: 'zjfbuivjugzlsnwd'
    }
  });
  
  var mailOptions = {
    from: 'thatoldreceipe@gmail.com',
    to: 'nfb@nicolebruno.com',
    subject: 'Sending Email using Node.js',
    text: 'That was easy!'
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
 

  module.exports = router;