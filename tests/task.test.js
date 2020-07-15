const request = require('supertest');
const app = require('../src/app');
const Task = require('../src/models/task');

const { userOneID, userOne, userTwoID, userTwo, taskOne, taskTwo, taskThree, setupDatabase } = require('./fixtures/db');

beforeEach(setupDatabase);

test('Should create task for user', async() => {
    const response = await request(app)
        .post('/tasks')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            description: 'From my test'
        })
        .expect(201);
    
    // Assertions for the created Task
    const task = await Task.findById(response.body._id);
    expect(task).not.toBeNull();
    expect(task.completed).toEqual(false);
});

test('Should get all the tasks for the authorized user', async() => {
    const response = await request(app)
        .get('/tasks')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200);

    expect(response.body.length).toBe(2);
});

test('Should not delete the task for the unauthorized user', async() => {
    const response = await request(app)
        .delete(`/tasks/${taskOne._id}`)
        .set('Authorization', `Bearer ${userTwo.tokens[0].token}`)
        .send()
        .expect(404);

    // Assertions
    const task = await Task.findById(taskOne._id);
    expect(task).not.toBeNull();
});