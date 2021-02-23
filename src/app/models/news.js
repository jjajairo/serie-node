const mongoose = require("mongoose");

const NewsSchema = new mongoose.Schema({
  title: {
    type: "string",
    required: true,
  },
  link: {
    type: "string",
    unique: true,
    required: true,
    lowercase: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const News = mongoose.model("News", NewsSchema);

module.exports = News;
