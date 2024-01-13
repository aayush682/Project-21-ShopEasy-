const Order = require('../../../models/order');

// Refactored code for the statusController function
function statusController() {
   // Return an object with the update method
   return {
      // Define the update method that takes req and res as parameters
      update(req, res) {
         // Update the order status using Mongoose's updateOne method
         Order.updateOne({ _id: req.body.orderId }, { status: req.body.status })
            .then(() => {
               // Emit event
               const eventEmitter = req.app.get('eventEmitter');

               // Emit the 'orderUpdated' event with the data as an object
               eventEmitter.emit('orderUpdated', { id: req.body.orderId, status: req.body.status });
               // Redirect the response (res) to the '/admin/orders' route
               return res.redirect('/admin/orders');
            })
            .catch((err) => {
               // Redirect to the admin orders page on error
               return res.redirect('/admin/orders');
            });
      }
   };
}

module.exports = statusController;
