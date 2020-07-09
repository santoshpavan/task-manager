const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// creating a new schema for User
const userSchema = new mongoose.Schema( {
    name: {
        type: String,
        required: true,
        trim: true
    }, 
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if(!validator.isEmail(value)) {
                throw new Error('Not a valid email id');
            }
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 7,
        trim: true,
        validate(value) {
            if(value.toLowerCase().includes('password')) {
                throw new Error('Should not contain "password"');
            }
        }
    },
    age: {
        type: Number,
        default: 0,
        validate(value) {
            if(value < 0) {
                throw new Error('Age must be a positive number');
            }
        }
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
});

// creating a user defined method. Methods -> Instance Method
userSchema.methods.generateAuthToken = async function() {
    const user = this;
    //sign takes 2 args: payload and secret->any random string
    const token = jwt.sign({ _id: user._id.toString() }, 'nodejsisfun');
    
    user.tokens = user.tokens.concat( {token} );
    await user.save();

    return token;
}

// creating a user defined method. Statics -> Static/Model Method
userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne( {email} );
    if (!user) {
        throw new Error('Unable to login');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw new Error('Unable to login');
    }

    return user;
}

// using Middleware to do stuff before or after an event
// pre here is for before and post is after the event
userSchema.pre('save', async function (next) { //not using arrow as it cannot bind "this"
    const user = this;

    if (user.isModified('password')) { //if password field is updated or created
        // 8 is the number of times the algo runs. It's best recommended value
        user.password = await bcrypt.hash(user.password, 8);
    }

    next(); //if this is not called User never gets saved and it gets hung here
});

// the first argument is the Model name and the second argument is the schema
const User = mongoose.model('User', userSchema);

module.exports = User;