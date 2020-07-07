// the starting point of the application
const express = require('express');
const User = require('./models/user');
const Task = require('./models/task');
require('./db/mongoose'); //mangoose connects to the db

const app = express();
const port = process.env.PORT || 3000;

// this allows automatic parsing of JSON data being sent
app.use(express.json());

app.post('/users', async(req, res) => {
    const user = new User(req.body);
    try {
        await user.save();
        res.status(201).send(user);
    } catch(e) {
        res.status(401).send();
    }
});

app.get('/users', async(req, res) => {
    try{
        const users = await User.find({});
        res.send(users);
    } catch(e) {
        res.status(500).send();
    }
});

app.get('/users/:id', async(req, res) => {
    const userId = req.params.id;
    console.log(userId);
    try{
        const user = await User.findById(userId);
        if(!user) {
            return res.status(404).send();
        }
        res.send(user);
    } catch(e) {
        res.status(500).send();
    }
});

app.patch('/users/:id', async(req, res) => {
    const userId = req.params.id;
    //dealing with invalid update request - an update for non-existing field
    const fieldPresent = ['age','name','email','password'];
    const fieldsUpdated = Object.keys(req.body);
    const validUpdate = fieldsUpdated.every((field) => fieldPresent.includes(field)); //returns true if only it's true for all
    if(!validUpdate) { //not a valid update
        return res.status(400).send({error: 'Invalid update request'});
    }

    try {
        const user = await User.findByIdAndUpdate(userId, req.body, { new: true, runValidators: true});
        if(!user) {
            res.status(404).send();
        }
        res.send(user);
    } catch(e) {
        res.status(400).send(e);
    }
});

app.delete('/users/:id', async(req, res) => {
    const userId = req.params.id;
    try {
        const user = await User.findByIdAndDelete(userId);
        if(!user) {
            return res.status(404).send();
        }

        res.send(user);
    } catch(e) {
        res.status(500).send();
    }
});


app.post('/tasks', async(req, res) => {
    const task = new Task(req.body);

    try{
        await task.save();
        res.status(201).send(task);
    } catch(e) {
        res.status(400).send({error: 'Invalid update request'});
    }
});

app.get('/tasks', async(req, res) => {
    try{
        const tasks = await Task.find({});
        res.send(tasks);
    } catch(e) {
        res.status(500).send();
    }
});

app.get('/tasks/:id', async(req, res) => {
    const taskId = req.params.id;
    try {
        const task = await Task.findById(taskId);
        if(!task) {
            return res.status(404).send();
        }
        res.send(task);
    } catch(e) {
        res.send(500).send();
    }
});

app.patch('/tasks/:id', async(req, res) => {
    const taskId = req.params.id;
    // checking for valid updates
    const allowedUpdates = ['description', 'completed'];
    const requestedUpdates = Object.keys(req.body);
    const validUpdate = requestedUpdates.every((field) => allowedUpdates.includes(field));
    if(!validUpdate) {
        res.status(400).send({error: 'Invalid update request'});
    }

    try{
        const task = await Task.findByIdAndUpdate(taskId, req.body, {new: true, runValidators: true});
        if(!task) {
            return res.status(404).send();
        }

        res.send(task);
    } catch(e) {
        res.status(400).send();
    }
});

app.delete('/tasks/:id', async(req, res) => {
    const taskId = req.params.id;
    try{
       const task = await Task.findByIdAndDelete(taskId);
       if(!task) {
           return res.status(404).send();
       }

       res.send(task);
    } catch(e) {
        res.send(500).send();
    }
});

app.listen(port, () => {
    console.log('Server is on port: ' + port);
});
