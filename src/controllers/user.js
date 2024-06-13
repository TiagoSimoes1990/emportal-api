/* User-related API logic */

const pool = require('../config/db'); // Import the database connection pool

const User = require('../models/user') // Import the User model

// Get user details by ID
async function getUserDetails(req, res) {
  const userId = req.body.id; // Assuming the ID is sent in the request body
  try {
    const user = await User.findById(userId);
    if(!user) {
        return res.status(404).json({message: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    console.error('Error getting user details:', err.stack);
    res.status(500).json({ message: 'Internal server error' }); // Send an error response
  }
}

// Get all users 
// TODO: (potentially with filtering/pagination in the future)
async function getAllUsers(req, res) {
  try {
    const result = await User.findAll();
    if(!result) {
        return res.status(404).json({message: 'No users found' });
    }
    res.json(result);  
  } catch (err) {
    console.error('Error getting all users:', err.stack);
    res.status(500).json({ message: 'Internal server error' }); // Send an error response
  }
}

// Get active users
async function getActiveUsers(req, res) {
  try {
    const result = await User.findActive();
    if (!result) {
        return res.status(404).json({message: 'No active users found'});
    }
    res.json(result);
  } catch (err) {
    console.error('Error getting active users:', err.stack);
    res.status(500).json({ message: 'Internal server error' });
  }
}

// Update user profile information
async function updateDetails(req, res) { // TODO - Include 'next' for error handling
  const userId = parseInt(req.params.id, 10); // Always provide radix (10) for parseInt
  const updateField = req.body;

  console.log("userId: ", userId);
  console.log("updateField: ", updateField);
    // TODO: Validation:
    //    - custom validation function
    //    - Ensure all required fields are present
    //    - Validate field formats (email, phone, etc.)

    // 1. Data Validation
  // if (!validateUpdateFields(updateField)) { // Custom validation function
  //   return next(new Error("Invalid input data")); 
  // }

  try{
     // 2. Update User Data
    const updatedUser = await User.updateUserData(userId, updateField);
    if (!updatedUser) { // Check if update was successful
      return res.status(404).json({ error: "User not found" });
    }
    // 3. Success Response
    res.json({ 
      message: "User updated successfully",
      user: updatedUser 
    });
  }catch (err) {
    // TODO - Implement centralized error handling on 'erroHandling.js'
    console.error('Error updating user profile information:'. err.stack);
    res.status(500).json({ message: 'Internal server error'})
  }
}

// TODO - rename methods and remover the word 'user' as this method is inside a User class 

// TODO - Create error handler
module.exports = {
  getUserDetails,
  getAllUsers,
  getActiveUsers,
  updateDetails,
};