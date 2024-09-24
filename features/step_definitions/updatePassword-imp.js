const { Given, When, Then, Before } = require("@cucumber/cucumber");
const assert = require("assert");
const axios = require("axios");
const userSchema = require("../../schemas/user-schema");
const errorSchema = require("../../schemas/error-schema");
const messageSchema = require("../../schemas/messaje-schema");
const faker = require("@faker-js/faker");
const Ajv = require("ajv");
const { AsyncLocalStorage } = require("async_hooks");
const ajv = new Ajv();

let token;
let URL_UPDATE_PASS = "http://localhost:8080/api/update";
let URL_ADD = "http://localhost:8080/api/add";
let newUser = {
    name: faker.fakerAR.internet.userName(),
    email: faker.fakerAR.internet.email(),
    password: faker.fakerAR.internet.password(),
};

Before(function () {
});

When('el usuario envía una solicitud POST a \\/api\\/update\\(Password) con su correo, contraseña nueva, y token valido', async function () {
    try {
        response = await axios.post(URL_ADD, newUser);
        token = response.data;
        newUser.password = faker.fakerAR.internet.password()
        response = await axios.post(URL_UPDATE_PASS, newUser, { headers: { Authorization: `Bearer ${token}` } });
    } catch (error) {
        if (error.response) {
            response = error.response;
        } else {
            throw new Error('No se recibió una respuesta válida o el mensaje de error está vacío.');
        }
    }
});

Then('el código de respuesta de \\/api\\/update\\(Password) debe ser {int}', function (expectedStatusCode) {
    assert.strictEqual(response.status, expectedStatusCode);
});

Then('el cuerpo de la respuesta de \\/api\\/update\\(Password) debe contener la nueva contraseña', function () {
    if (response && response.data) {
        const message = response.data;
        valid = ajv.validate(messageSchema, message);
        assert.strictEqual(valid, true);
    } else {
        throw new Error('No se recibió una respuesta válida o los datos están vacíos.');
    }
});

When('el usuario envía una solicitud POST a \\/api\\/update\\(Password) sin un token valido', async function () {
    try {
        newUser.password = faker.fakerAR.internet.password()
        response = await axios.post(URL_UPDATE_PASS, newUser, {});
    } catch (error) {
        if (error.response) {
            response = error.response;
        } else {
            throw new Error('No se recibió una respuesta válida o el mensaje de error está vacío.');
        }
    }
});

Then('el cuerpo de la respuesta de \\/api\\/update\\(Password) debe contener un mensaje de error', function () {
    if (response && response.data) {
        const error = response.data;
        valid = ajv.validate(errorSchema, error);
        assert.strictEqual(valid, true);
    } else {
        throw new Error('No se recibió una respuesta válida o el mensaje de error está vacío.');
    }
});

When('el usuario envía una solicitud POST a \\/api\\/update\\(Password) con la misma contraseña que usa actualmente', async function () {
    try {
        response = await axios.post(URL_UPDATE_PASS, newUser, { headers: { Authorization: `Bearer ${token}` } });
        response = await axios.post(URL_UPDATE_PASS, newUser, { headers: { Authorization: `Bearer ${token}` } });
    } catch (error) {
        if (error.response) {
            response = error.response;
        } else {
            throw new Error('No se recibió una respuesta válida o el mensaje de error está vacío.');
        }
    }
});

When('el usuario envía una solicitud POST a \\/api\\/update\\(Password) sin proporcionar su correo ni contraseña nueva', async function () {
    try {
        newUser = {
            email: "",
            password: ""
        };
        response = await axios.post(URL_UPDATE_PASS, newUser, {});
    } catch (error) {
        if (error.response) {
            response = error.response;
        } else {
            throw new Error('No se recibió una respuesta válida o el mensaje de error está vacío.');
        }
    }
});