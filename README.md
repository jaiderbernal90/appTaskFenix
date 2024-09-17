# Prueba Técnica Backend Developer (Node.js) - Fenix

## Introducción

Este proyecto representa la solución presentada para la prueba técnica del puesto de Backend Developer (Node.js) en la empresa Fenix. La aplicación ha sido desarrollada utilizando NestJS y incorpora las siguientes características:

- Implementación de pruebas unitarias para asegurar la calidad del código.
- Aplicación de las mejores prácticas de desarrollo.
- Implementación de medidas de seguridad.
- Se incluye una colección de Postman para facilitar el testeo de la API.

## Despliegue con Docker

Para desplegar la aplicación utilizando Docker, sigue estos pasos:

1. Asegúrate de tener Docker y Docker Compose instalados en tu sistema.

2. Clona este repositorio:
   ```
   git clone https://github.com/jaiderbernal90/appTaskFenix.git
   cd appTaskFenix
   ```

3. Crea un archivo `.env` en la raíz del proyecto con las siguientes variables de entorno:
   ```
   NODE_ENV=production
   PORT=YOUR_PORT
   DB_PATH=PATH_TO_DB_FILE
   TYPEORM_SYNC=false
   TYPEORM_LOGGING=false
   JWT_SECRET=YOUR_JWT_SECRET
   ```
   Asegúrate de reemplazar los valores con los apropiados para tu entorno.

4. Construye y levanta los contenedores Docker:
   ```
   docker-compose up --build
   ```

5. La aplicación estará disponible en `http://localhost:3000` (o el puerto que hayas especificado).

## Pruebas Unitarias

Se han implementado pruebas unitarias para asegurar la calidad y el correcto funcionamiento del código. Para ejecutar las pruebas:

```
npm run test
```

## Colección de Postman

Se adjunta una colección de Postman para facilitar el testeo de la API. Puedes encontrar el archivo `APP-TASK-FENIX.postman_collection` en la raíz del proyecto. Importa esta colección en Postman para probar los diferentes endpoints de la API.

## Seguridad

Se han implementado varias medidas de seguridad, incluyendo:

- Autenticación JWT
- Validación de datos de entrada
- Protección contra inyecciones SQL
- Hashing seguro de contraseñas

## Mejores Prácticas

Este proyecto sigue las mejores prácticas de desarrollo, incluyendo:

- Arquitectura modular y escalable
- Uso de interfaces y dependency injection
- Manejo de errores consistente
- Logging apropiado
- Configuración basada en entorno

Para cualquier pregunta o aclaración adicional, no dudes en contactar.