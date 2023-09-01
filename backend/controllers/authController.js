const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const {
  User,
  validateRegisterUser,
  validateLoginUser,
} = require("../models/User");

/** ------------------------------------------------
 * @desc Register new user 
 * @route /api/auth/register
 * @method POST
 * @access public 
 -------------------------------------------------*/

module.exports.registerUserCtrl = asyncHandler(async (req, res) => {
  // validation
  const { error } = validateRegisterUser(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  // check is user already exist
  let user = await User.findOne({ email: req.body.email });
  if (user) {
    return res.status(400).json({ message: "this user already exists" });
  }
  // hashing the password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);
  // create new user then save it in the DB
  user = new User({
    username: req.body.username,
    email: req.body.email,
    password: hashedPassword,
  });
  await user.save();
  // send Response to Client
  res
    .status(201)
    .json({ message: "User Registered Successfully Please Login" });
});

/** ------------------------------------------------
 * @desc Login user 
 * @route /api/auth/login
 * @method POST
 * @access public 
 -------------------------------------------------*/

module.exports.loginUserCtrl = asyncHandler(async (req, res) => {
  // validation
  const { error } = validateLoginUser(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  //check is user exists
  let user = await User.findOne({ email: req.body.email });
  if (!user) {
    return res.status(400).json({ message: "Invalid email or password" });
  }
  // check the password after decrypting it since we encrypt it in register
  const isPasswordMatch = await bcrypt.compare(
    req.body.password,
    user.password
  );
  if (!isPasswordMatch) {
    return res.status(400).json({ message: "Invalid email or password" });
  }
  // generate token (jwt)
  const token = user.generateAuthToken();
  // send Response to Client
  res.status(200).json({
    _id: user._id,
    isAdmin: user.isAdmin,
    profilePhoto: user.profilePhoto,
    token,
    username: user.username,
  });
});
