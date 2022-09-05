const express = require("express");
const {
  createBid,
  getBids,
  getBid,
  updateBid,
  deleteBid,
  acceptBid,
} = require("../controllers/bid");
const {
  getBidById,
  isMakeBid,
  // isAlreadyCreateBidSameProject,
  acceptBidByJobPoster,
  getBidByJobId,
} = require("../middlewares/bid");
const { getJobById } = require("../middlewares/job");
const router = express.Router();
const {
  getProfileById,
  isSignin,
  isAuthenticate,
} = require("../middlewares/profile");

router.param("profileId", getProfileById);
router.param("jobId", getJobById);
router.param("bidId", getBidById);
router.param("BidJobId", getBidByJobId);

//Create bid
router
  .route("/bid/create/:profileId/:jobId")
  .post(isSignin, isAuthenticate, createBid);
// isAlreadyCreateBidSameProject

// Read Bid
router.route("/bids/get/:BidJobId").get(getBids);
router.route("/bid/get/:bidId").get(getBid);

// Update bid
router
  .route("/bid/update/:profileId/:bidId")
  .put(isSignin, isAuthenticate, isMakeBid, updateBid);

// Delete Bid
router
  .route("/bid/delete/:profileId/:jobId/:bidId")
  .delete(isSignin, isAuthenticate, isMakeBid, deleteBid);

// Accept Bid By Project owner
router
  .route("/bid/accept/:profileId/:jobId/:bidId")
  .put(isSignin, isAuthenticate, acceptBidByJobPoster, acceptBid);

module.exports = router;
