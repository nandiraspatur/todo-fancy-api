var express = require('express');
var router = express.Router();
const users = require('../controllers/users');
const checkAuth = require('../middleware/checkAuth');

router.get('/', checkAuth.login, users.getAll)
router.post('/login', users.login)
router.post('/register', users.create)
router.put('/:id', checkAuth.login, users.update)
router.delete('/:id', checkAuth.login, users.remove)

module.exports = router;
