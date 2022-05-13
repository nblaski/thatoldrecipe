function authUser(req, res, next) {
  if (req.user == null) {
    res.status(403)
    return res.send('You need to sign in')
  }

  next()
}

function authRole(role) {
  return (req, res, next) => {
    if (req.user.role !== role) {
      res.status(401)
      return res.send('Not allowed')
    }

    next()
  }
}

function authRoleAdmin(role) {
  return (req, res, next) => {
    if (req.user.role !== role) {
      req.flash('error_msg', 'Unauthorized to view this page. Please log in as admin');
      res.redirect('/users/login');
    }
    next()
  }
}

module.exports = {
  authUser,
  authRole,
  authRoleAdmin
}