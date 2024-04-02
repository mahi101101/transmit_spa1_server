const catchAsyncError = require("../Middleware/catchAsyncError");

// get a client access token
exports.getClientToken = (
  async () => {
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
  }
);

// Create user
exports.createTransmitUser = (async (token, user) => {
  const resp = await fetch(process.env.USERS_URI, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(user),
  });
  return resp;
});
