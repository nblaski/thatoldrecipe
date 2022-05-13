const express = require('express');
const router = express.Router();
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');
const { authUser, authRole, authRoleAdmin } = require('../permissions/basicAuth');
const projectRouter = require('../permissions/project');
const path = require('path');
const ROLE = { ADMIN: 'admin', BASIC: 'basic' }
const User = require('../models/User');
const Recipe = require('../models/Recipe');
const imageMimeTypes = ['image/jpeg', 'image/png', 'images/gif']
const multer = require('multer');
const uploadPath = path.join('public', Recipe.coverImageBasePath)
const upload = multer({
  dest: uploadPath,
  fileFilter: (req, file, callback) => {
    callback(null, imagesMimeTypes.includes(file.mimetype));
  }
})

// Welcome Page
router.get('/', forwardAuthenticated, (req, res) => res.render('welcome'));

// Dashboard
router.get('/dashboard', ensureAuthenticated, (req, res) => {
  console.log(req.user)
    res.render('dashboard', {
      user: req.user
    })
  }
);

router.get('/new', ensureAuthenticated, (req,res) => {
  res.render('new');
})

router.get('/admin',ensureAuthenticated, authRoleAdmin(ROLE.ADMIN), (req, res) => {
  res.render('admin', {
    user: req.user
  })
})

router.post('/dashboard', upload.single('cover'), (req, res) => {
  const filename = req.file != null ? req.file.filename : null
  const newRecipe = new Recipe({
    recipeName: req.body.recipeName,
    allergens: req.body.allergens,
    stepName: req.body.stepName,
    author: req.body.author,
    coverImageName: filename
  });
  // saveCover(newRecipe, req.body.cover)
  try {
    newRecipe.save()
    res.redirect(`dashboard`)
  } catch (error) {
    if(error) throw(error);
    console.log("you go here" + error);
    renderNewPage(res, newRecipe, true)
  }
});


async function renderNewPage(res, recipe, hasError = false) {
  try{
    const recipe = await Recipe.find({})
    const params = {
      recipe: recipe
    }
    if (hasError) params.errorMessage = 'Error Creating Book'
    res.render('dashboard', params)
  } catch {
    res.redirect('/dashboard');
  }
}




function saveCover(newRecipe, coverEncoded) {
  if (coverEncoded == null) return
  const cover = JSON.parse(coverEncoded)
  if (cover != null && imageMimeTypes.includes(cover.type)) {
    book.coverImage = new Buffer.from(cover.data, 'base64')
    book.coverImageType = cover.type
  }
}

module.exports = router;
