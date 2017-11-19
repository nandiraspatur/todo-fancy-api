const Task = require('../models/task');
const User = require('../models/user');

const create = (req, res) => {
  req.body.user_id = req.userLogin.id
  let task = new Task(req.body)
  Task.create(task)
  .then(newTask => {
    User.findById(req.userLogin.id)
    .then(user => {
      user.task_list.push(newTask._id)
      user.save()
      .then(responseSave => {
        console.log(responseSave);
        res.send(newTask);
      })
    })
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
  Task.findById(req.params.id)
  .then(task => {
    if(task.status){
      task.status = false
    }else{
      task.status = true
    }

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
    User.findById(req.userLogin.id)
    .then(user => {
      user.task_list.forEach((t,i) => {
        if(t == task._id){
          user.task_list.splice(i, 1)
        }
      })
      let deletedTask = {
        status : 'deleted',
        data : task
      }
      res.send(deletedTask)
    })
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
