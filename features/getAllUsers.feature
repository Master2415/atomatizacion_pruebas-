Feature: Obtener todos los usuarios de la API

  Background:
    Given existe un token válido para acceder a la API

  Scenario: Usuario registrado obtiene correctamente todos los usuarios
    When el usuario envía una solicitud GET a /api/all con un token válido
    Then el código de respuesta de /api/all debe ser 200
    And el cuerpo de la respuesta de /api/all debe contener todos los usuarios

  Scenario: Usuario intenta obtener todos los usuarios sin proporcionar un token válido
    When el usuario envía una solicitud GET a /api/all sin un token válido
    Then el código de respuesta de /api/all debe ser 401
    And el cuerpo de la respuesta de /api/all debe contener un mensaje de error
