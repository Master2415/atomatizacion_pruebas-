Feature: Autenticación de Usuarios en la API

  Background:
    Given existe un usuario registrado en la aplicación con la siguiente información:
      | Name | Password |
      | Juan |     1234 |

  Scenario: Usuario inicia sesión correctamente
    When el usuario envía una solicitud POST a /api/login con credenciales válidas
    Then el código de respuesta debe ser 200
    And el cuerpo de la respuesta debe contener un token de acceso válido

  Scenario: Usuario intenta iniciar sesión sin proporcionar un método POST
    When el usuario envía una solicitud GET a /api/login sin metodo post
    Then el código de respuesta debe ser 404
    And el cuerpo de la respuesta debe contener un mensaje de error

  Scenario: Usuario intenta iniciar sesión sin proporcionar un nombre de usuario o contraseña
    When el usuario envía una solicitud POST a /api/login sin nombre de usuario o contraseña
    Then el código de respuesta debe ser 400
    And el cuerpo de la respuesta debe contener un mensaje de error

  Scenario: Usuario intenta iniciar sesión con credenciales inválidas
    When el usuario envía una solicitud POST a /api/login con credenciales inválidas
    Then el código de respuesta debe ser 404
    And el cuerpo de la respuesta debe contener un mensaje de error
