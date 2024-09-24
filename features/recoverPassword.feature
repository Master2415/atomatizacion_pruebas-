Feature: Recuperación de Contraseña en la API

  Background:
    Given existe un token válido para acceder a la API

  Scenario: Usuario recupera su contraseña exitosamente
    When el usuario envía una solicitud GET a /api/recover/{email} con un correo electrónico y token válidos
    Then el código de respuesta de /api/recover/{email} debe ser 200
    And el cuerpo de la respuesta de /api/recover/{email} debe contener la contraseña recuperada

  Scenario: Usuario intenta recuperar su contraseña sin proporcionar un token válido
    When el usuario envía una solicitud GET a /api/recover/{email} sin un token valido
    Then el código de respuesta de /api/recover/{email} debe ser 401
    And el cuerpo de la respuesta de /api/recover/{email} debe contener un mensaje de error

  Scenario: Usuario intenta recuperar su contraseña con un correo electrónico no registrado
    When el usuario envía una solicitud GET a /api/recover/{email} con un correo electrónico no registrado
    Then el código de respuesta de /api/recover/{email} debe ser 404
    And el cuerpo de la respuesta de /api/recover/{email} debe contener un mensaje de error
