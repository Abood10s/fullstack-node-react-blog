const router = require("express").Router();
const {
  getAllUsersCtrl,
  getUserProfileCtrl,
  updateUserProfileCtrl,
  getUsersCountCtrl,
  profilePhotoUploadCtrl,
  deleteUserProfileCtrl,
} = require("../controllers/usersController");
const photoUpload = require("../middlewares/photoUpload");
const vaildateObjecId = require("../middlewares/vaildateObjecId");
const {
  verifyTokenAndAdmin,
  verifyTokenAndOnlyUser,
  verifyToken,
  verifyTokenAndAuthorization,
} = require("../middlewares/verifyToken");

//verifyTokenAndAdmin is middleware and it's next function determines whether to give the client the requested data from the route or no according to the middleware login
// /api/users/profile
router.route("/profile").get(verifyTokenAndAdmin, getAllUsersCtrl);

// /api/users/profile/:id
router
  .route("/profile/:id")
  .get(vaildateObjecId, getUserProfileCtrl)
  .put(vaildateObjecId, verifyTokenAndOnlyUser, updateUserProfileCtrl)
  .delete(vaildateObjecId, verifyTokenAndAuthorization, deleteUserProfileCtrl);
// /api/users/profile/profile-photo-upload
//photoUpload.single("image") this is the multer work to give to images folder to cloudinary take it from the images folder then passes it to cloudinary single means 1 image only allowed to upload and image the name coming from the client and in postman
router
  .route("/profile/profile-photo-upload")
  .post(verifyToken, photoUpload.single("image"), profilePhotoUploadCtrl);

// /api/users/count
router.route("/count").get(verifyTokenAndAdmin, getUsersCountCtrl);
module.exports = router;
