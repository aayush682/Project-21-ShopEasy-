// Import the 'order' model
const order = require("../../../models/order");

// Define the 'orderController' function
function orderController() {
  return {
    // Handler for the index route
    index(req, res) {
      // Find orders with status not equal to 'completed'
      order.find({ status: { $ne: 'completed' } })
        // Sort orders by createdAt field in descending order
        .sort({ createdAt: -1 })
        // Populate the customerId field and exclude the password field
        .populate('customerId', '-password')
        // Execute the query
        .exec()
        .then((orders) => {
          if (req.xhr) {
            // If the request is an AJAX request, return orders as JSON
            return res.json(orders);
          } else {
            // If the request is not an AJAX request, render the 'admin/orders' view
            return res.render('admin/orders');
          }
        })
        .catch((error) => {
          console.error(error);
          // If an error occurs, return a 500 Internal Server Error response
          return res.status(500).send('Internal Server Error');
        });
    }
  };
}

// Export the 'orderController' function
module.exports = orderController;