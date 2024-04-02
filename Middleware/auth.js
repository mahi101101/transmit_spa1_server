const jwt = require("jsonwebtoken");
const ErrorHandler = require("../Utils/errorHandler");
const catchAsyncError = require("./catchAsyncError");
const User = require("../Models/userModel");

exports.isAuthenticated = catchAsyncError(async (req, res, next) => {
  const token = req.cookies;
  if (!token.token) {
    next(new ErrorHandler("Please login to acces this resource", 401));
  } else {
    const decodedData = jwt.verify(token.token, process.env.JWT_SECRET);

    req.user = await User.findById(decodedData.id);
  }
  next();
});