require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const cors = require('cors');
const jwt = require('jsonwebtoken');

const User = require('./models/user.model');
const Note = require('./models/note.model');
const authenticateToken = require('./utilities');

const app = express();
const PORT = process.env.PORT || 8001;

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cors({ origin: '*' }));

// Error handler for JSON
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({ error: "Invalid JSON body" });
  }
  next();
});

// Connect MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Root route
app.get("/", (req, res) => {
  res.json({ data: "hello lait singh" });
});

// Register
app.post("/create-account", async (req, res) => {
  try {
    const { fullname, email, password } = req.body;

    if (!fullname || !email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const isUser = await User.findOne({ email });
    if (isUser) {
      return res.json({ error: true, message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ fullName: fullname, email, password: hashedPassword });
    await user.save();

    const accessToken = jwt.sign({ userId: user._id }, process.env.ACCESS_TOKEN, {
      expiresIn: '36000m'
    });

    return res.json({
      error: false,
      user,
      accessToken,
      message: "Registration Successful",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// Login
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    const accessToken = jwt.sign({ userId: user._id }, process.env.ACCESS_TOKEN, {
      expiresIn: '36000m'
    });

    return res.json({
      error: false,
      message: "Login Successful",
      accessToken,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
});
//get user 
app.get("/get-user-details", authenticateToken, async (req, res) => {
   const userId = req.user.userId; 

  const isUser= await User.findById(userId);
  if(!isUser){
    return res.sendStatus(401);
  }
  return res.json({
    user: isUser,
    message: "User details fetched successfully"
  });
});

// Add Note
app.post("/add-note", authenticateToken, async (req, res) => {
  const { title, content, tags } = req.body;
  const userId = req.user.userId;

  if (!title || !content) {
    return res.status(400).json({ error: "Title and content are required" });
  }

  try {
    const note = new Note({ title, content, tags: tags || [], userId });
    await note.save();

    return res.json({
      error: false,
      note,
      message: "Note added successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
});
// Edit Note
app.put("/edit-note/:noteId", authenticateToken, async (req, res) => {
  const noteId = req.params.noteId;
  const { title, content, tags, isPinned } = req.body;
  const userId = req.user.userId; // Get userId from token

  if (!title || !content) {
    return res.status(400).json({ error: "Title and content are required" });
  }

  try {
    const note = await Note.findOne({ _id: noteId, userId });

    if (!note) {
      return res.status(404).json({ error: "Note not found" });
    }

    note.title = title;
    note.content = content;
    if (tags !== undefined) note.tags = tags;
    if (isPinned !== undefined) note.isPinned = isPinned;

    await note.save();

    return res.json({
      error: false,
      note,
      message: "Note updated successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
});
// Get All Notes
app.get("/get-all-notes", authenticateToken, async (req, res) => {
  const { userId } = req.user;

  try {
    const notes = await Note.find({ userId }).sort({ isPinned: -1 });

    return res.json({
      error: false,
      notes,
      message: "Notes fetched successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
});
// Delete Note
app.delete("/delete-note/:noteId", authenticateToken, async (req, res) => {
  const noteId = req.params.noteId;
  const userId = req.user.userId; // Get userId from token

  try {
    const note = await Note.findOne({ _id: noteId, userId: userId });
    if (!note) {
      return res.status(404)
        .json({ error: "Note not found" });
    }
    await Note.deleteOne({ _id: noteId, userId: userId });
    return res.json({
      error: false,
      message: "Note deleted successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500)
      .json({ error: "Internal server error" });
  }
});
// Update isPinned value
app.put("/update-pin-status/:noteId", authenticateToken, async (req, res) => {
  const noteId = req.params.noteId;
  const { isPinned } = req.body;
  const userId = req.user.userId;

  try {
    const note = await Note.findOne({ _id: noteId, userId });

    if (!note) {
      return res.status(404).json({ error: "Note not found" });
    }
    if (isPinned) note.isPinned = isPinned || false;;

    await note.save();

    return res.json({
      error: false,
      note,
      message: "Pin status updated successfully",
    });
  } catch (error) {
    console.error("Pin status update error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// Start server
app.listen(PORT, () => console.log(`👌 Server running on port ${PORT}`));

module.exports = app;
