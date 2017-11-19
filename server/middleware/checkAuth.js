const jwt = require('jsonwebtoken');
const User = require('../models/user')

const login = (req, res, next) => {
  let secret = process.env.SECRET_JWT
  jwt.verify(req.headers.accesstokentodo, secret, function(err, decoded) {
    if(!err){
      req.userLogin = decoded;
      next()
    }else{
      console.log('error login');
      res.status(401).send({status : 'Please Login/Register...'})
    }
  });
}

const isOwnTask = (req, res, next) => {
  User.findById(req.userLogin.id)
  .then(user => {
    user.task_list.forEach(t => {
      if(t == req.params.id){
        next()
      }
    })
  })
  .catch(err => {
    console.log(err);
  })
}

module.exports = {
  login,
  isOwnTask
};
