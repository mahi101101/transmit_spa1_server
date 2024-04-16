const express = require("express");
const {
  registerUser,
  loginUser,
  sendEmailVerification,
  redirect,
  emailValidation,
  getUserDetailsEmail,
  resetPassword,
  forgotPassword,
  createRegSession,
  getUserDetailsUsername,
  createForgotPassSession,
} = require("../Controllers/userController");

const router = express();

// Routes
router.route("/registeruser").post(registerUser);
router.route("/loginuser").post(loginUser);
router.route("/sendemail").post(sendEmailVerification);
router.route("/redirect").post(redirect);
router.route("/validateemail").post(emailValidation);

router.route("/user/password/reset").post(resetPassword);
router.route("/user/Password/forgot").put(forgotPassword);

router.route("/registeruser/getregsession/:mail").get(createRegSession);
router.route("/user/details/email/:mail").get(getUserDetailsEmail);
router.route("/user/details/username/:username").get(getUserDetailsUsername);
router
  .route("/user/password/forgot/getsession/:email")
  .get(createForgotPassSession);

module.exports = router;
