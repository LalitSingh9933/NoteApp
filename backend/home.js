require('dotenv').config();

const config = require('./config.json');
const mongoose = require('mongoose');
mongoose.connect(config.connectionString);

const User = require('./models/user.model');
const Note = require('./models/note.model');

const express = require('express');
const cors = require('cors');
const app = express();

const jwt = require('jsonwebtoken');
const authenticateToken = require('./utilities');

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(
  cors({
    origin: "*",
  })
);

// Error handling middleware for JSON parsing
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({ error: "Invalid JSON body" });
  }
  next();
});

app.get("/", (req, res) => {
  res.json({ data: "hello lait singh" });
});

// Create a new user
app.post("/create-account", async (req, res) => {
  try {
    // Check if body exists
    if (!req.body) {
      return res.status(400).json({ error: "Request body is missing" });
    }

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
      expiresIn: '36000m'
    });

    return res.json({
      error: false,
      user,
      acceptToken,
      message: "Registration Successful",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
});
//Login user
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }
  const userInfo = await User.findOne({ email: email, password: password });
  if (!userInfo) {
    return res.status(400).json({ error: "Invalid User" });
  }
  if (userInfo.email == email && userInfo.password == password) {
    const user = { user: userInfo };
    const acceptToken = jwt.sign(user, process.env.ACCESS_TOKEN, {
      expiresIn: '36000m'
    });
    return res.json({
      error: false,
      message: "Login Successful",
      email,
      acceptToken,
    });
  } else {
    return res.status(400).json({
      error: true,
      message: "Invalid email or password"
    });
  }

});
//Add a new note
// app.post("/add-note", authenticateToken, async (req, res) => {

//   const { title, content, tags } = req.body;
//   const {user} = req.user;
//   if (!title || !content) {
//     return res.status(400).json({ error: "Title and content are required" });
//   }
//   try {
//     const note = new Note({
//       title,
//       content,
//       tags: tags || [],
//       userId: user._id,
//     });
//     await note.save();
//     return res.json({
//       error: false,
//       note,
//       message: "Note added successfully",
//     });
//   } catch (error) {
//     return res.status(500).json({ error: "Internal server error" });
//   }


// });
app.listen(8001);

module.exports = app;