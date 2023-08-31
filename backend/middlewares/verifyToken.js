const jwt = require("jsonwebtoken");
require("dotenv").config();
// verify token the, third parameter here "next" takes a function
function verifyToken(req, res, next) {
  const authToken = req.headers.authorization;
  if (authToken) {
    const token = authToken.split(" ")[1];
    try {
      // decode token payload we gave user when he logged in and the private key
      const decodedPayload = jwt.verify(token, process.env.JWT_SECRET);
      // make new object in req and give it payload
      req.user = decodedPayload;
      //next continue the request and give data
      next();
    } catch (error) {
      return res.status(401).json({ message: "Inavlid token, access denied" });
    }
  } else {
    res.status(401).json({ message: "No token provided, access denied" });
  }
}
// verify token And Admin
function verifyTokenAndAdmin(req, res, next) {
  // next is a function so we don't repeat the code in verify token
  verifyToken(req, res, () => {
    if (req.user.isAdmin) {
      next();
    } else {
      return res
        .status(403)
        .json({ message: "Not allowed, You are not an Admin" });
    }
  });
}
// verify token And Only user himself
function verifyTokenAndOnlyUser(req, res, next) {
  // next is a function so we don't repeat the code in verify token
  verifyToken(req, res, () => {
    if (req.user.id === req.params.id) {
      next();
    } else {
      return res.status(403).json({
        message: "Not allowed, Only user himself can update his profile",
      });
    }
  });
}
// verify token And Authorization
function verifyTokenAndAuthorization(req, res, next) {
  verifyToken(req, res, () => {
    if (req.user.id === req.params.id || req.user.isAdmin) {
      next();
    } else {
      return res.status(403).json({
        message: "Not allowed, Only user himself or Admin",
      });
    }
  });
}
module.exports = {
  verifyToken,
  verifyTokenAndAdmin,
  verifyTokenAndOnlyUser,
  verifyTokenAndAuthorization,
};
