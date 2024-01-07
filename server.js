// Load environment variables from .env file
require("dotenv").config();

// Import required libraries
const express = require("express");
const ejs = require("ejs");
const ejsLayouts = require("express-ejs-layouts");
const mongoose = require("mongoose");
const session = require("express-session");
const path = require("path");
const flash = require('express-flash')
const MongoStore = require('connect-mongo');

// Create an instance of the Express app
const app = express();

// Set the port for the server to listen on
const PORT = process.env.PORT

// Connect to the database
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

// Set up middlewares

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_CONNECTION_URL,
    collectionName: 'sessions',
  }),
  saveUninitialized: false,
  cookie: { maxAge: 1000 * 60 * 60 * 24 } // 24 hours
}));

// Flash messages configuration
app.use(flash())

// Parse JSON request bodies
app.use(express.json());

// Parse URL-encoded request bodies with extended options
app.use(express.urlencoded({ extended: true }));

// Set the static folder for serving static files
app.use(express.static("public"));

// Set up EJS layouts for rendering views
app.use(ejsLayouts);

// Set the directory for views
app.set('views', path.join(__dirname, '/resources/views'))

// Make session data available in views
app.use((req, res, next) => {
  res.locals.session = req.session
  next();
})

// Set the view engine to EJS
app.set("view engine", "ejs");

// Import and configure routes
require('./routes/web')(app);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
})