const multer = require('multer');

const storage = multer.memoryStorage()

const fileFilter = (req, file, cb) => {
    // if (file.mimetype === 'image/jpeg')
    // file.mimetype.split('/') = ['image', 'jpeg']
    if (file.mimetype.split('/')[0] === 'image') {
      console.log("this is an image")
        cb(null, true);
    } else {
        // cb(null, false);
        // or pass in error
        console.log("NOT AN IMAGE")
        cb(new multer.MulterError("LIMIT_UNEXPECTED_FILE"), false)
    }
};

const upload = multer({
    storage, 
    // fileFilter, 
    // limits: { fileSize: 3000000, files: 1 }
});

  module.exports = multer({
      storage: storage,
    //   limits: { fileSize: 3000000, files: 1 },
    //   fileFilter
  })