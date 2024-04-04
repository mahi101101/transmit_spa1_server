const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Please Enter Your Username"],
      unique: true,
      minLength: [4, "Username should have more than 1 characters"],
    },
    name: {
      first_name: {
        type: String,
        required: [true, "Please Enter Your First Name"],
        maxLength: [30, "Name cannot exceed 30 characters"],
        minLength: [1, "Name should have more than 1 characters"],
      },
      last_name: {
        type: String,
        required: [true, "Please Enter Your Last Name"],
        maxLength: [30, "Name cannot exceed 30 characters"],
        minLength: [1, "Name should have more than 1 characters"],
      },
    },
    email: {
      type: String,
      required: [true, "Please Enter Your Email"],
      unique: true,
      validate: [validator.isEmail, "Please Enter a valid Email"],
    },
    address: {
      country: {
        type: String,
        required: [true, "Please Enter Your Country"],
      },
    },
    phone_number: {
      type: String,
      required: [true, "Please Enter Your Phone Number"],
      unique: true,
      validate: [validator.isMobilePhone, "Please Enter a valid Phone Number"],
      options: [{ strictMode: true }],
    },
    credentials: {
      password: {
        type: String,
        required: [true, "Please Enter Your Password"],
        minLength: [8, "Password should be greater than 8 characters"],
        validate: [
          validator.isStrongPassword,
          "Password should be greater than 8 characters, contain a lowercase letter, a uppercase letter and a special character",
        ],
        select: false,
      },
      force_replace: { type: Boolean, default: false },
    },
    custom_data: {
      usertype: { type: String, default: "user" },
    },
  },
  { _id: false }
);

userSchema.set("strict", "throw");
const User = mongoose.model("User", userSchema);
module.exports = User;

// // Hashing Password
// userSchema.pre("save", async function (next) {
//   if (!this.isModified("password")) {
//     next();
//   }
//   this.password = await bcrypt.hash(this.password, 10);
// });

// // JWT Token
// userSchema.methods.getJWTToken = function () {
//   return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
//     expiresIn: process.env.JWT_EXPIRE,
//   });
// };

// // Compare Password
// userSchema.methods.comparePassword = async function (enteredPassword) {
//   return await bcrypt.compare(enteredPassword, this.password);
// };
