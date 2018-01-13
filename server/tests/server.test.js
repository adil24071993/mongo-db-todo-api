var request = require('supertest');
var expect = require('expect');

var {app} = require('./../server');
var {Todo} = require('./../models/todo');

beforeEach((done)=>{
  Todo.remove({}).then(()=>{
    done
  });
});

describe('POST /todos', () => {
  if('should create a new todo', (done) => {
    var text = 'Test string';

    request(app)
      .post('/todos')
      .send({text})
      .expect(200)
      .expect((res)=>{
        expect(res.body.text.toBe(text));
      })
      .end((err, res)=>{
        if(err){
          return done(err)
        }

        Todo.find().then((todos)=>{
          expect(todos.length.toBe(1));
          expect(todos[0].text.toBe(text));
        }).catch((e)=>{
          done(e);
        });
      });
    });
});
