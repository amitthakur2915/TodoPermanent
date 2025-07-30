const express = require('express');
const app = express();
const mongoose = require('mongoose');

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

mongoose.connect("mongodb://localhost:27017/todo");

const trySchema = new mongoose.Schema({
    name: String
});
const Item = mongoose.model("Task", trySchema);

app.get("/", async function (req, res) {
    try {
        const foundItems = await Item.find({});
        res.render("list", { dayej: foundItems });
    } catch (err) {
        console.log(err);
        res.status(500).send("Something went wrong.");
    }
});

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

app.post("/delete", async function (req, res) {
    const checkedId = req.body.checkbox1;
    try {
        await Item.findByIdAndDelete(checkedId);
        console.log("Deleted item:", checkedId);
        res.redirect("/");
    } catch (err) {
        console.log(err);
        res.status(500).send("Failed to delete item");
    }
});

app.listen(8000, function () {
    console.log("Server is running on port 8000!!");
});
