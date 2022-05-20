const express = require('express');
const router = express.Router();
const Recipe  = require('../models/Recipe.js');
const User = require('../models/User.js');
const multer = require('multer');
// const aws = require('aws-sdk');
// aws.config.update({ region: process.env.AWS_REGION });

const { setUser, ensureAuthenticated, forwardAuthenticated } = require('../config/auth');
const { authUser, authRole, authRoleAdmin } = require('../permissions/basicAuth');
const ROLE = { ADMIN: 'admin', BASIC: 'basic' }

const { s3Uploadv2, s3Delete } = require('../s3Service');
// const randomID = parseInt(Math.random() * 10000000)
const uuid = require('uuid').v4;



const storage = multer.memoryStorage()

const fileFilter = (req, file, cb) => {
    // if (file.mimetype === 'image/jpeg')
    // file.mimetype.split('/') = ['image', 'jpeg']
    if (file.mimetype.split('/')[0] === 'image') {
        cb(null, true);
    } else {
        // cb(null, false);
        // or pass in error
        cb(new multer.MulterError("LIMIT_UNEXPECTED_FILE"), false)
    }
};

const upload = multer({
    storage, 
    fileFilter, 
    limits: { fileSize: 100000000, files: 1 }
});


// GET ROUTES
router.get('/:id', ensureAuthenticated, async (req, res) => {
    const user = req.user.name;
    const username = await User.findOne({ name: user});
    res.render('profile/index', { user: req.user, username: username });
});

router.get('/:id/update', ensureAuthenticated, async (req, res) => {
  const user = req.user;
  const username = await User.findById(req.params.id);
  res.render('profile/update', { user: req.user, username: username });
});


// // POST ROUTES UPDATE
// router.post("/:id/update", upload.array('file'), async (req, res) => {
//   const file = req.files[0];
//   const result = await s3Uploadv2(file);
//   console.log(result);
//   const user = req.user;
//   // res.json({ status: "success", result });
//   req.flash(
//     'success_msg',
//     'Profile Saved!'
//   );
//   res.redirect(`/profile/${user.name}`);
// });


router.post("/:id/update", upload.array('file'), async (req, res) => {
  const file = req.files[0];
  let user;
  try {
    user = await User.findById(req.params.id)
    const oldImageName = user.profileImgURL;
    user.name = req.body.name;
    // if (file && user.profileImgURL !== "https://thisoldrecipe-images.s3.amazonaws.com/uploads/default.png" ) {
      if (file) {
        try {
          const result = await s3Uploadv2(file);
          user.profileImgURL = `https://thisoldrecipe-images.s3.amazonaws.com/${result.paramKey}`;
          // const s3Delete = await s3Delete(oldImageName);
          // console.log("oldfile delete!")
        } catch(error) {
          console.log("there was an error uploading image" + error);
          req.flash(
            'error_msg',
            'Error uploading image'
          );
          res.redirect(`/profile/${user.id}`);
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
      res.redirect('/');
  }

})







// set multer upload errors
router.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
      if (error.code === "LIMIT_FILE_SIZE") {
          return res.status(400).json({
              message: "file is too large",
          });
      }

      if (error.code === "LIMIT_FILE_COUNT") {
          return res.status(400).json({
              message: "file limit reached",
          });
      }

      if (error.code === "LIMIT_UNEXPECTED_FILE") {
          return res.status(400).json({
              message: "file must be an image",
          });
      }
  }
})

module.exports = router;


// const AWS_BUCKET_NAME = process.env.AWS_BUCKET_NAME;

// router.get('/sign-s3', (req, res) => {
//   const s3 = new aws.S3();
//   const fileName = req.query['file-name'];
//   const fileType = req.query['file-type'];
//   const s3Params = {
//     Bucket: AWS_BUCKET_NAME,
//     Key: fileName,
//     Expires: 10000,
//     ContentType: fileType,
//     ACL: 'public-read'
//   };

//   s3.getSignedUrl('putObject', s3Params, (err, data) => {
//     if(err){
//       console.log(err);
//       return res.end();
//     }
//     const returnData = {
//       signedRequest: data,
//       url: `https://${AWS_BUCKET_NAME}.s3.amazonaws.com/${fileName}`
//     };
//     console.log("getSignedURL"+ data + "DATA"+ returnData)
//     res.write(JSON.stringify(returnData));
//     res.end();
//   });
// });