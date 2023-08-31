const cloudinary = require("cloudinary");
require("dotenv").config();
//config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
// cloundinary upload image
const cloudinaryUploadImage = async (fileToUpload) => {
  try {
    const data = await cloudinary.uploader.upload(fileToUpload, {
      resource_type: "auto",
    });
    return data;
  } catch (error) {
    console.log(error);
    throw new Error("Internal Server Error (cloudinary)");
  }
};
// cloundinary Remove image removes single image
//public id comes from cloudinary response after we store it in the db in user account
const cloudinaryRemoveImage = async (imagePublicID) => {
  try {
    const result = await cloudinary.uploader.destroy(imagePublicID);
    return result;
  } catch (error) {
    console.log(error);
    throw new Error("Internal Server Error (cloudinary)");
  }
};
// cloundinary Remove image removes Multiple images
//public ids => array of publicIds for images that needs to be removed
const cloudinaryRemoveMultipleImages = async (publicIds) => {
  try {
    // this line is from cloudinary "fixed"
    const result = await cloudinary.v2.api.delete_resources(publicIds);
    return result;
  } catch (error) {
    console.log(error);
    throw new Error("Internal Server Error (cloudinary)");
  }
};
module.exports = {
  cloudinaryUploadImage,
  cloudinaryRemoveImage,
  cloudinaryRemoveMultipleImages,
};
