// the starting point of the application
const express = require('express');
const User = require('./models/user');
const Task = require('./models/task');
require('./db/mongoose'); //mangoose connects to the db

const app = express();
const port = process.env.PORT || 3000;

// this allows automatic parsing of JSON data being sent
app.use(express.json());

app.post('/users', (req, res) => {
    const user = new User(req.body);

    user.save().then(() => {
        res.status(201).send(user);
    }).catch(() => {
        res.status(400).send(error);
    })
});

app.get('/users', (req, res) => {
    User.find({}).then((users) => {
        res.send(users);
    }).catch((e) => {
        res.status(500).send();
    })
});

app.get('/users/:id', (req, res) => {
    const userId = req.params.id;
    console.log(userId);
    User.findById(userId).then((user) => {
        if(!user) {
            return res.status(404).send();
        }
        res.send(user);
    }).catch((e) => {
        res.status(500).send();
    })
});

app.post('/tasks', (req, res) => {
    const task = new Task(req.body);

    task.save().then(() => {
        res.status(201).send(task);
    }).catch(() => {
        res.status(400).send(error);
    })
})

app.get('/tasks', (req, res) => {
    Task.find({}).then((tasks) => {
        res.send(tasks);
    }).catch(() => {
        res.status(500).send();
    })
});

app.get('/tasks/:id', (req, res) => {
    const taskId = req.params.id;
    Task.findById(taskId).then((task) => {
        if(!task) {
            return res.status(404).send();
        }
        res.send(task);
    }).catch(() => {
        res.status(500).send();
    })
});

app.listen(port, () => {
    console.log('Server is on port: ' + port);
});
