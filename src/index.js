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

    // user.save().then(() => {
    //     res.status(201).send(user);
    // }).catch(() => {
    //     res.status(400).send(error);
    // });
});

app.get('/users', async(req, res) => {
    try{
        const users = await User.find({});
        res.send(users);
    } catch(e) {
        res.status(500).send();
    }

    // User.find({}).then((users) => {
    //     res.send(users);
    // }).catch((e) => {
    //     res.status(500).send();
    // });
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

    // console.log(userId);
    // User.findById(userId).then((user) => {
    //     if(!user) {
    //         return res.status(404).send();
    //     }
    //     res.send(user);
    // }).catch((e) => {
    //     res.status(500).send();
    // });
});

app.post('/tasks', async(req, res) => {
    const task = new Task(req.body);

    try{
        await task.save();
        res.status(201).send(task);
    } catch(e) {
        res.status(400).send();
    }
    // task.save().then(() => {
    //     res.status(201).send(task);
    // }).catch(() => {
    //     res.status(400).send(error);
    // });
});

app.get('/tasks', async(req, res) => {
    try{
        const tasks = await Task.find({});
        res.send(tasks);
    } catch(e) {
        res.status(500).send();
    }
    
    // Task.find({}).then((tasks) => {
    //     res.send(tasks);
    // }).catch(() => {
    //     res.status(500).send();
    // });
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

    // Task.findById(taskId).then((task) => {
    //     if(!task) {
    //         return res.status(404).send();
    //     }
    //     res.send(task);
    // }).catch(() => {
    //     res.status(500).send();
    // });
});

app.listen(port, () => {
    console.log('Server is on port: ' + port);
});
