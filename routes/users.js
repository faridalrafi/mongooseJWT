var express = require('express');
var router = express.Router();
var auth = require('../middleware/auth')
const userController = require('../controllers/user')

router.get('/test', auth.isAuthenticated, userController.Test)
router.get('/testsend', auth.isAuthenticated, userController.TestSend)
router.get('/testend', auth.isAuthenticated, userController.TestEnd)
// POST user
router.post('/', userController.UserCreate)
// GET user
router.get('/', userController.UserAll)
// GET user
router.get('/allPromise', userController.UserAllPromise)
// Update user
router.put('/:id/update', userController.UserUpdate)
// Delete user
router.delete('/:id/delete', userController.UserDelete)
// GET user detail
router.get('/detail/:id', userController.UserDetail);

module.exports = router;
