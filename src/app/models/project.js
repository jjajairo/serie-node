const mongoose = require("../../database");

const ProjectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: "Please enter a title",
  },
  description: {
    type: String,
    required: "Please enter description",
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    require: "Please enter a user",
  },
  tasks: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task",
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Project = mongoose.model("Project", ProjectSchema);

module.exports = Project;
