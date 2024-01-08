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

const PORT = process.env.PORT;

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

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_CONNECTION_URL,
    collectionName: 'sessions',
  }),
  cookie: { maxAge: 1000 * 60 * 60 * 24 } // 24 hours
}));


const initPassport = require('./app/config/passport');
initPassport(passport);
app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  res.locals.session = req.session;
  res.locals.user = req.user;
  next();
});

app.use(express.static("public"));

app.use(ejsLayouts);
app.set('views', path.join(__dirname, '/resources/views'));


app.set("view engine", "ejs");

require('./routes/web')(app);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});