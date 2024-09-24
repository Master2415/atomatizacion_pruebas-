const { Given, When, Then, Before } = require("@cucumber/cucumber");
const assert = require("assert");
const axios = require("axios");
const messageSchema = require("../../schemas/messaje-schema");
const errorSchema = require("../../schemas/error-schema");
const faker = require("@faker-js/faker");
const Ajv = require("ajv");
const ajv = new Ajv();

let response;
let URL_ADD = "http://localhost:8080/api/add";
let userData = {
    name: faker.fakerAR.internet.userName(),
    email: faker.fakerAR.internet.email(),
    password: faker.fakerAR.internet.password(),
};
let existingUser = { id: 38, name: "Juan", email: "juan@gmail.com", password: "1234"};

Before(function () {
    response = null;
});

Given('un nuevo usuario desea registrarse en la aplicación', function () {
    return Promise.resolve();
});

Given('proporciona la siguiente información de registro:', function (dataTable) {
    return Promise.resolve();
});

//Scenario 1

When('el usuario envía una solicitud POST a \\/api\\/add', async function () {

    try {
        response = await axios.post(URL_ADD, userData);
    } catch (error) {
        if (error.response) {
            response = error.response;
        } else {
            throw new Error('No se recibió una respuesta válida o el mensaje de error está vacío.');
        }
    }
});

Then('el código de respuesta de \\/api\\/add debe ser {int}', function (expectedStatusCode) {
    assert.strictEqual(response.status, expectedStatusCode);
});

Then('el cuerpo de la respuesta debe contener el token del usuario registrado', function () {
    if (response && response.data) {
        const token = response.data;
        valid = ajv.validate(messageSchema, token);
        assert.strictEqual(valid, true);
    } else {
        throw new Error('No se recibió una respuesta válida o los datos están vacíos.');
    }
});

//Scenario 2

When('el usuario envía una solicitud POST a \\/api\\/add sin los datos requeridos', async function () {
    try {
        response = await axios.post(URL_ADD, {});
    } catch (error) {
        if (error.response) {
            response = error.response;
        } else {
            throw new Error('No se recibió una respuesta válida o el mensaje de error está vacío.');
        }
    }
});


Then('el cuerpo de la respuesta de \\/api\\/add debe contener un mensaje de error', function () {
    if (response && response.data) {
        const error = response.data;
        valid = ajv.validate(errorSchema, error);
        assert.strictEqual(valid, true);
    } else {
        throw new Error('No se recibió una respuesta válida o el mensaje de error está vacío.');
    }
});

//Scenario 3

Given('un usuario intenta registrarse pero ya existe en la base de datos', function () {
    return Promise.resolve();
});

When('el usuario envía una solicitud POST a \\/api\\/add con un correo ya registrado en la base de datos', async function () {
    try {

        response = await axios.post(URL_ADD, existingUser);
    } catch (error) {
        if (error.response) {
            response = error.response;
        } else {
            throw new Error('No se recibió una respuesta válida o el mensaje de error está vacío.');
        }
    }
});
