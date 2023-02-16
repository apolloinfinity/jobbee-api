const mongoose = require("mongoose");

const connectDB = () => {
  mongoose
    .connect(process.env.DB_CLOUD_URI, {
      useUnifiedTopology: true,
    })
    .then((con) => {
      console.log(
        `MongoDB Databse connected with host: ${con.connection.host}`
      );
    })
    .catch((error) => {
      console.log(`Error: ${error}`);
    });
  mongoose.set("strictQuery", true);
};
module.exports = connectDB;
