Feature: Obtener Usuario por ID en la API

  Background:
    Given existe un token válido para acceder a la API

  Scenario: Usuario obtiene correctamente un usuario por ID
    When el usuario envía una solicitud GET a /api/search/{id} con un ID y token válido
    Then el código de respuesta de /api/search/{id} debe ser 200
    And el cuerpo de la respuesta de /api/search/{id} debe contener el usuario solicitado

  Scenario: Usuario intenta obtener un usuario por ID sin proporcionar un token válido
    When el usuario envía una solicitud GET a /api/search/{id} sin un token valido
    Then el código de respuesta de /api/search/{id} debe ser 401
    And el cuerpo de la respuesta de /api/search/{id} debe contener un mensaje de error

  Scenario: Usuario intenta obtener un usuario por ID que no existe
    When el usuario envía una solicitud GET a /api/search/{id} con un ID no existente
    Then el código de respuesta de /api/search/{id} debe ser 404
    And el cuerpo de la respuesta de /api/search/{id} debe contener un mensaje de error