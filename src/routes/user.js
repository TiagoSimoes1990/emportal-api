/* User API routes */

const express = require('express');
const router = express.Router();
const userController = require('../controllers/user');

// Define user routes
router.post('/details', userController.getUserDetails);
router.get('/', userController.getAllUsers);
router.get('/active', userController.getActiveUsers);

module.exports = router; // Export the router for use in app.js