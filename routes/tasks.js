var express = require('express');
var router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { stringify } = require('jade/lib/utils');

// Get All Task
router.get('/get-all', async function (req, res, next) {
    const tasks = await prisma.task.findMany();
    res.send(tasks)
  });

// Create User
router.post('/create', async function (req, res, next) {
  const { title, desc, priority, deadline, is_done, created_by } = req.body;
  const parseDeadline = new Date(deadline);
  const task = await prisma.task.create({
    data: {
      title,
      desc,
      priority,
      deadline: parseDeadline,
      is_done: is_done !== undefined ? Boolean(is_done): false,
      created_by
    },
  });
  res.send(task)
});

// Update Task
router.put('/update/:id', async function (req, res, next) {
  const { id } = req.params;
  const { title, desc, priority, deadline, is_done, created_by } = req.body;
  const task = await prisma.task.update({
    where: {
      id: parseInt(id),
    },
    data: { title, desc, priority, deadline, is_done, created_by },
  });
  res.status(200).json({
    message: 'task updated', task
  })
});

// Delete Task
router.delete('/delete/:id', async function (req, res, next) {
  const { id } = req.params;
  const task = await prisma.task.delete({
    where: {
      id: parseInt(id),
    },
  });
  res.status(200).json({
    message: 'task deleted', task
  })
});

module.exports = router;