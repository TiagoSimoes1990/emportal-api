/* User API routes */

const express = require('express');
const router = express.Router();
const userController = require('../controllers/user');

// Define user routes
router.post('/details', userController.getDetails); //TODO: Change from post to get -> this route does not create anything, gets the info according to the user ID
router.get('/', userController.getAll);
router.get('/list-active', userController.getActive);
router.patch('/update/:id', userController.update);
router.post('/create', userController.create);

module.exports = router; // Export the router for use in app.js