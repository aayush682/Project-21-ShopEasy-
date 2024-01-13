// Import the 'shoe' model from the '../../models/shoe' directory
const Shoe = require('../../models/shoe');

// Define a function called 'homeController'
function homeController() {
  // The 'homeController' function returns an object with a method called 'index'
  return {
    // The 'index' method is an asynchronous function that takes 'req' and 'res' as parameters
    async index(req, res) {
      try {
        // Using the 'Shoe' model, find all the shoes in the database
        const shoes = await Shoe.find();

        // Render the 'home' view template and pass the 'shoes' data to it
        res.render('home', { shoes });
      } catch (error) {
        // If there's an error, handle it here
      }
    }
  };
}

// Export the 'homeController' function so that it can be used in other modules
module.exports = homeController;