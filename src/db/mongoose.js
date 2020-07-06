const mongoose = require('mongoose');

// the db name can be directly given in the url. Here: task-manager-api
mongoose.connect('mongodb://127.0.0.1:27017/task-manager-api', {
    useNewUrlParser: true,
    useCreateIndex: true //allows the indices to be created automatically
});