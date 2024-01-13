const { json } = require("express")

// Define a function named cartController
function cartController() {
  // The function returns an object with two methods, index and update
  return {
    // Method: index
    // This method handles the rendering of the 'customers/cart' view
    index(req, res) {
      res.render('customers/cart')
    },
    // Method: update
    // This method is responsible for updating the cart based on the request body
    update(req, res) {
      // Check if the cart does not exist in the session
      // If it doesn't exist, create a new cart object with initial values
      if (!req.session.cart) {
        req.session.cart = {
          items: {},
          totalQty: 0,
          totalPrice: 0
        }
      }
      // Get the cart object from the session
      let cart = req.session.cart

      // Check if the item does not exist in the cart
      // If it doesn't exist, add the item to the cart with quantity 1
      // Update the total quantity and total price accordingly
      if (!cart.items[req.body._id]) {
        cart.items[req.body._id] = {
          item: req.body,
          qty: 1
        }
        cart.totalQty = cart.totalQty + 1
        cart.totalPrice = cart.totalPrice + req.body.price
      } else {
        // If the item already exists in the cart
        // Increase the quantity of the item by 1
        // Update the total quantity and total price accordingly
        cart.items[req.body._id].qty = cart.items[req.body._id].qty + 1
        cart.totalQty = cart.totalQty + 1
        cart.totalPrice = cart.totalPrice + req.body.price
      }
      // Return a JSON response with the updated total quantity
      return res.json({ totalQty: req.session.cart.totalQty })
    }
  }
}

// Export the cartController function
module.exports = cartController