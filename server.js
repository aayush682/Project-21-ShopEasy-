const express = require("express");
const ejs = require("ejs");
const ejsLayouts = require("express-ejs-layouts");
const path = require("path");
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(ejsLayouts);

//set template engine
app.set('views', path.join(__dirname, '/resources/views'))

// set view engine
app.set("view engine", "ejs");

//routes
app.get("/", (req, res) => {
  res.render("home");
})

app.get("/cart", (req, res) => {
  res.render("customers/cart")
})

app.get("/register", (req, res) => {
  res.render("auth/register")
})

app.get("/login", (req, res) => {
  res.render("auth/login")
})


app.listen(PORT, () => {
  console.log(`server is running on http://localhost:${PORT}`);
})