const User = require('../models/user');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require('jsonwebtoken');

const create = (req, res) => {
  bcrypt.hash(req.body.password, saltRounds)
  .then(hash => {
    req.body.password = hash
    let user = new User(req.body)
    User.create(user)
    .then(newUser => {
      res.send(newUser)
    })
    .catch(err => {
      res.status(500).send(err)
    })
  })
  .catch(err => {
    res.status(500).send(err)
  })
}

const getAll = (req, res) => {
  User.find().populate('task_list')
  .then(users => {
    res.send(users)
  })
  .catch(err => {
    res.status(500).send(err)
  })
}

const update = (req, res) => {
  User.findById(req.params.id)
  .then(user => {
    user.username = req.body.username || user.username;
    user.password = req.body.password || user.password;
    user.firstname = req.body.firstname || user.firstname;
    user.lastname = req.body.lastname || user.lastname;
    user.email = req.body.email || user.email;

    user.save()
    .then(saveUser => {
      res.send(saveUser)
    })
  })
  .catch(err => {
    res.status(500).send(err)
  })
}

const remove = (req, res) => {
  User.findByIdAndRemove(req.params.id)
  .then(user => {
    let deletedUser = {
      status : 'deleted',
      data : user
    }
    res.send(deletedUser)
  })
  .catch(err => {
    res.status(500).send(err)
  })
}

const login = (req, res) => {
  User.findOne({username:req.body.username})
  .then(user => {
    bcrypt.compare(req.body.password, user.password)
    .then(function(response) {
      let payload = {
        username : req.body.username,
        email : req.body.email,
        id_facebook : req.body.id_facebook,
      }
      let secret = process.env.SECRET_JWT;
      jwt.sign(payload, secret, function(err, token) {
          if(!err){
            req.headers.token = token
            res.send({token: token});
          }else{
            res.status(401).send(err)
          }
        });
    });
  })
  .catch(err => {
    res.status(401).send(err)
  })
}

module.exports = {
  create,
  getAll,
  update,
  login,
  remove
};
