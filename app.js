const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config(); // Load env variables from .env file

const app = express();
const PORT = process.env.PORT || 8000;

// ✅ Use .env for MongoDB URI (recommended)
const mongoURL = process.env.MONGO_URI;

// ✅ Middleware
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// ✅ MongoDB Connection (no deprecated options)
mongoose.connect(mongoURL)
  .then(() => console.log("✅ MongoDB connected successfully!"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// ✅ Schema & Model
const trySchema = new mongoose.Schema({ name: String });
const Item = mongoose.model("Task", trySchema);

// ✅ Routes
app.get("/", async (req, res) => {
  try {
    const foundItems = await Item.find({});
    res.render("list", { dayej: foundItems });
  } catch (err) {
    res.status(500).send("Server Error");
  }
});

app.post("/", async (req, res) => {
  const newItemName = req.body.ele1;
  if (newItemName.trim()) {
    await new Item({ name: newItemName }).save();
  }
  res.redirect("/");
});

app.post("/delete", async (req, res) => {
  try {
    await Item.findByIdAndDelete(req.body.checkbox1);
    res.redirect("/");
  } catch (err) {
    res.status(500).send("Delete failed");
  }
});

// ✅ Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
