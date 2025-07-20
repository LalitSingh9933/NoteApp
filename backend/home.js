require('dotenv').config();

const config = require('./config.json');
const mongoose = require('mongoose');
mongoose.connect(config.connectionString);

const User = require('./models/user.model');

const express = require('express');
const cors = require('cors');
const app = express();

const jwt = require('jsonwebtoken');
const authenticateToken = require('./utilities');

app.use(express.json());
app.use(
  cors({
    origin: "*",
  })
);

app.get("/", (req, res) => {
  res.json({ data: "hello lait singh" });
});

// Create a new user
app.post("/create-account", async (req, res) => {
  const { fullname, email, password } = req.body;
  
  if (!fullname || !email || !password) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const isUser = await User.findOne({ email: email });

  if (isUser) {
    return res.json({
      error: true,
      message: "User already exists",
    });
  }

  const user = new User({
    fullname,
    email,
    password,
  });

  await user.save();

  const acceptToken = jwt.sign({ userId: user._id }, process.env.ACCESS_TOKEN, {
    expiresIn: '36000m' // token will expire in 1 hour
  });

  return res.json({
    error: false,
    user,
    acceptToken,
    message: "Registration Successful",
  });
});

app.listen(8001);

module.exports = app;