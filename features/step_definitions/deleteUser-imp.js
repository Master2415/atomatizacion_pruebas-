const { Given, When, Then, Before } = require("@cucumber/cucumber");
const assert = require("assert");
const axios = require("axios");
const userSchema = require("../../schemas/user-schema");
const errorSchema = require("../../schemas/error-schema");
const messageSchema = require("../../schemas/messaje-schema");
const faker = require("@faker-js/faker");
const Ajv = require("ajv");
const ajv = new Ajv();

let token;
let tokenOfAnotherUser;
let URL_DELETE;
let URL_API = "http://localhost:8080/api/delete/";
let URL_ADD = "http://localhost:8080/api/add";
let newUser = {
    name: faker.fakerAR.internet.userName(),
    email: faker.fakerAR.internet.email(),
    password: faker.fakerAR.internet.password(),
};
let anotherUser = {
    name: faker.fakerAR.internet.userName(),
    email: faker.fakerAR.internet.email(),
    password: faker.fakerAR.internet.password(),
};

Before(function () {
});

Given('existe un usuario registrado en la aplicación.', function () {
    return Promise.resolve();
});

Given('un usuario ha eliminado su cuenta previamente', function () {
    return Promise.resolve();
});

Given('un usuario intenta eliminar la cuenta de otro usuario',  function () {
    return Promise.resolve();
});

// Scenario 1
When('el usuario envía una solicitud POST a \\/api\\/delete\\/\\{email} con un token válido y un email', async function () {

    try {
        response = await axios.post(URL_ADD, newUser);
        token = response.data;
        URL_DELETE = URL_API + newUser.email;
        response = await axios.delete(URL_DELETE, { headers: { Authorization: `Bearer ${token}` } });
    } catch (error) {
        if (error.response) {
            response = error.response;
        } else {
            throw new Error('No se recibió una respuesta válida o el mensaje de error está vacío.');
        }
    }
});

Then('el código de respuesta de \\/api\\/delete\\/\\{email} debe ser {int}', function (expectedStatusCode) {
    assert.strictEqual(response.status, expectedStatusCode);
});

Then('el cuerpo de la respuesta de \\/api\\/delete\\/\\{email} debe contener un mensaje de confirmación de eliminación', function () {
    if (response && response.data) {
        const message = response.data;
        valid = ajv.validate(messageSchema, message);
        assert.strictEqual(valid, true);
    } else {
        throw new Error('No se recibió una respuesta válida o los datos están vacíos.');
    }
});

// Scenario 2
When('el usuario envía una solicitud POST a \\/api\\/delete\\/\\{email} sin un token válido', async function () {
    try {
        URL_DELETE = URL_API + newUser.email;
        response = await axios.post(URL_ADD, newUser);
        response = await axios.delete(URL_DELETE, {});
    } catch (error) {
        if (error.response) {
            response = error.response;
        } else {
            throw new Error('No se recibió una respuesta válida o el mensaje de error está vacío.');
        }
    }
});

Then('el cuerpo de la respuesta de \\/api\\/delete\\/\\{email} debe contener un mensaje de error', function () {
    if (response && response.data) {
        const error = response.data;
        valid = ajv.validate(errorSchema, error);
        assert.strictEqual(valid, true);
    } else {
        throw new Error('No se recibió una respuesta válida o el mensaje de error está vacío.');
    }
});

// Scenario 3

When('el usuario envía una solicitud POST a \\/api\\/delete\\/\\{email} con un token de otro usuario', async function () {
    try {
        response = await axios.post(URL_ADD, anotherUser);
        tokenOfAnotherUser = response.data;
        URL_DELETE = URL_API + newUser.email;
        response = await axios.delete(URL_DELETE, { headers: { Authorization: `Bearer ${tokenOfAnotherUser}` } });
    } catch (error) {
        if (error.response) {
            response = error.response;
        } else {
            throw new Error('No se recibió una respuesta válida o el mensaje de error está vacío.');
        }
    }
});

// Scenario 4
When('el usuario envía una solicitud POST a \\/api\\/delete\\/\\{email} con un email eliminado', async function () {
    try {
        URL_DELETE = URL_API + faker.fakerAR.internet.email();
        response = await axios.delete(URL_DELETE, {});
    } catch (error) {
        if (error.response) {
            response = error.response;
        } else {
            throw new Error('No se recibió una respuesta válida o el mensaje de error está vacío.');
        }
    }
});

// Scenario 5
When('el usuario envía una solicitud POST a \\/api\\/delete\\/\\{email} con email no correspondiente a su token', async function () {
    try {
        URL_DELETE = URL_API + anotherUser.email;
        response = await axios.delete(URL_DELETE, { headers: { Authorization: `Bearer ${token}` } });
    } catch (error) {
        if (error.response) {
            response = error.response;
        } else {
            throw new Error('No se recibió una respuesta válida o el mensaje de error está vacío.');
        }
    }
});