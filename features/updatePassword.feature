Feature: Actualización de Contraseña en la API

  Background:
    Given existe un token válido para acceder a la API

  Scenario: Usuario actualiza su contraseña exitosamente
    When el usuario envía una solicitud POST a /api/update(Password) con su correo, contraseña nueva, y token valido
    Then el código de respuesta de /api/update(Password) debe ser 200
    And el cuerpo de la respuesta de /api/update(Password) debe contener la nueva contraseña

  Scenario: Usuario intenta actualizar su contraseña sin proporcionar un token válido
    When el usuario envía una solicitud POST a /api/update(Password) sin un token valido
    Then el código de respuesta de /api/update(Password) debe ser 401
    And el cuerpo de la respuesta de /api/update(Password) debe contener un mensaje de error

  Scenario: Usuario intenta actualizar su contraseña con la misma contraseña actual
    When el usuario envía una solicitud POST a /api/update(Password) con la misma contraseña que usa actualmente
    Then el código de respuesta de /api/update(Password) debe ser 400
    And el cuerpo de la respuesta de /api/update(Password) debe contener un mensaje de error

  Scenario: Usuario intenta actualizar su contraseña sin proporcionar su correo ni contraseña nueva
    When el usuario envía una solicitud POST a /api/update(Password) sin proporcionar su correo ni contraseña nueva
    Then el código de respuesta de /api/update(Password) debe ser 400
    And el cuerpo de la respuesta de /api/update(Password) debe contener un mensaje de error


