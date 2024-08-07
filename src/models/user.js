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
  
  static async update(userId, updateFields) {
    // Build dynamic SET clause
    const setClause = Object.keys(updateFields)
      .map(key => `${key} = $${Object.keys(updateFields).indexOf(key) + 2}`)
      .join(', '); // Start parameters at $2 to leave $1 for userId

    // TODO: Build dynamic RETURNING clause for updated fields
    // const returningClause = Object.keys(updateFields)
    //   .map(key => `CASE WHEN ${key} IS DISTINCT FROM $${Object.keys(updateFields).indexOf(key) + 2} THEN '${key}' END`) // Add 2 to the parameter number for userId
    //   .filter(clause => clause !== null) // Remove null clauses
    //   .join(', ');

    const query = `
      UPDATE usr_data SET ${setClause} 
      WHERE id = $1 RETURNING *`;
    const values = [userId, ...Object.values(updateFields)];

    try {
        const result = await pool.query(query, values);
        return [result.rowCount, result.rows]; // Return [rowCount, updatedRows]
    } catch (err) {
        console.error('Error updating user data:', err.stack);
        throw err;
    }
  }

  static async create(userData) {
    const query = `
      INSERT INTO usr_data (
        first_names, last_names, birth_date, phone_number, 
        prefix_phone_number, address, zipcode, city, passwd, aboutme, 
        username, email, active, photo, profile_id, language_id,
        category_id, employe_number
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)
      RETURNING *`;

    const values = Object.values(userData);
    try {
      const result = await pool.query(query, values);
      return [result.rowCount, result.rows]; // Return [rowCount, createdRow]

    } catch (err) {
       console.error('Error executing query', err.stack);
      throw err;

    }
  }

  static async deactivate(userId) {
    const query = `
      UPDATE usr_data
      SET active = false
      WHERE id = $1
      RETURNING *
    `;
    const values = [userId];

    try {
      const result = await pool.query(query,values);
      return [result.rowCount, result.rows];
    } catch (err) {
      console.error('Error executing query', err.stack);
      throw err;
    }
  }

  static async remove(userId) {
    const query = `
      DELETE FROM usr_data
      WHERE id = $1
      RETURNING *
    `;
    const values = [userId];
    try {
      const result = await pool.query(query,values);

      return [result.rowCount, result.rows];
    } catch (err) {
      console.error('Error executing query', err.stack)
      throw err;
    }

  }

  static async getPhoto(userId) {
    const query = `
    SELECT 
      photo
    FROM
      usr_data
    WHERE 
      id = $1
    `;
    const values = [userId];

    try {
      const result = await pool.query(query,values);
      console.log(result);
      return [result.rowCount,result.rows];
    } catch (error) {
      console.erro('Error executing query', error.stack);
      throw error;
    }
  }
}
module.exports = User;