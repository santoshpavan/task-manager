require('../src/db/mongoose');
const Task = require('../src/models/task');
const { ResumeToken } = require('mongodb');

Task.findByIdAndDelete('5f02499054945e04eb2277ed').then((task) => {
    console.log(task);
    return Task.countDocuments({completed: false});
}).then((result) => {
    console.log(result);
}).catch((e) => {
    console.log(e);
})