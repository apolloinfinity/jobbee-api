const ErrorHandler = require("../utils/errorHandler");

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Internal Server Error";

  if (process.env.NODE_ENV === "development") {
    console.log(`Hello from ${process.env.NODE_ENV}`);

    res.status(err.statusCode).json({
      success: false,
      error: err,
      errMessage: err.message,
      stack: err.stack,
    });
  }

  if (process.env.NODE_ENV === "production") {
    console.log(`Hello from ${process.env.NODE_ENV}`);
    let error = { ...err };

    error.message = err.message;

    // Wrong mongoose Object ID error.
    if (err.name === "CastError") {
      const message = `Resource not found. Invalid ${err.path}`;
      error = new ErrorHandler(message, 404);
    }

    // Handling mongoose validation error
    if (err.name === "ValidationError") {
      const message = Object.values(err.errors).map((value) => value.message);
      error = new ErrorHandler(message, 400);
    }

    res.status(error.statusCode).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};
