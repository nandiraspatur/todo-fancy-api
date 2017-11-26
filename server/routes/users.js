var express = require('express');
var router = express.Router();
const users = require('../controllers/users');
const checkAuth = require('../middleware/checkAuth');

router.get('/all', checkAuth.login, users.getAll)
router.get('/', checkAuth.login, users.getOne)
router.post('/login', users.setAccessToken, users.login)
router.get('/logout', users.logout)
router.post('/register', users.create)
router.put('/:id', checkAuth.login, users.update)
router.delete('/:id', checkAuth.login, users.remove)

module.exports = router;
