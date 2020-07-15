const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const User = require('../../src/models/user');
const Task = require('../../src/models/task');

// generating a new ID using mongoose
const userOneID = new mongoose.Types.ObjectId();
const userOne = {
    _id: userOneID,
    name: 'Kira',
    email: 'kira@example.com',
    password: 'Kira123',
    tokens: [{
        token: jwt.sign({_id: userOneID}, process.env.JWT_SECRET)
    }]
}

const userTwoID = new mongoose.Types.ObjectId();
const userTwo = {
    _id: userTwoID,
    name: 'Kira2',
    email: 'kira2@example.com',
    password: 'Kira2123',
    tokens: [{
        token: jwt.sign({_id: userTwoID}, process.env.JWT_SECRET)
    }]
}

const taskOne = {
    _id: new mongoose.Types.ObjectId(),
    description: 'First task',
    completed: false,
    owner: userOneID
}

const taskTwo = {
    _id: new mongoose.Types.ObjectId(),
    description: 'Second task',
    completed: true,
    owner: userOneID
}


const taskThree = {
    _id: new mongoose.Types.ObjectId(),
    description: 'Three task',
    completed: true,
    owner: userTwoID
}


const setupDatabase = async() => {
    // deleting the exsting data
    await User.deleteMany();
    await Task.deleteMany();
    
    // entering the new data
    await new User(userOne).save();
    await new User(userTwo).save();
    await new Task(taskOne).save();
    await new Task(taskTwo).save();
    await new Task(taskThree).save();
}

module.exports = {
    userOneID,
    userOne,
    userTwoID,
    userTwo,
    taskOne,
    taskTwo,
    taskThree,
    setupDatabase
}