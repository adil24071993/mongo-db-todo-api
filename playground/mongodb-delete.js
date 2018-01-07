//const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

var obj = new ObjectID();


MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
  if(err){
    return  console.log('Unable to connect to MongoDB server');
  }
  console.log('Connected to MongoDB server');
  db.collection('Users').findOneAndDelete({
    name: "Adil"
  }).then((result)=>{
    console.log(result);
    //console.log(JSON.stringify(result.ops, undefined, 2))
  });
  //db.close();
});
