const catchAsyncError = require("../Middleware/catchAsyncError");

// get a client access token
exports.getClientToken = async () => {
  const formData = new URLSearchParams({
    client_id: process.env.CLIENT_ID,
    client_secret: process.env.CLIENT_SECRET,
    grant_type: process.env.GRANT_CLIENT_CREDENTIAL,
  });
  const resp = await fetch(process.env.OIDC_TOKEN_URI, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: formData.toString(),
  });
  if (!resp.ok) {
    throw new Error(`Failed to fetch access token: ${resp.status}`);
  }
  const data = await resp.json();
  return data.access_token;
};

// Create user
exports.createTransmitUser = async (token, user) => {
  const resp = await fetch(process.env.USERS_URI, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(user),
  });
  return resp;
};

// user login
exports.loginTransmitUser = async (token, user) => {
  const resp = await fetch(process.env.LOGIN_URI, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(user),
  });

  return resp;
};

// send email verification mail
exports.sendEmailVerificationClient = async (token, email) => {
  const resp = await fetch(
    `https://api.transmitsecurity.io/cis/v1/auth/otp/email`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        email: email,
        create_new_user: true,
        redirect_uri: "http://localhost:8080/redirect",
      }),
    }
  );
  return resp;
};

// Validate email Passcode
exports.validateEmailPasscode = async (token, email, passcode) => {
  // console.log(typeof passcode);
  const resp = await fetch(
    `https://api.transmitsecurity.io/cis/v1/auth/otp/email/validation`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        email: email,
        passcode: passcode,
        response_type: "code",
        nonce: "string",
      }),
    }
  );

  return resp;
};
