var express = require('express');
var router = express.Router();

const user_controller = require('../controllers/user')

router.get('/test', user_controller.test)
router.post('/create', user_controller.user_create)
router.get('/all', user_controller.user_all)
router.put('/:id/update', user_controller.user_update)
router.delete('/:id/delete',user_controller.user_delete)
router.post('/login', user_controller.authentication)
module.exports = router;
