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

  // POST COMMENT
// router.post("/do-post",  async (req, res) => {
//   console.log(req.body.comments)
//   console.log()

//   let comment;
//   try {
//     comment = await Recipe.findById(req.params.id);
//     console.log(comment)
//     comment.comments = req.body.comments;
//     // await comment.save()
//     // console.log('Comment has been saved to DB');
//     // req.flash(
//     //   'success_msg',
//     //   'Comment Saved!'
//     // );
//      res.send("posted success!")
//   } catch(err) {
//     console.log("error comment "+ err)
//     // if (comment != null) {
//     //   renderEditPage(res, comment, true)
//     // } else {
//       req.flash('error_msg', 'ERROR saving comment')
//       // redirect(`/recipes/${comment.id}`)
//     // }
//   }
  
//   // test.collections("recipes").insertOne(req.body, function (error, document) {
//   //   res.send("posted success!")
//   // })
//   // res.send(req.body);
// });


  module.exports = router;