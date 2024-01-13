// Load environment variables from a .env file
require("dotenv").config();

// Import required modules
const express = require("express");
const ejs = require("ejs");
const ejsLayouts = require("express-ejs-layouts");
const mongoose = require("mongoose");
const session = require("express-session");
const path = require("path");
const flash = require('express-flash');
const passport = require('passport');
const MongoStore = require('connect-mongo');

// Create an instance of the Express application
const app = express();

// Set the port for the server to listen on
const PORT = process.env.PORT;

// Function to establish a database connection using Mongoose
async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_CONNECTION_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to the database");
  } catch (error) {
    console.log("Failed to connect to the database:", error);
  }
}
connectDB();

// Configure session middleware for Express
app.use(session({
  secret: process.env.SESSION_SECRET, // Secret used to sign session ID cookie
  resave: false, // Indicates whether the session should be saved back to the session store if the session was never modified
  saveUninitialized: false, // Indicates whether a new, but not modified, session should be saved to the session store
  store: MongoStore.create({ // Store sessions in MongoDB
    mongoUrl: process.env.MONGO_CONNECTION_URL, // MongoDB connection URL
    collectionName: 'sessions', // Name of the collection to store sessions in
  }),
  cookie: { maxAge: 1000 * 60 * 60 * 24 } // Set the maximum age of the session cookie to 24 hours
}));

// Initialize Passport.js for authentication
const initPassport = require('./app/config/passport');
initPassport(passport);
app.use(passport.initialize());
app.use(passport.session());

// Enable flash messages
app.use(flash());

// Parse JSON bodies and URL-encoded bodies
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Set local variables for views
app.use((req, res, next) => {
  res.locals.session = req.session; // Make the session available in views
  res.locals.user = req.user; // Make the currently logged in user available in views
  next();
});

// Serve static files from the "public" directory
app.use(express.static("public"));

// Use EJS as the template engine
app.use(ejsLayouts);
app.set('views', path.join(__dirname, '/resources/views'));

// Set the view engine to EJS
app.set("view engine", "ejs");

// Load the routes defined in the "web.js" file
require('./routes/web')(app);

// Start the server and listen on the specified port
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});