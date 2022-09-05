const Review = require("../models/review");
const Profile = require("../models/profile");

exports.createReview = async (req, res) => {
  try {
    const { review, rating } = req.body;
    if (!(review && rating)) {
      return res.status(400).json({
        error: `Review and Rating must be require`,
      });
    }
    let data = {
      clientProfile: req.auth.profileId,
      clientAuth: req.auth.authId,
      Job: req.job._id,
      review,
      rating,
      Profile: req.profile._id,
      ProfileAuth: req.profile.Auth,
    };

    const createReview = await Review.create(data);

    await Profile.findOneAndUpdate(
      { _id: req.auth.profileId },
      { $push: { postReviews: createReview._id } },
      { new: true }
    );

    await Profile.findOneAndUpdate(
      { _id: req.profile._id },
      { $push: { getReviews: createReview._id } },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      createReview,
    });
  } catch (error) {
    return res.status(400).json({
      error: `Fail to create review`,
    });
  }
};

exports.getReviews = async (req, res) => {
  // const reviews = req.profile.getReviews;
  try {
    const reviews = await Review.find({ Profile: req.profile._id })
      .populate("clientProfile", "photo country currency getReviews jobposts ")
      .populate("clientAuth", "name email verified")
      .populate("Job", "title Description budget createdAt")
      .populate("Profile", "photo");

    return res.status(200).json(reviews);
  } catch (error) {
    return res.status(400).json(error);
  }
};

exports.postReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ clientProfile: req.profile._id })
      .populate("clientProfile", "photo ")
      .populate("ProfileAuth", "name email verified")
      .populate("Job", "title Description budget createdAt")
      .populate("Profile", "photo country currency getReviews jobposts ");

    return res.status(200).json(reviews);
  } catch (error) {
    return res.status(400).json(error);
  }
};

exports.getReview = (req, res) => {
  const review = req.review;
  return res.status(200).json({
    review,
  });
};

exports.updateReviewRequest = async (req, res) => {
  await Review.findByIdAndUpdate(
    req.review._id,
    { updateReview: true },
    { new: true }
  );
  return res.status(200).json({
    message: `Update review request send`,
  });
};

exports.updateReview = async (req, res) => {
  try {
    const { review, rating } = req.body;
    let data = {
      review,
      rating,
      updateReview: false,
    };
    const updatedReview = await Review.findByIdAndUpdate(req.review._id, data, {
      new: true,
    });
    return res.status(200).json({
      success: true,
      updatedReview,
    });
  } catch (error) {
    return res.status(400).json({
      error: "Fail to modify this review",
    });
  }
};
