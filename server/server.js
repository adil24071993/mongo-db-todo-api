var express = require('express');
var bodyParser = require('body-parser');

var {mongoose} = require('./db/mongoose.js');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');
var {ObjectID} = require('mongodb');

var app = express();

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
  // if(ObjectID.isValid(id)){
  //   Todo.findById(id).then((todo)=>{
  //     res.send(todo)
  //   }, (e)=>{
  //     res.status(404).send({
  //       "errorMessage": "Id not found"
  //     })
  //   });
  // }else{
  //   res.status(400).send({
  //     "errorMessage": "Invalid Id"
  //   });
  // }
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

app.listen(3000, ()=>{
  console.log('Server started at 3000');
});

module.exports = {
  app
};
