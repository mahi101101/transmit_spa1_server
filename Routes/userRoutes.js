const express = require("express");
const { registerUser, loginUser } = require("../Controllers/userController");

const router = express();

// Routes
router.route("/registeruser").post(registerUser);
router.route("/loginuser").post(loginUser);

module.exports = router;
