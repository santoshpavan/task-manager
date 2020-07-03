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
});