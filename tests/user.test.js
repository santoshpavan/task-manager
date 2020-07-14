const request = require('supertest');
const app = require('../src/app');
const User = require('../src/models/user');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const { send } = require('@sendgrid/mail');

// generating a new ID using mongoose
const userOneID = new mongoose.Types.ObjectId();
const userOne = {
    _id: userOneID,
    name: 'Kira',
    email: 'kira@example.com',
    password: 'Kira123',
    tokens: [{
        token: jwt.sign({_id: userOneID}, process.env.JWT_SECRET)
    }]
}

beforeEach(async() => {
    await User.deleteMany();
    await new User(userOne).save();
})

test('Should signup a new user', async () => {
    // supertest supports asynchronous actions
    await request(app).post('/users').send({
        name: 'Santosh',
        email: 'santosh@example.com',
        password: 'Santosh123'
    }).expect(201); //201 status expected
});

test('Should login existing user', async() => {
    await request(app).post('/users/login').send({
        email: userOne.email,
        password: userOne.password
    }).expect(200);
});

test('Should not login a non-existent user', async() => {
    await request(app).post('/users/login').send({
        email: userOne.email,
        password: 'Keka'
    }).expect(400);
});

test('Should get profile for authenticated user', async() => {
    await request(app)
        .get('/users/myProfile')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`) //authorization header
        .send()
        .expect(200);
});

test('Should not get profile for unauthenticated user', async() => {
    await request(app)
        .get('/users/myProfile')
        .send()
        .expect(401);
});

test('Should delete account for authenticated user', async() => {
    await request(app)
        .delete('/users/myProfile')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`) //authorization header
        .send()
        .expect(200);
});

test('Should not delete account for unauthenticated user', async() => {
    await request(app)
        .delete('/users/myProfile')
        .send()
        .expect(401);
});