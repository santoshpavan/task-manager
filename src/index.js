// the starting point of the application
const express = require('express');
const User = require('./models/user');
const Task = require('./models/task');
const userRouter = require('./routers/users');
const taskRouter = require('./routers/tasks');
require('./db/mongoose'); //mangoose connects to the db

const app = express();
const port = process.env.PORT || 3000;

// this allows automatic parsing of JSON data being sent
app.use(express.json());
// registering the routers
app.use(userRouter);
app.use(taskRouter);

app.listen(port, () => {
    console.log('Server is on port: ' + port);
});
