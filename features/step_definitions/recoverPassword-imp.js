const { Given, When, Then, Before } = require("@cucumber/cucumber");
const assert = require("assert");
const axios = require("axios");
const errorSchema = require("../../schemas/error-schema");
const messageSchema = require("../../schemas/messaje-schema");
const faker = require("@faker-js/faker");
const Ajv = require("ajv");
const { AsyncLocalStorage } = require("async_hooks");
const ajv = new Ajv();

let token; 
let URL_RECOVER;
let URL_API = "http://localhost:8080/api/recover/";
let URL_ADD = "http://localhost:8080/api/add";
let newUser = {
    name: faker.fakerAR.internet.userName(),
    email: faker.fakerAR.internet.email(),
    password: faker.fakerAR.internet.password(),
};

When('el usuario envía una solicitud GET a \\/api\\/recover\\/\\{email} con un correo electrónico y token válidos', async function () {
    try {
        response = await axios.post(URL_ADD, newUser);
        token = response.data;
        URL_RECOVER = URL_API + newUser.email;
        response = await axios.get(URL_RECOVER, { headers: { Authorization: `Bearer ${token}` } });
    } catch (error) {
        if (error.response) {
            response = error.response;
        } else {
            throw new Error('No se recibió una respuesta válida o el mensaje de error está vacío.');
        }
    }
});

Then('el código de respuesta de \\/api\\/recover\\/\\{email} debe ser {int}', function (expectedStatusCode) {
    assert.strictEqual(response.status, expectedStatusCode);
});

Then('el cuerpo de la respuesta de \\/api\\/recover\\/\\{email} debe contener la contraseña recuperada', function () {
    if (response && response.data) {
        const message = response.data;
        valid = ajv.validate(messageSchema, message);
        assert.strictEqual(valid, true);
    } else {
        throw new Error('No se recibió una respuesta válida o los datos están vacíos.');
    }
});

When('el usuario envía una solicitud GET a \\/api\\/recover\\/\\{email} sin un token valido', async function () {
    try {
        URL_RECOVER = URL_API + newUser.email;
        response = await axios.get(URL_RECOVER, {});
    } catch (error) {
        if (error.response) {
            response = error.response;
        } else {
            throw new Error('No se recibió una respuesta válida o el mensaje de error está vacío.');
        }
    }
});
Then('el cuerpo de la respuesta de \\/api\\/recover\\/\\{email} debe contener un mensaje de error', function () {
    if (response && response.data) {
        const error = response.data;
        valid = ajv.validate(errorSchema, error);
        assert.strictEqual(valid, true);
    } else {
        throw new Error('No se recibió una respuesta válida o el mensaje de error está vacío.');
    }
});


When('el usuario envía una solicitud GET a \\/api\\/recover\\/\\{email} con un correo electrónico no registrado', async function () {
    try {
        URL_RECOVER = URL_API + faker.fakerAR.internet.email();
        response = await axios.get(URL_RECOVER, {});
    } catch (error) {
        if (error.response) {
            response = error.response;
        } else {
            throw new Error('No se recibió una respuesta válida o el mensaje de error está vacío.');
        }
    }
});