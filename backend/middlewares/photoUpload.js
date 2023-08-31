const path = require("path");
const multer = require("multer");

// we should determine destination the place we will store the images
// Photo storage
const PhotoStorage = multer.diskStorage({
  // cb => callback function first param is error message
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../images"));
  },
  filename: function (re, file, cb) {
    if (file) {
      // from windows adds ":" but we will replace it with "-"
      cb(null, new Date().toISOString().replace(/:/g, "-") + file.originalname);
    } else {
      // false => don't write name for the file
      cb(null, false);
    }
  },
});
//photo upload middleware
const photoUpload = multer({
  storage: PhotoStorage,
  //checks type of file
  fileFilter: function (req, file, cb) {
    // if you want more specify in image type you can write startsWith("image/png") ...
    if (file.mimetype.startsWith("image")) {
      //true here means do the upload
      cb(null, true);
    } else {
      //false means do not upload the file
      cb({ message: "Unsupported file format" }, false);
    }
  },
  // file "image" size
  limits: { fileSize: 1024 * 1024 * 2 }, // 2 megabyte
  //if you want the size to be 5 megabyte or 3 just multiply by it like:{ fileSize: 1024 * 1024 *5 },
});
module.exports = photoUpload;
