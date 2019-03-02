var express = require('express');
var router = express.Router();
var auth = require('../middleware/auth')
const userController = require('../controllers/user')

router.get('/test', auth.isAuthenticated, userController.Test)
router.post('/create', userController.UserCreate)
router.get('/all', userController.UserAll)
router.put('/:id/update', userController.UserUpdate)
router.delete('/:id/delete', userController.UserUpdate)
router.post('/login', userController.authentication)
router.get('/detail/:id', userController.UserDetail);
module.exports = router;
