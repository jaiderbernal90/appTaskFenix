# Fenix Ventures

## Prueba Técnica Backend Developer:

### API de Gestión de Tareas

**Descripción del Proyecto:**  
El objetivo es desarrollar una API para la gestión de tareas (ToDo List) con funcionalidades CRUD (Crear, Leer, Actualizar y Eliminar) utilizando **NestJS** y **TypeScript**. Adicionalmente, se deberán incluir **pruebas unitarias**, asegurar el código con **prácticas de seguridad** y mantener un **código limpio y modular**.

---

### Requerimientos Funcionales:

1. **Crear una tarea**

   - Endpoint: `POST /tasks`
   - El body debe incluir el título, descripción y estado de la tarea (pendiente, en progreso, completada).
   - Debe devolver la tarea creada con su ID.

2. **Listar todas las tareas**

   - Endpoint: `GET /tasks`
   - Devuelve una lista de todas las tareas almacenadas.

3. **Actualizar una tarea**

   - Endpoint: `PUT /tasks/:id`
   - Permite modificar el título, descripción o estado de una tarea.

4. **Eliminar una tarea**
   - Endpoint: `DELETE /tasks/:id`
   - Permite eliminar una tarea por su ID.

---

### Requerimientos Técnicos:

1. **Arquitectura basada en módulos y controladores**: Implementar la API de acuerdo con la arquitectura de NestJS. El código debe ser limpio, bien estructurado y seguir los principios de **clean code**.

2. **Persistencia**: Utiliza una base de datos en memoria o una base de datos SQLite para almacenar las tareas. La conexión debe estar gestionada con **TypeORM** o **Prisma**.

3. **Validaciones**: Implementar validaciones con **class-validator** (por ejemplo, que el título de la tarea no esté vacío y que el estado sea uno de los valores permitidos).

4. **Pruebas Unitarias**: Escribir pruebas unitarias para los servicios de la API utilizando **Jest**. Incluir al menos:

   - Pruebas para crear tareas.
   - Pruebas para listar tareas.
   - Pruebas para actualizar tareas.
   - Pruebas para eliminar tareas.

5. **Prácticas de Seguridad**:
   - Proteger los endpoints utilizando **guards** o **decorators** de NestJS para asegurarse de que solo los usuarios autenticados puedan crear, actualizar o eliminar tareas.
   - Implementar autenticación básica con **JWT**.
   - Evitar inyecciones de SQL y sanitizar las entradas.
   - Usar **Helmet** para agregar cabeceras de seguridad HTTP y **rate-limiting** para prevenir ataques de fuerza bruta.

---

### Evaluación:

1. **Código Limpio**:

   - El código debe estar bien organizado y seguir principios de **SOLID**.
   - Evitar duplicación de código y complejidad innecesaria.
   - Uso correcto de **TypeScript** y tipado fuerte.

2. **Pruebas Unitarias**:

   - Se evaluará la calidad de las pruebas, así como la cobertura de las mismas.
   - Las pruebas deben ser claras y fáciles de leer.

3. **Prácticas de Seguridad**:
   - Correcta implementación de autenticación y autorizaciones.
   - Validaciones y sanitización de entradas.
   - Uso de herramientas de seguridad en el servidor (ej. Helmet, rate limiting).

---

### Instrucciones:

1. Crea un repositorio público y adjunta como respuesta a este correo el enlace al repositorio.
2. Implementa la solución cumpliendo con los requisitos mencionados.
3. Escribe las pruebas unitarias.
4. Opcionalmente (pero te dará puntos adicionales 👀), puedes hacer uso de Docker para contenerizar la aplicación.
