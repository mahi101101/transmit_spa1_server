const express = require("express");
const {
  registerUser,
  loginUser,
  sendEmailVerification,
  redirect,
  emailValidation,
  getUserDetailsEmail,
} = require("../Controllers/userController");

const router = express();

// Routes
router.route("/registeruser").post(registerUser);
router.route("/loginuser").post(loginUser);

router.route("/sendemail").post(sendEmailVerification);
router.route("/redirect").post(redirect);
router.route("/validateemail").post(emailValidation);

router.route("/user/details/email/:mail").get(getUserDetailsEmail);

module.exports = router;
