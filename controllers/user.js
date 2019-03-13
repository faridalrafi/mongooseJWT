const User = require('../models/user')
const bcrypt = require('bcrypt');
const saltRounds = 10;
const Ajv = require('ajv');
var userSchema = require('../scheme/user');
var jwt = require('jsonwebtoken');
let crypto = require('crypto');
const EmailService = require('../lib/mailer')

// var validate = ajv.compile(userSchema);

exports.Test = function (req, res, next) {
  // token = req.headers.authorization;
  res.json({ message: req.decoded });
};

exports.TestSend = function (req, res, next) {
  // token = req.headers.authorization;
  res.send("<h1>TEST ah</h1>");
};

exports.TestEnd = function (req, res, next) {
  // token = req.headers.authorization;
  res.status(204).end();
};

exports.UserAllPromise = function (req, res) {
  User.find({}).then(doc => {
    res.send({
      data: doc,
      status: 'Ok'
    })
  }).catch(err => {
    console.error(err)
  })
}

exports.UserAll = (req, res, next) => {
  User.find({}, function (err, user) {
    if (err) {
      return next(err)
    }
    res.status(200)
    res.send(user)
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
        res.status(201)
        res.send({ message: 'User Created' })
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
  User.findByIdAndRemove(req.params.id, function (err, item) {
    if (err) return next(err);
    if (!item) {
      res.status(404)
      res.send({ message: 'user Not Found' });
    } else {
      res.status(202)
      res.send({ message: 'user Deleted', userDetail: item });
    }
  })
};

exports.authentication = (req, res, next) => {
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
        var token = jwt.sign(user.toJSON(), process.env.SECRET_KEY, { // melakukan generate token di jwt
          algorithm: 'HS256'
        });

        res.json({ message: 'berhasil login', token: token });
      } else {
        res.status(401)
        res.send({ Message: 'Password salah' })
      }
    }).catch((err) => { return next(err) })
  })
}

exports.forgetPassword = (req, res, next) => {
  let userMail = req.body.email;
  let forgetByMail = User.findOne({ email: userMail }).exec();
  forgetByMail.then((user) => {
    const buf = crypto.randomBytes(12); // sync create token
    user.resetPasswordToken = buf.toString('hex')
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    user.save(function (err) {
      if (err) {
        return next(err);
      }
      EmailService.sendText(userMail, 'You have requested RESET password', `Do something with this token :! ${user.resetPasswordToken}`)
        .then(() => {
          // Email sent successfully
          console.log('email sent')
        })
        .catch(() => {
          // Error sending email
          console.log('email failed')
        })
      res.status(201)
      res.send({ message: 'Token created' + user.resetPasswordToken })
    })
  }).catch(next)
}

exports.reset = (req, res, next) => {
  let userToken = User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }).exec()
  userToken.then((user) => {
    console.log(user)
    let hash = bcrypt.hashSync(req.body.password, saltRounds);
    user.password = hash;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    user.save(function (err) {
      if (err) {
        res.send(422, { message: 'failed to update data' })
      }
      res.send(201, { message: 'Password Changed' })
    });
  }).catch(next)
}
