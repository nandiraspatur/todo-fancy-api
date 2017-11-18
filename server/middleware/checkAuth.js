const jwt = require('jsonwebtoken');

const login = (req, res, next) => {
  let secret = process.env.SECRET_JWT
  jwt.verify(req.headers.token_access, secret, function(err, decoded) {
    if(!err){
      req.userLogin = decoded;
      next()
    }else{
      res.status(401).send({status : 'Please Login/Register...'})
    }
  });
}

module.exports = {
  login
};
