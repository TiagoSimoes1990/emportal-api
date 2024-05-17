/* user.js */

const pool = require('../config/db'); // Import your database connection pool

class User {
  static async findById(id) {
    try {
      const result = await pool.query('SELECT * FROM public.usr_data WHERE id = $1', [id]);
      return result.rows.length > 0 ? result.rows[0] : null; // Return the user object or null if not found
    } catch (err) {
      console.error('Error finding user by ID:', err.stack);
      throw err; // Re-throw the error to be handled by the controller
    }
  }

  static async findAll() {
    try {
      const result = await pool.query('SELECT * FROM public.usr_data');
      return result.rows;
    } catch (err) {
      console.error('Error fetching all users:', err.stack);
      throw err;
    }
  }

  static async findActive() {
    try {
      const result = await pool.query(`
        SELECT id, first_names, last_names, phone_number, prefix_phone_number, email, photo, category_id
        FROM public.usr_data
        WHERE active = true
      `);
      return result.rows;
    } catch (err) {
      console.error('Error fetching active users:', err.stack);
      throw err;
    }
  }
  
  // TODO: Add more methods as needed (e.g., create, update, delete)
}

module.exports = User;