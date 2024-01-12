// Import the axios library for making HTTP requests and the Noty library for displaying notifications
import axios from "axios";
import Noty from "noty";
import { initAdmin } from './admin.js';

// Get all elements with the class "add-to-cart" and assign them to the variable addToCart
let addToCart = document.querySelectorAll('.add-to-cart');

// Get the element with the id "cartCounter" and assign it to the variable cartCounter
let cartCounter = document.querySelector('#cartCounter');

// Define a function called "updateCart" that takes a parameter called "shoe"
function updateCart(shoe) {
  // Send a POST request to the "/update-cart" endpoint with the "shoe" data
  axios.post('/update-cart', shoe).then(res => {
    // Update the text content of the "cartCounter" element with the total quantity from the response data
    cartCounter.innerText = res.data.totalQty;
    // Create and show a success notification using the Noty library
    new Noty({
      type: 'success',
      timeout: 2000,
      progressBar: true,
      text: 'Item added to cart',
    }).show();
  }).catch(err => {
    // Create and show an error notification using the Noty library
    new Noty({
      type: 'error',
      timeout: 2000,
      progressBar: true,
      text: 'Something went wrong',
    }).show();
  })
}

// Add a click event listener to each element in the "addToCart" array
addToCart.forEach((btn) => {
  btn.addEventListener('click', (e) => {
    // Parse the "shoe" data from the dataset of the clicked button
    let shoe = JSON.parse(btn.dataset.shoe);
    // Call the "updateCart" function with the parsed "shoe" data
    updateCart(shoe);
  })
})

// Remove msg after 3 seconds
const msg = document.querySelector('#success-alert')
if (msg) {
  setTimeout(() => {
    msg.remove()
  }, 3000)
}

// Initialize the admin interface
initAdmin();