const Errorhandler = require("../Utils/errorHandler");
const catchAsyncErrors = require("../Middleware/catchAsyncError");
const User = require("../Models/userModel");
const uuid = require("uuid");
const sendToken = require("../Utils/jwtToken");
const {
  getClientToken,
  createTransmitUser,
  loginTransmitUser,
  sendEmailVerificationClient,
  validateEmailPasscode,
  getUserByEmail,
  getResetToken,
  resetThePassword,
  forgotPassword,
  getUserDetailsByUsername,
  getTokenforSocialLogin,

} = require("./clientController");
const OtpRequests = new Map();
const tokenList = new Map();
const regTokens = new Map();
const ForgotSession = new Map();

// Register User
exports.registerUser = catchAsyncErrors(async (req, res, next) => {

  const new_user = new User(req.body);
  await new_user.validate();

  const token = tokenList.get("accessToken")
    ? tokenList.get("accessToken")
    : await getClientToken();
  if (tokenList.get("accessToken") !== token) {
    tokenList.set("accessToken", token);
    setTimeout(() => {
      tokenList.delete("accessToken");
    }, 59 * 60 * 1000);
  }

  const resp = await createTransmitUser(token, new_user);
  const data = await resp.json();

  if (resp.status !== 201) {
    res.status(resp.status).json({ success: false, message: data.message });
  }

  res.status(resp.status).json({ success: true, message: "User Created" });
});

// Create Session for user registration
exports.createRegSession = catchAsyncErrors(async (req, res, next) => {
  const email = req.params.mail;

  if (regTokens.get(email)) {
    res.status(401).json({
      success: false,
      message: "Unauthorized. Please try again.",
    });
  } else {
    const regtoken = uuid.v4();

    regTokens.set(email, regtoken);

    setTimeout(() => {
      regTokens.delete(email);
    }, 60 * 60 * 1000);

    res.status(200).json({
      success: true,
      message: "Registration session generated",
      token: regtoken,
    });
  }
});

// Login User
exports.loginUser = catchAsyncErrors(async (req, res, next) => {
  const { username, password } = req.body;

  const new_user = {
    username: username,
    password: password,
  };

  const token = tokenList.get("accessToken")
    ? tokenList.get("accessToken")
    : await getClientToken();
  if (tokenList.get("accessToken") !== token) {
    tokenList.set("accessToken", token);
    setTimeout(() => {
      tokenList.delete("accessToken");
    }, 59 * 60 * 1000);
  }

  const resp = await loginTransmitUser(token, new_user);

  const data = await resp.json();
  if (data.error_code === 401) {
    res.status(resp.status).json({ success: false, message: data.message });
  }

  res
    .status(resp.status)
    .json({ success: true, message: "Successfully Logged In", data });
});

// Logout User
exports.logoutUser = catchAsyncErrors(async (req, res, next) => {});

// Forgot Password
exports.forgotPassword = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;

  const token = tokenList.get("accessToken")
    ? tokenList.get("accessToken")
    : await getClientToken();
  if (tokenList.get("accessToken") !== token) {
    tokenList.set("accessToken", token);
    setTimeout(() => {
      tokenList.delete("accessToken");
    }, 59 * 60 * 1000);
  }

  const userinfo = await getUserByEmail(token, email);
  const data = await userinfo.json();

  const userId = data.result.user_id;

  const resp = await forgotPassword(userId, password, token);
  const data2 = await resp.json();

  if (data2.error_code) {
    res.status(resp.status).json({ success: false, message: data2.message });
  }
  res.status(resp.status).json({ success: true, message: data2.message });
});

// Create Session for user pass forgot
exports.createForgotPassSession = catchAsyncErrors(async (req, res, next) => {
  const email = req.params.email;

  if (ForgotSession.get(email)) {
    res.status(401).json({
      success: false,
      message: "Unauthorized. Please try again.",
    });
  } else {
    const ForgotSessionToken = uuid.v4();

    ForgotSession.set(email, ForgotSessionToken);

    setTimeout(() => {
      ForgotSession.delete(email);
    }, 2 * 60 * 1000);

    res.status(200).json({
      success: true,
      message: "Password Reset session generated",
      token: ForgotSessionToken,
    });
  }
});

// Reset Password
exports.resetPassword = catchAsyncErrors(async (req, res, next) => {
  const { username, password, new_password } = req.body;
  const response = await getResetToken(username, password);
  const data = await response.json();

  if (!data || !data.result) {
    return res
      .status(response.status)
      .json({ success: false, message: data.message });
  }

  const response2 = await resetThePassword(data.result, new_password);
  const data2 = await response2.json();

  if (data2.error_code) {
    res
      .status(response2.status)
      .json({ success: false, message: data2.message.join(", ") });
  }

  res.status(response2.status).json({ success: true, message: data2.message });
});

// Send Email for Verification
exports.sendEmailVerification = catchAsyncErrors(async (req, res, next) => {
  const { email } = req.body;

  if (OtpRequests.has(email)) {
    return res.status(429).json({
      success: false,
      message: "Please wait before requesting another OTP",
    });
  }

  OtpRequests.set(email, Date.now());

  const token = tokenList.get("accessToken")
    ? tokenList.get("accessToken")
    : await getClientToken();
  if (tokenList.get("accessToken") !== token) {
    tokenList.set("accessToken", token);
    setTimeout(() => {
      tokenList.delete("accessToken");
    }, 59 * 60 * 1000);
  }

  setTimeout(() => {
    OtpRequests.delete(email); // Remove the entry from the cache after expiration
  }, 2 * 60 * 1000);

  const resp = await sendEmailVerificationClient(token, email);
  const data = await resp.json();

  // console.log("Email sent: ", data);

  if (!resp.ok) {
    res
      .status(resp.status)
      .json({ success: false, message: "Error sending email" });
  }

  res.status(resp.status).json({ success: true, message: data.message });
});

// Redirect
exports.redirect = catchAsyncErrors(async (req, res, next) => {
  const authCode = req.query.code;

  const result = await getTokenforSocialLogin(authCode);
  const data = await result.json();

  if (result.status == 200) {
    const jsonData = JSON.stringify(data);
    res
      .status(result.status)
      .redirect(
        "https://hostpc.com:3000/redirect?status=" +
          result.status +
          "&data=" +
          jsonData
      );
  } else {
    res
      .status(result.status)
      .redirect("https://hostpc.com:3000/login?status=" + result.status);
  }
});

// Email Validation
exports.emailValidation = catchAsyncErrors(async (req, res, next) => {
  const { email, passcode } = req.body;

  if (!passcode) {
    return new Errorhandler("Passcode is important", 400);
  }
  const token = tokenList.get("accessToken")
    ? tokenList.get("accessToken")
    : await getClientToken();
  if (tokenList.get("accessToken") !== token) {
    tokenList.set("accessToken", token);
    setTimeout(() => {
      tokenList.delete("accessToken");
    }, 59 * 60 * 1000);
  }
  const resp = await validateEmailPasscode(token, email, passcode);
  const data = await resp.json();

  // console.log(data);
  if (data.error_code) {
    res
      .status(data.error_code)
      .json({ message: "Email verification failed", data });
  }
  res.status(200).json({ message: "Email verified sucessfully", data });
});

// Get User Details - email
exports.getUserDetailsEmail = catchAsyncErrors(async (req, res, next) => {
  const email = req.params.mail;
  const token = tokenList.get("accessToken")
    ? tokenList.get("accessToken")
    : await getClientToken();
  if (tokenList.get("accessToken") !== token) {
    tokenList.set("accessToken", token);
    setTimeout(() => {
      tokenList.delete("accessToken");
    }, 59 * 60 * 1000);
  }
  const resp = await getUserByEmail(token, email);
  const data = await resp.json();

  if (resp.status === 404 || resp.status === 400) {
    res.status(resp.status).json({
      success: false,
      message: "Could not fetch User Details",
      message: data.message,
    });
  }

  res.status(resp.status).json({
    success: true,
    message: "Fetched User Details Successfully",
    data,
  });
});

// Get User Details - username
exports.getUserDetailsUsername = catchAsyncErrors(async (req, res, next) => {
  const username = req.params.username;
  const token = tokenList.get("accessToken")
    ? tokenList.get("accessToken")
    : await getClientToken();
  if (tokenList.get("accessToken") !== token) {
    tokenList.set("accessToken", token);
    setTimeout(() => {
      tokenList.delete("accessToken");
    }, 59 * 60 * 1000);
  }
  const resp = await getUserDetailsByUsername(username, token);
  const data = await resp.json();

  if (resp.status === 404 || resp.status === 400) {
    res.status(resp.status).json({
      success: false,
      message: "Could not fetch User Details",
      message: data.message,
    });
  }

  res.status(resp.status).json({
    success: true,
    message: "Fetched User Details Successfully",
    data,
  });
});

// Social login
exports.socialLogin = catchAsyncErrors(async (req, res, next) => {
  const clientId = process.env.CLIENT_ID;
  const redirectUri = process.env.REDIRECT_URI;

  const queryParams = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    create_new_user: "true",
  });

  // Redirect the user to Google's OAuth dialog with the constructed query parameters
  await res.redirect(
    `${process.env.GOOGLE_AUTH_URI}?${queryParams.toString()}`
  );
});

// Get Login History
exports.getLoginHistory = catchAsyncErrors(async (req, res, next) => {});
