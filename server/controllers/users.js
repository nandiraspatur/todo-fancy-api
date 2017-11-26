const User = require('../models/user');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require('jsonwebtoken');
// require fb
const FB = require('fb');
const fb = new FB.Facebook({version: 'v2.11'});

const setAccessToken = (req, res, next) => {
  FB.setAccessToken(req.headers.accesstokenfb);
  next()
}

const create = (req, res, data) => {
  let newUser = {
    data: req.body
  }
  console.log(newUser);
  bcrypt.hash(newUser.data.password || data.password, saltRounds)
  .then(hash => {
    newUser.data.password = hash
    let user = new User(newUser.data)
    User.create(user)
    .then(newUser => {
      res.send(newUser)
    })
    .catch(err => {
      console.log(err);
      res.status(500).send(err)
    })
  })
  .catch(err => {
    console.log(err);
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

const getOne = (req, res) => {
  User.findOne({ email: req.userLogin.email}).populate('task_list')
  .then(user => {
    user.password = '**********'
    res.send(user)
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
  if(req.headers.accesstokenfb) {
    console.log('masuk api');
    FB.api(
      "/me",
      { fields: 'first_name,last_name,email' },
      function (response) {
        User.findOne({ id_facebook: response.id })
        .then(result => {
          if(result){
            console.log('masuk findOne');
            tokenGenerate(req, res, result)
          }else{
            let data = {
              username: response.email,
              password: response.email,
              email: response.email,
              firstname: response.first_name,
              lastname: response.last_name,
              id_facebook: response.id
            }
            create(req, res, data)
          }
        })
        .catch(err => {
        })
      }
    );
  }else{
    console.log('masuk login');
    console.log(req.body);
    User.findOne({username:req.body.username})
    .then(user => {
      console.log(user);
      bcrypt.compare(req.body.password, user.password)
      .then(function(response) {
        if(response){
          tokenGenerate(req, res, user)
        }else{
          res.status(401).send({errMsg: 'Incorrect username/password'})
        }
      });
    })
    .catch(err => {
      res.status(401).send(err)
    })
  }
}

const tokenGenerate = (req, res, data) => {
  console.log('masuk token');
  let payload = {
    id : data.id,
    username : data.username,
    email : data.email,
    id_facebook : data.id_facebook,
  }
  let secret = process.env.SECRET_JWT;
  jwt.sign(payload, secret, function(err, token) {
    if(!err){
      req.headers.token = token
      res.send({accesstokentodo: token});
    }else{
      res.status(401).send(err)
    }
  });
}


const logout = (req, res) => {
  req.headers = {}
  res.send('You are logged out...')
}
module.exports = {
  create,
  getAll,
  getOne,
  update,
  login,
  logout,
  setAccessToken,
  remove
};
