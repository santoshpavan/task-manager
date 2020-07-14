const request = require('supertest');
const app = require('../src/app');
const User = require('../src/models/user');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const { send } = require('@sendgrid/mail');
const { resource, response } = require('../src/app');
const e = require('express');

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
    const response = await request(app).post('/users').send({
        name: 'Santosh',
        email: 'santosh@example.com',
        password: 'Santosh123'
    }).expect(201); //201 status expected

    // Assert that the database was changed correctly
    const user = await User.findById(response.body.user._id);
    expect(user).not.toBeNull();

    // Assertions about the response
    expect(response.body).toMatchObject({
        user: {
            name: 'Santosh',
            email: 'santosh@example.com'
        },
        token: user.tokens[0].token
    });

    // Asserting that the password is not saved as plain text
    expect(user.password).not.toBe(response.body.user.password);
});

test('Should login existing user', async() => {
    const response = await request(app).post('/users/login').send({
        email: userOne.email,
        password: userOne.password
    }).expect(200);

    const user = await User.findById(userOneID);
    // Asserting that the tokens will be the same
    expect(response.body.token).toBe(user.tokens[1].token);
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
    
    const user = await User.findById(userOneID);
    // Asserting that the user is deleted in DB
    expect(user).toBeNull();
});

test('Should not delete account for unauthenticated user', async() => {
    await request(app)
        .delete('/users/myProfile')
        .send()
        .expect(401);
});

test('Should upload avatar image', async() => {
    await request(app)
        .post('/users/myProfile/avatar')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .attach('avatar', 'tests/fixtures/profile-pic.jpg')
        .expect(200);
    
    const user = await User.findById(userOneID);
    expect(user.avatar).toEqual(expect.any(Buffer));
});

test('Should update valid user fields', async() => {
    await request(app)
        .patch('/users/myProfile')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            name: 'Kira'
        })
        .expect(200);
   
    const user = await User.findById(userOneID);
    // Assertion that the user name has changed
    expect(user.name).toBe('Kira');
});

test('Should not update invalid user fields', async() => {
    await request(app)
        .patch('/users/myProfile')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            phone: '900900900'
        })
        .expect(400);
});