const router = require("express").Router();
const {
  createCategoryCtrl,
  getAllCategoriesCtrl,
  deleteCategoryCtrl,
} = require("../controllers/categoriesController");
const { verifyTokenAndAdmin } = require("../middlewares/verifyToken");
const vaildateObjecId = require("../middlewares/vaildateObjecId");

// /api/categories
router
  .route("/")
  .post(verifyTokenAndAdmin, createCategoryCtrl)
  .get(getAllCategoriesCtrl);
// /api/categories/:id
router
  .route("/:id")
  .delete(vaildateObjecId, verifyTokenAndAdmin, deleteCategoryCtrl);
module.exports = router;
