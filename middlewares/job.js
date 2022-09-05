const Job = require("../models/job");

exports.getJobById = async (req, res, next, id) => {
  try {
    const job = await Job.findById(id)
      .populate("Profile")
      .populate("categories")
      .populate("Auth", "name email")
      .populate("onProjectTotalBid");
    if (!job) {
      return res.status(400).json({
        error: "Job not found",
      });
    }
    req.job = job;
    next();
  } catch (error) {
    return res.status(400).json({
      error: "Invalid ID JOBID",
    });
  }
};

exports.isMakeJob = (req, res, next) => {
  const { authId, profileId } = req.auth;
  const { Auth, Profile } = req.job;
  if (authId != Auth && profileId != Profile._id) {
    return res.status(400).json({
      error: "You can not modify this job",
    });
  }
  next();
};

exports.isAcceptJob = (req, res, next) => {
  if (req.job.getJobAnyPerson.accept === true) {
    return res.status(400).json({
      error: "This project is already accepted . You can't modify",
    });
  }

  next();
};

exports.acceptedJob = (req, res, next) => {
  if (req.job.getJobAnyPerson.accept === false) {
    return res.status(400).json({
      error: "This project is not accepted ",
    });
  }

  next();
};

exports.jobComplete = (req, res, next) => {
  if (req.job.jobComplete === true) {
    return res.status(400).json({
      error: "This project is Already complete ",
    });
  }

  next();
};
