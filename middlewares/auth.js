const { expressjwt: jwt } = require("express-jwt");

exports.isForgotPassword = jwt({
  secret: process.env.FORGOT_PASSWORD_TOKEN,
  algorithms: ["HS256"],
  requestProperty: "auth",
});
