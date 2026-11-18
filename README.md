# Syllabus Nube

Sistema de gestión académica del Instituto de Ciencias Básicas e Ingeniería (ICBI) de la Universidad
Autónoma del Estado de Hidalgo (UAEH). Administra docentes, alumnos,
asignaturas, programas, periodos, grupos, inscripciones, calificaciones y reportes semestrales.

| Parte | Tecnología | Carpeta |
|---|---|---|
| Base de datos | PostgreSQL (Supabase) | `bd/` |
| API | Node.js, Express 5, Prisma 7 | `backend/` |
| Interfaz | React 19, Vite, React Router | `frontend/` |

## Requisitos

- Node.js 20.19 o superior (requerido por Vite 7).
- Una base de datos PostgreSQL accesible (por ejemplo, un proyecto de Supabase).

## 1. Base de datos

Ejecuta `bd/scripts/create_tables.sql` en el **SQL Editor** de Supabase (o con `psql`). El script crea
las tablas, restricciones, índices, el trigger `validar_inscripcion` (máximo 8 asignaturas por periodo
y sin repetir asignatura) y la vista `v_reporte_calificaciones` que usa el módulo de reportes.

## 2. Backend

```powershell
cd backend
npm install
Copy-Item .env.example .env   # y completa DATABASE_URL
npx prisma generate
npm run db:test               # opcional: comprueba la conexión
npm run dev                   # o npm start
```

- `DATABASE_URL`: cópiala en Supabase desde **Project Settings → Database → Connection string → URI**.
  Se recomienda el *Session pooler*, porque la conexión directa solo funciona por IPv6.
- La API queda en `http://localhost:3000`. `GET /health` indica si el servidor está activo.
- No publiques `backend/.env` ni compartas sus credenciales.

### Scripts

| Comando | Descripción |
|---|---|
| `npm start` | Inicia el servidor. |
| `npm run dev` | Inicia el servidor y lo reinicia al guardar cambios. |
| `npm run db:test` | Consulta algunos registros para verificar la conexión. |
| `npm run prisma:generate` | Genera el cliente de Prisma (necesario tras instalar o cambiar el esquema). |
| `npm run prisma:pull` | Actualiza `prisma/schema.prisma` a partir de la base de datos. |
| `npm run prisma:studio` | Abre Prisma Studio para explorar los datos. |

### Endpoints

Todos responden `{ ok, data }` o, si hay error, `{ ok: false, message }`.

| Recurso | Ruta | Clave |
|---|---|---|
| Docentes | `/api/docentes` | `num_cuenta` |
| Alumnos | `/api/alumnos` | `num_cuenta` |
| Asignaturas | `/api/asignaturas` | `codigo` |
| Programas académicos | `/api/programas-academicos` | `id_programa` |
| Periodos académicos | `/api/periodos-academicos` | `id_periodo` |
| Grupos | `/api/grupos` | `id_grupo` |
| Inscripciones | `/api/inscripciones` | `id_inscripcion` |
| Reporte de calificaciones | `GET /api/reportes/calificaciones` | — |

Cada recurso (salvo reportes) admite `GET /`, `GET /:clave`, `POST /`, `PUT /:clave` y `DELETE /:clave`.

## 3. Frontend

En otra terminal:

```powershell
cd frontend
npm install
npm run dev
```

Abre `http://localhost:5173`. Por defecto la interfaz usa la API en `http://localhost:3000/api`; para
cambiarla, crea `frontend/.env` a partir de `frontend/.env.example` y ajusta `VITE_API_URL`.

## Validaciones

Las reglas están en `shared/validators.mjs` y se aplican igual en la interfaz y en la API.

| Campo | Regla |
|---|---|
| Número de cuenta | 6 dígitos |
| Teléfono | 10 dígitos, sin empezar con 0 ni 1 (en México ninguna lada empieza así) |
| Correo institucional | 2 letras + número de cuenta + `@uaeh.edu.mx` (ej. `ji448283@uaeh.edu.mx`) |
| Correo personal | Formato de correo válido; no puede ser de `@uaeh.edu.mx` |
| NSS (IMSS) | 11 dígitos: subdelegación (2), año de afiliación (2), año de nacimiento (2), consecutivo (4) y dígito verificador (algoritmo de Luhn). Si hay CURP, el año de nacimiento debe coincidir y la afiliación no puede ser anterior al nacimiento ni futura |
| CURP | 18 caracteres: 4 letras, fecha AAMMDD válida, sexo (H/M/X), clave de entidad (o NE), 3 consonantes, homoclave (dígito si nació antes de 2000, letra después) y dígito verificador. Las iniciales deben corresponder al primer apellido, al segundo (X si no hay) y a uno de los nombres |
| Nombre y apellidos | Solo letras, espacios, apóstrofos y guiones |
| Dirección, descripción | Texto sin caracteres especiales como `{ } < >` |
| Código de asignatura | `AAA-000` (ej. `MAT-101`) |
| Clave de grupo | Código de la asignatura + guion + letra (ej. `MAT-101-A`) |
| Créditos / horas semanales | Enteros de 1 a 30 / de 1 a 40 |
| Periodo | Año 2000–2100; semestre 1 inicia entre enero y junio y semestre 2 entre julio y diciembre; fechas dentro del año, fin posterior al inicio y sin traslaparse con otro periodo |
| Calificación | 0 a 10 con hasta 2 decimales; solo se captura a partir de la fecha de inicio del periodo del grupo. Tampoco se puede mover a un periodo futuro un grupo o periodo que ya tiene calificaciones |

## Estructura

```
bd/
  modelo_er/        Diagrama entidad-relación y documentación del modelo
  scripts/          Scripts SQL
backend/
  prisma/           Esquema de Prisma
  src/
    config/         Conexión a la base de datos
    routes/         Definición de rutas
    controllers/    Adaptan la petición HTTP al servicio
    services/       Reglas de negocio y acceso a datos
    middlewares/    Manejo de errores
    utils/          Validación de datos y traducción de errores de la base
shared/
  validators.mjs    Reglas de validación usadas por el backend y el frontend
frontend/
  src/
    components/     Componentes reutilizables (tabla, formulario, filtros, menú)
    pages/          Una página por módulo
    routes/         Rutas y menú de navegación
    services/       Cliente de la API
    utils/          Formato y filtrado de datos
```
