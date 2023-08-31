const router = require("express").Router();
const {
  createCommentCtrl,
  getAllCommentsCtrl,
  deleteCommentCtrl,
  updateCommentCtrl,
} = require("../controllers/commentsController");
const {
  verifyToken,
  verifyTokenAndAdmin,
} = require("../middlewares/verifyToken");
const vaildateObjecId = require("../middlewares/vaildateObjecId");

// api/comments
router
  .route("/")
  .post(verifyToken, createCommentCtrl)
  .get(verifyTokenAndAdmin, getAllCommentsCtrl);

// api/comments/:id
router
  .route("/:id")
  .delete(vaildateObjecId, verifyToken, deleteCommentCtrl)
  .put(vaildateObjecId, verifyToken, updateCommentCtrl);

module.exports = router;
