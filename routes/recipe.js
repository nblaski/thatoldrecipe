const express = require('express');
const router = express.Router();
const methodOverride = require('method-override');
router.use(methodOverride('_method'));
const fs = require('fs');
const path = require('path');
const Recipe  = require('../models/Recipe.js');
const User = require('../models/User');
const multer = require('multer');
const upload = require("../multerLocal.js");
const sharp = require('sharp');

const { setUser, ensureAuthenticated, forwardAuthenticated } = require('../config/auth');
const { authUser, authRole, authRoleAdmin } = require('../permissions/basicAuth');
const ROLE = { ADMIN: 'admin', BASIC: 'basic' }

// GET RECENTLY ADDED RECIPES
router.get('/', ensureAuthenticated, async (req, res) => {
  let recipes
  try {
    recipes = await Recipe.find().sort({ createdAt: 'desc' }).exec()
    // recipes = await Recipe.find().sort({ createdAt: 'desc' }).limit(10).exec()
  } catch {
    recipes = []
  }
  res.render('recipes/index', { user: req.user, recipes: recipes })
});


// GET newFORM RECIPE FORM PAGE
router.get('/newForm', ensureAuthenticated, (req, res) => {
  res.render('recipes/newForm', { user: req.user });
});


// POST ROUTE NEW RECIPE
router.post('/newForm', upload.single('cover'), async (req, res) => {
  let recipeImage;
  try {   
      try {
        if(req.fileValidationError) {
          req.flash(
            'error_msg',
            'ERROR: Wrong file type'
          );
          res.redirect(`/recipes/newForm`);
        } else if(req.file == undefined ) {
          recipeImage = req.user.profileImgURL
          // recipeImage = req.user.userProfileImg
  
          // req.flash(
          //     'error_msg',
          //     'ERROR: no file selected.'
          // );
          // res.redirect(`/recipes/newForm`);
        } else if (req.file) {
          const { filename: newCoverImage } = req.file;
          await sharp(req.file.path)
          .resize({ height: 1200, fit: 'contain' })
          .jpeg({ quality: 92 })
          .toFile(
              path.resolve(req.file.destination,'coverImages', newCoverImage)
          )
          fs.unlinkSync(req.file.path)
          console.log('file uploaded!')
          recipeImage = '/images/coverImages/' + req.file.filename
        }
      } catch(err) {
        console.log(err);
        req.flash(
            'error_msg',
            'ERROR: ERROR SETTING recipeImage'
        );
        res.redirect(`/recipes/newForm`);
      }


        const recipe = new Recipe ({
            recipeName: req.body.recipeName,
            author: req.body.author,
            category: req.body.category,
            allergens: req.body.allergens,
            ingredients: req.body.ingredients,
            amount: req.body.amount,
            stepName: req.body.stepName,
            stepNameTitle: req.body.stepNameTitle,
            imageName: recipeImage
          });
        await recipe.save()
        console.log('New recipe saved.');
        req.flash(
          'success_msg',
          'Recipe Saved!'
        );
        res.redirect(`/recipes/${recipe.id}`);
      
  } catch(err) {
    console.log("there was an error" + err);
    req.flash('error_msg', 'ERROR saving new recipe')
    res.redirect(`/`);
  }
});


// GET ROUTE SHOW RECIPE PAGE BY RECIPE ID
router.get('/:id', ensureAuthenticated, async (req, res) => {
  try {
      const recipe = await Recipe.findById(req.params.id);
      const allergenString = JSON.stringify(recipe.allergens)
      const categoryString = JSON.stringify(recipe.category)
      res.render('recipes/show', { user: req.user, recipe: recipe })
    } catch(err) {
      console.log(err);
      req.flash('error_msg', 'ERROR rendering show recipe by ID page')
      res.redirect('/');
    }
});

// DELETE ROUTE RECIPE
router.delete('/:id', async (req, res) => {
  const recipe = await Recipe.findById(req.params.id);
  const imagePath = './public'+ recipe.imageName;
  try {
    fs.unlink(imagePath, (err) => {
        if (err) {
          console.error(err);
          req.flash(
            'error_msg',
            'FS Error Deleting Image'
          );
        }
        console.log('old image deleted')
    });

    await Recipe.deleteOne({ _id: req.params.id });
    req.flash(
      'success_msg',
      'Recipe Deleted!'
    );
    res.redirect('/recipes');
  } catch (err) {
      console.log(err)
      req.flash(
        'error_msg',
        'Error deleting recipe'
      );
      res.redirect('/recipes');
  }
})

// GET ROUTE EDIT RECIPE
router.get('/:id/edit', ensureAuthenticated, async (req, res) => {
  try {
    const user = req.user
    const recipe = await Recipe.findById(req.params.id);
    res.render('recipes/edit', { user: req.user, recipe: recipe })
  } catch(err) {
    console.log(err);
    req.flash('error_msg', 'Error rendering Edit Page')
    res.redirect('/');
  }
}) 

// POST ROUTE UPDATE RECIPE
router.put('/:id', upload.single('cover'), async (req, res) => {
  recipe = await Recipe.findById(req.params.id);
  const oldFile = './public'+recipe.imageName;
  const file = req.file;
  try {

    if (req.file) {
      try {
        if(req.fileValidationError) {
            req.flash(
                'error_msg',
                'ERROR: Wrong file type'
            );
            res.redirect(`/recipes/${recipe.id}/edit`);
        } else if(req.file == undefined ) {
            req.flash(
                'error_msg',
                'ERROR: no file selected.'
            );
            return res.redirect(`/recipes/${recipe.id}/edit`);
        } else {
            const { filename: myImage } = req.file;
            await sharp(req.file.path)
            .resize({ height: 1200, fit: 'contain' })
            .jpeg({ quality: 92 })
            .toFile(
                path.resolve(req.file.destination,'coverImages',myImage)
            )
            fs.unlinkSync(req.file.path)
            console.log('file uploaded!')

            fs.unlink(oldFile, (err) => {
                if (err) {
                  console.error(err);
                  req.flash(
                    'error_msg',
                    'FS Error Deleting Image'
                  );
                }
                console.log('old image deleted')
            });
            const newFile = '/images/coverImages/' + req.file.filename
            recipe.imageName = newFile
          } 
      } catch(err) {
        req.flash(
          'error_msg',
          'ERROR uploading and deleting image'
        );
        return res.redirect(`/recipes/${recipe.id}/edit`);
      }       
    } else {
      const existingFile = recipe.imageName
      recipe.imageName = existingFile;
    }      
    recipe.recipeName = req.body.recipeName
    recipe.author = req.body.author
    recipe.category = req.body.category
    recipe.allergens = req.body.allergens
    recipe.ingredients = req.body.ingredients
    recipe.stepName = req.body.stepName
    // recipe.stepNameTitle = req.body.stepNameTitle
    recipe.amount = req.body.amount
    await recipe.save()
      console.log('Recipe updated to DB.');
      req.flash(
        'success_msg',
        'Recipe UPDATED!'
      );
      res.redirect(`/recipes/${recipe.id}`);
  } catch(err) {
    console.log(err);
    if (recipe != null) {
      console.log(err);
      req.flash('error_msg', 'ERROR saving edits')
      res.redirect(`/recipes/${recipe.id}`)
    } else {
      console.log(err);
      req.flash('error_msg', 'ERROR saving edits')
      res.redirect(`/recipes/${recipe.id}`)
    }
  }
})




router.post('/:id/do-post', async (req, res) => {
  let recipeCommentsArray = [];
  try {
    comment = await Recipe.findById(req.params.id);
    username = req.body.username;
    userComment = req.body.comments
    date = req.body.date;
    userProfileImg = req.body.userProfileImg
    recipeCommentsArray.push(username, userComment, date, userProfileImg );
    comment.comments.push(recipeCommentsArray);
console.log(recipeCommentsArray)
      await comment.save()
        console.log('Comment saved to DB.');
        req.flash(
          'success_msg',
          'Comment SAVED!'
        );
        res.redirect(`/recipes/${comment.id}`);
  } catch(err) {
    if (comment!= null) {
      console.log(err);
      req.flash('error_msg', 'ERROR saving comment not equal null ');
      res.redirect(`/recipes/${comment.id}`);
    } else {
      console.log(err);
      req.flash('error_msg', 'ERROR saving comment')
      res.redirect(`/recipes/${comment.id}`);
    }
  }
})



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










module.exports = router;