const mongoose = require("mongoose");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
require("dotenv").config();

//User schema
const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      minlength: 5,
      maxlength: 150,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minlength: 8,
    },
    profilePhoto: {
      type: Object,
      default: {
        url: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
        publicId: null,
      },
    },
    bio: {
      type: String,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    isAccountVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    //toJson and toObject will allow the virtual below to work without them it won't work
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);
// populate that written "belongs" to this profile when he gets his profile
// will add posts field to this User schema virtually "When needed" when user gets his profile
UserSchema.virtual("posts", {
  //references Post model
  ref: "Post",
  // foreign field should be in the referenced Post model
  foreignField: "user",
  // localField = foreignField because in Post model user field is an id so gets the posts with this user id
  localField: "_id",
});

// Generate Auth token jwt
// this refers to objects of this Userschema means the users
UserSchema.methods.generateAuthToken = function () {
  return jwt.sign(
    { id: this._id, isAdmin: this.isAdmin },
    process.env.JWT_SECRET
  );
};
//User model
const User = mongoose.model("User", UserSchema);

//validate register user
function validateRegisterUser(obj) {
  const schema = Joi.object({
    email: Joi.string().trim().min(5).max(150).required(),
    username: Joi.string().trim().min(2).max(100).required(),
    password: Joi.string().min(8).required(),
  });
  return schema.validate(obj);
}
//validate login user
function validateLoginUser(obj) {
  const schema = Joi.object({
    email: Joi.string().trim().min(5).max(150).required(),
    password: Joi.string().min(8).required(),
  });
  return schema.validate(obj);
}

//validate update user
function validateUpdateUser(obj) {
  const schema = Joi.object({
    username: Joi.string().trim().min(2).max(100),
    password: Joi.string().min(8),
    bio: Joi.string(),
  });
  return schema.validate(obj);
}
module.exports = {
  User,
  validateRegisterUser,
  validateLoginUser,
  validateUpdateUser,
};
