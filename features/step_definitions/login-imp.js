const { Given, When, Then, Before } = require("@cucumber/cucumber");
const assert = require("assert");
const axios = require("axios");
const errorSchema = require("../../schemas/error-schema");
const messageSchema = require("../../schemas/messaje-schema");
const faker = require("@faker-js/faker");
const Ajv = require("ajv");
const ajv = new Ajv();

let response;
let URL_LOGIN = "http://localhost:8080/api/login";
let URL_ADD = "http://localhost:8080/api/add";
let newUser = {
    name: faker.fakerAR.internet.userName(),
    email: faker.fakerAR.internet.email(),
    password: faker.fakerAR.internet.password(),
};

Before(function () {
});

Given('existe un usuario registrado en la aplicación con la siguiente información:', function (dataTable) {
    return Promise.resolve();
});

When('el usuario envía una solicitud POST a \\/api\\/login con credenciales válidas', async function () {
    try {
        response = await axios.post(URL_ADD, newUser);
        response = await axios.post(URL_LOGIN, newUser);
    } catch (error) {
        if (error.response) {
            response = error.response;
        } else {
            throw new Error('No se recibió una respuesta válida o el mensaje de error está vacío.');
        }
    }
});

Then('el código de respuesta debe ser {int}',  function (expectedStatusCode) {
    assert.strictEqual(response.status, expectedStatusCode);
});

Then('el cuerpo de la respuesta debe contener un token de acceso válido', function () {
    if (response && response.data) {
        const message = response.data;
        valid = ajv.validate(messageSchema, message);
        assert.strictEqual(valid, true);
    } else {
        throw new Error('No se recibió una respuesta válida o los datos están vacíos.');
    }
});

When('el usuario envía una solicitud GET a \\/api\\/login sin metodo post', async function () {
    try {
        response = await axios.get(URL_LOGIN, newUser);
    } catch (error) {
        if (error.response) {
            response = error.response;
        } else {
            throw new Error('No se recibió una respuesta válida o el mensaje de error está vacío.');
        }
    }
});

Then('el cuerpo de la respuesta debe contener un mensaje de error', function () {
    if (response && response.data) {
        const error = response.data;
        valid = ajv.validate(errorSchema, error);
        assert.strictEqual(valid, true);
    } else {
        throw new Error('No se recibió una respuesta válida o el mensaje de error está vacío.');
    }
});

When('el usuario envía una solicitud POST a \\/api\\/login sin nombre de usuario o contraseña', async function () {
    try {
        newUser = {
            name: "",
            email: "",
            password: ""
        };
        response = await axios.post(URL_LOGIN, newUser);
    } catch (error) {
        if (error.response) {
            response = error.response;
        } else {
            throw new Error('No se recibió una respuesta válida o el mensaje de error está vacío.');
        }
    }
});

When('el usuario envía una solicitud POST a \\/api\\/login con credenciales inválidas', async function () {
    try {
        newUser = {
            name: faker.fakerAR.internet.userName(),
            email: faker.fakerAR.internet.email(),
            password: faker.fakerAR.internet.password(),
        };
        response = await axios.post(URL_LOGIN, newUser);
    } catch (error) {
        if (error.response) {
            response = error.response;
        } else {
            throw new Error('No se recibió una respuesta válida o el mensaje de error está vacío.');
        }
    }
});