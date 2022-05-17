const express = require('express');
const router = express.Router();
const methodOverride = require('method-override');
const fs = require('fs');
const path = require('path');
const Recipe  = require('../models/Recipe.js');
const User = require('../models/User.js');
router.use(methodOverride('_method'));
const upload = require('../multer.js');


const { setUser, ensureAuthenticated, forwardAuthenticated } = require('../config/auth');
const { authUser, authRole, authRoleAdmin } = require('../permissions/basicAuth');
const projectRouter = require('../permissions/project');
const ROLE = { ADMIN: 'admin', BASIC: 'basic' }
const User = require('../models/User');

// // WELCOME PAGE
// router.get('/', forwardAuthenticated, (req, res) => res.render('welcome'));



// GET RECENTLY ADDED RECIPES
router.get('/', ensureAuthenticated, async (req, res) => {
  let users
  try {
    users = await User.findOne({ name: req.user });
  } catch {
    recipes = []
  }
  res.render('profile/index', { user: req.user, users: users })
});

// GET NEW RECIPE FORM PAGE
router.get('/new', ensureAuthenticated, (req, res) => {
  res.render('recipes/new', { user: req.user });
});

// POST NEW RECIPE ROUTE
router.post('/', upload.single('cover'), async (req, res) => {
  const file = req.file;
  if(!file) {
    return console.log('Please select an Image.');
  }
  
  let url = file.path.replace('public', '');

  const recipe = new Recipe ({
      recipeName: req.body.recipeName,
      author: req.body.author,
      allergens: req.body.allergens,
      ingredients: req.body.ingredients,
      stepName: req.body.stepName,
      stepDescription: req.body.stepDescription,
      imageName: url
  });
  try {
      await Recipe.findOne({imageName : url})
        .then( img => {
          if(img) {
              console.log('Duplicate Image. Try again!');
              req.flash(
                'error_msg',
                'Duplicate Image. Try again!'
              );
              return res.redirect('/recipes/new');
          }
          recipe.save()
              .then(img => {
                  console.log('Image saved to DB.');
                  req.flash(
                    'success_msg',
                    'Recipe Saved!'
                  );
                  res.redirect(`/recipes/${recipe.id}`);
              })
        })
    .catch(err => {
        return console.log('ERROR: '+err);
    });
      
  } catch(err) {
      console.log(err)
      req.flash(
        'error_msg',
        'ERROR saving recipe' + err
      );
      return res.redirect('/recipes/error' + err)
  } 
});

// GET SHOW RECIPE PAGE BY RECIPE ID
router.get('/:id', ensureAuthenticated, async (req, res) => {
  try {
      const recipe = await Recipe.findById(req.params.id);
      const allergenString = JSON.stringify(recipe.allergens)
      res.render('recipes/show', { user: req.user, recipe: recipe })
    } catch(error) {
      console.log(error);
      res.render('recipes/error' + errorMessage);
    }
});

// DELETE RECIPE ROUTE
router.delete('/:id', async (req, res) => {
  let recipe;
  try {
    recipe = await Recipe.findById(req.params.id)
    fs.unlink('public' + recipe.imageName, function (err) {
      if (err) {throw err};
      // if no error, file has been deleted successfully
      console.log('File deleted!');
      });
    await Recipe.deleteOne({ _id: req.params.id });
    req.flash(
      'success_msg',
      'Recipe Deleted!'
    );
    res.redirect('/recipes');
  } catch (error) {
    if (recipe != null) {
      res.render('partials/error', {
        recipe: recipe,
        errorMessage: 'Could not remove recipe'
      })
    } else if (error) {
      console.log(error)
      res.redirect('/error', { errorMessage: error })
    }
  }
})

// Edit Book Route
router.get('/:id/edit', ensureAuthenticated, async (req, res) => {
  try {
    const user = req.user
    const recipe = await Recipe.findById(req.params.id);
    renderEditPage(res, user, recipe);
  } catch(error) {
    console.log(error);
    req.flash('error_msg', 'Error rendering Edit Page')
    res.redirect('/');
  }
})

router.put('/:id', upload.single('cover'), async (req, res) => {
  let recipe
  const file = req.file;
  try {
    recipe = await Recipe.findById(req.params.id)
    recipe.recipeName = req.body.recipeName
    recipe.author = req.body.author
    recipe.allergens = req.body.allergens
    recipe.ingredients = req.body.ingredients
    recipe.stepName = req.body.stepName
    recipe.stepDescription = req.body.stepDescription
    if (file) {
      try {
        fs.unlink('public' + recipe.imageName, function (err) {
          if (err) {throw err};
          // if no error, file has been deleted successfully
          console.log('old file deleted!');
          });
      } catch(error) {
        console.log("there was an error deleting old image")
      } finally {
        let url = file.path.replace('public', '');
        recipe.imageName = url
      }
    } else {
      console.log('there is no url to assign to imageName')
    }
      
    await recipe.save()
      console.log('Recipe saved to DB.');
      req.flash(
        'success_msg',
        'Recipe UPDATED!'
      );
      res.redirect(`/recipes/${recipe.id}`);
  } catch {
    if (recipe != null) {
      renderEditPage(res, recipe, true)
    } else {
      req.flash('error_msg', 'ERROR saving edits')
      redirect('/')
    }
  }
})

// GET ERROR PAGE
router.get('/error', ensureAuthenticated, (req, res) => {
  res.render('partials/error' + errorMessage, { user: req.user });
});

async function renderEditPage(res, user, recipe, hasError = false) {
  renderFormPage(res, user, recipe, 'edit', hasError)
}

async function renderFormPage(res, user, recipe, form, hasError = false) {
  try {
    const params = {
      user: user,
      recipe: recipe
    }
    if (hasError) {
      if (form === 'edit') {
        params.errorMessage = 'Error Updating Book'
      } else {
        params.errorMessage = 'Error Creating Book'
      }
    }
    res.render(`recipes/${form}`, params)
  } catch (error) {
    console.log(error);
    req.flash('error_msg', 'Error rendering form')
    res.redirect('/recipes')
  }
}

module.exports = router;