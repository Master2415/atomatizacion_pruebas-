Feature: Actualización de Usuario registrados en la API

  Background:
    Given existe un usuario registrado registrado en la aplicación con la siguiente información:
      | Id | Name | Email          | Password | Date       |
      |  1 | Juan | juan@gmail.com |     1234 | 2024-03-26 |

  Scenario: Usuario registrado actualiza sus datos exitosamente
    When el usuario registrado envía una solicitud PUT a /api/update con los datos actualizados y un token válido
    Then el código de respuesta de /api/update debe ser 200
    And el cuerpo de la respuesta debe contener los detalles del usuario actualizado

  Scenario: Usuario registrado intenta actualizar sus datos sin proporcionar un token válido
    When el usuario registrado envía una solicitud PUT a /api/update sin un token válido
    Then el código de respuesta de /api/update debe ser 401
    And el cuerpo de la respuesta de /api/update debe contener un mensaje de error

  Scenario: Usuario registrado intenta actualizar sus datos con un token de otro usuario registrado
    When el usuario registrado envía una solicitud PUT a /api/update con un token de otro usuario
    Then el código de respuesta de /api/update debe ser 401
    And el cuerpo de la respuesta de /api/update debe contener un mensaje de error

  Scenario: Usuario registrado intenta actualizar sus datos con un correo electrónico que ya está en uso por otro usuario registrado
    When el usuario registrado envía una solicitud PUT a /api/update con un correo electrónico ya registrado
    Then el código de respuesta de /api/update debe ser 409
    And el cuerpo de la respuesta de /api/update debe contener un mensaje de error
