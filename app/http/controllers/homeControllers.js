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
    },
    about(req, res) {
      res.render('about');
    },
    async shoes(req, res) {
      try {
        const page = req.query.page || 1;
        const perPage = 4;

        const shoes = await Shoe.find()
          .skip((page - 1) * perPage)
          .limit(perPage);

        res.json(shoes);
      } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
      }
    }
  };
}

// Export the 'homeController' function so that it can be used in other modules
module.exports = homeController;