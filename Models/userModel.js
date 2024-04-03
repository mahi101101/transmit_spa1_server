const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userSchema = {
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
  },
  credentials: {
    password: {
      type: String,
      required: [true, "Please Enter Your Password"],
      minLength: [8, "Password should be greater than 8 characters"],
      select: false,
    },
  },
  custom_data: {
    usertype: { type: String, default: "user" },
  },
};

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
