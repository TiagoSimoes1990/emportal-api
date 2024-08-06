/* User API routes */

const express = require('express');
const router = express.Router();
const userController = require('../controllers/user');
const upload = require('../middleware/multer');

// Define user routes
// ----- GET requests ----- //
router.get('/details/:id', userController.getDetails);
router.get('/', userController.getAll);
router.get('/active', userController.getActive);

// ----- PATCH requests ----- //
router.patch('/update/:id', userController.update);
router.patch('/deactivate/:id', userController.deactivate);

// ----- POST requests ----- //
router.post('/create', userController.create);
router.post('/photo/:id', upload.single('image'), userController.uploadProfilePhoto);

// ----- DELETE requests ----- //
router.delete('/remove/:id', userController.remove);

module.exports = router; // Export the router for use in app.js