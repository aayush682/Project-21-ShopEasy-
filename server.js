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
const Emitter = require('events');

const app = express();
const port = process.env.PORT;

// Connect to the database using Mongoose
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

// Set up Event Emitter
const eventEmitter = new Emitter();
app.set('eventEmitter', eventEmitter);

// Configure session middleware for Express
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_CONNECTION_URL,
    collectionName: 'sessions',
  }),
  cookie: { maxAge: 1000 * 60 * 60 * 24 }
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

// Start the server and listen on the specified port
const server = app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

// Set up Socket.io
const io = require('socket.io')(server);

// Event handler for when a client connects to the server
io.on('connection', (socket) => {
  // Event handler for the client's 'join' event
  socket.on('join', (orderId) => {
    // Join the specified room for the order
    socket.join(orderId);
  });
});

// Event listener for the 'orderUpdated' event emitted by the 'eventEmitter'
eventEmitter.on('orderUpdated', (data) => {
  // Emit the 'orderUpdated' event to all clients in the room 'order_{data.id}'
  io.to(`order_${data.id}`).emit('orderUpdated', data);
});