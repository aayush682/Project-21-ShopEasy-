// Import the Order model and the moment library
const Order = require('../../../models/order');
const moment = require('moment');

// Define the orderController function
function orderController() {
  // Return an object with two methods: store and index
  return {
    // store method handles the creation of a new order
    store(req, res) {
      // Extract the phone and address from the request body
      const { phone, address } = req.body;

      // Check if phone or address is missing
      if (!phone || !address) {
        // If any of the fields is missing, set an error flash message and redirect to the cart page
        req.flash('error', 'All fields are required to place order');
        return res.redirect('/cart');
      }

      // Create a new Order instance with the customer id, items from the session cart, phone, and address
      const order = new Order({
        customerId: req.user._id,
        items: req.session.cart.items,
        phone,
        address
      })

      // Save the order to the database
      order.save().then(result => {
        // If the order is saved successfully, set a success flash message, delete the cart from the session, and redirect to the customer's orders page
        req.flash('success', 'Order created successfully');
        delete req.session.cart;
        return res.redirect('customers/orders');
      }).catch(err => {
        // If there is an error while saving the order, set an error flash message and redirect to the cart page
        req.flash('error', 'Something went wrong');
        return res.redirect('/cart');
      })
    },
    // index method retrieves the list of orders for the current customer
    async index(req, res) {
      // Find all orders for the current customer, sorted by createdAt in descending order
      const orders = await Order.find({ customerId: req.user._id }, null, { sort: { 'createdAt': -1 } });

      // Set the Cache-Control header to prevent caching
      res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');

      // Render the customers/orders view with the orders and moment library
      res.render('customers/orders', { orders: orders, moment: moment });
    },
    // The show method retrieves the details of a specific order
    async show(req, res) {
      // Find the order by its ID
      const order = await Order.findById(req.params.id);

      // Check if the logged-in user is authorized to view the order
      if (req.user._id.toString() === order.customerId.toString()) {
        // Render the singleOrder view template with the order details
        return res.render('customers/singleOrder', { order });
      }

      // If the user is not authorized, redirect them to the homepage
      return res.redirect('/customers/dashboard');
    }
  }
}

// Export the orderController function
module.exports = orderController;