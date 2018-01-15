var request = require('supertest');
var expect = require('expect');

var {app} = require('./../server');
var {Todo} = require('./../models/todo');
var {User} = require('./../models/user');

beforeEach((done)=>{
  Todo.remove({}).then(()=>{
    console.log('Todo DB cleared');
    User.remove({}).then(()=>{
      console.log('Users DB cleared');
      done();
    });
  }).catch((err)=>{
    done(err);
  });
});

describe('POST /todos', () => {
  it('should create a new todo', (done) => {
    var text = 'Test string';

    request(app)
      .post('/todos')
      .send({text})
      .expect(200)
      .expect((res)=>{
        expect(res.body.text).toBe(text);
      })
      .end((err, res)=>{
        if(err){
          return done(err)
        }

        Todo.find().then((todos)=>{
          expect(todos.length).toBe(1);
          expect(todos[0].text).toBe(text);
          done();
        }).catch((e)=>{
          done(e);
        });
      });
    });
});

describe('POST /users', ()=>{
  it('should create new user', (done)=>{
    var email = 'dark@gmail.com';

    request(app)
      .post('/users')
      .send({email})
      .expect(200)
      .expect((res)=>{
        expect(res.body.email).toBe(email)
      })
      .end((err, res)=>{
        if(err){
          return done(err)
        }
        User.find().then((users)=>{
          expect(users.length).toBe(1);
          expect(users[0].email).toBe(email);
          done();
        }, (e)=>{
          done(e);
        });
      });
  });
});
