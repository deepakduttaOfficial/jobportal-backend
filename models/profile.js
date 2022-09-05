const mongoose = require("mongoose");
const profileSchema = new mongoose.Schema(
  {
    Auth: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Auth",
      required: [true, "You are not Authenticate"],
    },
    number: {
      type: Number,
      trim: true,
    },
    country: {
      type: String,
      default: "India",
      trim: true,
    },
    currency: {
      type: String,
      trim: true,
    },
    role: {
      type: String,
      default: "user",
    },
    describeUserSelf: {
      type: String,
    },
    currentBid: {
      type: Number,
    },
    photo: {
      id: {
        type: String,
      },
      secure_url: {
        type: String,
      },
    },
    documentVerify: {
      documentName: {
        type: String,
      },
      documentNumber: {
        type: String,
      },
    },
    paymentVerify: {
      type: String,
    },
    totalBidsPost: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Bid",
      },
    ],
    getTotalJobs: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Job",
      },
    ],
    jobposts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Job",
      },
    ],
    getReviews: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Review",
      },
    ],
    postReviews: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Review",
      },
    ],
    totalEarn: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Profile", profileSchema);
