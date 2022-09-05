const Category = require("../models/category");

exports.createCategory = async (req, res) => {
  const { authId, profileId } = req.auth;
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({
      error: "Category name must be required",
    });
  }

  const category = await Category.create({
    Profile: profileId,
    Auth: authId,
    categoryName: name,
  });

  return res.status(200).json({
    category,
  });
};

exports.getCategory = async (req, res) => {
  return res.status(200).json(req.category);
};

exports.getCategories = async (req, res) => {
  const categories = await Category.find();
  if (!categories) {
    return res.status(400).json({
      error: "Currently no category was found",
    });
  }

  return res.status(200).json(categories);
};

exports.updateCategory = async (req, res) => {
  const { name } = req.body;
  if (name.length === 0) {
    return res.status(400).json({
      error: "Name must be required",
    });
  }
  const category = await Category.findByIdAndUpdate(
    req.category._id,
    { categoryName: name },
    {
      new: true,
    }
  );
  return res.status(200).json({
    category,
  });
};

exports.deleteCategory = async (req, res) => {
  const category = req.category;
  deleteCategory = await category.remove();
  return res.status(200).json({
    message: `${deleteCategory.categoryName} category was deleted`,
  });
};
// const category = req.category;
// category.remove((err, category) => {
//   if (err && !category) {
//     return res.status(400).json({
//       error: "Something worng",
//     });
//   }
//   return res.status(200).json({
//     message: `${category.categoryName} category was deleted`,
//   });
// });
