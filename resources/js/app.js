// Import the axios library for making HTTP requests and the Noty library for displaying notifications
import axios from "axios";
import Noty from "noty";
import { initAdmin } from './admin.js';
import moment from "moment";

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

// Change the Status of the order
let statuses = document.querySelectorAll('.status_line')
let hiddenInput = document.querySelector('#hiddenInput')
let order = hiddenInput ? hiddenInput.value : null
order = JSON.parse(order)
let time = document.createElement('small')

// Function to update the status of the order
function updateStatus(order) {
  // Remove 'step-completed' and 'current' classes from all statuses
  statuses.forEach((status) => {
    status.classList.remove('step-completed')
    status.classList.remove('current')
  })

  // Set a flag to track if the current step is completed
  let stepCompleted = true;

  // Iterate over all statuses
  statuses.forEach((status) => {
    let dataProp = status.dataset.status

    // If the step is completed, add 'step-completed' class to the status
    if (stepCompleted) {
      status.classList.add('step-completed')
    }

    // If the status matches the order status
    if (dataProp === order.status) {
      stepCompleted = false // Set the flag to false
      time.innerText = moment(order.updatedAt).format('hh:mm A') // Set the time
      status.appendChild(time) // Append the time to the status

      // If there is a next status, add 'current' class to it
      if (status.nextElementSibling) {
        status.nextElementSibling.classList.add('current')
      }
    }
  })
}

updateStatus(order);


// Socket io configuration
let socket = io(); // Initialize socket io connection

if (order) {
  socket.emit('join', `orderId-${order._id}`); // Join a room based on the order ID if it exists
}

// Listen for 'orderUpdated' event from the server
socket.on('orderUpdated', (data) => {
  // Update the order details
  const updatedOrder = { ...order }; // Make a copy of the original order object
  updatedOrder.updatedAt = moment().format(); // Update the 'updatedAt' field with the current time
  updatedOrder.status = data.status; // Update the 'status' field with the new status received from the server
  console.log(data);
  updateStatus(updatedOrder); // Call the 'updateStatus' function with the updated order object

  // Show a notification to the user
  new Noty({
    type: 'success',
    timeout: 2000,
    text: 'Order Updated',
    progressBar: true,
  }).show();
});