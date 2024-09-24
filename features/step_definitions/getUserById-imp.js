const { Given, When, Then, Before } = require("@cucumber/cucumber");
const assert = require("assert");
const axios = require("axios");
const userSchema = require("../../schemas/user-schema");
const errorSchema = require("../../schemas/error-schema");
const messageSchema = require("../../schemas/messaje-schema");
const faker = require("@faker-js/faker");
const Ajv = require("ajv");
const ajv = new Ajv();

let URL_GET;
let ID_TO_SEARCH = "10";
let URL_API = "http://localhost:8080/api/search/";
let URL_ADD = "http://localhost:8080/api/add";
let newUser = {
    name: faker.fakerAR.internet.userName(),
    email: faker.fakerAR.internet.email(),
    password: faker.fakerAR.internet.password(),
};


Before(function () {
});

Given('existe un token válido para acceder a la API', function () {
    return Promise.resolve();
});

// Scenario 1
When('el usuario envía una solicitud GET a \\/api\\/search\\/\\{id} con un ID y token válido', async function () {
    try {
        response = await axios.post(URL_ADD, newUser);
        token = response.data;
        URL_GET = URL_API + ID_TO_SEARCH;
        response = await axios.get(URL_GET, { headers: { Authorization: `Bearer ${token}` } });
    } catch (error) {
        if (error.response) {
            response = error.response;
        } else {
            throw new Error('No se recibió una respuesta válida o el mensaje de error está vacío.');
        }
    }
});

Then('el código de respuesta de \\/api\\/search\\/\\{id} debe ser {int}', function (expectedStatusCode) {
    assert.strictEqual(response.status, expectedStatusCode);
});

Then('el cuerpo de la respuesta de \\/api\\/search\\/\\{id} debe contener el usuario solicitado', function () {
    if (response && response.data) {
        const message = response.data;
        valid = ajv.validate(userSchema, message);
        assert.strictEqual(valid, true);
    } else {
        throw new Error('No se recibió una respuesta válida o los datos están vacíos.');
    }
});

// Scenario 2
When('el usuario envía una solicitud GET a \\/api\\/search\\/\\{id} sin un token valido',async function () {
    try {
        response = await axios.get(URL_GET, {});
    } catch (error) {
        if (error.response) {
            response = error.response;
        } else {
            throw new Error('No se recibió una respuesta válida o el mensaje de error está vacío.');
        }
    }
});

  Then('el cuerpo de la respuesta de \\/api\\/search\\/\\{id} debe contener un mensaje de error', function () {
    if (response && response.data) {
        const error = response.data;
        valid = ajv.validate(errorSchema, error);
        assert.strictEqual(valid, true);
    } else {
        throw new Error('No se recibió una respuesta válida o el mensaje de error está vacío.');
    }
});

// Scenario 3
  When('el usuario envía una solicitud GET a \\/api\\/search\\/\\{id} con un ID no existente', async function () {
    try {
        URL_GET = URL_API + '0';
        response = await axios.get(URL_GET, { headers: { Authorization: `Bearer ${token}` } });
    } catch (error) {
        if (error.response) {
            response = error.response;
        } else {
            throw new Error('No se recibió una respuesta válida o el mensaje de error está vacío.');
        }
    }
  });

