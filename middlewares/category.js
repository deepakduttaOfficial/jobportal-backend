const Category = require("../models/category");

exports.getCategoryById = async (req, res, next, id) => {
  try {
    const category = await Category.findById(id);
    if (!category) {
      return res.status(400).json({
        error: "Category not found",
      });
    }
    req.category = category;
    next();
  } catch (error) {
    return res.status(400).json({
      error: "Invalid ID",
    });
  }
};

exports.isMakeCategory = (req, res, next) => {
  const { authId, profileId } = req.auth;
  const { Profile, Auth } = req.category;
  if (authId != Auth && profileId != Profile) {
    return res.status(400).json({
      error: "You can not update this category",
    });
  }
  next();
};
