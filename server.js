const express = require("express");
const ejs = require("ejs");
const ejsLayouts = require("express-ejs-layouts");
const webRoutes = require("./routes/web");
const path = require("path");
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

//routes
app.use(webRoutes);

// set view engine
app.set("view engine", "ejs");

//set template engine
app.use(ejsLayouts);
app.set('views', path.join(__dirname, '/resources/views'))

app.listen(PORT, () => {
  console.log(`server is running on http://localhost:${PORT}`);
})