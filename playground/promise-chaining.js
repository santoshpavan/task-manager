// testing out the promise chaining with update operation
require('../src/db/mongoose');
const User = require('../src/models/user');

User.findByIdAndUpdate('5f025b62f7ff910791a72f48', {age: 1}).then((user) => {
    console.log(user);
    return User.countDocuments({age: 1});
}).then((result) => {
    console.log(result);
}).catch((e) => {
    console.log(e);
})