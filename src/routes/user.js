/* User API routes */

const express = require('express');
const router = express.Router();
const userController = require('../controllers/user');

// Define user routes
router.get('/details/:id', userController.getDetails);
router.get('/', userController.getAll);
router.get('/active', userController.getActive);
router.patch('/update/:id', userController.update);
router.patch('/deactivate/:id', userController.deactivate);
router.post('/create', userController.create);
router.delete('/remove/:id', userController.remove);

module.exports = router; // Export the router for use in app.js