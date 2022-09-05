const mongoose = require("mongoose");
const bidSchema = new mongoose.Schema(
  {
    Job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
    },
    bidDescription: {
      type: String,
      required: [true, "Description must be required"],
      trim: true,
    },
    moneyRequest: {
      type: Number,
      required: [true, "Budget of project must be required"],
    },
    Profile: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Profile",
    },
    Auth: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Auth",
    },
    accept: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Bid", bidSchema);
