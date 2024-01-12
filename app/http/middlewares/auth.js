// Refactored function to handle authentication
function auth(req, res, next) {
  // Check if user is authenticated
  if (req.isAuthenticated()) {
    // If user is authenticated, call the next middleware or route handler
    return next();
  }
  // If user is authenticated, redirect to the login page
  return res.redirect('/login');
}

module.exports = auth