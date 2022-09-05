const Profile = require("../models/profile");
const cloudinary = require("cloudinary").v2;

exports.getProfile = (req, res) => {
  res.status(200).json(req.profile);
};

exports.getProfiles = async (req, res) => {
  const profiles = await Profile.find().populate("Auth", "name email varified");
  return res.status(200).json(profiles);
};

exports.updateProfile = async (req, res) => {
  try {
    const newData = {
      number: req.body.number,
      country: req.body.country,
      currency: req.body.currency,
      describeUserSelf: req.body.describeUserSelf,
      documentVerify: {
        documentName: req.body.documentName,
        documentNumber: req.body.documentNumber,
      },
      paymentVerify: req.body.paymentVerify,
    };
    if (req.files) {
      const profile = await Profile.findById(req.profile._id);
      const imageId = profile.photo.id;
      //delete phoro from cloudinary
      if (imageId) {
        await cloudinary.uploader.destroy(imageId);
      }
      //upload new photo
      let file = req.files.photo;
      result = await cloudinary.uploader.upload(file.tempFilePath, {
        folder: "jobportal",
        width: 200,
        crop: "scale",
      });

      newData.photo = {
        id: result.public_id,
        secure_url: result.secure_url,
      };
    }
    const profile = await Profile.findByIdAndUpdate(req.profile._id, newData, {
      new: true,
    });
    return res.status(200).json({
      profile,
    });
  } catch (error) {
    return res.status(400).json({
      error: "Fill atleast one field",
    });
  }
};
