const express = require('express');
const router = express.Router();
const User = require('../models/User.js');
const path = require('path');
const fs = require('fs');
const sharp = require('sharp');
const multer = require('multer');
const upload = require("../multerLocal.js");
const upload2 = upload.single('icon');
const multerError = require("./_multerErrors");
router.use(multerError);


const { setUser, ensureAuthenticated, forwardAuthenticated } = require('../config/auth');
const { authUser, authRole, authRoleAdmin } = require('../permissions/basicAuth');
const ROLE = { ADMIN: 'admin', BASIC: 'basic' }




// GET ROUTE SHOW USER PROFILE
router.get('/:id', ensureAuthenticated, async (req, res) => {
    const username = await User.findById(req.params.id);
    // const username = await User.findOne({ name: user});
    res.render('profile/index', { user: req.user, username: username });
});

// GET ROUTE UPDATE USER PROFILE
router.get('/:id/update', ensureAuthenticated, async (req, res) => {
  console.log("HELLO from update route");
  const user = req.user;
  const username = await User.findById(req.params.id);
  res.render('profile/update', { user: req.user, username: username });
});

  
router.post('/:id/test', upload.single('icon'), (req, res) => {
   res.send(req.file)
}, (error, req, res, next) => {
    res.status(400).send({ error: error.message })
})

// POST ROUTE UPDATE USER PROFILE
router.post("/:id/update", upload.single('icon'), async (req, res) => {
  console.log("HELLO from the update post route")
  const user = await User.findById(req.params.id);
  console.log("user: " + user)
  const pathOld = './public'+ user.profileImgURL;
  console.log("pathOld: " + pathOld)

  try {    
      if(req.fileValidationError) {
        req.flash(
          'error_msg',
          'ERROR: Wrong file type'
        );
        res.redirect(`/profile/${user.id}`);
      } else if(req.file) {
        console.log("file in try catch: " + req.file)
        const { filename: newProfileIcon } = req.file;
        console.log("path is sharp: " + req.file.path)
        
        await sharp(req.file.path)
        .resize({ height: 1200, fit: 'contain' })
        .jpeg({ quality: 92 })
        .toFile(
            path.resolve(req.file.destination,'profileIcon', newProfileIcon)
        )
        fs.unlinkSync(req.file.path)
        console.log('file uploaded!')


        console.log("old image path  " + pathOld)
        fs.unlink(pathOld, (err) => {
            if (err) {
              console.error(err);
              req.flash(
                'error_msg',
                'FS Error Deleting Image'
              );
            }
            console.log('old image deleted')
        });
      }
      // user = await User.findById(req.params.id)
      console.log(("userId: " + user.id))
      const newFile = '/images/profileIcon/' + req.file.filename
      user.profileImgURL = newFile
      user.name = req.body.name;


      await user.save()
      console.log('Profile updated to DB.');
      req.flash(
        'success_msg',
        'Profile UPDATED!'
      );
      res.redirect(`/profile/${user.id}`);
  } catch(err) {
    console.log("there was an error" + err);
    req.flash('error_msg', 'ERROR saving edits')
    res.redirect(`/profile/${user.id}`);
  }
      
});


//set multer upload errors
router.use((error, req, res, next) => {
  const user = req.user;
  if (error instanceof multer.MulterError) {
      if (error.code === "LIMIT_FILE_SIZE") {
        console.log("LIMIT_FILE_SIZE");
        req.flash('error_msg', 'File is too large.')
        res.redirect(`/profile/${user.id}/update`);
          // return res.status(400).json({
          //     message: "file is too large",
          // });
      }

      if (error.code === "LIMIT_FILE_COUNT") {
        console.log("LIMIT_FILE_COUNT");
        req.flash('error_msg', 'File limit reached.')
        res.redirect(`/profile/${user.id}/update`);
          // return res.status(400).json({
          //     message: "file limit reached",
          // });
      }

      if (error.code === "LIMIT_UNEXPECTED_FILE") {
        console.log("LIMIT_UNEXPECTED_FILE");
        req.flash('error_msg', 'File must be an image.')
        res.redirect(`/profile/${user.id}/update`);
          // return res.status(400).json({
          //     message: "file must be an image",
          // });
      }
  }
});

module.exports = router;
