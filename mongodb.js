// performing CRUD operations

const mongodb = require('mongodb');
const mongo_client = mongodb.MongoClient;

const connection_url = 'mongodb://127.0.0.1:27017';
const database_name = 'task-manager';

mongo_client.connect(connection_url, {useNewUrlParser: true}, (error, client) => {
    if(error){
        return console.log('Unable to connect to DB');
    }

    console.log('connected');

    // don't have to actually create a db just can use reference like this
    const db = client.db(database_name);
    // inserting a collection
    db.collection('users').insertOne({
        name: 'Trump',
        age: 70
    }, (error, result) => {
        if(error){
            return console.log('Insertion failed');
        }
        console.log(result.ops);
    });

    db.collection('users').insertMany([
        {
            name: 'Obama',
            age: 60
        }, {
            name: 'Bush',
            age: 60
        }
    ], (error, result) => {
        if(error){
            return console.log('Insertion many failed');
        }

        console.log(result.ops);
    });
});