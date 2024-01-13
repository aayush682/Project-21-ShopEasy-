// Import required modules
const LocalStrategy = require('passport-local').Strategy; // Import LocalStrategy from passport-local module
const User = require('../models/user'); // Import User model from user.js file
const bcrypt = require('bcrypt'); // Import bcrypt module

// Initialize passport with custom LocalStrategy
function init(passport) {
  passport.use(new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
    // Login
    // Check if email exists
    const user = await User.findOne({ email: email }); // Find user with matching email in the database
    if (!user) {
      return done(null, false, { message: 'No user with this email' }); // Return error message if user does not exist
    }

    // Compare passwords
    bcrypt.compare(password, user.password).then(match => {
      if (match) {
        return done(null, user, { message: 'Logged in succesfully' }); // Return user and success message if passwords match
      }
      return done(null, false, { message: 'Wrong username or password' }); // Return error message if passwords do not match
    }).catch(err => {
      return done(null, false, { message: 'Something went wrong' }); // Return error message if an error occurs during password comparison
    });
  }));

  // Serialize user object to store in the session
  passport.serializeUser((user, done) => {
    done(null, user._id); // Store user ID in the session
  });

  // Deserialize user object from the session
  passport.deserializeUser((id, done) => {
    User.findById(id) // Find user with matching ID in the database
      .then(user => done(null, user)) // Return user object if found
      .catch(err => done(err, null)); // Return error if user is not found
  });
}

// Export the init function
module.exports = init;