/* User-related API logic */

const pool = require('../config/db'); // Import the database connection pool
const { GeneralError } = require('../utils/errors');
const User = require('../models/user') // Import the User model

// Get user details by ID
async function getUserDetails(req, res) {
  const userId = req.body.id; // Assuming the ID is sent in the request body
  try {
    const user = await User.findById(userId);
    if(!user) {
      return next(new GeneralError("User not found", 404));
    }
    res.json(user);
  } catch (err) {
    next(err);
  }
}

// Get all users 
// TODO: (potentially with filtering/pagination in the future)
async function getAllUsers(req, res) {
  try {
    const result = await User.findAll();
    if(!result) {
        return next(new GeneralError("No users found", 404));
    }
    res.json(result);  
  } catch (err) {
    next(err);
  }
}

// Get active users
async function getActiveUsers(req, res) {
  try {
    const result = await User.findActive();
    if (!result) {
        return next(new GeneralError("No active users found", 404));
    }
    res.json(result);
  } catch (err) {
    next(err);
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
  //   return next(new GeneralError("Invalid input data", 400));
  // }

  try{
     // 2. Update User Data
    const updatedUser = await User.updateUserData(userId, updateField);
    if (!updatedUser) { // Check if update was successful
      return next(new GeneralError("User not found",404));
    }
    // 3. Success Response
    res.json({ 
      message: "User updated successfully",
      user: updatedUser 
    });
  }catch (err) {
    next(err);
  }
}

// Create user
async function create(req, res, next) {
    // 1. Data Validation
    const userData = req.body;
  try {
    // 2. Insert new user data
    const createUser = await User.create(userData);
    if (!createUser) { // Check if update was successful
      return next(new GeneralError("Failed to create user", 422))
    }
    // 3. Success Response
    res.json({ 
      message: "User created successfully",
      user: createUser
    }); 
  } catch (err) {
    // TODO - Implement centralized error handling on 'erroHandling.js'
    if (err.name === 'SequelizeUniqueConstraintError') {
      return next(new GeneralError('User already exists', 409));
    }
    next(err);
  }
}
// TODO - rename methods and remover the word 'user' as this method is inside a User class 

// TODO - Create error handler
module.exports = {
  getUserDetails,
  getAllUsers,
  getActiveUsers,
  updateDetails,
  create,
};