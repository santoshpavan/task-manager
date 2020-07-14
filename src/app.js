// the starting point of the application
const express = require('express');
const userRouter = require('./routers/user');
const taskRouter = require('./routers/task');
require('./db/mongoose'); //mangoose connects to the db

const app = express();

// this allows automatic parsing of JSON data being sent
app.use(express.json());
// registering the routers
app.use(userRouter);
app.use(taskRouter);

modules.export = app;