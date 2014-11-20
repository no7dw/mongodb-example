var http=require('http'),
    mongodb = require("mongodb"),
    poolModule = require('generic-pool');

var pool = poolModule.Pool({
    name     : 'mongodb',
    create   : function(callback) {
        var server_options={'auto_reconnect':false,poolSize:1};
        //http://docs.mongodb.org/manual/reference/connection-string/#uri.w
        var db_options={w:-1};
        var mongoserver = new mongodb.Server('localhost', 27017,server_options );
        var db=new mongodb.Db('addr', mongoserver, db_options);
        db.open(function(err,db){
            if(err)return callback(err);
            callback(null,db);
        });
    },
    destroy  : function(db) { db.close(); },
    max      : 10,
    // optional. if you set this, make sure to drain() (see step 3)
    // min      : 2, 
    // specifies how long a resource can stay idle in pool before being removed
    idleTimeoutMillis : 30000,
     // if true, logs via console.log - can also be a function
    log : false 
});

var server=http.createServer(function(req,res){
    // acquire connection - callback function is called
    // once a resource becomes available
    pool.acquire(function(err, db) {
        if (err) {
            res.statusCode=500;
            res.end(JSON.stringify(err,null,2));
        } else {
            db.collection('addr').find({}).toArray(function(err, docs) {
                res.end(JSON.stringify(docs,null,2));
                // return object back to pool
                pool.release(db);
            });
        }
    });
});
server.listen(8080,function(){
    console.log('server listen to %d',this.address().port);
});

setTimeout(function(){
    for (var i = 0; i < 20; i++) {
        //serval second later , connection will close
        console.log("request #%d",i);
        http.get('http://localhost:8080',function(res){console.log('request ok')});    
    }
    
},2000);