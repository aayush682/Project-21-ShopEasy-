const homeController = require('../app/http/controllers/homeControllers');
const authController = require('../app/http/controllers/authControllers');
const cartController = require('../app/http/controllers/customers/cartController');
const orderController = require('../app/http/controllers/customers/orderController');



// middlewares
const guest = require('../app/http/middlewares/guest');
const auth = require('../app/http/middlewares/auth');


function initRoutes(app) {
  app.get("/", homeController().index);


  app.get("/register", guest, authController().register);
  app.get("/login", guest, authController().login);

  app.post("/register", authController().postRegister);
  app.post("/login", authController().postLogin);
  app.post("/logout", authController().logout);

  app.get("/cart", cartController().index);
  app.post("/update-cart", cartController().update);


  //Customer routes
  app.post("/orders", auth, orderController().store);
  app.get("/customers/orders", auth, orderController().index);




}

module.exports = initRoutes