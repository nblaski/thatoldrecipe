const express = require('express');
const router = express.Router();
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');
const { authUser, authRole, authRoleAdmin } = require('../permissions/basicAuth');
const projectRouter = require('../permissions/project');
const path = require('path');
const ROLE = { ADMIN: 'admin', BASIC: 'basic' }
const User = require('../models/User');
const Recipe = require('../models/Recipe');

// Welcome Page
router.get('/', forwardAuthenticated, (req, res) => res.render('welcome'));

// Dashboard
router.get('/dashboard', ensureAuthenticated, async (req, res) => {
    // console.log(req.user)
    let recipes
    try {
      recipes = await Recipe.find().sort({ createdAt: 'desc' }).limit(10).exec()
    } catch {
      recipes = []
    }
    res.render('dashboard', { user: req.user, recipes: recipes })
    }
  );

  module.exports = router;