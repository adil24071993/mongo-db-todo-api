const _= require("lodash");
const express = require('express');
const bodyParser = require('body-parser');

var {mongoose} = require('./db/mongoose.js');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');
var {ObjectID} = require('mongodb');

var app = express();
var port = process.env.PORT || 3000;

app.use(bodyParser.json());

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

app.post('/users', (req, res)=>{
  var user = new User({
    "email": req.body.email
  });

  user.save().then((user)=>{
    res.send(user);
  },(error)=>{
    res.status(400).send(error);
  });
});

app.get('/todos', (req, res)=>{
  Todo.find().then((todos)=>{
    res.send({
      todos
    });
  },(e)=>{
    res.status(400).send(e);
  })
});

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

app.listen(port, ()=>{
  console.log('Server started at port ', port);
});

module.exports = {
  app
};
