const _= require("lodash");
const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');

var {mongoose} = require('./db/mongoose.js');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');
var {authenticate} = require('./middleware/authenticate');


var app = express();
var port = process.env.PORT || 3000;

app.use(bodyParser.json());

//POST Todo
app.post('/todos',(req, res)=>{
  var todo = new Todo({
    text: req.body.text
  });

  todo.save().then((doc)=>{
    res.send(doc);
  },(error)=>{
    res.status(400).send(error);
  });
});

//Find all Todo
app.get('/todos', (req, res)=>{
  Todo.find().then((todos)=>{
    res.send({
      todos
    });
  },(e)=>{
    res.status(400).send(e);
  })
});

//Find by ID Todo
app.get('/todos/:id', (req, res)=>{
  var id = req.params.id;
  if(!ObjectID.isValid(id)){
    return res.status(404).send()
  }

  Todo.findById(id).then((todo)=>{
    if(!todo){
      res.status(404).send();
    }else{
        res.send({todo})
    }
  }, (e)=>{
    res.status(400).send()
  });
});

//DELETE Todo
app.delete('/todos/:id',(req, res)=>{
  var id = req.params.id;
  if(!ObjectID.isValid(id)){
    return res.status(404).send({
      "errorMessage" : "ID Not Valid"
    });
  }
  Todo.findByIdAndRemove(id).then((todo)=>{
    if(!todo){
      return res.status(404).send({
        "errorMessage" : "ID Not found"
      });
    }else{
      res.send({todo});
    }
  },(e)=>{
    res.status(400).send({
      "errorMessage" : "Not a valid ID"
    });
  });
});

//Update Todo
app.patch('/todos/:id',(req, res) => {
  var id = req.params.id;
  var body = _.pick(req.body, ['text', 'completed']);

  if(!ObjectID.isValid(id)){
    return res.status(404).send({
      "errorMessage" : "ID Not Valid"
    });
  }

  if(_.isBoolean(body.completed) && body.completed){
    body.completedAt = new Date().getTime();
  }else{
    body.completed = false;
    body.completedAt = null;
  }

  Todo.findByIdAndUpdate(id, {$set: body}, {new: true}).then((todo) => {
    if(!todo){
      return res.status(404).send({
        "errorMessage": "Todo not found"
      });
    }
    res.status(200).send({todo});
  }).catch((error) => {
    return res.status(400).send({
      "errorMessage" : "Error"
    });
  })
});

//POST Users
app.post('/users', (req, res) => {
  var body = _.pick(req.body, ['email', 'password']);
  var user = new User(body);

  user.save().then(() => {
    return user.generateAuthToken();
  }).then((token) => {
    res.header('x-auth', token).send(user);
  }).catch((e) => {
    res.status(400).send(e);
  });
});

//Authenticate User
app.get('/users/me', authenticate, (req, res) => {
  res.send(req.user);
});

//POST Users Login
app.post('/users/login', (req, res) => {
  var body = _.pick(req.body, ['email', 'password']);

  User.findByCredentials(body.email, body.password).then((user) => {
    user.generateAuthToken().then((token) => {
      res.header('x-auth', token).send(user);
    });
  }).catch((e) => {
    res.status(400).send();
  });

});

//Delte all users
app.delete('/users', (req, res)=>{
  User.remove({}).then(()=>{
      res.send({
        message: "All docuemnts removed"
      });
  }).catch((e)=>{
    res.statu(400).send(e);
  });
});

//PORT listen
app.listen(port, ()=>{
  console.log('Server started at port ', port);
});

module.exports = {
  app
};
