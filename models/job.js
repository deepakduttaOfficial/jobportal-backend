const mongoose = require("mongoose");
const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "title must be required"],
      trim: true,
    },
    budget: {
      type: Number,
      required: [true, "Budget of project must be required"],
    },
    Description: {
      type: String,
      required: [true, "Description must be required"],
      trim: true,
    },
    categories: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
      },
    ],
    onProjectTotalBid: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Bid",
      },
    ],
    Profile: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Profile",
    },
    Auth: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Auth",
    },
    getJobAnyPerson: {
      accept: {
        type: Boolean,
        default: false,
      },
      getJobPersonProfileId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Profile",
      },
    },
    jobComplete: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Job", jobSchema);
