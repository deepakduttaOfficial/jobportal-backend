const express = require("express");
const {
  signup,
  signin,
  logout,
  emamilVerify,
  forgotPasswordToken,
  resetPassword,
} = require("../controllers/auth");
const { isForgotPassword } = require("../middlewares/auth");
const router = express.Router();

// User route
router.route("/signup").post(signup);
router.route("/signin").post(signin);
router.route("/logout").get(logout);

// Email verify route
router.route("/user/verify-email/:token").get(emamilVerify);

//forgot password
router.route("/forgotpassword").post(forgotPasswordToken);
router.route("/resetpassword").post(isForgotPassword, resetPassword);

module.exports = router;
