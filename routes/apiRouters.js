const express = require("express");
const Users = require("../models/Registration");
const bcrypt = require("bcrypt");
const JWT = require("jsonwebtoken");
require("dotenv").config();
const { auth, roleAuth } = require("../middleware/auth.js");

const apiRouter = express.Router();

apiRouter.post("/register", async (req, res) => {
  const { name, email, password, role } = req.body;
  try {
    const user = await Users.findOne({ email });

    if (user) {
      return res.status(400).send("email already exists");
    }
    const hashPassword = await bcrypt.hash(password, 10);
    const newUser = new Users({ name, email, password: hashPassword, role });
    await newUser.save();
    res.status(200).send("User created successfully");
  } catch (err) {
    res.status(500).send("Server error: " + err.message);
  }
});

apiRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const emailCheck = await Users.findOne({ email });

    if (!emailCheck) {
      return res.status(400).send("User does not exist");
    }

    const passCheck = await bcrypt.compare(password, emailCheck.password);
    if (!passCheck) {
      return res.status(400).send("Incorrect password");
    }
    const { name, email: email1, password: pass1, role, _id } = emailCheck;
    const token = JWT.sign({ name, email1, role, _id }, process.env.TOKENCODE);
    res
      .status(200)
      .send({ message: "Logged In successfully", token: { token } });
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
});

apiRouter.post("/addBook", auth, roleAuth("admin"), async (req, res) => {
  const { title, author, description } = req.body;
  try {
    res.status(200).send({ title, author });
  } catch (err) {
    res.status(500).send("Server error: " + err.message);
  }
});

module.exports = apiRouter;
