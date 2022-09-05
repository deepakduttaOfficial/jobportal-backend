const mongoose = require("mongoose");
const reviewSchema = new mongoose.Schema(
  {
    clientProfile: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Profile",
    },
    clientAuth: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Auth",
    },
    Job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
    },
    review: {
      type: String,
      required: [true, "review must be required"],
    },
    rating: {
      type: Number,
      required: [true, "Plz given rating to user"],
    },
    Profile: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Profile",
    },
    ProfileAuth: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Auth",
    },
    updateReview: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Review", reviewSchema);
