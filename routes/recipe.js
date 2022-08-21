const express = require('express');
const router = express.Router();
const methodOverride = require('method-override');
const fs = require('fs');
const path = require('path');
const Recipe  = require('../models/Recipe.js');
router.use(methodOverride('_method'));
const upload = require('../multer.js');
const upload_resize = require('../multerResize.js')
const multer = require('multer');
const { s3Delete, s3UploadCover, s3UploadResize } = require('../s3Service');

const { setUser, ensureAuthenticated, forwardAuthenticated } = require('../config/auth');
const { authUser, authRole, authRoleAdmin } = require('../permissions/basicAuth');
const projectRouter = require('../permissions/project');
const ROLE = { ADMIN: 'admin', BASIC: 'basic' }
const User = require('../models/User');



// GET RECENTLY ADDED RECIPES
router.get('/', ensureAuthenticated, async (req, res) => {
  let recipes
  try {
    recipes = await Recipe.find().sort({ createdAt: 'desc' }).limit(10).exec()
  } catch {
    recipes = []
  }
  res.render('recipes/index', { user: req.user, recipes: recipes })
});

// GET NEW RECIPE FORM PAGE
router.get('/test', ensureAuthenticated, (req, res) => {
  res.render('recipes/test', { user: req.user });
});

// GET newFORM RECIPE FORM PAGE
router.get('/newForm', ensureAuthenticated, (req, res) => {
  res.render('recipes/newForm', { user: req.user });
});


// POST ROUTE NEW RECIPE
router.post('/newForm', upload.single('cover'), async (req, res) => { 
  console.log(req.file.paramKey + "in new form route");
  const file = req.file;
  if(!file) {
    return console.log('Please select an Image.');
  }
  let url;
  try {
    if (file) {
      try {
        const result = await s3UploadResize(file, req.user.name);
        url = `https://thisoldrecipe-images.s3.amazonaws.com/${result.paramKey}`;
      } catch(err) {
        console.log("error setting cover image" + err);
      } finally {
        const recipe = new Recipe ({
          recipeName: req.body.recipeName,
          author: req.body.author,
          allergens: req.body.allergens,
          ingredients: req.body.ingredients,
          amount: req.body.amount,
          stepName: req.body.stepName,
          stepNameTitle: req.body.stepNameTitle,
          imageName: url
        });
          await recipe.save();
          console.log('Image saved to DB.');
          console.log(recipe.id)
          req.flash(
            'success_msg',
            'Recipe Saved!'
          );
          res.redirect(`/recipes/${recipe.id}`);
      }
    }
  } catch(err) {
    console.log("ERROR" + err)
    req.flash(
      'error_msg',
      'ERROR saving recipe' + err
    );
    return res.redirect('/recipes/error' + err)
  }
});


// GET ROUTE SHOW RECIPE PAGE BY RECIPE ID
router.get('/:id', ensureAuthenticated, async (req, res) => {
  try {
      const recipe = await Recipe.findById(req.params.id);
      const allergenString = JSON.stringify(recipe.allergens)
      res.render('recipes/show', { user: req.user, recipe: recipe })
    } catch(error) {
      console.log(error);
      res.render('recipes/error' + error);
    }
});

// DELETE ROUTE RECIPE
router.delete('/:id', async (req, res) => {
  let recipe;
  try {
    recipe = await Recipe.findById(req.params.id);
    const deleteImg = await s3Delete(recipe.imageName.slice(46));
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

// GET ROUTE EDIT RECIPE
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

// POST ROUTE UPDATE RECIPE
router.put('/:id', upload.single('cover'), async (req, res) => {
  let recipe
  const file = req.file;
  let oldFile;
  try {
    recipe = await Recipe.findById(req.params.id);
    oldFile = recipe.imageName.slice(46);
    recipe.recipeName = req.body.recipeName
    recipe.author = req.body.author
    recipe.allergens = req.body.allergens
    recipe.ingredients = req.body.ingredients
    recipe.stepName = req.body.stepName
    recipe.stepNameTitle = req.body.stepNameTitle
    recipe.amount = req.body.amount

    if (file) {
      try {
        const result = await s3UploadCover(file, req.user.name);
        recipe.imageName = `https://thisoldrecipe-images.s3.amazonaws.com/${result.paramKey}`;
      } catch(error) {
        console.log("there was an error uploading new image" + error);
        req.flash(
          'error_msg',
          'Error uploading new image'
        );
        res.redirect(`/profile/${req.user.id}`);
      } finally {
        console.log(recipe.imageName)
        console.log(oldFile);
        const deleteImg = await s3Delete(oldFile);
      } 
  }       
    await recipe.save()
      console.log('Recipe updated to DB.');
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

//set multer upload errors
router.use((error, req, res, next) => {
  const user = req.user;
  if (error instanceof multer.MulterError) {
      if (error.code === "LIMIT_FILE_SIZE") {
        console.log("LIMIT_FILE_SIZE");
        req.flash('error_msg', 'File is too large.')
        res.redirect('back');
        // return res.status(400).json({
        //       message: "file is too large",
        //   });
      }

      if (error.code === "LIMIT_FILE_COUNT") {
        console.log("LIMIT_FILE_COUNT");
        req.flash('error_msg', 'File limit reached.')
        res.redirect('back');
        // return res.status(400).json({
          //     message: "file limit reached",
          // });
      }

      if (error.code === "LIMIT_UNEXPECTED_FILE") {
        console.log("LIMIT_UNEXPECTED_FILE");
        req.flash('error_msg', 'File must be an image.')
        res.redirect('back');
      }
  }
})




// TESTING //////////////////////////////////////////////////////////////////////////////////


// GET RESIZE FORM TEST PAGE
router.get('/resize', ensureAuthenticated, (req, res) => {
  res.render('recipes/resize', { user: req.user });
});

// router.post('/upload_resize', upload_resize.single('inputFile'), (req, res) => {
//   console.log(req.file); // Print upload details
//   res.send('Successfully uploaded!');
// });





router.post('/upload_resize', upload_resize.single('inputFile'), async (req, res) => {
  console.log(req.file); // Print upload details

  const file = req.files[0];
  if(!file) {
    return console.log('Please select an Image.');
  }
  let url;
  try {
    if (file) {
      try {
        const result = await s3UploadResize(file, req.user.name);
        url = `https://thisoldrecipe-images.s3.amazonaws.com/${result.paramKey}`;
      } catch(err) {
        console.log("error setting cover image" + err);
      } finally {
        const recipe = new Recipe ({
          recipeName: req.body.recipeName,
          author: req.body.author,
          allergens: req.body.allergens,
          ingredients: req.body.ingredients,
          amount: req.body.amount,
          stepName: req.body.stepName,
          stepNameTitle: req.body.stepNameTitle,
          imageName: url
        });
          await recipe.save();
          console.log('Image saved to DB.');
          console.log(recipe.id)
          req.flash(
            'success_msg',
            'Recipe Saved! and SUCCESSFULLY UPLOADED!!!'
          );
          res.redirect('/recipes/test');
      }
    }
  } catch(err) {
    console.log("ERROR" + err)
    req.flash(
      'error_msg',
      'ERROR saving recipe' + err
    );
    return res.redirect('/recipes/error' + err)
  }
});






















module.exports = router;