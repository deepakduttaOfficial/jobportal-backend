require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");
const version = "v1";
app.use(cors());

// Cloudinay require from config
require("./config/cloudinary");

// DB connection import and use
const { databaseConnect } = require("./config/database");
databaseConnect();

// Reguler middleware
app.use(express.json());
app.use(cookieParser());
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);

// import router
const authRoute = require("./routes/auth");
const profileRoute = require("./routes/profile");
const categoryRoute = require("./routes/category");
const jobRoute = require("./routes/job");
const bidRoute = require("./routes/bid");
const reviewRoute = require("./routes/review");

// exicuting router
app.use(`/api/${version}`, authRoute);
app.use(`/api/${version}`, profileRoute);
app.use(`/api/${version}`, categoryRoute);
app.use(`/api/${version}`, jobRoute);
app.use(`/api/${version}`, bidRoute);
app.use(`/api/${version}`, reviewRoute);

module.exports = app;
