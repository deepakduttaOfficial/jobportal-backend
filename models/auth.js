const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const authSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name must be required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email must be required"],
      length: [5, "enter valid email"],
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password must be required"],
      trim: true,
    },
    verifyToken: {
      type: String,
      trim: true,
    },
    verified: {
      type: Boolean,
      default: false,
    },
    Profile: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Profile",
    },
    forgotPasswordToken: {
      type: String,
      default: null,
    },
    forgotPasswordOTP: {
      type: Number,
      default: null,
    },
  },
  { timestamps: true }
);

authSchema.pre("save", function (next) {
  var user = this;
  if (!user.isModified("password")) return next();
  bcrypt.genSalt(10, function (err, salt) {
    if (err) return next(err);
    bcrypt.hash(user.password, salt, function (err, hash) {
      if (err) return next(err);
      user.password = hash;
      next();
    });
  });
});

module.exports = mongoose.model("Auth", authSchema);
