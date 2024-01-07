function cartController() {
  // Define the cartController function that will be returned
  // This function acts as a controller for handling cart-related operations

  // Return an object with two methods: cart and updateCart
  return {
    // cart method is responsible for rendering the 'customers/cart' view
    cart(req, res) {
      res.render('customers/cart');
    },

    // updateCart method is responsible for updating the cart based on the request body
    updateCart(req, res) {
      // Check if req.session.cart exists, if not, initialize it with empty values
      if (!req.session.cart) {
        req.session.cart = {
          items: {},
          totalQty: 0,
          totalPrice: 0,
        };
      }

      // Assign the cart object from req.session.cart to a local variable
      let cart = req.session.cart;

      // Check if the item with the given _id already exists in the cart
      if (!cart.items[req.body._id]) {
        // If the item doesn't exist, add it to the cart with quantity 1
        cart.items[req.body._id] = {
          item: req.body,
          qty: 1,
        };

        // Increment the totalQty and totalPrice of the cart
        cart.totalQty = cart.totalQty + 1;
        cart.totalPrice = cart.totalPrice + req.body.price;
      } else {
        // If the item already exists in the cart, increment its quantity
        cart.items[req.body._id].qty = cart.items[req.body._id].qty + 1;

        // Increment the totalQty and totalPrice of the cart
        cart.totalQty = cart.totalQty + 1;
        cart.totalPrice = cart.totalPrice + req.body.price;
      }

      // Return the updated totalQty as a JSON response
      return res.json({ totalQty: req.session.cart.totalQty });
    },
  };
}

// Export the cartController function
module.exports = cartController;