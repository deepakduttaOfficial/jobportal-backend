const Job = require("../models/job");
const Profile = require("../models/profile");

exports.createJob = async (req, res) => {
  try {
    const { authId, profileId } = req.auth;
    const { title, budget, Description, categories } = req.body;
    if (!(title && budget && Description && categories)) {
      return res.status(400).json({
        error: "All field are required",
      });
    }
    const newData = {
      title,
      budget,
      Description,
      categories,
      Profile: profileId,
      Auth: authId,
    };
    const job = await Job.create(newData);

    await Profile.findByIdAndUpdate(
      { _id: req.profile._id },
      { $push: { jobposts: job._id } },
      { new: true }
    );
    return res.status(200).json(job);
  } catch (error) {
    return res.status(400).json({
      error: "Worng information",
    });
  }
};

exports.getJob = (req, res) => {
  return res.status(200).json(req.job);
};

exports.getJobs = async (req, res) => {
  const jobs = await Job.find()
    .populate("Profile")
    .populate("categories")
    .populate("Auth", "name email")
    .populate("onProjectTotalBid");
  return res.status(200).json(jobs);
};

exports.updateJob = async (req, res) => {
  try {
    const { title, budget, Description, categories } = req.body;
    const newData = {
      title,
      budget,
      Description,
      categories,
    };
    const job = await Job.findByIdAndUpdate(req.job._id, newData, {
      new: true,
    });
    return res.status(200).json({
      job,
    });
  } catch (error) {
    return res.status(400).json({
      error: "Worng information",
    });
  }
};

exports.deleteJob = async (req, res) => {
  const job = req.job;
  await Profile.findByIdAndUpdate(
    req.profile._id,
    {
      $pullAll: { jobposts: [job._id] },
    },
    { safe: true, multi: true }
  );

  await job.remove();

  return res.status(200).json({
    message: "Job was delete",
  });

  // const removeJob = job.remove();
};

exports.completeJob = async (req, res) => {
  try {
    await Profile.findByIdAndUpdate(
      req.profile._id,
      {
        totalEarn: totalEarn + req.body.amount,
      },
      { new: true }
    );
    await Job.findByIdAndUpdate(
      req.job._id,
      {
        jobComplete: true,
      },
      { new: true }
    );
    return res.status(200).json({
      message: "Successfully payment",
    });
  } catch (error) {
    return res.status(400).json({
      error: "Something worng",
    });
  }
};
