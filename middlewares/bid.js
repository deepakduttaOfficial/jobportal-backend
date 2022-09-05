const Bid = require("../models/bid");

exports.getBidById = async (req, res, next, id) => {
  try {
    const bid = await Bid.findById(id).populate("Profile");
    if (!bid) {
      return res.status(400).json({
        error: "Bid not found",
      });
    }
    req.bid = bid;
    next();
  } catch (error) {
    return res.status(400).json({
      error: "Invalid ID BID ID",
    });
  }
};

exports.getBidByJobId = async (req, res, next, id) => {
  try {
    const bids = await Bid.find({ Job: id })
      .populate("Profile")
      .populate("Auth", "name email")
      .populate("Job");
    if (!bids) {
      return res.status(400).json({
        error: "No Bid",
      });
    }
    req.bids = bids;
    next();
  } catch (error) {
    return res.status(400).json({
      error: "No Bid ",
    });
  }
};

exports.isMakeBid = (req, res, next) => {
  const { authId, profileId } = req.auth;
  const { Profile, Auth } = req.bid;
  if (authId != Auth && profileId != Profile) {
    return res.status(400).json({
      error: "You can not Modify this Bid",
    });
  }
  if (req.bid.accept === true) {
    return res.status(400).json({
      error: "This bid is Acceptable by Client  So, can't Modify this bid",
    });
  }
  next();
};

// exports.isAlreadyCreateBidSameProject = async (req, res, next) => {
//   try {
//     const jobBid = req.job.onProjectTotalBid;
//     const profileBid = req.profile.totalBidsPost;

//     let isMatch = false;

//     // console.log(jobBid);
//     // console.log(profileBid);
//   } catch (error) {
//     return res.status(400).json({
//       error: "You alreay Bid on this Project",
//     });
//   }
// };

exports.acceptBidByJobPoster = (req, res, next) => {
  const { authId, profileId } = req.auth;
  const { Auth, Profile } = req.job;
  const bid = req.bid;

  if (authId != Auth._id && profileId != Profile && bid.Job != req.job._id) {
    return res.status(400).json({
      error: "You can't modify this bid no Authorize",
    });
  }

  if (req.job.getJobAnyPerson.accept === true) {
    return res.status(400).json({
      error: "This project already accept",
    });
  }
  next();
};
