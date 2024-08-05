/* User-related API logic */

const pool = require('../config/db'); // Import the database connection pool
const { GeneralError } = require('../utils/errors');
const User = require('../models/user') // Import the User model
const userService = require('../services/userService')

// Get user details by ID
async function getDetails(req, res, next) {
  const userId = parseInt(req.params.id,10); // Assuming the ID is sent in the request body
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
async function getAll(req, res, next) {
  try {
    const users = await User.findAll();
    res.json(users);  // Return users even if it's an empty array
  } catch (err) {
    next(err);
  }
}

// Get active users
async function getActive(req, res, next) {
  try {
    const users = await User.findActive();
    res.json(users); // Return activeUsers even if it's an empty array
  } catch (err) {
    next(err);
  }
}

// Update user profile information
async function update(req, res, next) {
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
    // Destructuring  of result
    const [rowCount, updatedRows] = await User.update(userId, updateField);
    if (rowCount === 0) { // Check if the rowCount is greater then 0, meaning the user was updated
      return next(new GeneralError("User not found",404));
    }
    // 3. Success Response
    res.json({ 
      message: "User updated successfully",
      user: updatedRows[0]
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
    // Destructuring  of result
    const [rowCount, [createdUser]] = await User.create(userData);
    if (rowCount === 0) { // Check if update was successful
      return next(new GeneralError("Failed to create user", 422))
    }
    // 3. Success Response
    res.status(201).json({ // Use 201 Created status code
      message: "User created successfully",
      user: createdUser 
    }); 
  } catch (err) {
    if (err.code === '23505') { // PostgreSQL unique constraint violation code
      return next(new GeneralError('User already exists', 409));
    }
    next(err); // Handle other errors
  }
}

// Deactivate user
async function deactivate(req, res, next) {
  // 1. Get the user id
  const userId = parseInt(req.params.id);

  try {
    // 2. Update the user 'active' state 
    const [rowCount, deactivatedUser] = await User.deactivate(userId);
    if (rowCount === 0) {
      return next(new GeneralError('User not found'), 404);
    } else if (rowCount > 1) { 
      return next(new GeneralError("Unexpected error: Multiple users were deactivated", 500));
    }
     // 3. Success Response
    res.json({
      message:'User deactivated sucessfully',
      user:deactivatedUser
    });
  } catch (err) {
    if (err.code === '23505') {// PostgreSQL unique constraint violation code
      return next (new GeneralError('Cannot deactivate user due to dependencies', 409));
    }
    next(err); // Handle other errors with errorHandler Middleware
  }
}

// Remove user from database
async function remove(req, res, next) {
  // 1. Get userId
  const userId = parseInt(req.params.id);

  try {
  // 2. Delete the user
  const [rowCount, removedUser] = await User.remove(userId);

  if (rowCount === 0) {
    return next(new GeneralError('User not found'), 404);
  }
   // 3. Success Response
  res.json({
    message:'User removed sucessfully',
    user:removedUser
  });
    
  } catch (err) {
    if (err.code === '23505') { // PostgreSQL unique constraint violation code
      return next( new GeneralError('Cannout remove user due to dependencies', 409));
    }
    next(err);
  }
}

// Upload profile Photo
async function uploadProfilePhoto(req,res,next) {
  try {
    // 1. Call the uploadProfilePhoto service
    const result = await userService.uploadImage(req.file);
    
    // 2. Success response
    res.status(201).json({
      message: result.message,
      result: result.key
    });
  } catch (error) {
    //  3. Handle Errors
    console.error(error);
    next(new GeneralError('Failed to upload photo', 500));
  }
  
}

module.exports = {
  getDetails,
  getAll,
  getActive,
  update,
  create,
  deactivate,
  remove,
  uploadProfilePhoto
};