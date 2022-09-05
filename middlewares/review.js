const Profile = require("../models/profile");
const Review = require("../models/review");

exports.authenticatePerson = (req, res, next) => {
  if (
    req.job.getJobAnyPerson.getJobPersonProfileId != req.profile._id.toString()
  ) {
    return res.status(400).json({
      error: "You can't Post review this user ",
    });
  }
  next();
};

exports.isSameProjectReview = async (req, res, next) => {
  try {
    const profile = await Profile.findOne({
      getReviews: { $elemMatch: { jobId: req.job } },
    });
    if (profile) {
      return res.status(400).json({
        error: "You alreay reviewed This project",
      });
    }
    next();
  } catch (error) {
    console.log(error);
  }
};

exports.getReviewById = async (req, res, next, id) => {
  try {
    const review = await Review.findById(id);
    if (!review) {
      return res.status(400).json({
        error: "Review not found",
      });
    }
    req.review = review;
    next();
  } catch (error) {
    return res.status(400).json({
      error: "Invalid ID Review",
    });
  }
};

exports.updateReviewRequestByUser = (req, res, next) => {
  const { profileId } = req.auth;
  const { Profile } = req.review;
  if (profileId != Profile) {
    return res.status(400).json({
      error: "You can't make update request in this review",
    });
  }
  next();
};

exports.isMakeReview = (req, res, next) => {
  const { profileId, authId } = req.auth;
  const { clientProfile, clientAuth } = req.review;
  if (profileId != clientProfile && authId != clientAuth) {
    return res.status(400).json({
      error: "You can't modify this review",
    });
  }
  next();
};

exports.isUpdate = (req, res, next) => {
  const { updateReview } = req.review;
  if (updateReview === false) {
    return res.status(400).json({
      error: "User can not give you permission to modify this Review",
    });
  }
  next();
};
