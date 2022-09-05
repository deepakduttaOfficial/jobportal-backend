const express = require("express");
const { razorpay } = require("../config/payment");
const {
  createJob,
  updateJob,
  getJob,
  getJobs,
  deleteJob,
  completeJob,
} = require("../controllers/job");
const {
  getJobById,
  isMakeJob,
  isAcceptJob,
  acceptedJob,
  jobComplete,
} = require("../middlewares/job");
const {
  getProfileById,
  isSignin,
  isAuthenticate,
} = require("../middlewares/profile");
const router = express.Router();

router.param("profileId", getProfileById);
router.param("jobId", getJobById);

//  Create Job
router
  .route("/job/create/:profileId")
  .post(isSignin, isAuthenticate, createJob);

// Update job
router
  .route("/job/update/:profileId/:jobId")
  .put(isSignin, isAuthenticate, isMakeJob, isAcceptJob, updateJob);

// Read Job
router.route("/job/get/:jobId").get(getJob);
router.route("/jobs/get").get(getJobs);

// Delete Job
router
  .route("/job/delete/:profileId/:jobId")
  .delete(isSignin, isAuthenticate, isMakeJob, isAcceptJob, deleteJob);

// Complete or not
router
  .route("/job/compelete/:profileId/:jobId")
  .post(isSignin, isMakeJob, acceptedJob, jobComplete, razorpay, completeJob);

module.exports = router;
