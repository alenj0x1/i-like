# Análisis del proyecto y preparación de migración a React + .NET

## Estado y propósito

`i-like` es una red social pequeña implementada como monolito web. Este documento reúne hechos comprobados del repositorio, riesgos y propuestas para preparar una migración a React y .NET.

> Las recomendaciones no son decisiones confirmadas. Las decisiones aprobadas deben registrarse en `docs/decitions.md`.

## Tecnologías

| Área | Implementación actual |
| --- | --- |
| Runtime | Node.js 20 en Docker |
| Backend | Express 4 |
| Vistas | Pug 3 con renderizado del lado del servidor |
| Datos | MongoDB con Mongoose 8 |
| Autenticación | JWT en cookie HTTP-only |
| Contraseñas | bcrypt |
| Cliente | HTML Pug, CSS y JavaScript vanilla |
| Build/desarrollo | Babel, Nodemon y Yarn |
| Infraestructura | Docker y Docker Compose |

Dependencias de producción: `bcrypt`, `color-convert`, `cookie-parser`, `dotenv`, `express`, `jsonwebtoken`, `mongoose` y `pug`. Dependencias de desarrollo: Babel, `morgan` y `nodemon`.

## Ejecución

```powershell
yarn install
Copy-Item .env.example .env
yarn dev
```

El servidor escucha en el puerto `3001`. Requiere `MONGODB_URI`, las variables `ADMIN_*`, `JWT_SECRET_KEY` y `JWT_TOKEN_EXPIRES_IN`. En una base sin usuarios se crea automáticamente un administrador.

También existe `docker compose up --build`. El compose actual no inyecta el `.env` al servicio web ni declara una dependencia saludable de MongoDB, por lo que no asegura un arranque autónomo sin ajustes.

## Arquitectura actual

```text
Navegador (Pug + CSS + JS vanilla)
  ↓
Express: rutas, renderizado, reglas, validación y acceso a datos
  ↓
lib: CRUD, DTOs y composición de relaciones
  ↓
Mongoose → MongoDB
```

La aplicación no tiene una API REST separada. Las rutas GET renderizan HTML; los POST suelen devolver JSON consumido mediante `fetch` desde scripts por página.

| Ubicación | Responsabilidad actual |
| --- | --- |
| `src/routes` | HTTP, renderizado, validación, autorización y consultas |
| `src/database/models` | Esquemas Mongoose |
| `src/lib/manageApp.js` | CRUD y consultas de administración |
| `src/lib/filterData.js` | DTOs manuales y carga de relaciones |
| `src/middlewares` | Sesión JWT y restricción administrativa |
| `public/views` | 38 vistas/componentes Pug |
| `public/js` | 18 scripts de interfaz |
| `public/css` | 18 estilos |

No hay pruebas automatizadas, OpenAPI, linter ni CI detectados.

## Dominios y casos de uso

| Dominio | Casos implementados |
| --- | --- |
| Identidad | Registro, login, logout y perfil propio |
| Perfil | Nombre, usuario, biografía, avatar/banner por URL, color, privacidad y contraseña |
| Social | Consulta de perfiles, seguir/dejar de seguir |
| Comunidad | Temas y espacios |
| Contenido | Crear y consultar publicaciones con etiquetas |
| Administración | Gestión de usuarios, temas, espacios y publicaciones |
| Moderación | Crear, consultar y cerrar sanciones `muted` / `banned` |

Likes, favoritos, compartidos, comentarios, reportes y soporte aparecen en modelos o interfaz, pero carecen de implementación completa. Deben validarse con negocio antes de incluirlos en alcance.

## Modelo de datos

| Colección | Contenido |
| --- | --- |
| `user` | Credenciales, perfil, roles, privacidad e interacciones sociales |
| `topic` | Nombre, descripción, banner y espacios |
| `space` | Datos del espacio, administrador, tema y publicaciones |
| `post` | Autor, contenido, etiquetas, espacio e interacciones |
| `follow` | Seguidor y seguido |
| `mod` | Sanciones e infraestructura parcial de soporte/reportes |

Relaciones duplicadas:

```text
Topic.spaces[]  ←→  Space.topicId
Space.posts[]   ←→  Post.spaceId
Post.author / Space.manager → User
Follow.follower/followed → User
```

Los IDs se almacenan habitualmente como texto o arrays sin referencias tipadas. No hay integridad referencial ni cascadas garantizadas por MongoDB.

## Rutas principales

- Públicas: `/`, `/login`, `/register`, `/posts/:postId`.
- Requieren sesión: `/home`, `/topics`, `/spaces`, `/settings`, `/users`, `/interactions`.
- Administración: `/manage/*`; el middleware actual permite únicamente `admin`.

Escrituras principales: autenticación, cambios de perfil/privacidad/contraseña, follows, creación/configuración de espacios, creación de posts y CRUD administrativo.

## Riesgos técnicos

### Seguridad y autorización

- No hay autorización por recurso en configuración de espacios ni creación de posts; usuarios autenticados pueden operar sobre recursos ajenos conociendo el ID.
- La cookie usa `secure: true`, impidiendo sesión por HTTP local; no especifica `SameSite`.
- No hay CSRF, rate limiting, cabeceras de seguridad, CORS definido ni manejo de error centralizado.
- Ramas de moderador existen, pero son inalcanzables porque `/manage` exige `admin`.
- La validación de ObjectId en follow/unfollow no invoca correctamente `isValidObjectId`.
- `password_hint` se guarda en texto plano; no debe migrarse tal cual.

### Datos, rendimiento y calidad

- Los borrados en cascada son parciales, no siempre esperados y pueden dejar huérfanos.
- La composición de relaciones produce consultas N+1.
- Algunas operaciones cargan colecciones enteras y filtran en memoria.
- No hay paginación, orden explícito ni filtros de servidor.
- Muchos errores devuelven `404` aunque correspondan a validación, autorización o error interno.
- `Post.title` y `Space.name` son únicos globalmente; la regla debe confirmarse con negocio.

## Propuesta para la migración

Se recomienda evaluar un monolito modular con React + TypeScript, ASP.NET Core Web API, OpenAPI, pruebas y PostgreSQL con EF Core.

```text
React + TypeScript
  ↓ /api/v1
ASP.NET Core Web API
  ├─ Endpoints
  ├─ Application (casos de uso)
  ├─ Domain (reglas)
  └─ Infrastructure (EF Core, autenticación)
  ↓
PostgreSQL
```

Dominios sugeridos: Identity & Profile, Community, Content, Social Graph, Moderation & Administration. La base relacional debería sustituir arrays duplicados por claves foráneas e índices.

La API futura debe separar autenticación, perfil, temas, espacios, publicaciones, follows y administración bajo `/api/v1`, con DTOs, paginación, autorización por recurso y códigos HTTP semánticos.

## Estrategia de migración propuesta

1. Confirmar alcance funcional real, especialmente interacciones incompletas.
2. Definir OpenAPI, DTOs, roles, políticas de borrado y pruebas de caracterización.
3. Diseñar el modelo destino y un proceso ETL reproducible MongoDB → staging → base destino.
4. Implementar el backend .NET por dominios: identidad/perfil, comunidad, contenido, follows y administración.
5. Migrar React por verticales funcionales, reutilizando componentes para navegación, tarjetas y formularios.
6. Validar conteos, relaciones y credenciales migradas antes del corte.
7. Realizar corte gradual, evitando doble escritura prolongada.

## Decisiones pendientes

- Confirmar PostgreSQL frente a continuidad en MongoDB.
- Confirmar funcionalidades sociales y de moderación que formarán parte de la primera versión.
- Definir política de eliminación y retención de datos.
- Determinar si se invalidarán las sesiones existentes; se recomienda exigir nuevo login.
- Precisar permisos de moderadores.
- Decidir si React y API compartirán dominio; afecta CORS, cookies y CSRF.
