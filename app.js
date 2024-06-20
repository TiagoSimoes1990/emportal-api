const express = require('express');
const bodyParser = require('body-parser');
const corsMiddleware = require('./src/middleware/cors');
const userRoutes = require('./src/routes/user');
const errorHandler = require('./src/utils/errorHandler');

const app = express();

// Middleware Setup
app.use(corsMiddleware);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Mount Routes
app.use('/api/users', userRoutes);

// Error handler middleware 
app.use(errorHandler)

// Start the Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`);
});