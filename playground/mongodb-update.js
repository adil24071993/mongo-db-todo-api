//const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

var obj = new ObjectID();


MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
  if(err){
    return  console.log('Unable to connect to MongoDB server');
  }
  console.log('Connected to MongoDB server');

  // db.collection('Todos').findOneAndUpdate({
  //   _id: new ObjectID('5a51f53a799e7a17b4d6fa89')
  // },{
  //   $set: {
  //     completed: true
  //   }
  // },{
  //   returnOriginal: false
  // }).then((result)=>{
  //   console.log(result);
  // });

  db.collection('Users').findOneAndUpdate({
    _id: new ObjectID("5a5277eebad40b40d4480f36")
  },{
    $set: {
      name: 'Dark Shadow'
    },
    $inc: {
      age: 1
    }
  },{
    returnOriginal: false
  }).then((result)=>{
    console.log(result)
  });

  //db.close();
});
