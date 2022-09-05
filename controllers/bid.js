const Bid = require("../models/bid");
const Profile = require("../models/profile");
const Job = require("../models/job");

exports.createBid = async (req, res) => {
  try {
    const { bidDescription, moneyRequest } = req.body;
    const { authId, profileId } = req.auth;
    if (!(bidDescription && moneyRequest)) {
      return res.status(400).json({
        error: "All field are required",
      });
    }

    let data = {
      Job: req.job._id,
      bidDescription,
      moneyRequest,
      Profile: profileId,
      Auth: authId,
    };

    const bid = await Bid.create(data);

    await Profile.findByIdAndUpdate(
      { _id: req.profile._id },
      { $push: { totalBidsPost: bid._id } },
      { new: true }
    );

    await Job.findByIdAndUpdate(
      { _id: req.job._id },
      { $push: { onProjectTotalBid: bid._id } },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      bid,
    });
  } catch (error) {
    return res.status(400).json({
      error: error,
    });
  }
};

exports.getBids = (req, res) => {
  const bids = req.bids;
  return res.status(200).json(bids);
};

exports.getBid = (req, res) => {
  const bid = req.bid;
  return res.status(200).json({
    bid,
  });
};

exports.updateBid = async (req, res) => {
  try {
    const { bidDescription, moneyRequest } = req.body;
    let newData = {
      bidDescription,
      moneyRequest,
    };

    const bid = await Bid.findByIdAndUpdate(req.bid._id, newData, {
      new: true,
    });
    return res.status(200).json({
      success: true,
      bid,
    });
  } catch (error) {
    return res.status(400).json({
      error: "Some thing worng",
    });
  }
};

exports.deleteBid = async (req, res) => {
  try {
    const bid = req.bid;

    await Profile.findByIdAndUpdate(
      req.profile._id,
      {
        $pullAll: { totalBidsPost: [bid._id] },
      },
      { safe: true, multi: true }
    );
    await Job.findByIdAndUpdate(
      req.job._id,
      {
        $pullAll: { onProjectTotalBid: [bid._id] },
      },
      { safe: true, multi: true }
    );
    await bid.remove();
    return res.status(200).json({
      message: "Delete successFully",
    });
  } catch (error) {
    return res.status(400).json({
      error: "Delete Bid unsuccessfull",
    });
  }
};

exports.acceptBid = async (req, res) => {
  try {
    await Profile.findOneAndUpdate(
      { _id: req.bid.Profile },
      { $push: { getTotalJobs: req.job._id } },
      { new: true }
    );
    await Job.findOneAndUpdate(
      { _id: req.job._id },
      {
        getJobAnyPerson: {
          accept: true,
          getJobPersonProfileId: req.bid.Profile,
        },
      },
      { new: true }
    );
    await Bid.findOneAndUpdate(
      { _id: req.bid._id },
      { accept: true },
      {
        new: true,
      }
    );
    return res.status(200).json({
      message: "You accept Bid , Now You can't reject this bid",
    });
  } catch (error) {
    return res.status(400).json({
      error: "Bid Modify Fail",
    });
  }
};
