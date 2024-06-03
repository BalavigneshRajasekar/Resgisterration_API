const express = require("express");
const JWT = require("jsonwebtoken");

const auth = (req, res, next) => {
  const token = req.header("Authorization");

  try {
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const tokenCheck = JWT.verify(token, process.env.TOKENCODE);

    req.user = tokenCheck;
    next();
  } catch (err) {
    return res.status(401).json({ message: "token mismatch" });
  }
};

const roleAuth = (value) => {
  return (req, res, next) => {
    if (req.user.role !== value) {
      return res.status(401).json({ message: "need Admin access" });
    }
    next();
  };
};

module.exports = { auth, roleAuth };
