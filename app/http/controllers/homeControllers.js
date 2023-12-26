const Shoe = require('../../models/shoe');
function homeController() {
  return {
    async index(req, res) {
      try {
        const shoes = await Shoe.find();
        res.render('home', { shoes });
      } catch (error) {
        // Handle error
      }
    }
  }
}

module.exports = homeController