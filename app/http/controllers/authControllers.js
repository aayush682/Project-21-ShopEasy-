// Import required modules
const User = require('../../models/user') // Import the User model
const bcrypt = require('bcrypt') // Import the bcrypt library for password hashing
const passport = require('passport') // Import the passport library for authentication

// Define the authController function
function authController() {
  // Define a helper function to get the redirect URL based on the user's role
  const _getRedirectURL = (req) => {
    return req.user.role === 'Admin' ? '/admin/orders' : '/customer/orders'
  }

  // Define and return an object with various controller methods
  return {
    // Render the login page
    login(req, res) {
      res.render('auth/login')
    },

    // Handle the login form submission
    postLogin(req, res, next) {
      const { email, password } = req.body

      // Validate request: check if email and password are provided
      if (!email || !password) {
        req.flash('error', 'All fields are required')
        return res.redirect('/login')
      }

      // Authenticate the user using passport middleware
      passport.authenticate('local', (err, user, info) => {
        if (err) {
          req.flash('error', info.message)
          return next(err)
        }
        if (!user) {
          req.flash('error', info.message)
          return res.redirect('/login')
        }

        // Log in the user and redirect to the appropriate URL
        req.logIn(user, (err) => {
          if (err) {
            req.flash('error', info.message)
            return next(err)
          }
          return res.redirect(_getRedirectURL(req))
        })
      })(req, res, next)
    },

    // Render the registration page
    register(req, res) {
      res.render('auth/register')
    },

    // Handle the registration form submission
    async postRegister(req, res) {
      const { name, email, password } = req.body

      // Validate request: check if name, email, and password are provided
      if (!name || !email || !password) {
        req.flash('error', 'All fields are required');
        req.flash('name', name);
        req.flash('email', email);
        return res.redirect('/register');
      }

      // Check if the email already exists in the User collection
      const emailExists = await User.exists({ email: email });

      if (emailExists) {
        req.flash('error', 'Email already taken');
        req.flash('name', name);
        req.flash('email', email);
        return res.redirect('/register');
      }

      try {
        // Hash the password using bcrypt
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user instance
        const user = new User({ name, email, password: hashedPassword });

        // Save the user to the database
        await user.save();

        // Redirect to the login page upon successful registration
        res.redirect('/login');
      } catch (err) {
        req.flash('error', 'Something went wrong');
        console.error(err);
        return res.redirect('/register');
      }
    },

    // Handle user logout
    logout(req, res) {
      req.logout((err) => {
        if (err) return next(err)
      })
      return res.redirect('/login')
    }
  }
}

// Export the authController function
module.exports = authController