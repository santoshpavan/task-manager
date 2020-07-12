const mongoose = require('mongoose');

// the db name can be directly given in the url. Here: task-manager-api
mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useCreateIndex: true, //allows the indices to be created automatically
    useFindAndModify: false
});