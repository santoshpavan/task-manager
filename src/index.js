// the starting point of the application
const express = require('express');
const User = require('./models/user');
require('./db/mongoose'); //mangoose connects to the db

const app = express();
const port = process.env.PORT || 3000;

// this allows automatic parsing of JSON data being sent
app.use(express.json());

app.post('/users', (req, res) => {
    const user = new User(req.body);

    user.save().then(() => {
        req.send(user);
    }).catch(() => {
        req.status(400).send(error);
    })
})

app.listen(port, () => {
    console.log('Server is on port: ' + port);
});
