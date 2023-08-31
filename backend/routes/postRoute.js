const router = require("express").Router();
const {
  createPostCtrl,
  getAllPostsCtrl,
  getSinglePostCtrl,
  getPostCountCtrl,
  deletePostCtrl,
  updatePostCtrl,
  updatePostImageCtrl,
  toggleLikeCtrl,
} = require("../controllers/postController");
const photoUpload = require("../middlewares/photoUpload");
const { verifyToken } = require("../middlewares/verifyToken");
const vaildateObjecId = require("../middlewares/vaildateObjecId");

// /api/posts
router
  .route("/")
  .post(verifyToken, photoUpload.single("image"), createPostCtrl)
  .get(getAllPostsCtrl);
// /api/posts/count
router.route("/count").get(getPostCountCtrl);
// /api/posts/:id
router
  .route("/:id")
  .get(vaildateObjecId, getSinglePostCtrl)
  .delete(vaildateObjecId, verifyToken, deletePostCtrl)
  .put(vaildateObjecId, verifyToken, updatePostCtrl);

// /api/posts/update-image/:id
router
  .route("/update-image/:id")
  .put(
    vaildateObjecId,
    verifyToken,
    photoUpload.single("image"),
    updatePostImageCtrl
  );
// /api/posts/likes/:id
router.route("/like/:id").put(vaildateObjecId, verifyToken, toggleLikeCtrl);
module.exports = router;
