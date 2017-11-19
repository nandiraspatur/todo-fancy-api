const express = require('express');
const router = express.Router();
const tasks = require('../controllers/tasks');
const checkAuth = require('../middleware/checkAuth');

router.get('/', checkAuth.login, tasks.getAll)
router.post('/', checkAuth.login, tasks.create)
router.put('/:id', checkAuth.login, checkAuth.isOwnTask, tasks.update)
router.put('/done/:id', checkAuth.login, checkAuth.isOwnTask, tasks.done)
router.delete('/:id', checkAuth.login, checkAuth.isOwnTask, tasks.remove)

module.exports = router;
