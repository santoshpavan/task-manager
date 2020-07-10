// the starting point of the application
const express = require('express');
const userRouter = require('./routers/user');
const taskRouter = require('./routers/task');
const { translateAliases } = require('./models/task');
require('./db/mongoose'); //mangoose connects to the db

const app = express();
const port = process.env.PORT || 3000;

// middleware function to reject all requests - Maintanence Mode
// app.use((req, res, next) => {
//     res.status(503).send("Website is currently under Maintanence. Please try again later.");
// });

// this allows automatic parsing of JSON data being sent
app.use(express.json());
// registering the routers
app.use(userRouter);
app.use(taskRouter);

app.listen(port, () => {
    console.log('Server is on port: ' + port);
});


// experimental stuff
const User = require('./models/user');
const Task = require('./models/task');

const main = async () => {
    // const task = await Task.findById('5f085693f85a0f03ad5704c4');
    // console.log(task.owner);
    // //to populate the reference User profile
    // await task.populate('owner').execPopulate();
    // console.log(task.owner);
    // const user = await User.findById('5f085639f85a0f03ad5704bc');
    // await user.populate('tasks').execPopulate();
    // console.log(user.tasks);
}

main();