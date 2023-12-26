const homeController = require('../app/http/controllers/homeControllers');
const authController = require('../app/http/controllers/authControllers');
const cartController = require('../app/http/controllers/customers/cartController');


function initRoutes(app) {
  app.get("/", homeController().index);

  app.get("/cart", cartController().cart);

  app.get("/register", authController().register);

  app.get("/login", authController().login);
}

module.exports = initRoutes