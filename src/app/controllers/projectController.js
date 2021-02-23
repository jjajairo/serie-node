const express = require("express");
const authMiddleware = require("../middleware/auth.js");

const Project = require("../models/project");
const Task = require("../models/task");

const router = express.Router();

router.use(authMiddleware);

//LIST
router.get("/", async (req, res) => {
  try {
    const projects = await Project.find().populate(["user", "tasks"]);
    return res.send(projects);
  } catch (err) {
    return res
      .status(400)
      .send({ error: "Error loading projects", console: err });
  }
});

//SHOW
router.get("/:projectId", async (req, res) => {
  try {
    const project = await Project.findById(req.params.projectId).populate(
      "user"
    );
    return res.send(project);
  } catch (err) {
    return res
      .status(400)
      .send({ error: "Error loading project", console: err });
  }
});

//CREATE
router.post("/", async (req, res) => {
  try {
    const { title, description, tasks } = req.body;

    const project = await Project.create({
      title,
      description,
      user: req.userId,
    });

    await Promise.all(
      tasks.map(async (task) => {
        const projectTask = new Task({ ...task, project: project._id });

        await projectTask.save();

        project.tasks.push(projectTask);
      })
    );

    await project.save();

    return res.send({ project });
  } catch (err) {
    return res
      .status(400)
      .send({ error: "Error creating new project", console: err });
  }
});

//UPDATE
router.put("/:projectId", async (req, res) => {
  try {
    const { title, description, tasks } = req.body;
    console.log(tasks);

    const project = await Project.findByIdAndUpdate(
      req.params.projectId,
      {
        title,
        description,
      },
      { new: true }
    );

    project.tasks = [];
    await Task.remove({ project: project._id });

    await Promise.all(
      tasks.map(async (task) => {
        const projectTask = new Task({ ...task, project: project._id });

        await projectTask.save();

        project.tasks.push(projectTask);
      })
    );

    await project.save();

    return res.send({ project });
  } catch (err) {
    console.error(err);
    return res
      .status(400)
      .send({ error: "Error updating project", console: err });
  }
});

//DELETE
router.delete("/:projectId", async (req, res) => {
  try {
    await Project.findByIdAndDelete(req.params.projectId);
    return res.status(200).send({ message: "Deletado com sucesso" });
  } catch (err) {
    return res
      .status(400)
      .send({ error: "Error deleting project", console: err });
  }
});

module.exports = (app) => {
  app.use("/projects", router);
};
