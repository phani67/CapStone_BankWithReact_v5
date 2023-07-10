const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://127.0.0.1:27017';

MongoClient.connect(url, {useUnifiedTopology: true}, function(err,client){
    console.log('Connected!');

    if(err) {
        console.log(err);
    }

    //database name
    const dbName = 'myproject';
    const db = client.db(dbName);

    //new user
    var name = 'user'+Math.floor(Math.random()*1000);
    var email = name + '@mit.edu';

    //insert into customer table
    var collection = db.collection('customers');
    var doc = {name, email};
    //collection.insertOne(doc, {w:1}, function(err, result) {
     //   console.log('Document insert');      
   // });
    collection.insertOne(doc, { writeConcern: { w: 'majority', wtimeout: 5000 } }, function (err, result) {
        if (err) {
          console.error('Error inserting document:', err);
        } else {
          console.log('Document inserted successfully:', result);
        }
      });
      
    //read from the database
    var customers = db
        .collection('customers') 
        .find()
        .toArray(function(err,docs) {
        console.log('Collection:', docs)
        });

        //clean up
        client.close();

});