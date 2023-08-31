const asyncHandler = require("express-async-handler");
const { Comment } = require("../models/Comment");
const {
  Post,
  validateCreatePost,
  validateUpdatePost,
} = require("../models/Post");
const path = require("path");
const fs = require("fs");
const {
  cloudinaryUploadImage,
  cloudinaryRemoveImage,
} = require("../utils/cloudinary");

/** ------------------------------------------------
 * @desc Create New Post
 * @route /api/posts
 * @method POST
 * @access private (only logged in user) 
 -------------------------------------------------*/
module.exports.createPostCtrl = asyncHandler(async (req, res) => {
  // 1.VALIDATION FOR IMAGE
  if (!req.file) {
    return res.status(400).json({ message: "No image provided" });
  }
  // 2.VALIDATION FOR DATA
  const { error } = validateCreatePost(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  // 3.UPLOAD PHOTO
  const imagePath = path.join(__dirname, `../images/${req.file.filename}`);
  const result = await cloudinaryUploadImage(imagePath);
  // 4.CREATE NEW POST AND SAVE IT TO DB
  // with this method no need for save() it does it on it's own the new Post needs await.save() here no
  const post = await Post.create({
    title: req.body.title,
    description: req.body.description,
    category: req.body.category,
    //because the user is logged in already
    user: req.user.id,
    image: {
      url: result.secure_url,
      publicId: result.public_id,
    },
  });
  // 5.SEND RESPONSE TO CLIENT
  res.status(201).json(post);
  // 6.REMOVE IMAGE FROM THE SERVER OUR "IMAGES" FOLDER
  fs.unlinkSync(imagePath);
});
/** ------------------------------------------------
 * @desc Get All Posts
 * @route /api/posts
 * @method GET
 * @access public  
 -------------------------------------------------*/
module.exports.getAllPostsCtrl = asyncHandler(async (req, res) => {
  const POSTS_PER_PAGE = 3;
  const { pageNumber, category } = req.query;
  let posts;
  if (pageNumber) {
    posts = await Post.find()
      .skip((pageNumber - 1) * POSTS_PER_PAGE)
      .limit(POSTS_PER_PAGE)
      .sort({ createdAt: -1 })
      .populate("user", ["-password"]);
  } else if (category) {
    posts = await Post.find({ category })
      .sort({ createdAt: -1 })
      .populate("user", ["-password"]);
  } else {
    // will sort them from the newest to the oldest
    posts = await Post.find()
      .sort({ createdAt: -1 })
      //gets all user info from db but not the password
      .populate("user", ["-password"]);
  }
  res.status(200).json(posts);
});
/** ------------------------------------------------
 * @desc Get single Post
 * @route /api/post/:id
 * @method GET
 * @access public  
 -------------------------------------------------*/
module.exports.getSinglePostCtrl = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id)
    .populate("user", ["-password"])
    //.populate("comments"); => because we named it comments in virtual in the PostSchema
    .populate("comments");
  if (!post) {
    return res.status(404).json({ message: "Post not found" });
  }
  return res.status(200).json(post);
});
/** ------------------------------------------------
 * @desc Get Posts count "length"
 * @route /api/post/count
 * @method GET
 * @access public  
 -------------------------------------------------*/
module.exports.getPostCountCtrl = asyncHandler(async (req, res) => {
  const count = await Post.count();

  return res.status(200).json(count);
});
/** ------------------------------------------------
 * @desc Delete Post
 * @route /api/post/:id
 * @method DELETE
 * @access private (only admin or post owner)  
 -------------------------------------------------*/
module.exports.deletePostCtrl = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) {
    return res.status(404).json({ message: "Post not found" });
  }
  // remember we added user field on post which is an id user.id is objectId in db
  if (req.user.isAdmin || req.user.id === post.user.toString()) {
    await Post.findByIdAndDelete(req.params.id);
    //removes post image from cloudinary
    await cloudinaryRemoveImage(post.image.publicId);
    res.status(200).json({
      message: "Post has been deleted successfully",
      postId: post._id,
    });
  } else {
    res.status(403).json({
      message: "Access denied, forbidden",
    });
  }
  // Delete All Comments That Belongs To This Post because comment has post id in it
  await Comment.deleteMany({ postId: post._id });
});

/** ------------------------------------------------
 * @desc Update Post
 * @route /api/post/:id
 * @method PUT
 * @access private (only post owner)  
 -------------------------------------------------*/
module.exports.updatePostCtrl = asyncHandler(async (req, res) => {
  // validation
  const { error } = validateUpdatePost(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  const post = await Post.findById(req.params.id);
  if (!post) {
    return res.status(404).json({ message: "Post not found" });
  }
  //check if this post belong to logger id user
  if (req.user.id !== post.user.toString()) {
    return res
      .status(403)
      .json({ message: "Access denied, you are not allowed" });
  }
  const updatedPost = await Post.findByIdAndUpdate(
    req.params.id,
    {
      //  looks for what updated from those and set it
      $set: {
        title: req.body.title,
        description: req.body.description,
        category: req.body.category,
      },
    },
    { new: true }
  ).populate("user", ["-password"]);
  res.status(200).json(updatedPost);
});
/** ------------------------------------------------
 * @desc Update Post Image
 * @route /api/posts/update-image/:id
 * @method PUT
 * @access private (only post owner)  
 -------------------------------------------------*/
module.exports.updatePostImageCtrl = asyncHandler(async (req, res) => {
  // 1. Validation
  if (!req.file) {
    return res.status(400).json({ message: "no image provided" });
  }

  // 2. Get the post from DB and check if post exist
  const post = await Post.findById(req.params.id);
  if (!post) {
    return res.status(404).json({ message: "post not found" });
  }

  // 3. Check if this post belong to logged in user
  if (req.user.id !== post.user.toString()) {
    return res
      .status(403)
      .json({ message: "access denied, you are not allowed" });
  }

  // 4. Delete the old image
  await cloudinaryRemoveImage(post.image.publicId);

  // 5. Upload new photo
  const imagePath = path.join(__dirname, `../images/${req.file.filename}`);
  const result = await cloudinaryUploadImage(imagePath);

  // 6. Update the image field in the db
  const updatedPost = await Post.findByIdAndUpdate(
    req.params.id,
    {
      $set: {
        image: {
          url: result.secure_url,
          publicId: result.public_id,
        },
      },
    },
    { new: true }
  );

  // 7. Send response to client
  res.status(200).json(updatedPost);

  // 8. Remove image from the server
  fs.unlinkSync(imagePath);
});
/** ------------------------------------------------
 * @desc toggle Like
 * @route /api/posts/like/:id "post id"
 * @method PUT
 * @access private (only post logged in user)  
 -------------------------------------------------*/
//in our model post has likes array, when user like a post we will add userId to pos likes array
//like social media app if the user already liked post when you click another time remove the like "toggle"
module.exports.toggleLikeCtrl = asyncHandler(async (req, res) => {
  const loggedInUser = req.user.id;
  const { id: postId } = req.params;

  let post = await Post.findById(postId);
  if (!post) {
    return res.status(404).json({ message: "Post not found" });
  }
  // user.toString() => an Id of people who liked the post
  const isPostAlreadyLiked = post.likes?.find(
    (user) => user.toString() === loggedInUser
  );
  if (isPostAlreadyLiked) {
    post = await Post.findByIdAndUpdate(
      postId,
      {
        //$pull in mongoose can remove value from an array removes the like of the user
        $pull: { likes: loggedInUser },
      },
      { new: true }
    );
  } else {
    post = await Post.findByIdAndUpdate(
      postId,
      {
        //$push in mongoose can add value to an array add  the like of the user liked by his Id
        $push: { likes: loggedInUser },
      },
      { new: true }
    );
  }
  res.status(200).json(post);
});
