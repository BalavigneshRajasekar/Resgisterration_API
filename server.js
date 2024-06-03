const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const path = require("path");
const cors = require("cors");
const server = express();
const port = 3000;
const bcrypt = require("bcrypt");
const apiRouter = require("./routes/apiRouters");

server.use(cors());
server.use(bodyParser.json());
server.use("/api", apiRouter);
mongoose.connect("mongodb://localhost:27017/Registration").then(() => {
  console.log("Connected to database");
  server.listen(port, () => {
    console.log("Server is running on port 3000");
  });
});
