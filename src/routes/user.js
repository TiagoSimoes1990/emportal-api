/* User API routes */

const express = require('express');
const router = express.Router();
const userController = require('../controllers/user');

// Define user routes
router.post('/details', userController.getUserDetails); //TODO: Change from post to get -> this route does not create anything, gets the info according to the user ID
router.get('/', userController.getAllUsers);
router.get('/active', userController.getActiveUsers); //TODO: change the route to '/list-active' - this makes the intention of the route clearer
router.patch('/update/:id', userController.updateDetails);

module.exports = router; // Export the router for use in app.js