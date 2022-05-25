const express = require('express');
const router = express.Router();
const User = require('../models/User.js');
const multer = require('multer');
// router.use('/profile', require('../multer.js'));


const { setUser, ensureAuthenticated, forwardAuthenticated } = require('../config/auth');
const { authUser, authRole, authRoleAdmin } = require('../permissions/basicAuth');
const ROLE = { ADMIN: 'admin', BASIC: 'basic' }

const upload = require("../multer.js");
const multerError = require("./_multerErrors");
router.use(multerError);

const { s3UploadProfileIcon, s3Delete } = require('../s3Service');

// GET ROUTE SHOW USER PROFILE
router.get('/:id', ensureAuthenticated, async (req, res) => {
    const username = await User.findById(req.params.id);
    // const username = await User.findOne({ name: user});
    res.render('profile/index', { user: req.user, username: username });
});

// GET ROUTE UPDATE USER PROFILE
router.get('/:id/update', ensureAuthenticated, async (req, res) => {
  const user = req.user;
  const username = await User.findById(req.params.id);
  res.render('profile/update', { user: req.user, username: username });
});

// POST ROUTE UPDATE USER PROFILE
router.post("/:id/update", upload.array('file'), async (req, res) => {
  const file = req.files[0];
  let user;
  try {
    user = await User.findById(req.params.id)
    const oldFile = user.profileImgURL.slice(46);
    console.log(oldFile);
    user.name = req.body.name;
      if (file) {
        try {
          const result = await s3UploadProfileIcon(file, req.user.name);
          user.profileImgURL = `https://thisoldrecipe-images.s3.amazonaws.com/${result.paramKey}`;
        } catch(error) {
          console.log("there was an error uploading image" + error);
          req.flash(
            'error_msg',
            'Error uploading image'
          );
          res.redirect(`/profile/${user.id}`);
        } finally {
          const deleteImg = await s3Delete(oldFile);
          console.log("oldFile deleted!")
        } 
    } 
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