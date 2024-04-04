app.post("/sendemail", async (req, res) => {
  console.log("Received request:", req.body);
  try {
    //   Get access token using client credentials
    const token = await getToken(client_id, client_secret, grant_type);

    // Send email using the obtained access token
    const response = await fetch(
      `https://api.transmitsecurity.io/cis/v1/auth/otp/email`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          email: req.body.email,
          create_new_user: true,
          redirect_uri: "http://localhost:8080/redirect",
        }),
      }
    );

    if (response.ok) {
      const data = await response.json();
      console.log("Email sent:", data);
      res.status(200).json({ message: "Email sent successfully" });
    } else {
      console.error("Error sending email:", response.statusText);
      res.status(response.status).json({ error: "Error sending email" });
    }
  } catch (error) {
    console.error("Error occurred:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Route for redirection after email link is clicked
app.post("/redirect", (req, res) => {
  console.log("Redirecting...", req.body);
  res.send("Redirecting...");
});

// OTP Validation
app.post("/validateemail", async (req, res) => {
  const { email, passcode } = req.body;

  if (!passcode) {
    return res.status(400).json({ message: "Passcode is important" });
  }

  try {
    const token = await getToken(client_id, client_secret, grant_type);
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

    const data = await resp.json();
    console.log(data);

    if (data.error_code === 400) {
      return res.status(400).json({ message: "Invalid passcode" });
    }

    res.status(200).json({ message: "Email varified succusfully", data });
  } catch (error) {
    console.error("Error occurred:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
