const User = require('../models/user')
const bcrypt = require('bcrypt');
const saltRounds = 10;
const Ajv = require('ajv');
var userSchema = require('../scheme/user');
var jwt = require('jsonwebtoken');
require('dotenv').config() // membaca file env

// var validate = ajv.compile(userSchema);

exports.Test = function (req, res, next) {
  // token = req.headers.authorization;
  res.json({ message: req.decoded });
};

exports.UserAll = function (req, res) {
  User.find({}).then(doc => {
    res.send({
      data: doc,
      status: 'Ok'
    })
  }).catch(err => {
    console.error(err)
  })
}

exports.UserCreate = function (req, res, next) {
  let user = new User(
    {
      name: req.body.name,
      username: req.body.username,
      email: req.body.email,
      password: req.body.password
    });
  var ajv = new Ajv();
  // var valid = ajv.validate(userSchema, user);
  var validate = ajv.compile(userSchema);
  var valid = validate(user);

  if (valid) {
    console.log('User data is valid!');
    bcrypt.hash(user.password, saltRounds).then(function (hash) {
      // Store hash in your password DB.
      user.password = hash
      user.save(function (err) {
        if (err) {
          return next(err);
        }
        res.send('User Created')
      })
    });
  } else {
    console.log('User data is INVALID!', validate.errors);
    res.status(400)
    res.send({ message: 'DATA INVALID', error: validate.errors })
  }
}

exports.UserDetail = function (req, res, next) {
  User.findById(req.params.id, function (err, user) {
    if (err) return next(err);
    res.send(user);
  })
};

exports.UserUpdate = function (req, res, next) {
  User.findByIdAndUpdate(req.params.id, { $set: req.body }, function (err, user) {
    if (err) return next(err);
    res.send('User updated.');
  });
};

exports.UserDelete = function (req, res, next) {
  User.findByIdAndRemove(req.params.id, function (err) {
    if (err) return next(err);
    res.send('User Deleted successfully!');
  })
};

exports.authentication = (req, res) => {
  let user = User.findOne({
    username: req.body.username
  }, function (err, obj) {
    if (!err) {
      return obj
    } else {
      console.log(err)
    }
  });

  user.then((user) => {
    console.log(user)
    console.log(req.body)
    bcrypt.compare(req.body.password, user.password).then(function (result) {
      // res == true
      if (result) {
        // res.send('OKE')
        // Taro JWT disini atau login untuk pasport juga boleh
        var token = jwt.sign(user.toJSON(), 'jwtsecret', { // melakukan generate token di jwt
          algorithm: 'HS256'
        });

        res.json({ message: 'berhasil login', token: token });
      } else {
        res.status(401)
        res.send({ Message: 'Password salah' })
      }
    }).catch((err)=> { console.log(err)})
  })
}
