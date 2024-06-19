/* Error handling middleware */
const { GeneralError } = require('./errors'); // Assuming you have a custom GeneralError class

const handleError = (err, req, res, next) => {
    if (res.headersSent) {
        return next(err);
    }

    let code = 500;
    let message = 'Something went wrong';

    if (err instanceof GeneralError) {
        code = err.getCode();
        message = err.getMessage();
    }

    console.error(err); // Log the detailed error to the console

    res.status(code).json({
        status: 'error',
        message: err.message || 'Internal Server Error'
    });
};

module.exports = handleError;