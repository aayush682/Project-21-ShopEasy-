require("dotenv").config();
const express = require("express");
const ejs = require("ejs");
const ejsLayouts = require("express-ejs-layouts");
const mongoose = require("mongoose");
const session = require("express-session");
const path = require("path");
const flash = require('express-flash')
const MongoStore = require('connect-mongo');
const app = express();
const PORT = process.env.PORT


// Database Connection
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

// Middlewares
// Session config
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


app.use(flash())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//set static folder
app.use(express.static("public"));
app.use(ejsLayouts);

//set template engine
app.set('views', path.join(__dirname, '/resources/views'))

// set view engine
app.set("view engine", "ejs");

//routes
require('./routes/web')(app);


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
})