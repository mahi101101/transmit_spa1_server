const Errorhandler = require("../Utils/errorHandler");
const catchAsyncErrors = require("../Middleware/catchAsyncError");
const User = require("../Models/userModel");
const sendToken = require("../Utils/jwtToken");
const {
  getClientToken,
  createTransmitUser,
  loginTransmitUser,
} = require("./clientController");

// Register User
exports.registerUser = catchAsyncErrors(async (req, res, next) => {

  const new_user = new User(req.body);
  await new_user.validate();
  
  const token = await getClientToken();
  const resp = await createTransmitUser(token, new_user);
  const data = await resp.json();

  // console.log("Response from API:", data);

  res.status(resp.status).json({ success: true, data });
});

// Login User
exports.loginUser = catchAsyncErrors(async (req, res, next) => {
  const { username, password } = req.body;

  const new_user = {
    username: username,
    password: password,
  };
  const token = await getClientToken();
  const resp = await loginTransmitUser(token, new_user);

  const data = await resp.json();
  res.status(resp.status).json({ success: true, data });
});

// Logout User
exports.logoutUser = catchAsyncErrors(async (req, res, next) => {});

// Forgot Password
exports.forgotPassword = catchAsyncErrors(async (req, res, next) => {});

// Reset Password
exports.resetPassword = catchAsyncErrors(async (req, res, next) => {});

// Email Verification
exports.emailVerification = catchAsyncErrors(async (req, res, next) => {});

// Get User Details
exports.getUserDetails = catchAsyncErrors(async (req, res, next) => {});

// Get Login History
exports.getLoginHistory = catchAsyncErrors(async (req, res, next) => {});

// Delete User
exports.deleteUser = catchAsyncErrors(async (req, res, next) => {});
