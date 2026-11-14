# Syllabus Nube

## Backend

Requiere Node.js y una base de datos PostgreSQL accesible.

1. Entra a `backend` e instala las dependencias:

   ```powershell
   cd backend
   npm install
   ```

2. Copia la plantilla y completa `backend/.env` con los datos de conexión de PostgreSQL:

   ```powershell
   Copy-Item .env.example .env
   ```

   Completa `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER` y `DB_PASSWORD` con los valores de tu proveedor. No publiques `backend/.env` ni compartas sus credenciales.

3. Inicia el servidor:

   ```powershell
   npm start
   ```

El servidor escucha en `http://localhost:3000`. La ruta raíz consulta la base de datos y devuelve la hora actual.
