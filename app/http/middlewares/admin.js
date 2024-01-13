// This function acts as a middleware to check if the user is an authenticated admin
function admin(req, res, next) {
  // Check if the user is authenticated and has the role of 'Admin'
  if (req.isAuthenticated() && req.user.role === 'Admin') {
    // If the user is an authenticated admin, pass the control to the next middleware or route handler
    return next();
  }
  // If the user is not an authenticated admin, redirect them to the home page
  return res.redirect('/');
}

// Export the admin middleware function so that it can be used in other parts of the code
module.exports = admin;