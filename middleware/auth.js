// Check if user is authenticated
exports.isAuthenticated = (req, res, next) => {
  if (req.session.user) {
    return next()
  }
  res.redirect("/login")
}

// Check if user is NOT authenticated (for login/signup pages)
exports.isNotAuthenticated = (req, res, next) => {
  if (!req.session.user) {
    return next()
  }
  res.redirect("/main")
}
