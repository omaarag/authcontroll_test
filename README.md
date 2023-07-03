# Prueba Técnica - Autenticación y Gestión de Usuarios

## Objetivo

Crear una aplicación de registro de usuarios que permita a los usuarios registrarse, iniciar sesión y ver su perfil.

## Requerimientos

### Frontend

* [x] Crea un formulario de registro con campos para el nombre, dirección de correo electrónico y contraseña del usuario.
* [x] Implementa la validación de los campos del formulario. El nombre y la dirección de correo electrónico deben ser obligatorios, y el correo electrónico debe tener un formato válido. La contraseña debe tener una longitud mínima de 6 caracteres.
* [x] Agrega una funcionalidad para mostrar mensajes de error debajo de los campos del formulario en caso de que la validación falle.
* [x] Al enviar el formulario de registro, realiza una solicitud al backend para registrar al usuario.
* [x] Implementa una página de inicio de sesión donde los usuarios puedan ingresar su dirección de correo electrónico y contraseña.
* [x] Al iniciar sesión correctamente, muestra una página de perfil que muestra los datos del usuario.

### Backend

* [x] Crea una API RESTful utilizando Node.js y Express.
* [x] Implementa rutas para el registro de usuarios, inicio de sesión y obtención de datos de perfil.
* [x] Al registrar a un usuario, almacena sus datos en una base de datos.
* [x] Implementa la funcionalidad de autenticación para verificar las credenciales del usuario al iniciar sesión.
* [x] Al autenticar con éxito, genera un token de acceso JWT (JSON Web Token) para el usuario.
* [x] Implementa un middleware de autenticación que verifique el token de acceso en las rutas protegidas.
* [x] Implementa una ruta para obtener los datos del perfil del usuario autenticado.

### Recomendaciones

* [x] Utiliza React para el desarrollo del frontend y crea componentes reutilizables.
* [x] Utiliza el estado de React para gestionar el formulario de registro y el estado de inicio de sesión.
* [x] Utiliza axios u otra biblioteca para realizar las solicitudes HTTP desde el frontend al backend.
* [x] Utiliza MongoDB o cualquier otra base de datos de tu elección para almacenar los datos de usuario.
* [x] Utiliza bcrypt u otra biblioteca para cifrar las contraseñas de los usuarios antes de almacenarlas en la base de datos.
* [x] Utiliza el paquete jsonwebtoken para generar y verificar tokens JWT en el backend.
* [x] Utiliza buenas prácticas de codificación y asegúrate de validar y sanitizar los datos en el backend para evitar vulnerabilidades de seguridad.

Desarrolla la prueba técnica y proporciona el enlace al repositorio o al proyecto para que pueda revisarlo. Asegúrate de incluir tanto el frontend como el backend. ¡Buena suerte con tu desarrollo y espero que esta prueba sea de utilidad!
