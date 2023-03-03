const express = require("express");
const dotenv = require("dotenv");

const app = express();
const connectDatabase = require("./config/database");
const errorMiddleware = require("./middleware/errors");

// Setting up config.env file variables
dotenv.config({ path: "./config/config.env" });

// Connecting to Database
connectDatabase();

// Setting up Body Parser
app.use(express.json());

// Importing all routes
const jobs = require("./routes/jobs");

app.use("/api/v1", jobs);
// Middleware to handle errors
app.use(errorMiddleware);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(
    `Server started on port ${process.env.PORT} in ${process.env.NODE_ENV} mode.`
  );
});

// TODO: Fix issue with scripts commands between *nix OS and Windows OS. check-out cross-env package.
