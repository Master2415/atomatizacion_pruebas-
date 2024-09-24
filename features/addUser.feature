Feature: Registro de Usuarios en la API

  Background:
    Given un nuevo usuario desea registrarse en la aplicación
    And proporciona la siguiente información de registro:
      | Name | Email          | Password |
      | douglas | douglas@gmail.com | 1234     |

  Scenario: Nuevo usuario se registra con éxito en la base de datos
    When el usuario envía una solicitud POST a /api/add
    Then el código de respuesta de /api/add debe ser 201
    And el cuerpo de la respuesta debe contener el token del usuario registrado

  Scenario: Nuevo usuario intenta registrarse sin proporcionar los datos requeridos
    When el usuario envía una solicitud POST a /api/add sin los datos requeridos
    Then el código de respuesta de /api/add debe ser 400
    And el cuerpo de la respuesta de /api/add debe contener un mensaje de error

  Scenario: Nuevo usuario intenta registrarse con un email que ya está registrado
    Given un usuario intenta registrarse pero ya existe en la base de datos
    When el usuario envía una solicitud POST a /api/add con un correo ya registrado en la base de datos
    Then el código de respuesta de /api/add debe ser 409
    And el cuerpo de la respuesta de /api/add debe contener un mensaje de error
