const express = require('express');
const router = express.Router();
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');
const { authUser, authRole, authRoleAdmin } = require('../permissions/basicAuth');
const path = require('path');
const ROLE = { ADMIN: 'admin', BASIC: 'basic' }
const User = require('../models/User');
const Recipe = require('../models/Recipe');
const Code = require('../models/Code');


router.get('/code', ensureAuthenticated, (req, res) => {
    res.render('code');
});

// router.get('/code', await (req, res) => {
//     try {
//         const code = await Code.findOne({_id: "0" });
//         console.log("CODE: " + code)
//         // await comment.save()
//         req.flash(
//           'success_msg',
//           'code sent!'
//         );
//         res.redirect('/codeConfirmed')
//     } catch(err) {
//         console.log(err);
//     }
    
  
// });


module.exports = router;