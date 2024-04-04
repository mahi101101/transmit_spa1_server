const Errorhandler = require("../Utils/errorHandler");
const catchAsyncErrors = require("../Middleware/catchAsyncError");
const User = require("../Models/userModel");
const sendToken = require("../Utils/jwtToken");
const {
  getClientToken,
  createTransmitUser,
  loginTransmitUser,
  sendEmailVerificationClient,
  validateEmailPasscode,
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

// Send Email for Verification
exports.sendEmailVerification = catchAsyncErrors(async (req, res, next) => {
  const { email } = req.body;

  const token = await getClientToken();
  const resp = await sendEmailVerificationClient(token, email);
  const data = await resp.json();

  console.log("Email sent: ", data);

  if (!resp.ok) {
    res.status(response.status).json({ error: "Error sending email" });
  }

  res.status(resp.status).json({ message: data });
});

// Redirect
exports.redirect = catchAsyncErrors(async (req, res, next) => {
  console.log("Redirecting...", req.body);
  res.send("Redirecting...");
});

// Email Validation
exports.emailValidation = catchAsyncErrors(async (req, res, next) => {
  const { email, passcode } = req.body;

  if (!passcode) {
    return new Errorhandler("Passcode is important", 400);
  }
  const token = await getClientToken();
  const resp = await validateEmailPasscode(token, email, passcode);
  const data = await resp.json();

  console.log(data);
  if (data.error_code) {
    res
      .status(data.error_code)
      .json({ message: "Email verification failed", data });
  }
  res.status(200).json({ message: "Email varified succusfully", data });
});

// Get User Details
exports.getUserDetails = catchAsyncErrors(async (req, res, next) => {});

// Get Login History
exports.getLoginHistory = catchAsyncErrors(async (req, res, next) => {});

// Delete User
exports.deleteUser = catchAsyncErrors(async (req, res, next) => {});
