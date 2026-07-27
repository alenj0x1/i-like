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

## Inventario técnico del legacy (T-004)

### Rutas y vistas

| Prefijo | Archivo de ruta | Operaciones observadas | Vistas Pug asociadas |
| --- | --- | --- | --- |
| `/` | `src/routes/root.routes.js` | Portada; redirige a usuarios autenticados. | `root.pug` |
| `/login`, `/register` | `src/routes/login.routes.js`, `src/routes/register.routes.js` | Formularios y creación de sesión JWT. | `login.pug`, `register.pug` |
| `/home` | `src/routes/home.routes.js` | Inicio autenticado. | `home.pug` |
| `/settings` | `src/routes/settings.routes.js` | Lectura y actualización de apariencia, privacidad y contraseña. | `settings.pug` |
| `/users/:username` | `src/routes/users.routes.js` | Perfil, posts, espacios y relación de seguimiento. | `users/view.pug` |
| `/interactions` | `src/routes/interactions.routes.js` | Seguir y dejar de seguir. | No renderiza vista propia. |
| `/topics` | `src/routes/topics.routes.js` | Listado y detalle de temas. | `topics/index.pug`, `topics/view.pug` |
| `/spaces` | `src/routes/spaces.routes.js` | Crear, consultar, configurar espacios y redactar posts. | `spaces/new.pug`, `view.pug`, `config.pug`, `redactPost.pug` |
| `/posts/:postId` | `src/routes/posts.routes.js` | Consulta pública de publicación. | `posts/view.pug` |
| `/manage` | `src/routes/manage.routes.js` | Back-office de usuarios, temas, espacios, posts y sanciones. | `manage/` (15 vistas, incluidas las de detalle y formularios). |

`src/app.js` monta esos prefijos y aplica `authenticate` a los ámbitos autenticados; `/manage` añade `restricted`. Las vistas reutilizables se concentran en `public/views/components/` e `includes/`; los estilos están en `public/css/` y los scripts en `public/js/`, con un script específico para cada formulario o acción mutante relevante.

### Código de dominio y datos

| Ubicación | Función verificada |
| --- | --- |
| `src/database/models/User.models.js` | Usuario, perfil, privacidad, roles, arrays de interacciones y estado de cuenta. |
| `src/database/models/Topic.model.js` | Tema y su array duplicado de espacios. |
| `src/database/models/Space.models.js` | Espacio, gestor, tema y array duplicado de posts. |
| `src/database/models/Post.model.js` | Publicación, autor, etiquetas y arrays de likes, comentarios y compartidos. |
| `src/database/models/Follow.model.js` | Relación seguidor-seguido sin restricciones de esquema. |
| `src/database/models/Mod.model.js` | Sanciones y estructura prevista para soporte y reportes. |
| `src/lib/manageApp.js`, `filterData.js` | CRUD, composición manual y DTOs; concentra lecturas de administración. |
| `src/middlewares/*.js` | Autenticación desde cookie JWT y restricción global de administración a `admin`. |
| `src/database/index.js` | Conexión MongoDB y creación automática del primer administrador. |

### Dependencias e infraestructura

`package.json` declara Express 4, Mongoose 8, Pug 3, JWT, bcrypt, cookie-parser, dotenv y color-convert; para desarrollo usa Babel, Nodemon y Morgan. `Dockerfile` usa Node 20.17 Alpine y `docker-compose.yml` define MongoDB y el servidor. No hay dependencias ni archivos de pruebas, linting, OpenAPI o CI detectados. El archivo `.env.example` exige `MONGODB_URI`, credenciales iniciales de administrador y parámetros JWT.

### Evidencia y límites del inventario

- Evidencia estática revisada: `src/app.js`, los 11 archivos de `src/routes/`, los seis modelos Mongoose, middleware, librerías, `package.json`, `Dockerfile`, `docker-compose.yml` y los árboles `public/views/`, `public/js/` y `public/css/`.
- El inventario describe código versionado; no acredita qué rutas o pantallas se usan en producción ni el contenido real de MongoDB. Esas cuestiones se tratarán en T-005 y T-008.

## Riesgos técnicos

### Seguridad y autorización

- No hay autorización por recurso en configuración de espacios ni creación de posts; usuarios autenticados pueden operar sobre recursos ajenos conociendo el ID.
- El esquema admite los roles `admin`, `mod`, `support` y `user`, pero el middleware `restricted` permite acceder a `/manage` exclusivamente a `admin`. Aunque dos operaciones internas (`POST /manage/sanctions/new/:userId` y `POST /manage/topics/new`) aceptan `mod`, dicho rol no puede alcanzar esas rutas; no hay flujo para asignar roles. En consecuencia, solo la administración está operativa y el rol de moderador no lo está.
- Las sanciones sí tienen un flujo operativo de administración: crear `muted` o `banned`, listar, consultar detalle y marcar como cerrada. No se encontró aplicación de la sanción a las rutas de usuario ni validación de vencimiento; el estado `account_status` tampoco se actualiza en ese flujo.
- Soporte y reportes solo existen como valores previstos en `Mod.type` y en constantes. No se encontraron rutas, vistas ni scripts de creación, listado o gestión para ellos.
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

### Estado de las funciones de comunidad

| Función | Estado comprobado |
| --- | --- |
| Publicaciones, temas, espacios y seguimiento | Operativos, aunque con riesgos de autorización y calidad ya indicados. |
| Likes | Existen arrays en `User` y `Post`, pero no rutas, scripts ni vistas que permitan dar o retirar likes. No operativo. |
| Favoritos | Existe `User.favorites_posts`, sin rutas, scripts ni vistas. No operativo. |
| Compartidos | Existen `User.shared_posts` y `Post.shared`, sin rutas, scripts ni vistas. No operativo. |
| Comentarios | Existe `Post.comments`, sin modelo propio, rutas, scripts ni vistas. No operativo. |
| Sanciones | Operativas solo desde el panel de administrador; aplicación efectiva de sanciones no encontrada. |
| Soporte y reportes | Previstas en datos y constantes, sin flujo funcional. No operativos. |

### Alcance funcional confirmado para la primera versión (T-005)

| Flujo | Clasificación | Alcance confirmado |
| --- | --- | --- |
| Likes | Corregir e incluir | Like y retiro de like en publicaciones. |
| Comentarios | Corregir e incluir | Conversación en publicaciones, con autorización y moderación. |
| Reportes | Corregir e incluir | Reporte de contenido o cuentas para revisión de moderación. |
| Favoritos | Posponer | No será una capacidad activa de la primera versión. |
| Compartidos | Posponer | No será una capacidad activa de la primera versión. |
| Soporte | Posponer | No se construirá un sistema interno de tickets en la primera versión. |

La primera versión incorporará un rol de moderador funcional, separado del administrador. El detalle de sus permisos se definirá y someterá a aprobación en T-006.

## Matriz de permisos aprobada (T-006)

### Hechos observados en el legacy

- `user` es el rol asignado durante el registro y `admin` es el rol del usuario inicial creado al conectar una base vacía.
- `mod` y `support` están declarados, pero no existe gestión de roles y el middleware restringe todo `/manage` a `admin`.
- Cualquier usuario autenticado puede configurar un espacio o crear un post en un espacio conociendo su identificador; la propiedad del espacio no se comprueba.
- La lectura de posts individuales es pública. Los demás ámbitos de comunidad exigen sesión en el legacy.

### Propuesta para la primera versión

Leyenda: `✓` permitido, `Propio` solo recursos propios, `Asignado` solo elementos asignados al moderador, `—` no permitido.

| Recurso / acción | Visitante | Usuario | Propietario de espacio | Moderador | Administrador |
| --- | --- | --- | --- | --- | --- |
| Ver perfiles, temas, espacios y posts públicos | ✓ | ✓ | ✓ | ✓ | ✓ |
| Crear y editar perfil | — | Propio | Propio | Propio | Propio / gestión administrativa |
| Crear espacio | — | ✓ | ✓ | ✓ | ✓ |
| Editar o transferir espacio | — | — | Propio | — | ✓ |
| Crear post | — | ✓ | ✓ | ✓ | ✓ |
| Editar o borrar post | — | Propio | Propio | Según moderación | ✓ |
| Dar o retirar like | — | Propio | Propio | Propio | Propio |
| Crear o borrar comentario | — | Propio | Propio | Según moderación | ✓ |
| Crear reporte | — | ✓ | ✓ | ✓ | ✓ |
| Ver y gestionar reportes | — | — | — | Asignado | ✓ |
| Moderar contenido o cuentas | — | — | — | Según asignación | ✓ |
| Crear/editar/eliminar temas | — | — | — | — | ✓ |
| Gestionar roles, usuarios y configuración global | — | — | — | — | ✓ |

### Reglas confirmadas

1. El propietario de un espacio puede moderar posts y comentarios de terceros únicamente dentro de su espacio.
2. Un moderador puede revisar cualquier reporte pendiente. La solución debe registrar quién lo toma y quién lo resuelve.
3. Los perfiles, temas, espacios y posts se consultan públicamente; las acciones mutantes exigen sesión.

## Política aprobada de borrado, retención y visibilidad (T-007)

| Recurso | Política aprobada |
| --- | --- |
| Cuentas, posts, comentarios y espacios | Borrado lógico con recuperación durante 30 días. |
| Cuenta eliminada | Anonimizar y conservar posts y comentarios, excepto contenido borrado expresamente por el autor o retirado por moderación. |
| Likes y follows | Borrado físico inmediato cuando se elimine su origen o titular. |
| Reportes y auditoría | Conservar cerrados durante 12 meses; los abiertos requieren resolución o cierre explícito. |
| Visibilidad | Perfiles, temas, espacios y posts públicos; recursos eliminados se ocultan y autores anonimizados se muestran como tales. |

## Disponibilidad de datos legacy (T-008)

- Comprobado el 2026-07-26: el repositorio no contiene `.env` ni una exportación de datos legacy fuera de dependencias; la única coincidencia de archivos de datos versionados es `package.json`.
- Comprobado el 2026-07-26: no hay un contenedor MongoDB de `i-like` en ejecución. Los contenedores disponibles pertenecen a otro entorno (`collector-*`).
- Comprobado el 2026-07-26 mediante un arranque temporal de `docker compose up --build -d`: Compose crea e inicia el contenedor `mongodb`, pero la instancia inicia vacía. El servidor compila e inicia en el puerto 3001, aunque falla su conexión porque `MONGODB_URI` no está definido; por ello no crea la base de aplicación ni el administrador inicial.
- `docker-compose.yml` no declara `env_file`, `environment` para el servidor ni un volumen para `database`. Por tanto, aun con `.env` presente en el directorio de trabajo, el compose actual no se lo inyecta automáticamente al contenedor y los datos de MongoDB no quedan persistidos al recrear el contenedor.
- Tras aplicar T-016, `docker compose up -d` inicia únicamente MongoDB publicado en `localhost:27017` y conservado en `mongodb_data`. `yarn dev` inicia el servidor local y sus logs confirman la conexión a datos y la creación del administrador inicial en una base vacía.
- La base creada localmente es nueva y contiene únicamente datos de desarrollo iniciales; no representa ni reemplaza los datos legacy necesarios para el perfilado empírico de T-008.

### Perfilado ejecutado sobre datos sintéticos

El 2026-07-26 se ejecutaron `yarn seed:legacy` y `yarn profile:legacy`. El seeding crea tres usuarios identificados con `seed_` y conserva el administrador local preexistente. Los resultados siguientes validan el procedimiento de perfilado; no describen volumen ni calidad de producción.

| Indicador | Resultado |
| --- | ---: |
| Usuarios | 4 |
| Temas | 1 |
| Espacios | 2 |
| Posts | 2 |
| Follows | 3 |
| Registros de moderación | 2 |
| Duplicados en arrays de espacios de temas | 1 |
| Duplicados en arrays de posts de espacios | 1 |
| Duplicados de likes en usuario | 1 |
| Duplicados de likes en post | 1 |
| Pares de follow duplicados | 1 |
| Espacios con gestor huérfano | 1 |
| Posts con autor huérfano | 1 |
| Posts con espacio huérfano | 1 |
| Follows con usuario huérfano | 1 |
| Registros de moderación con usuario huérfano | 1 |

Los scripts `src/scripts/seedLegacyData.js` y `src/scripts/profileLegacyData.js` son repetibles y sirven para validar las consultas y la futura ETL. El riesgo de desconocer los volúmenes y anomalías reales se mantiene abierto hasta disponer de una fuente legacy real.
- Riesgo: sin acceso de solo lectura a MongoDB o una exportación representativa no se pueden medir volumen, duplicados, valores inválidos ni referencias huérfanas. El modelo y sus riesgos estructurales están documentados, pero no sustituyen un perfilado empírico.

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
