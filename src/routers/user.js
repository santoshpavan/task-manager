const express = require('express');
const User = require('../models/user');
const auth = require('../middlewares/auth');
const multer = require('multer');
const { ReplSet } = require('mongodb');
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

router.patch('/users/myProfile', auth, async(req, res) => {
    //dealing with invalid update request - an update for non-existing field
    const fieldPresent = ['age','name','email','password'];
    const fieldsUpdated = Object.keys(req.body);
    const validUpdate = fieldsUpdated.every((field) => fieldPresent.includes(field)); //returns true if only it's true for all
    
    if(!validUpdate) { //not a valid update
        return res.status(400).send({error: 'Invalid update request'});
    }

    try {
        // changing the update being made as it normally bypasses the mongoose
        const user = await User.findById(req.user._id);
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
        await req.user.remove();
        res.send(req.user);
    } catch(e) {
        res.status(500).send();
    }
});

// the destination path for the uploads
const upload=  multer({
    limits: {
        fileSize: 1000000 //in bytes - 1MB
    },
    fileFilter(req, file, callback) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) { //using regex
            return callback(new Error('Please upload an image.'));
        }

        // accepting the upload
        callback(undefined, true);
    }
});

// uploading the file
router.post('/users/myProfile/avatar', auth, upload.single('avatar'), async(req, res) => {
    req.user.avatar = req.file.buffer; //file.buffer is here since dest is remove above
    await req.user.save();
    res.send();
}, (error, req, res, next) => { //this format of args tells that this is for error handling
    res.status(400).send({ error: error.message });
});

router.get('/users/:id/avatar', async(req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if(!user || !user.avatar) {
            throw new Error();
        }

        res.set('Content-Type', 'image/jpg');
        res.send(user.avatar);
    } catch (e) {
        res.status(500).send();
    }
});

router.delete('/users/myProfile/avatar', auth, async(req, res) => {
    try {
        req.user.avatar = undefined;
        await req.user.save();
        res.send();
    } catch(e) {
        res.send(500).send();
    }
});

module.exports = router;