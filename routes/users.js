var express = require('express');
var router = express.Router();
var auth = require('../middleware/auth')
const user_controller = require('../controllers/user')

router.get('/test', auth.isAuthenticated, user_controller.test)
router.post('/create', user_controller.user_create)
router.get('/all', user_controller.user_all)
router.put('/:id/update', user_controller.user_update)
router.delete('/:id/delete', user_controller.user_delete)
router.post('/login', user_controller.authentication)
router.get('/detail/:id', user_controller.user_details);
module.exports = router;
