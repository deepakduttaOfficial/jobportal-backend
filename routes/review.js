const express = require("express");
const {
  createReview,
  getReviews,
  postReviews,
  getReview,
  updateReviewRequest,
} = require("../controllers/review");
const { getJobById, isMakeJob, acceptedJob } = require("../middlewares/job");
const {
  isSignin,
  getProfileById,
  isAuthenticate,
} = require("../middlewares/profile");
const {
  authenticatePerson,
  isSameProjectReview,
  getReviewById,
  updateReviewRequestByUser,
  isMakeReview,
  isUpdate,
} = require("../middlewares/review");

const router = express.Router();

router.param("profileId", getProfileById);
router.param("jobId", getJobById);
router.param("reviewId", getReviewById);

// Create Review
router
  .route("/review/create/:profileId/:jobId")
  .post(
    isSignin,
    isMakeJob,
    acceptedJob,
    authenticatePerson,
    isSameProjectReview,
    createReview
  );

// Read Reviews
router.route("/reviews/get/:profileId").get(isSignin, getReviews);
router.route("/reviews/post/:profileId").get(isSignin, postReviews);
router.route("/review/get/:reviewId").get(isSignin, getReview);

// Update Review Request
router
  .route("/review/updaterequest/:profileId/:reviewId")
  .put(
    isSignin,
    isAuthenticate,
    updateReviewRequestByUser,
    updateReviewRequest
  );

// Update By client
router
  .route("/review/update/:profileId/:reviewId")
  .put(isSignin, isAuthenticate, isMakeReview, isUpdate, updateReviewRequest);

module.exports = router;
