const express = require("express");
const {
  getProfile,
  getProfiles,
  updateProfile,
} = require("../controllers/profile");
const {
  getProfileById,
  isSignin,
  isAuthenticate,
} = require("../middlewares/profile");
const router = express.Router();

//Middleware
router.param("profileId", getProfileById);

//Get route
router
  .route("/profile/get/:profileId")
  .get(isSignin, isAuthenticate, getProfile);

router.route("/profiles/get").get(isSignin, getProfiles);

//Update route
router
  .route("/profile/update/:profileId")
  .put(isSignin, isAuthenticate, updateProfile);

module.exports = router;
