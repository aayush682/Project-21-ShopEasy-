const homeController = require('../app/http/controllers/homeControllers');
const authController = require('../app/http/controllers/authControllers');
const cartController = require('../app/http/controllers/customers/cartController');
const guest = require('../app/http/middlewares/guest');


function initRoutes(app) {
  app.get("/", homeController().index);


  app.get("/register", guest, authController().register);
  app.get("/login", guest, authController().login);

  app.post("/register", authController().postRegister);
  app.post("/login", authController().postLogin);
  app.post("/logout", authController().logout);

  app.get("/cart", cartController().cart);
  app.post("/update-cart", cartController().updateCart);

}

module.exports = initRoutes