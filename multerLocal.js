const path = require('path');
const multer = require('multer');

let storage = multer.diskStorage({
    destination: './public/uploads/recipeCovers',
    filename: (req, file, cb) => {
          let ext = ''; // set default extension (if any)
          if (file.originalname.split(".").length>1) // checking if there is an extension or not.
              ext = file.originalname.substring(file.originalname.lastIndexOf('.'), file.originalname.length);
          cb(null, Date.now() + ext)
            // cb(null, file.originalname)
    }
  });
  
//   let upload = multer({
//     storage : storage,
//     fileFilter : (req, file, cb) => {
//         checkFileType(file, cb);
//     }
//   });
  
  function checkFileType(file, cb) {
    const fileTypes = /jpeg|jpg|png|gif/;
    const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
  
    if(extname) {
        return cb(null, true);
    } else {
        cb('Error: Please images only.');
    }
  }

//   module.exports = {storage}, {upload}, checkFileType

  module.exports = multer({
    storage: storage,
    limits: {
      fileSize: 1024 * 1024 * 15, // 15mb max size,
    },
    fileFilter : (req, file, cb) => {
        checkFileType(file, cb);
    }
  });