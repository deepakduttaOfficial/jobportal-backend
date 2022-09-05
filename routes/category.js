const express = require("express");
const {
  createCategory,
  getCategory,
  getCategories,
  updateCategory,
  deleteCategory,
} = require("../controllers/category");
const { getCategoryById, isMakeCategory } = require("../middlewares/category");
const {
  getProfileById,
  isAdmin,
  isSignin,
  isAuthenticate,
} = require("../middlewares/profile");
const router = express.Router();

router.param("profileId", getProfileById);
router.param("categoryId", getCategoryById);

// Ceate Category
router
  .route("/category/create/:profileId")
  .post(isSignin, isAuthenticate, isAdmin, createCategory);

//  reade category
router.route("/category/get/:categoryId").get(getCategory);
router.route("/categorys/get").get(getCategories);

//Update catgory
router
  .route("/category/update/:profileId/:categoryId")
  .put(isSignin, isAuthenticate, isAdmin, isMakeCategory, updateCategory);

// Delete category
router
  .route("/category/delete/:profileId/:categoryId")
  .delete(isSignin, isAuthenticate, isAdmin, isMakeCategory, deleteCategory);

module.exports = router;
