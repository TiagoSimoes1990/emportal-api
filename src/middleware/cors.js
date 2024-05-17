/* CORS middleware */

require('dotenv').config(); // Load environment variables from .env file
const cors = require('cors');

// To prevent requests from unauthorized domains
const whitelist = [
  `http://${process.env.REACT_HOST}`,
  `http://${process.env.REACT_HOST}:${process.env.REACT_PORT}`
];

const corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      // Allow requests from the specified origins or from the same origin (when no origin is provided, typically for same-origin requests)
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
};

module.exports = cors(corsOptions); // Export the configured CORS middleware