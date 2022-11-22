const path = require('path');
const multer = require('multer');

let storage = multer.diskStorage({
    destination: './public/images/',
    filename: function(req, file, cb){
      cb(null,file.fieldname + '-'+ req.user.name + "-" + Date.now() + path.extname(file.originalname));
    }
  });
  

module.exports = multer({
    storage: storage,
    // limits: {
    //   fileSize: 1024 * 1024 * 15, // 15mb max size,
    // },
    fileFilter : (req, file, cb) => {
        const fileTypes = /jpeg|jpg|png|gif/;
        const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
        if (!extname) {
            req.fileValidationError = 'goes wrong on the mimetype';
            return cb(null, false, new Error('goes wrong on the mimetype'));
           }
           cb(null, true);
    }
  });