const express = require('express');
const router = express.Router();
const { Tasks } = require('../models')

router.get('/', async (req, res) => {
  const listofTasks = await Tasks.findAll();
  res.json(listofTasks);  
})

router.post('/', async (req, res) => {
  const task = req.body;
  const createdTask = await Tasks.create(task); 
  res.json(createdTask)
})

router.put('/:id', async (req, res) => {
  const taskId = req.params.id;
  const { task, dueDate, completedTask, room } = req.body;

  const existingTask = await Tasks.findByPk(taskId);

  existingTask.task = task;
  existingTask.dueDate = dueDate;
  existingTask.completedTask = completedTask;
  existingTask.room = room;

  await existingTask.save();
  res.json(existingTask);

})

router.put('/completed/:id', async (req, res) => {
  const taskId = req.params.id;

  const existingTask = await Tasks.findByPk(taskId);

  existingTask.completedTask = "Completed";

  await existingTask.save();
  res.json(existingTask);

})

router.delete('/:id', async (req, res) => {
  const taskId = req.params.id;
  const task = await Tasks.findByPk(taskId);
  await task.destroy();
  res.json(task);
})

module.exports = router;