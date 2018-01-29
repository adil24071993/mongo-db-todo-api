const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');

var UserSchema = new mongoose.Schema({
  email:{
    type: String,
    required: true,
    minlength: 1,
    trim: true,
    unique: true,  //only single instance in DB
    validate: {
      validator: (value) => {
        return validator.isEmail(value);
      },
      message: '{VALUE} is not a valid email'
    }
  },
  password:{
    type: String,
    required: true,
    minlength: 6
  },
  tokens:[{
    access:{
      type: String,
      required: true
    },
    token:{
      type: String,
      required: true
    }
  }]
}, { usePushEach: true });

UserSchema.methods.toJSON = function(){
  var user = this;
  var userObject = user.toObject();

  return _.pick(userObject,["_id", "email"]);

};

UserSchema.methods.generateAuthToken = function () {
  var user = this; //instance method is called over individual 'Document'
  var access = 'auth';
  var token = jwt.sign({_id: user._id.toHexString(), access}, 'syedadil').toString();

  user.tokens.push({access, token});

  return user.save().then(() => {
    return token;
  });
};

UserSchema.statics.findByToken = function (token) {
  var User = this; //static methods is called over Model
  var decoded;

  try{
    decoded = jwt.verify(token, 'syedadil');
  } catch (e){
    // return new Promise(resolve, reject){
    //   reject();
    // }

    //shorter form of the above code
    return Promise.reject();
  }

  return User.findOne({
    '_id': decoded._id,
    'tokens.token': token,
    'tokens.access': 'auth'
  })
}

var User = mongoose.model('User', UserSchema);

module.exports = {
  User
};
