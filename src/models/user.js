/* user.js */

const pool = require('../config/db'); // Import your database connection pool

class User {
  static async findById(id) {
    try {
      const result = await pool.query(`
        SELECT
          u.id,
          u.first_names,
          u.last_names,
          u.birth_date,
          u.phone_number,
          u.prefix_phone_number,
          u.address,
          u.zipcode,
          u.city,
          u.aboutme,
          u.username,
          u.email,
          u.active,
          u.photo,
          u.profile_id,
          u.language_id,
          u.employe_number,
          c.name AS category_name 
        FROM
          usr_data u
        JOIN
          category c
        ON
          u.category_id = c.id
        WHERE 
          u.id = $1`, [id]);
      return result.rows.length > 0 ? result.rows[0] : null; // Return the user object or null if not found
    } catch (err) {
      console.error('Error finding user by ID:', err.stack);
      throw err; // Re-throw the error to be handled by the controller
    }
  }

  static async findAll() {
    try {
      const result = await pool.query(`
        SELECT 
          u.id,
          u.first_names,
          u.last_names,
          u.birth_date,
          u.phone_number,
          u.prefix_phone_number,
          u.address,
          u.zipcode,
          u.city,
          u.aboutme,
          u.username,
          u.email,
          u.active,
          u.photo,
          u.profile_id,
          u.language_id,
          u.employe_number,
          c.name AS category_name
        FROM 
          usr_data u
        JOIN 
          category c 
        ON
          u.category_id = c.id
        `);
      return result.rows;
    } catch (err) {
      console.error('Error fetching all users:', err.stack);
      throw err;
    }
  }

  static async findActive() {
    try {
      const result = await pool.query(`
        SELECT
          u.id,
          u.first_names,
          u.last_names,
          u.phone_number,
          u.prefix_phone_number,
          u.email,
          u.photo,
          c.name AS category_name
        FROM
          usr_data u
        JOIN
          category c
        ON 
          u.category_id = c.id
        WHERE 
          active = true
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