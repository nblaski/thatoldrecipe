

module.exports = function (error, req, res, next) {
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
  }