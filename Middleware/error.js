const ErrorHandler = require("../Utils/errorHandler");

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Internal Server Error";

  // JWT error
  if (err.name === "JsonWebTokenError") {
    const message = "JWT Error, try again";
    err = new ErrorHandler(message, 400);
  }

  res.status(err.statusCode).json({
    success: false,
    message: err.message, // Change to err.stack or err.message
  });
};
