const mongoose = require("mongoose");

const calculationSchema = new mongoose.Schema(
  {
    calculationName: {
      type: String,
      trim: true,
      required: true,
    },
    calculation: {
      type: String,
      trim: true,
      required: true,
    },
    result: {
      type: String,
      trim: true,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("calculation", calculationSchema);
