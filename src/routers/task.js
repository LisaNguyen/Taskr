const express = require('express');
const Task = require('../models/task');
const auth = require('../middleware/authentication');
const router = new express.Router();


router.get('/tasks', auth, async (req, res) => {
  const match = {};
  const sort = {};

  if (req.query.completed) {
    match.completed = req.query.completed === 'true';
  }

  if (req.query.sortBy) {
    const sortValues = req.query.sortBy.split(':');
    sort[sortValues[0]] = sortValues[1] === 'desc' ? -1 : 1;
  }

  try {
    await req.user.populate({
      path: 'tasks',
      match,
      options: {
        limit: parseInt(req.query.limit),
        skip: parseInt(req.query.skip),
        sort
      }
    }).execPopulate();
    res.send(req.user.tasks);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.post('/tasks', auth, async (req, res) => {
  const newTask = new Task({
    ...req.body,
    author: req.user._id

  });
  try {
    const task = await newTask.save();
    res.status(201).send(task);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.get('/tasks/:id', auth, async (req, res) => {
  const _id = req.params.id;
  try {
    const task = await Task.findOne({ _id, author: req.user._id });
    if (!task) {
      return res.status(404).send();
    }
    res.send(task);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.patch('/tasks/:id', auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ['description', 'completed'];
  const isValidUpdate = updates.every(update => allowedUpdates.includes(update));
  if (!isValidUpdate) {
    res.status(400).send({ error: 'Invalid update operation.' });
  }

  try {
    const task = await Task.findOne({
      _id: req.params.id,
      author: req.user._id
    });
    // const task = await Task.findByIdAndUpdate(
    //   req.params.id,
    //   req.body,
    //   { new: true, runValidators: true }
    // );

    if (!task) {
      return res.status(404).send();
    }

    updates.forEach(update => task[update] = req.body[update]);
    await task.save();
    res.send(task)
  } catch (error) {
    res.status(400).send(error);
  }
});

router.delete('/tasks/:id', auth, async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      author: req.user._id
    });
    if (!task) {
      return res.status(404).send();
    }
    res.send(task);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
