// This is a refactored function called 'auth' that handles authentication.

// It takes three parameters: 'req', which represents the request object, 'res', which represents the response object, and 'next', which is a callback function that will be called when authentication is successful.

function auth(req, res, next) {
  // Check if the user is authenticated by calling the 'isAuthenticated()' method on the 'req' object.
  if (req.isAuthenticated()) {
    // If the user is authenticated, call the 'next()' function to move on to the next middleware or route handler.
    return next();
  }
  // If the user is not authenticated, redirect them to the '/login' page using the 'res.redirect()' method.
  return res.redirect('/login');
}

// Export the 'auth' function so it can be used in other parts of the code.
module.exports = auth;