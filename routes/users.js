var express = require('express');
var router = express.Router();
var auth = require('../middleware/auth')
const userController = require('../controllers/user')

router.get('/test', auth.isAuthenticated, userController.Test)
router.get('/testsend', auth.isAuthenticated, userController.TestSend)
router.get('/testend', auth.isAuthenticated, userController.TestEnd)

router.post('/create', userController.UserCreate)
router.get('/all', userController.UserAll)
router.get('/allPromise', userController.UserAllPromise)
router.put('/:id/update', userController.UserUpdate)
router.delete('/:id/delete', userController.UserDelete)
router.post('/login', userController.authentication)
router.get('/detail/:id', userController.UserDetail);
router.post('/forgot', userController.forgetPassword)
router.post('/reset/:token', userController.reset)
module.exports = router;
