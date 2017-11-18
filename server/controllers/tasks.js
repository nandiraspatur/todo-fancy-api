const Task = require('../models/task');

const create = (req, res) => {
  req.body.status = false;
  let task = new Task(req.body)
  Task.create(task)
  .then(newTask => {
    res.send(newTask);
  })
  .catch(err => {
    res.status(500).send(err);
  })
}

const getAll = (req, res) => {
  Task.find()
  .then(tasks => {
    res.send(tasks)
  })
  .catch(err => {
    res.status(500).send(err)
  })
}

const update = (req, res) => {
  Task.findById(req.params.id)
  .then(task => {
    task.task_name = req.body.task_name || task.task_name;
    task.status = req.body.status || task.status;

    task.save()
    .then(saveTask => {
      res.send(saveTask)
    })
  })
  .catch(err => {
    res.status(500).send(err)
  })
}

const done = (req, res) => {
  res.findById(req.params.id)
  .then(task => {
    task.status = true

    task.save()
    .then(taskDone => {
      res.send(taskDone)
    })
  })
  .catch(err => {
    res.status(500).send(err)
  })
}

const remove = (req, res) => {
  Task.findByIdAndRemove(req.params.id)
  .then(task => {
    let deletedTask = {
      status : 'deleted',
      data : task
    }
    res.send(deletedTask)
  })
  .catch(err => {
    res.status(500).send(err)
  })
}

module.exports = {
  create,
  getAll,
  update,
  done,
  remove
};
