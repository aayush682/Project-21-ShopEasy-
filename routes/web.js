// Importing the required controller modules
const homeController = require('../app/http/controllers/homeControllers');
const authController = require('../app/http/controllers/authControllers');
const cartController = require('../app/http/controllers/customers/cartController');
const orderController = require('../app/http/controllers/customers/orderController');
const adminOrderController = require('../app/http/controllers/admin/adminController');

// Importing the required middleware modules
const guest = require('../app/http/middlewares/guest');
const auth = require('../app/http/middlewares/auth');
const admin = require('../app/http/middlewares/admin');

// Function to initialize routes
function initRoutes(app) {
  // Home route
  app.get("/", homeController().index);

  // Register and login routes for guests
  app.get("/register", guest, authController().register);
  app.get("/login", guest, authController().login);

  // Post request for registering and logging in
  app.post("/register", authController().postRegister);
  app.post("/login", authController().postLogin);
  app.post("/logout", authController().logout);

  // Cart routes
  app.get("/cart", cartController().index);
  app.post("/update-cart", cartController().update);

  // Customer routes
  app.post("/orders", auth, orderController().store);
  app.get("/customers/orders", auth, orderController().index);

  // Admin routes
  app.get("/admin/orders", admin, adminOrderController().index);
}

// Exporting the initRoutes function
module.exports = initRoutes;