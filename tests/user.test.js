const request = require('supertest');
const app = require('../src/app');
const User = require('../src/models/user');

const userOne = {
    name: 'Kira',
    email: 'kira@example.com',
    password: 'Kira123'
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