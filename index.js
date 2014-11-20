var MongoClient = require('mongodb').MongoClient
  , assert = require('assert');

// Connection URL
var url = 'mongodb://localhost:27017/demo';

var options = {
  db: { native_parser: true },
  server: { poolSize: 1 }
}

var findaddr = function(db, callback) {
  // Get the addr collection
  db.collection('addr').find({}).toArray(function(err, docs) {
    
    callback(err, docs);
  });      
}
// Use connect method to connect to the Server
// note that: this is not good for node (single process ) that 
// connect every time, this is just for demo
MongoClient.connect(url, options, function(err, db) {
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
