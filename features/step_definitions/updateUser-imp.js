const { Given, When, Then, Before } = require("@cucumber/cucumber");
const assert = require("assert");
const axios = require("axios");
const userSchema = require("../../schemas/user-schema");
const errorSchema = require("../../schemas/error-schema");
const faker = require("@faker-js/faker");
const Ajv = require("ajv");
const ajv = new Ajv();

let response;
let token;
let URL_UPDATE = "http://localhost:8080/api/update";
let URL_LOGIN = "http://localhost:8080/api/login";
let userToUpdate = { id: 38, name: "Juan", email: "juan@email.com", password: "1234" };
let ramdomUser = {
    id: Math.floor(Math.random() * 10),
    name: faker.fakerAR.internet.userName(),
    email: faker.fakerAR.internet.email(),
    password: faker.fakerAR.internet.password(),
};
const existingUserEmail = 'antonio@email.com';

Before(function () {
});

Given('existe un usuario registrado registrado en la aplicación con la siguiente información:', function (dataTable) {
    return Promise.resolve();
});

// Scenario 1
When('el usuario registrado envía una solicitud PUT a \\/api\\/update con los datos actualizados y un token válido', async function () {
    try {
        response = await axios.post(URL_LOGIN, userToUpdate);
        token = response.data;
        response = await axios.put(URL_UPDATE, userToUpdate, { headers: { Authorization: `Bearer ${token}` } });
    } catch (error) {
        error = error.response;
    }
});

Then('el código de respuesta de \\/api\\/update debe ser {int}', function (expectedStatusCode) {
    assert.strictEqual(response.status, expectedStatusCode);
});

Then('el cuerpo de la respuesta debe contener los detalles del usuario actualizado', function () {
    if (response && response.data) {
        const user = response.data;
        valid = ajv.validate(userSchema, user);
        assert.strictEqual(valid, true);
    } else {
        throw new Error('No se recibió una respuesta válida o los datos están vacíos.');
    }
});

// Scenario 2
When('el usuario registrado envía una solicitud PUT a \\/api\\/update sin un token válido', async function () {
    try {
        response = await axios.put(URL_UPDATE, userToUpdate);
    } catch (error) {
        if (error.response) {
            response = error.response;
        } else {
            throw new Error('No se recibió una respuesta válida o el mensaje de error está vacío.');
        }
    }
});

Then('el cuerpo de la respuesta de \\/api\\/update debe contener un mensaje de error', function () {
    if (response && response.data) {
        const error = response.data;
        valid = ajv.validate(errorSchema, error);
        assert.strictEqual(valid, true);
    } else {
        throw new Error('No se recibió una respuesta válida o el mensaje de error está vacío.');
    }
});

// Scenario 3
When('el usuario registrado envía una solicitud PUT a \\/api\\/update con un token de otro usuario', async function () {

    try {
        response = await axios.put(URL_UPDATE, ramdomUser, { headers: { Authorization: `Bearer ${token}` } });
    } catch (error) {
        if (error.response) {
            response = error.response;
        } else {
            throw new Error('No se recibió una respuesta válida o el mensaje de error está vacío.');
        }
    }
});

// Scenario 4
When('el usuario registrado envía una solicitud PUT a \\/api\\/update con un correo electrónico ya registrado', async function () {
    try {
        userToUpdate.email = existingUserEmail;
        response = await axios.put(URL_UPDATE, userToUpdate, { headers: { Authorization: `Bearer ${token}` } });
    } catch (error) {
        if (error.response) {
            response = error.response;
        } else {
            throw new Error('No se recibió una respuesta válida o el mensaje de error está vacío.');
        }
    }
});


