const express = require('express');
const Task = require('../models/task');

// creating a new router
const router = new express.Router();

router.post('/tasks', async(req, res) => {
    const task = new Task(req.body);

    try{
        await task.save();
        res.status(201).send(task);
    } catch(e) {
        res.status(400).send({error: 'Invalid update request'});
    }
});

router.get('/tasks', async(req, res) => {
    try{
        const tasks = await Task.find({});
        res.send(tasks);
    } catch(e) {
        res.status(500).send();
    }
});

router.get('/tasks/:id', async(req, res) => {
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

router.patch('/tasks/:id', async(req, res) => {
    const taskId = req.params.id;
    // checking for valid updates
    const allowedUpdates = ['description', 'completed'];
    const requestedUpdates = Object.keys(req.body);
    const validUpdate = requestedUpdates.every((field) => allowedUpdates.includes(field));
    if(!validUpdate) {
        res.status(400).send({error: 'Invalid update request'});
    }

    try{
        // updating so that middleware is not ingnored
        const task = await Task.findById(taskId);
        if(!task) {
            return res.status(404).send();
        }
        requestedUpdates.forEach((updateField) => task[updateField] = req.body[updateField]);
        await task.save();
        
        res.send(task);
    } catch(e) {
        res.status(400).send();
    }
});

router.delete('/tasks/:id', async(req, res) => {
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

module.exports = router;