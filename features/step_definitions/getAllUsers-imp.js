const { Given, When, Then, Before } = require("@cucumber/cucumber");
const assert = require("assert");
const axios = require("axios");
const userListSchema = require("../../schemas/userList-schema");
const errorSchema = require("../../schemas/error-schema");
const faker = require("@faker-js/faker");
const Ajv = require("ajv");
const ajv = new Ajv();

let page = Math.floor(Math.random() * 10);
let pageSize = Math.floor(Math.random() * 10);
let URL_GETALL = "http://localhost:8080/api/all?page=" + page + "&pageSize=" + pageSize;
let URL_ADD = "http://localhost:8080/api/add";
let newUser = {
    name: faker.fakerAR.internet.userName(),
    email: faker.fakerAR.internet.email(),
    password: faker.fakerAR.internet.password(),
};

When('el usuario envía una solicitud GET a \\/api\\/all con un token válido', async function () {
    try {
        response = await axios.post(URL_ADD, newUser);
        token = response.data;
        response = await axios.get(URL_GETALL, { headers: { Authorization: `Bearer ${token}` } });
    } catch (error) {
        if (error.response) {
            response = error.response;
        } else {
            throw new Error('No se recibió una respuesta válida o el mensaje de error está vacío.');
        }
    }
});

Then('el código de respuesta de \\/api\\/all debe ser {int}', function (expectedStatusCode) {
    assert.strictEqual(response.status, expectedStatusCode);
});

Then('el cuerpo de la respuesta de \\/api\\/all debe contener todos los usuarios', function () {
    if (response && response.data) {
        const users = response.data;
        valid = ajv.validate(userListSchema, users);
        assert.strictEqual(valid, true);
    } else {
        throw new Error('No se recibió una respuesta válida o los datos están vacíos.');
    }
});

When('el usuario envía una solicitud GET a \\/api\\/all sin un token válido', async function () {
    try {
        response = await axios.get(URL_GETALL, {});
    } catch (error) {
        if (error.response) {
            response = error.response;
        } else {
            throw new Error('No se recibió una respuesta válida o el mensaje de error está vacío.');
        }
    }
});

Then('el cuerpo de la respuesta de \\/api\\/all debe contener un mensaje de error', function () {
    if (response && response.data) {
        const error = response.data;
        valid = ajv.validate(errorSchema, error);
        assert.strictEqual(valid, true);
    } else {
        throw new Error('No se recibió una respuesta válida o el mensaje de error está vacío.');
    }
});
