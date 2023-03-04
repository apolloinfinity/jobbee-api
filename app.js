const express = require("express");
const dotenv = require("dotenv");

const app = express();

// handling Uncaught Exception
process.on("uncaughtException", (err) => {
  console.log(`Error: ${err.message}`);
  console.log(`Shutting down due to uncaught exception`);
  process.exit(1);
});

const connectDatabase = require("./config/database");
const errorMiddleware = require("./middleware/errors");
const ErrorHandler = require("./utils/errorHandler");

// Setting up config.env file variables
dotenv.config({ path: "./config/config.env" });

// Connecting to Database
connectDatabase();

// Setting up Body Parser
app.use(express.json());

// Importing all routes
const jobs = require("./routes/jobs");

app.use("/api/v1", jobs);

app.all("*", (req, res, next) => {
  next(new ErrorHandler(`${req.originalUrl} route not found`, 404));
});

// Middleware to handle errors
app.use(errorMiddleware);

const PORT = process.env.PORT;
const server = app.listen(PORT, () => {
  console.log(
    `Server started on port ${process.env.PORT} in ${process.env.NODE_ENV} mode.`
  );
});

// Handling unhandled promise rejection.
process.on("unhandledRejection", (err) => {
  console.log(`Error: ${err.message}`);
  console.log(`Shutting down server due to unhandled promise rejection.`);
  server.close(() => {
    process.exit(1);
  });
});

// TODO: Fix issue with scripts commands between *nix OS and Windows OS. check-out cross-env package.
