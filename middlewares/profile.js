const { expressjwt: jwt } = require("express-jwt");
const Profile = require("../models/profile");

exports.isSignin = jwt({
  secret: process.env.JWT_SECRET,
  algorithms: ["HS256"],
  requestProperty: "auth",
});

exports.getProfileById = async (req, res, next, id) => {
  try {
    const profile = await Profile.findById(id)
      .populate("Auth", "name email verified")
      .populate("jobposts")
      .populate("getReviews");

    if (!profile) {
      return res.status(400).json({
        error: "Profile not found",
      });
    }
    req.profile = profile;
    next();
  } catch (error) {
    return res.status(400).json({
      error: "Invalid ID Profile",
    });
  }
};

exports.isAuthenticate = (req, res, next) => {
  if (
    req.profile._id != req.auth.profileId &&
    req.profile.Auth._id != req.auth.authId
  ) {
    return res.status(400).json({
      error: "You are not able to access this profile",
    });
  }
  next();
};

exports.isAdmin = (req, res, next) => {
  if (req.profile.role !== "admin") {
    return res.status(400).json({
      error: "You are not Admin",
    });
  }
  next();
};
