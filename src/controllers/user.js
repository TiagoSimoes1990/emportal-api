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

module.exports = {
  getUserDetails,
  getAllUsers,
  getActiveUsers
};