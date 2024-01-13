// This function is used as middleware to check if a user is a guest or not.
// It takes in three parameters: req (the request object), res (the response object), and next (the next middleware function).
function guest(req, res, next) {
  // Check if the user is not authenticated (i.e., is a guest).
  if (!req.isAuthenticated()) {
    // If the user is a guest, call the next middleware function.
    return next()
  }
  // If the user is not a guest, redirect them to the home page.
  return res.redirect('/')
}

// Export the guest middleware function so that it can be used in other files.
module.exports = guest