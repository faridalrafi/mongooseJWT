var express = require('express');
var router = express.Router();
const IndexController = require('../controllers/index')

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});
// API
router.post('/login', IndexController.authentication)
router.post('/signup', IndexController.SignUp)
router.post('/forgot', IndexController.forgetPassword)
router.post('/reset/:token', IndexController.reset)
module.exports = router;
