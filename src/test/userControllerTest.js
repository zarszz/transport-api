const app = require('../server');
const request = require('supertest');
const expect = require('chai').expect
const faker = require('faker');
const models = require('../models');

const usersModel = models.users;

const validData = {
    email: faker.internet.email(),
    first_name: faker.name.firstName(),
    last_name: faker.name.lastName(),
    password: faker.internet.password()
};

const invalidEmailData = {
    email: 'dasdada',
    first_name: faker.name.firstName(),
    last_name: faker.name.lastName(),
    password: faker.internet.password()
};

const invalidData = {
    email: faker.internet.email(),
    invalid_data: faker.name.firstName(),
    last_name: faker.name.lastName(),
    invalid_data_2: faker.internet.password()
}

const invalid_token = "invalid_token"

var token = "invalid_token";

describe("## POST api/v1/auth/signup", function () {
    it("Should create new user", function (done) {
        request(app)
            .post('/api/v1/auth/signup')
            .send(validData)
            .set('Accept', 'application/json')
            .end((err, response) => {
                if (err) return done(err);
                expect(response.status).to.equal(201);
                expect(response.body.status).to.equal("success");
                done();
            })
    })
    it("Should not create new user with invalid email", function (done) {
        request(app)
            .post('/api/v1/auth/signup')
            .send(invalidEmailData)
            .set('Accept', 'application/json')
            .end((err, response) => {
                if (err) return done(err);
                expect(response.status).to.equal(400);
                expect(response.body.status).to.equal("error");
                expect(response.body.error).to.equal("please enter a valid email");
                done()
            })
    })
    it("Should not create new user with invalid request body", function (done) {
        request(app)
            .post('/api/v1/auth/signup')
            .send(invalidData)
            .set('Accept', 'application/json')
            .end((err, response) => {
                if (err) return done(err);
                expect(response.status).to.equal(400);
                expect(response.body.status).to.equal("error");
                expect(response.body.error).to.equal("email, first name, last name, and password cannot be empty");
                done()
            })
    })
})

describe("## POST api/v1/auth/signin", function () {
    it("Should logged in as admin", function (done) {
        request(app)
            .post('/api/v1/auth/signin')
            .send({ email: 'ucok@email.com', password: 'password' })
            .set('Accept', 'application/json')
            .end((err, response) => {
                if (err) return done(err);
                expect(response.status).to.equal(201);
                done();
            })
    })

    it("Should logged in as normal user", function (done) {
        request(app)
            .post('/api/v1/auth/signin')
            .send({ email: validData.email, password: validData.password })
            .set('Accept', 'application/json')
            .end((err, response) => {
                if (err) return done(err);
                expect(response.status).to.equal(201);
                done();
            })
    })

    it("Should not logged in with unregistered credentials", function (done) {
        request(app)
            .post('/api/v1/auth/signin')
            .send({ email: 'invalidemail@email.com', password: 'invalidpassword99' })
            .set('Accept', 'application/json')
            .end((err, response) => {
                if (err) return done(err);
                expect(response.status).to.equal(404);
                expect(response.body.status).to.equal("error")
                expect(response.body.error).to.equal("user with this email does not exist")
                done();
            })
    })

    it("Should not logged in with invalid credentials", async function () {
        const validUser = await usersModel.findOne({ where: {}, order: [['id', 'DESC']] });
        request(app)
            .post('/api/v1/auth/signin')
            .send({ email: validUser.email, password: 'invalidpassword99' })
            .set('Accept', 'application/json')
            .end((err, response) => {
                expect(response.status).to.equal(400);
                expect(response.body.status).to.equal("error")
                expect(response.body.error).to.equal("the email or password is incorrect")
            })
    })
})

describe('## PUT /api/v1/user', function () {
    let dataBeforeUpdate = null;
    let validUser = null;
    const updateData = {
        id: null,
        email: "ucoxx12351@email.com",
        first_name: "ucox",
        last_name: "dragon"
    }
    before(async function () {
        validUser = await usersModel.findOne({ where: { id: 3 } });
        dataBeforeUpdate = {
            id: validUser.id,
            email: validUser.email,
            first_name: validUser.first_name,
            last_name: validUser.last_name
        };
        updateData.id = dataBeforeUpdate.id;
    })
    before(function (done) {
        request(app)
            .post('/api/v1/auth/signin')
            .send({ email: validUser.email, password: 'password' })
            .set('Content-Type', 'application/json')
            .end((err, response) => {
                if (err) return done(err);
                token = response.body.data.token;
                done();
            })
    });
    it("Should updated user data", function (done) {
        request(app)
            .put('/api/v1/user')
            .send(updateData)
            .set('Accept', 'application/json')
            .set('token', token)
            .end((err, response) => {
                if (err) return done(err);
                expect(response.status).to.equal(200);
                expect(response.body.status).to.equal('success')
                expect(response.body.data.email).to.equal(updateData.email);
                expect(response.body.data.first_name).to.equal(updateData.first_name);
                expect(response.body.data.last_name).to.equal(updateData.last_name);
                done();
            });
    });
    it("Should not updated user data with invalid request body", function (done) {
        request(app)
            .put('/api/v1/user')
            .send(invalidData)
            .set('Accept', 'application/json')
            .set('token', token)
            .end((err, response) => {
                if (err) return done(err);
                expect(response.status).to.equal(400);
                expect(response.body.status).to.equal('error');
                expect(response.body.error).to.equal('email, first name, or last name must not blank');
                done();
            })
    });
    it("Should not updated user data with invalid token provided", function (done) {
        request(app)
            .put('/api/v1/user')
            .send(updateData)
            .set('Accept', 'application/json')
            .set('token', invalid_token)
            .end((err, response) => {
                if (err) return done(err);
                expect(response.status).to.equal(401);
                expect(response.body.status).to.equal('error');
                expect(response.body.error).to.equal('authentication failed');
                done();
            })
    });
    it("Should not updated user data with no token provided", function (done) {
        request(app)
            .put('/api/v1/user')
            .send(updateData)
            .set('Accept', 'application/json')
            .end((err, response) => {
                if (err) return done(err);
                expect(response.status).to.equal(400);
                expect(response.body.status).to.equal('error');
                expect(response.body.error).to.equal('token not provided');
                done();
            })
    });
    after(function (done) {
        request(app)
            .put('/api/v1/user')
            .send(dataBeforeUpdate)
            .set('Accept', 'application/json')
            .set('token', token)
            .end((err, response) => {
                if (err) return done(err);
                expect(response.status).to.equal(200);
                expect(response.body.status).to.equal('success')
                expect(response.body.data.email).to.equal(dataBeforeUpdate.email);
                expect(response.body.data.first_name).to.equal(dataBeforeUpdate.first_name)
                expect(response.body.data.last_name).to.equal(dataBeforeUpdate.last_name)
                done();
            })
    });
})


describe('## GET /api/v1/user', function () {
    before(function (done) {
        request(app)
            .post('/api/v1/auth/signin')
            .send({ email: 'ucok@email.com', password: 'password' })
            .set('Content-Type', 'application/json')
            .end((err, response) => {
                token = response.body.data.token;
                done();
            })
    });
    it('Should can see all users data', function (done) {
        request(app)
            .get('/api/v1/user')
            .set('Content-Type', 'application/json')
            .set('token', token)
            .end((err, response) => {
                if (err) return done(err);
                expect(response.status).to.equal(200);
                expect(response.body.status).to.equal('success');
                done();
            })
    });
    it('Should not see all users data with invalid token provided', function (done) {
        request(app)
            .get('/api/v1/user')
            .set('Content-Type', 'application/json')
            .set('token', invalid_token)
            .end((err, response) => {
                if (err) return done(err);
                expect(response.status).to.equal(401);
                expect(response.body.status).to.equal('error');
                expect(response.body.error).to.equal('You are not authorized to doing this action');
                done();
            })
    });
    it('Should not see all users data with no token provided', function (done) {
        request(app)
            .get('/api/v1/user')
            .set('Content-Type', 'application/json')
            .end((err, response) => {
                if (err) return done(err);
                expect(response.status).to.equal(401);
                expect(response.body.status).to.equal('error');
                expect(response.body.error).to.equal('You are not authorized to doing this action');
                done();
            })
    });
});

describe('## DELETE /api/v1/:userId', function () {
    var userData = null;
    var userBeforeDelete = null;
    var url = '';
    before(async function () {
        // get latest record in unit test database
        userData = await usersModel.findOne({ where: {}, order: [['id', 'DESC']] });
        userBeforeDelete = {
            email: userData.email,
            password: faker.internet.password(),
            first_name: userData.first_name,
            last_name: userData.last_name,
        }
        url = `/api/v1/user/${userData.id}`;
    })
    before(function (done) {
        request(app)
            .post('/api/v1/auth/signin')
            .send({ email: 'ucok@email.com', password: 'password' })
            .set('Content-Type', 'application/json')
            .end((err, response) => {
                token = response.body.data.token;
                done();
            })
    })
    it('Should delete registered user', function (done) {
        request(app)
            .delete(url)
            .set('Content-Type', 'application/json')
            .set('token', token)
            .end((err, response) => {
                if (err) return done(err);
                expect(response.status).to.equal(200);
                expect(response.body.data.message).to.equal('user delete success');
                done();
            })
    });
    it('Should not delete user data with invalid token provided', function (done) {
        request(app)
            .delete(url)
            .set('Content-Type', 'application/json')
            .set('token', invalid_token)
            .end((err, response) => {
                if (err) return done(err);
                expect(response.status).to.equal(401);
                expect(response.body.status).to.equal('error');
                expect(response.body.error).to.equal('You are not authorized to doing this action');
                done();
            })
    });
    it('Should not delete user data with no token provided', function (done) {
        request(app)
            .get('/api/v1/user')
            .set('Content-Type', 'application/json')
            .set('token', invalid_token)
            .end((err, response) => {
                if (err) return done(err);
                expect(response.status).to.equal(401);
                expect(response.body.status).to.equal('error');
                expect(response.body.error).to.equal('You are not authorized to doing this action');
                done();
            })
    });
    after(async function () {
        await usersModel.create(userBeforeDelete,
            {
                fields: ['email', 'password', 'first_name', 'last_name']
            })
    })
});