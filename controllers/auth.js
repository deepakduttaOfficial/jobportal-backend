const jwt = require("jsonwebtoken");
const Auth = require("../models/auth");
const Profile = require("../models/profile");
const bcrypt = require("bcryptjs");
const { v4: uuidv4 } = require("uuid");
const { emailSend } = require("../config/emailsend");
const otpGenerator = require("otp-generator");

// user
exports.signup = async (req, res) => {
  const { name, email, password } = req.body;
  if (!(name || email || password)) {
    return res.status(400).json({
      error: "All field are required",
    });
  }
  //Chech if user Alreay exist
  const isAlreaySignup = await Auth.findOne({ email });
  if (isAlreaySignup) {
    return res.status(400).json({
      error: "You are already resgister in our application . Plz login..",
    });
  }

  // create verify token
  let verifyToken = jwt.sign(
    { id: uuidv4() },
    process.env.EMAIL_VERIFY_TOKEN_SECRET_KEY,
    {
      expiresIn: "1h",
    }
  );

  //Create New User
  const user = new Auth({
    name,
    email,
    password,
    verifyToken,
  });
  user.save(async (err, user) => {
    if (err || !user) {
      err = Object.values(err.errors)[0].properties.message;
      return res.status(400).json({
        error: err,
      });
    }
    //Create user Profile
    const profile = await Profile.create({ Auth: user._id });
    // update user Profile Id
    user.Profile = profile._id;
    await user.save();
    // Send mail
    let sendMailOption = {
      from: "deepakduttag@gmail.com",
      to: user.email,
      subject: "Plz verify the email ✔",
      html: `<h1> ${user.name} ! Thanks for registration our site </h1>
              <h4> please varify your mail to continue... </h4>
              <a href="http://${req.headers.host}/api/v1/user/verify-email/${user.verifyToken}">Varify Your Email</a>`,
    };
    emailSend(sendMailOption);

    return res.status(200).json({
      message: `Hello ${user.name} you signup sucessfully, Plz check your email and verify to continue..`,
    });
  });
};

exports.signin = async (req, res) => {
  const { email, password } = req.body;
  if (!(email && password)) {
    return res.status(400).json({
      error: "All field are required",
    });
  }

  //ChecK if user Signup
  const user = await Auth.findOne({ email });
  if (!user) {
    return res.status(400).json({
      error: "Email and Password could not match",
    });
  }

  // Match password
  const isMatchPassword = bcrypt.compareSync(password, user.password);
  if (!isMatchPassword) {
    return res.status(400).json({
      error: "Email and Password could not match",
    });
  }

  // check if user email has alreat verifed
  if (!user.verified) {
    return res.status(201).json({
      error: `Plz check your email and verify to continue...`,
    });
  }
  if (user.verifyToken !== null) {
    return res.status(300).json({
      error: "Email varification fail",
    });
  }

  // Create token
  const token = jwt.sign(
    { authId: user._id, profileId: user.Profile },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRE_DATE,
    }
  );

  // Create cookie and send with token
  const option = {
    expires: new Date(
      Date.now() + process.env.COOKIE_TIME * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };
  res.cookie("token", token, option);

  // response back
  user.password = undefined;
  return res.status(200).json({
    user,
    token,
  });
};

exports.logout = (req, res) => {
  if (req.cookies.token) {
    return res
      .clearCookie("token")
      .status(200)
      .json({ message: "Successfully logged out 😏 🍀" });
  }
  return res.status(400).json({
    error: "You are already Logout",
  });
};

exports.emamilVerify = async (req, res) => {
  const token = req.params.token;
  const user = await Auth.findOne({ verifyToken: token });

  if (!user) {
    return res.send("<h1>Token has expire</h1>");
  }
  user.verifyToken = null;
  user.verified = true;
  user.save();
  res.send("<h1> varification success fully </h1>");
};

// Forgot password
exports.forgotPasswordToken = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({
      error: "Plz providev an Email",
    });
  }

  const user = await Auth.findOne({ email: email });
  if (!user) {
    return res.status(400).json({
      error: "User not found",
    });
  }

  const forgotpasswordToken = jwt.sign(
    { id: user._id },
    process.env.FORGOT_PASSWORD_TOKEN,
    {
      expiresIn: "1h",
    }
  );

  const OTP = otpGenerator.generate(6, {
    upperCaseAlphabets: false,
    specialChars: false,
    lowerCaseAlphabets: false,
  });

  user.forgotPasswordToken = forgotpasswordToken;
  user.forgotPasswordOTP = OTP;
  await user.save();
  const option = {
    expires: new Date(
      Date.now() + process.env.COOKIE_TIME * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };
  res.cookie("forgotPasswordToken", forgotpasswordToken, option);

  let sendMailOption = {
    from: "deepakduttag@gmail.com",
    to: user.email,
    subject: "Password Reset",
    html: `<h1> O.T.P </h1>
    <h2> ${OTP} </h2>
    `,
  };
  emailSend(sendMailOption);
  return res.status(200).json({
    token: user.forgotPasswordToken,
  });
};
exports.resetPassword = async (req, res) => {
  const { otp, password } = req.body;

  const user = await Auth.findById(req.auth.id);
  if (!user) {
    return res.status(400).json({
      error: "Something worng",
    });
  }

  if (!otp) {
    return res.status(400).json({
      error: "Check email and Provide O.T.P",
    });
  }

  if (user.forgotPasswordOTP != otp) {
    return res.status(400).json({
      error: "Enter valid O.T.P",
    });
  }

  if (!password) {
    return res.status(400).json({
      error: "Enter a Password",
    });
  }
  user.password = password;
  user.forgotPasswordToken = null;
  user.forgotPasswordOTP = null;

  await user.save();
  return res.status(200).json({
    message: "Password reset succesfully , Login Plz..",
  });
};
