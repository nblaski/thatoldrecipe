module.exports = {
  ensureAuthenticated: function(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    req.flash('error_msg', 'Please log in to view that resource');
    res.redirect('/users/login');
  },
  forwardAuthenticated: function(req, res, next) {
    if (!req.isAuthenticated()) {
      return next();
    }
    res.redirect('/dashboard');      
  },
  setUser: function(req, res, next) {
    user = req.session.user;
    next();
  },
  ensureAuthenticatedCode: function(req, res, next) {
    if (req.isAuthenticated() && req.user.name == "Nicole Laski") {
      return next();
    }
    req.flash('error_msg', 'Need to be ADMIN to view that resource');
    res.redirect('/dashboard');
  },
};
