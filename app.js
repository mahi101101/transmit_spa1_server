const express = require("express");
const cors = require("cors");
const error = require("./Middleware/error");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const https = require("https");
const fs = require("fs");

const app = express();
app.use(express.json());
app.use(cors());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));

//Route Imports
const userRoute = require("./Routes/userRoutes");

app.use("/api/v1", userRoute);

//Error - Middleware
app.use(error);

const privateKey = fs.readFileSync("server.key", "utf8");
const certificate = fs.readFileSync("server.cert", "utf8");
const credentials = { key: privateKey, cert: certificate };

const httpsServer = https.createServer(credentials, app);

module.exports = httpsServer;
