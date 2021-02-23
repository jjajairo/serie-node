const mongoose = require("../../database");

const TaskSchema = new mongoose.Schema({
  title: {
    type: "string",
    required: true,
  },
  project: {
    type: mongoose.Schema.Types.ObjectID,
    ref: "Project",
    required: true,
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectID,
    ref: "User",
    required: true,
  },
  completed: {
    type: Boolean,
    required: true,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Task = mongoose.model("Task", TaskSchema);

module.exports = Task;
