var MongoClient = require('mongodb').MongoClient
  , assert = require('assert');

// Connection URL
var url = 'mongodb://localhost:27017/demo';

var findaddr = function(db, callback) {
  // Get the addr collection
  var collection = db.collection('addr');
  // Find some addr
  collection.find({}).toArray(function(err, docs) {
    
    callback(err, docs);
  });      
}

// Use connect method to connect to the Server
MongoClient.connect(url, function(err, db) {
  assert.equal(null, err);
  console.log("Connected correctly to server");
  findaddr(db,function(err, docs){
  	if(err)
  		console.log('we get err', err);
  	else
  		console.log('result:', docs);
  	db.close();
  });
  
});
