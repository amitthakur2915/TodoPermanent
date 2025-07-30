const express = require('express');
const app = express();
const mongoose = require('mongoose');

// Middleware
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// ✅ Correct MongoDB Atlas URI (password encoded)
const mongoURL = 'mongodb+srv://amitthakur2915:Amit%402915@cluster0.fwxgjnn.mongodb.net/todoDB?retryWrites=true&w=majority';

// ✅ MongoDB Connection
mongoose.connect(mongoURL)
  .then(() => console.log("✅ MongoDB connected successfully!"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// ✅ Schema & Model
const trySchema = new mongoose.Schema({
  name: String
});
const Item = mongoose.model("Task", trySchema);

// ✅ GET Route: Show all todos
app.get("/", async function (req, res) {
  try {
    const foundItems = await Item.find({});
    res.render("list", { dayej: foundItems });
  } catch (err) {
    console.log(err);
    res.status(500).send("Something went wrong.");
  }
});

// ✅ POST Route: Add new todo
app.post("/", async function (req, res) {
  const newItemName = req.body.ele1;
  if (newItemName.trim()) {
    try {
      const newItem = new Item({ name: newItemName });
      await newItem.save();
    } catch (err) {
      console.log(err);
    }
  }
  res.redirect("/");
});

// ✅ POST Route: Delete todo
app.post("/delete", async function (req, res) {
  const checkedId = req.body.checkbox1;
  try {
    await Item.findByIdAndDelete(checkedId);
    console.log("🗑️ Deleted item:", checkedId);
    res.redirect("/");
  } catch (err) {
    console.log(err);
    res.status(500).send("Failed to delete item");
  }
});

// ✅ Start Server
app.listen(8000, function () {
  console.log("🚀 Server is running on http://localhost:8000");
});
