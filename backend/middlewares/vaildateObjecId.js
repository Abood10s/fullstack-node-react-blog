const mongoose = require("mongoose");

module.exports = (req, res, next) => {
  // if id syntax doesn't match id syntax in the database before sending request to database
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: "Invalid Id" });
  }
  next();
};
