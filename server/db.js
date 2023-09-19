const mongoose = require("mongoose");

function connectToDatabase() {
  mongoose.connect(process.env.DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  mongoose.connection.on("error", () => {
    console.error.bind(console, "Connection Error: ");
  });

  mongoose.connection.once("open", () => {
    console.log(`MongoDB connected!!`);
  });
}

module.exports = connectToDatabase;
