const express = require('express');
const Task = require('../models/task');
const router = new express.Router();

router.get('/tasks', async (req, res) => {
  try {
    const tasks = await Task.find({});
    res.send(tasks);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.post('/tasks', async (req, res) => {
  try {
    const newTask = new Task(req.body);
    const task = await newTask.save();
    res.status(201).send(task);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.get('/tasks/:id', async (req, res) => {
  const _id = req.params.id;
  try {
    const task = await Task.findById(_id);
    if (!task) {
      return res.status(404).send();
    }
    res.send(task);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.patch('/tasks/:id', async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ['description', 'completed'];
  const isValidUpdate = updates.every(update => allowedUpdates.includes(update));
  if (!isValidUpdate) {
    res.status(400).send({ error: 'Invalid update operation.' });
  }

  try {
    const task = await Task.findById(req.params.id);
    updates.forEach(update => task[update] = req.body[update]);
    await task.save();
    // const task = await Task.findByIdAndUpdate(
    //   req.params.id,
    //   req.body,
    //   { new: true, runValidators: true }
    // );

    if (!task) {
      res.send(404).send();
    }

    res.send(task)
  } catch (error) {
    res.status(400).send(error);
  }
});

router.delete('/tasks/:id', async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) {
      res.status(404).send();
    }
    res.send(task);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
