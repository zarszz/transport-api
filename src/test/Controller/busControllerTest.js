const app = require('../../server');
const request = require('supertest');
const expect = require('chai').expect
const faker = require('faker');
const models = require('../../models');

const busModel = models.buses;

var validData = {
    number_plate: faker.lorem.word(),
    manufacturer: faker.lorem.word(),
    model: faker.lorem.word(),
    year:  faker.random.number(5000).toString(),
    capacity: faker.random.number(200)
};

const invalidData = {
    random_things: faker.lorem.word(),
    manufacturer: faker.lorem.word(),
    model: faker.lorem.word(),
    year: faker.random.number(5000),
    capacity: faker.random.number(200)
};

const admin_credentials = {
    email: "ucok@email.com",
    password: "password"
};

const invalid_token = 'invalid_token';

var token = '';

describe("## POST api/v1/bus", function () {
    before(function (done) {
        request(app)
            .post('/api/v1/auth/signin')
            .send(admin_credentials)
            .set('Content-Type', 'application/json')
            .end((err, response) => {
                token = response.body.data.token;
                done();
            });
    });
    it("Should create new bus", function (done) {
        request(app)
            .post('/api/v1/bus')
            .send(validData)
            .set('token', token)
            .set('Content-Type', 'application/json')
            .end((err, response) => {
                expect(response.status).to.equal(201);
                expect(response.body.status).to.equal("success");
                expect(response.body.data.manufacturer).to.equal(validData.manufacturer)
                expect(response.body.data.model).to.equal(validData.model);
                done();
            });
    });
    it("Should not create new bus with invalid field", function (done) {
        request(app)
            .post('/api/v1/bus')
            .send(invalidData)
            .set('token', token)
            .set('Content-Type', 'application/json')
            .end((err, response) => {
                expect(response.status).to.equal(400);
                expect(response.body.status).to.equal("error");
                expect(response.body.error).to.equal("all fields are required");
                done();
            });
    });
    it("Should not create new bus with invalid token provided", function (done) {
        request(app)
            .post('/api/v1/bus')
            .send(validData)
            .set('token', invalid_token)
            .set('Content-Type', 'application/json')
            .end((err, response) => {
                expect(response.status).to.equal(401);
                expect(response.body.status).to.equal("error");
                expect(response.body.error).to.equal("authentication failed");
                done();
            })
    })
    it("Should not create new bus with no token provided", function (done) {
        request(app)
            .post('/api/v1/bus')
            .send(validData)
            .set('Content-Type', 'application/json')
            .end((err, response) => {
                expect(response.status).to.equal(400);
                expect(response.body.status).to.equal("error");
                expect(response.body.error).to.equal("token not provided");
                done();
            })
    })
    after(async function () {
        await busModel.destroy({where: {number_plate: validData.number_plate}});
    })
})

describe("## GET /api/v1/bus", function () {
    let count_buses = NaN;
    before(function (done) {
        request(app)
            .post('/api/v1/auth/signin')
            .send(admin_credentials)
            .set('Content-Type', 'application/json')
            .end((err, response) => {
                token = response.body.data.token;
                done();
            });
    });
    before(async function () {
        count_buses = await busModel.count();
    });
    it("Should can see all buses data", function (done) {
        request(app)
            .get('/api/v1/bus')
            .set('token', token)
            .set('Content-Type', 'application/json')
            .end((err, response) => {
                let response_length = response.body.data.length;
                expect(response.status).to.equal(200);
                expect(response.body.status).to.equal('success');
                expect(response_length).to.equal(count_buses);
                done();
            });
    });
    it("Should not see all buses with invalid token provided", function (done) {
        request(app)
            .get('/api/v1/bus')
            .set('token', invalid_token)
            .set('Content-Type', 'application/json')
            .end((err, response) => {
                expect(response.status).to.equal(401);
                expect(response.body.status).to.equal("error");
                expect(response.body.error).to.equal("authentication failed");
                done();
            });
    });
    it("Should not see all buses with no token provided", function (done) {
        request(app)
            .get('/api/v1/bus')
            .set('Content-Type', 'application/json')
            .end((err, response) => {
                expect(response.status).to.equal(400);
                expect(response.body.status).to.equal("error");
                expect(response.body.error).to.equal("token not provided");
                done();
            });
    });
});

describe("## PUT /api/v1/bus", function () {
    let dataBeforeUpdate = null;
    let busId = null;
    let dataAfterUpdate = validData;
    before(async function () {
        let data = await busModel.findOne({ where: {}, order: [['id', 'DESC']] });
        delete data['dataValues'].createdAt;
        delete data['dataValues'].updatedAt;
        dataBeforeUpdate = data['dataValues'];
        busId = dataBeforeUpdate.id;
        dataAfterUpdate.id = busId;
    });
    before(function (done) {
        request(app)
            .post('/api/v1/auth/signin')
            .send(admin_credentials)
            .set('Content-Type', 'application/json')
            .end((err, response) => {
                token = response.body.data.token;
                done();
            });
    });
    it("Should update bus", function (done) {
        request(app)
            .put('/api/v1/bus')
            .send(dataAfterUpdate)
            .set('token', token)
            .set('Content-Type', 'application/json')
            .end((err, response) => {
                expect(response.status).to.equal(200);
                expect(response.body.status).to.equal('success');
                expect(response.body.data.id).to.equal(busId);
                expect(response.body.data.number_plate).to.equal(dataAfterUpdate.number_plate);
                expect(response.body.data.manufacturer).to.equal(dataAfterUpdate.manufacturer);
                expect(response.body.data.model).to.equal(dataAfterUpdate.model);
                expect(response.body.data.year).to.equal(dataAfterUpdate.year);
                expect(response.body.data.capacity).to.equal(dataAfterUpdate.capacity);
                done();
            });
    });
    it("Should not update bus because not found", function (done) {
        let invalidDataId = Object.assign({}, validData);
        invalidDataId.id = 6969;
        request(app)
            .put('/api/v1/bus')
            .send(invalidDataId)
            .set('token', token)
            .set('Content-Type', 'application/json')
            .end((err, response) => {
                expect(response.status).to.equal(404);
                expect(response.body.status).to.equal('error');
                expect(response.body.error).to.equal('bus not found');
                done();
            });
    });
    it("Should not update bus with invalid fields", function (done) {
        let invalidDataId = Object.assign({}, invalidData);
        invalidDataId.id = busId;
        request(app)
            .put('/api/v1/bus')
            .send(invalidDataId)
            .set('token', token)
            .set('Content-Type', 'application/json')
            .end((err, response) => {
                expect(response.status).to.equal(400);
                expect(response.body.status).to.equal('error');
                expect(response.body.error).to.equal('all fields are required');
                done();
            });
    });
    it("Should not update bus with invalid token provided", function (done) {
        request(app)
            .put('/api/v1/bus')
            .set('token', invalid_token)
            .set('Content-Type', 'application/json')
            .end((err, response) => {
                expect(response.status).to.equal(401);
                expect(response.body.status).to.equal("error");
                expect(response.body.error).to.equal("authentication failed");
                done();
            });
    });
    it("Should not update bus with no token provided", function (done) {
        request(app)
            .put('/api/v1/bus')
            .set('Content-Type', 'application/json')
            .end((err, response) => {
                expect(response.status).to.equal(400);
                expect(response.body.status).to.equal("error");
                expect(response.body.error).to.equal("token not provided");
                done();
            });
    });
    after(async function () {
        await busModel.update(dataBeforeUpdate, {where: {id: busId}});
    });
});

describe("## DELETE /api/v1/bus/<:busId>", function () {
    let dataBeforeDelete = null;
    let url = null;
    before(async function () {
        let data = await busModel.findOne({ where: {}, order: [['id', 'DESC']] });
        dataBeforeDelete = {
            number_plate: data.number_plate,
            manufacturer: data.manufacturer,
            model: data.model,
            year: data.year,
            capacity: data.capacity
        };
        url = `/api/v1/bus/${data.id}`;
    });
    before(function (done) {
        request(app)
            .post('/api/v1/auth/signin')
            .send(admin_credentials)
            .set('Content-Type', 'application/json')
            .end((err, response) => {
                token = response.body.data.token;
                done();
            });
    });
    it("Should delete registered bus", function(done) {
        request(app)
            .delete(url)
            .set('token', token)
            .set('Content-Type', 'application/json')
            .end((err, response) => {
                expect(response.status).to.equal(200);
                expect(response.body.status).to.equal('success');
                expect(response.body.message).to.equal('delete bus successfully');
                done();
            })
    });
    it("Should not delete bus because not found", function (done) {
        let invalidUrl = `/api/v1/bus/12345`;
        request(app)
            .delete(invalidUrl)
            .set('token', token)
            .set('Content-Type', 'application/json')
            .end((err, response) => {
                expect(response.status).to.equal(404);
                expect(response.body.status).to.equal('error');
                expect(response.body.error).to.equal('bus not found');
                done();
            });
    });
    it("Should not delete bus with invalid token provided", function (done) {
        request(app)
            .delete(url)
            .set('token', invalid_token)
            .set('Content-Type', 'application/json')
            .end((err, response) => {
                expect(response.status).to.equal(401);
                expect(response.body.status).to.equal("error");
                expect(response.body.error).to.equal("authentication failed");
                done();
            });
    });
    it("Should not delete bus with no token provided", function (done) {
        request(app)
            .delete(url)
            .set('Content-Type', 'application/json')
            .end((err, response) => {
                expect(response.status).to.equal(400);
                expect(response.body.status).to.equal("error");
                expect(response.body.error).to.equal("token not provided");
                done();
            });
    });
    after(async function () {
        await busModel.create(dataBeforeDelete);
    })
})