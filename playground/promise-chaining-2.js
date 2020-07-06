require('../src/db/mongoose');
const Task = require('../src/models/task');
const { ResumeToken } = require('mongodb');

// Task.findByIdAndDelete('5f02499054945e04eb2277ed').then((task) => {
//     console.log(task);
//     return Task.countDocuments({completed: false});
// }).then((result) => {
//     console.log(result);
// }).catch((e) => {
//     console.log(e);
// })

const removeTask = async (id) => {
    await Task.findByIdAndDelete(id);
    const count = Task.countDocuments({completed: false});
    return count;
}

removeTask('5f026520ab2186093e29d257').then((count) => {
    console.log(count);
}).catch((e) => {
    console.log(e);
});