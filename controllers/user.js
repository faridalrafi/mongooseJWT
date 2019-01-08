const User = require('../models/user')
const bcrypt = require('bcrypt');
const saltRounds = 10;

exports.test = function (req, res) {
  res.send('Greetings from the Test controller!');
};

exports.user_all = function (req,res) {
  User.find({}).then (doc =>{
      res.send({
          data: doc,
          status: 'Ok',
      })
  }).catch(err =>{
      console.error(err)
  })

}

exports.user_create = function (req, res,next) {
  let raw_password = req.body.password
  bcrypt.hash(raw_password, saltRounds).then(function(hash) {
    // Store hash in your password DB.

  let user = new User(
    {
        name: req.body.name,
        username: req.body.username,
        email: req.body.email,
        password: hash
    });
  
  
    user.save(function (err) {
        if (err) {
            return next (err);
        }
        res.send('User Created')
    })
});
}

exports.user_details = function (req, res) {
  User.findById(req.params.id, function (err, user) {
      if (err) return next(err);
      res.send(user);
  })
};

exports.user_update = function (req, res) {
  Product.findByIdAndUpdate(req.params.id, {$set: req.body}, function (err, user) {
      if (err) return next(err);
      res.send('User updated.');
  });
};

exports.user_delete = function (req, res) {
  User.findByIdAndRemove(req.params.id, function (err) {
      if (err) return next(err);
      res.send('User Deleted successfully!');
  })
};

exports.authentication = (req, res) => {
  let user = User.findOne( {
    username: req.body.username
  }, function(err,obj) { 
    if (!err){
      return obj
    }else{
      console.log(err)
    }
   });

  user.then( (user) => {
    bcrypt.compare(req.body.password, user.password).then(function(result) {
      // res == true
      if (result){
        res.send("OKE")
        // Taro JWT disini atau login untuk pasport juga boleh
      }else{
        res.status(401)
        res.send({Message : "Password salah"})
      }
  });
  })

}
