const mongoose = require("mongoose");

mongoose.connect(process.env.DB_CLOUD_URI, {
  useNewParser: true,
  useUnifiedTopology: true,
});
