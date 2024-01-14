require("dotenv").config();

const express = require("express");
const ejs = require("ejs");
const ejsLayouts = require("express-ejs-layouts");
const mongoose = require("mongoose");
const session = require("express-session");
const path = require("path");
const flash = require('express-flash');
const passport = require('passport');
const MongoStore = require('connect-mongo');
const app = express();
const port = process.env.PORT;

// Connect to the database using Mongoose
async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_CONNECTION_URL);
    console.log("Connected to the database");
  } catch (error) {
    console.log("Failed to connect to the database:", error);
  }
}
connectDB();


// Configure session middleware for Express
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_CONNECTION_URL,
    collectionName: 'sessions',
  }),
  cookie: { maxAge: 1000 * 60 * 60 * 1 } // 1 hour
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
  res.locals.session = req.session;
  res.locals.user = req.user;
  next();
});

// Serve static files from the "public" directory
app.use(express.static("public"));

// Use EJS as the template engine
app.use(ejsLayouts);
app.set('views', path.join(__dirname, '/resources/views'));
app.set("view engine", "ejs");

// Load the routes defined in the "web.js" file
require('./routes/web')(app);

// Error Page Middleware
app.use((req, res) => {
  res.status(404).render("errors/404");
})

// Start the server and listen on the specified port
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});