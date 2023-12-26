const mongoose = require("mongoose");
const shoeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  image: { type: String, required: true },
  price: { type: Number, required: true },
  size: { type: String, required: true },
});

const Shoe = mongoose.model("Shoe", shoeSchema);

module.exports = Shoe;