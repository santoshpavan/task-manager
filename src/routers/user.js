const express = require('express');
const User = require('../models/user');
const auth = require('../middlewares/auth');
// creating a new router
const router = new express.Router();

// signup (creation) of users
router.post('/users', async(req, res) => {
    const user = new User(req.body);
    try {
        await user.save();
        const token = await user.generateAuthToken();
        res.status(201).send({user, token});
    } catch(e) {
        res.status(401).send();
    }
});

router.post('/users/login', async(req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password);
        // it is not for "User" but for "user"
        const token = await user.generateAuthToken();
        res.send({user, token});
    } catch(e) {
        res.status(404).send();
    }
});

router.post('/users/logout', auth, async(req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((tokenObject) => {
            return tokenObject.token != req.token; //false for the present token, removing it
        });

        await req.user.save();
        res.send(); //sending 200-ok status
    } catch(e) {
        res.status(500).send();
    }
});

router.post('/users/logoutAll', auth, async(req, res) => {
    try {
        req.user.tokens = [];

        await req.user.save();
        res.send(); //sending 200-ok status
    } catch(e) {
        res.status(500).send();
    }
});

// auth-middleware runs first and then the route handler runs
router.get('/users/myProfile', auth, async(req, res) => {
    res.send(req.user);
});

router.get('/users/:id', async(req, res) => {
    const userId = req.params.id;
    console.log(userId);
    try{
        const user = await User.findById(userId);
        if(!user) {
            return res.status(404).send();
        }
        res.send(user);
    } catch(e) {
        res.status(500).send();
    }
});

router.patch('/users/:id', async(req, res) => {
    const userId = req.params.id;
    //dealing with invalid update request - an update for non-existing field
    const fieldPresent = ['age','name','email','password'];
    const fieldsUpdated = Object.keys(req.body);
    const validUpdate = fieldsUpdated.every((field) => fieldPresent.includes(field)); //returns true if only it's true for all
    
    if(!validUpdate) { //not a valid update
        return res.status(400).send({error: 'Invalid update request'});
    }

    try {
        // changing the update being made as it normally bypasses the mongoose
        const user = await User.findById(userId);
        if(!user) {
            res.status(404).send();
        }
        // this way it goes through mongoose and uses the schema change
        fieldsUpdated.forEach((updateField) => user[updateField] = req.body[updateField]);
        await user.save();

        res.send(user);
    } catch(e) {
        res.status(400).send(e);
    }
});

router.delete('/users/myProfile', auth, async(req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.user._id);
        res.send(user);
    } catch(e) {
        res.status(500).send();
    }
});

module.exports = router;