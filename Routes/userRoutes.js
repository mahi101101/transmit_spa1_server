const express = require("express");
const { registerUser } = require("../Controllers/userController");

const router = express();

// Routes
router.route("/registeruser").post(registerUser);

module.exports = router;
