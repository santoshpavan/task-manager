const jwt = require('jsonwebtoken');
const User = require('../models/user');

const auth = async (req, res, next) => {
    try {
        // Authorization header and Bearer are sent from Postman
        const token = req.header('Authorization').replace('Bearer ', '');
        // validating it
        const decoded = jwt.verify(token, 'nodejsisfun');
        const user = await User.findOne({ _id: decoded._id, "tokens.token": token });

        if (!user) {
            throw new Error();
        }
        
        req.user = user;
        next(); //next allows the route handler to run afer this
    } catch (e) {
        res.status(401).send({ error: 'Please authenticate' });
    }
}

module.exports = auth;