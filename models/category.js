const mongoose = require("mongoose");
const reviewSchema = new mongoose.Schema({
  Profile: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "UserProfile",
  },
  Auth: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "UserProfile",
  },
  categoryName: {
    type: String,
    required: [true, "Enter atleast a category name"],
  },
});

module.exports = mongoose.model("Category", reviewSchema);
