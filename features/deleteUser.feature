Feature: Eliminación de Usuarios en la API

  Background:
    Given existe un usuario registrado en la aplicación.

  Scenario: Usuario registrado elimina su cuenta exitosamente
    When el usuario envía una solicitud POST a /api/delete/{email} con un token válido y un email
    Then el código de respuesta de /api/delete/{email} debe ser 200
    And el cuerpo de la respuesta de /api/delete/{email} debe contener un mensaje de confirmación de eliminación

  Scenario: Usuario registrado intenta eliminar su cuenta sin proporcionar un token válido
    When el usuario envía una solicitud POST a /api/delete/{email} sin un token válido
    Then el código de respuesta de /api/delete/{email} debe ser 401
    And el cuerpo de la respuesta de /api/delete/{email} debe contener un mensaje de error

  Scenario: Usuario registrado intenta eliminar su cuenta con token de otro usuario
    When el usuario envía una solicitud POST a /api/delete/{email} con un token de otro usuario
    Then el código de respuesta de /api/delete/{email} debe ser 401
    And el cuerpo de la respuesta de /api/delete/{email} debe contener un mensaje de error

  Scenario: Usuario registrado intenta eliminar una cuenta que ya ha sido eliminada
    Given un usuario ha eliminado su cuenta previamente
    When el usuario envía una solicitud POST a /api/delete/{email} con un email eliminado
    Then el código de respuesta de /api/delete/{email} debe ser 404
    And el cuerpo de la respuesta de /api/delete/{email} debe contener un mensaje de error

  Scenario: Usuario registrado intenta eliminar la cuenta de otro usuario
    Given un usuario intenta eliminar la cuenta de otro usuario
    When el usuario envía una solicitud POST a /api/delete/{email} con email no correspondiente a su token
    Then el código de respuesta de /api/delete/{email} debe ser 401
    And el cuerpo de la respuesta de /api/delete/{email} debe contener un mensaje de error