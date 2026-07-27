# Plan de migración a React y .NET

## Principios de ejecución

- Migrar por capacidades de negocio completas, no por capas técnicas aisladas.
- Mantener el sistema legacy como referencia funcional mientras sea necesario, pero evitar doble escritura prolongada.
- Definir contrato API y pruebas antes de construir cada vertical.
- Cerrar cada fase con evidencia verificable antes de avanzar.
- Registrar decisiones aprobadas en `docs/decitions.md` y nuevos hallazgos en `docs/analisis.md`.

## Fase 0 — Descubrimiento y congelación de alcance

**Estado:** Completada el 2026-07-26. Alcance aprobado en `docs/v1-scope.md`; el perfilado de datos se realizó con datos sintéticos y debe repetirse con datos legacy reales antes de la migración final.

**Objetivo:** establecer qué comportamiento legacy debe conservarse, corregirse o descartarse.

**Alcance:**

- Inventariar rutas, vistas, scripts y modelos existentes.
- Priorizar, para la primera versión, las capacidades que habiliten comunidad y conversación (decisión aceptada el 2026-07-26).
- Validar con negocio los flujos implementados y las funciones incompletas: likes, favoritos, compartidos, comentarios, soporte y reportes.
- Alcance confirmado el 2026-07-26: incluir likes, comentarios y reportes; posponer favoritos, compartidos y soporte; separar el rol de moderador funcional del administrador.
- Definir roles, permisos, reglas de propiedad y políticas de borrado.
- Política aprobada el 2026-07-26: borrado lógico recuperable por 30 días, anonimización de contenido de cuentas eliminadas, eliminación física de likes/follows y retención de reportes/auditoría por 12 meses.
- Identificar datos existentes, volumen, calidad, duplicados y relaciones huérfanas.
- Crear un catálogo de requisitos funcionales y no funcionales.

**Criterio de finalización:**

- Alcance de la primera versión migrada aprobado.
- Lista de funcionalidades fuera de alcance explícita.
- Matriz de roles y permisos aprobada.
- Inventario de datos y riesgos de migración documentado.

## Fase 1 — Fundaciones técnicas y contrato API

**Objetivo:** disponer de una base .NET y React ejecutable, segura y observable.

**Alcance:**

- Crear solución ASP.NET Core Web API con configuración por ambientes.
- Crear aplicación React con TypeScript, enrutamiento y cliente HTTP.
- Configurar OpenAPI, manejo centralizado de errores, logging estructurado y health checks.
- Definir convenciones de respuestas, validación, paginación y códigos HTTP.
- Configurar autenticación, CORS, cabeceras de seguridad, rate limiting y estrategia CSRF según el modelo de sesión elegido.
- Configurar pruebas unitarias, integración y pipeline de CI mínimo.

**Criterio de finalización:**

- React y API levantan localmente y mediante contenedores.
- OpenAPI publica un endpoint de prueba protegido y uno público.
- CI ejecuta build y pruebas.
- Estándares de error, autenticación y observabilidad están documentados y probados.

## Fase 2 — Modelo de datos y migración piloto

**Objetivo:** validar el modelo destino y el proceso reproducible de traslado de MongoDB.

**Alcance:**

- Diseñar esquema relacional inicial: usuarios, temas, espacios, posts, follows y moderación.
- Crear migraciones EF Core, índices, restricciones y políticas de borrado.
- Definir trazabilidad entre ObjectId legacy y claves destino.
- Implementar ETL de prueba sobre una copia anonimizada o de desarrollo.
- Detectar y definir tratamiento de registros inválidos, duplicados y referencias huérfanas.
- Validar compatibilidad de hashes bcrypt o definir proceso de restablecimiento de contraseña.

**Criterio de finalización:**

- Esquema destino revisado y aprobado.
- ETL se ejecuta repetidamente con el mismo resultado sobre datos de prueba.
- Conteos y relaciones críticas se reconcilian contra el origen.
- Excepciones de datos se documentan con una política de resolución.

## Fase 3 — Identidad, sesión y perfiles

**Objetivo:** migrar el acceso al sistema y la gestión del perfil de usuario.

**Alcance:**

- Registro, login, logout y consulta de usuario actual.
- Cambio de contraseña y actualización de perfil: nombre, usuario, biografía, avatar, banner y color.
- Configuración de privacidad.
- Componentes React para acceso, navegación autenticada y configuración.
- Autorización por rol y pruebas de seguridad asociadas.

**Criterio de finalización:**

- Un usuario puede registrarse, iniciar/cerrar sesión y administrar su perfil desde React.
- Credenciales inválidas, sesiones vencidas y accesos no autorizados se manejan correctamente.
- Pruebas de API e interfaz cubren los flujos críticos.
- No se expone información sensible ni se almacena `password_hint` en el sistema nuevo.

## Fase 4 — Temas y espacios

**Objetivo:** migrar la navegación y administración básica de comunidades.

**Alcance:**

- Consulta y detalle de temas.
- Creación, consulta y actualización de espacios.
- Autorización por propiedad del espacio y por rol administrativo.
- Componentes React para listados, detalle, formularios y navegación.
- Paginación o límites de lectura donde corresponda.

**Criterio de finalización:**

- Usuarios autorizados crean y administran sus espacios.
- Usuarios no propietarios no pueden modificar espacios ajenos.
- Temas y espacios se consultan sin consultas N+1 ni relaciones duplicadas.
- Flujos cubiertos por pruebas de integración y autorización.

## Fase 5 — Publicaciones y consulta de contenido

**Objetivo:** migrar la creación, detalle y administración de publicaciones.

**Alcance:**

- Crear, listar y consultar publicaciones por espacio, tema y autor.
- Etiquetas, banner y reglas de validación de contenido.
- Edición/borrado de posts según propiedad, rol y política de retención aprobada.
- Componentes React de tarjeta, detalle, formulario y listados paginados.
- Índices y consultas optimizadas para las vistas principales.

**Criterio de finalización:**

- Los flujos de publicación se completan desde React contra la API .NET.
- Se aplican autorización por recurso y validación de entradas.
- Listados paginados y ordenados cumplen los objetivos acordados de rendimiento.
- No se mantienen arrays duplicados de posts en el modelo destino.

## Fase 6 — Grafo social

**Objetivo:** migrar perfiles públicos y la relación de seguimiento.

**Alcance:**

- Perfiles públicos, conteos y visibilidad según privacidad.
- Seguir y dejar de seguir.
- Restricción de seguimiento propio, duplicados y relaciones inválidas.
- Componentes React de perfil y acción de seguimiento.
- Índices para follower/followed y pruebas de concurrencia básicas.

**Criterio de finalización:**

- Los perfiles muestran datos permitidos por privacidad.
- Follow/unfollow es idempotente y no permite duplicados.
- Conteos y permisos son consistentes tras operaciones concurrentes.

## Fase 7 — Administración y moderación

**Objetivo:** migrar el back-office con permisos explícitos y trazabilidad.

**Alcance:**

- Gestión administrativa de usuarios, temas, espacios y posts.
- Creación, consulta y cierre de sanciones.
- Políticas diferenciadas para administrador y moderador.
- Auditoría de acciones administrativas sensibles.
- Interfaz React de administración separada de la experiencia de usuario.

**Criterio de finalización:**

- Cada acción administrativa exige la política correspondiente.
- Moderadores acceden únicamente a acciones autorizadas.
- Cambios y sanciones quedan auditados.
- Pruebas cubren accesos permitidos, denegados y casos de cierre de sanción.

## Fase 8 — Migración final de datos y validación operativa

**Objetivo:** cargar datos definitivos y asegurar que la solución nueva está lista para producción.

**Alcance:**

- Ejecutar ETL sobre un corte final de datos.
- Reconciliar conteos, relaciones, usuarios, contenido y sanciones.
- Ejecutar pruebas de regresión, carga, seguridad y recuperación.
- Preparar monitoreo, alertas, respaldos, runbooks y plan de reversión.
- Realizar aceptación de usuarios clave.

**Criterio de finalización:**

- Reconciliación de datos aprobada.
- Pruebas críticas sin defectos bloqueantes.
- Observabilidad, respaldo y recuperación verificados.
- Plan de corte y reversión aprobado.

## Fase 9 — Corte, estabilización y retiro del legacy

**Objetivo:** poner en producción la plataforma nueva y retirar el monolito legacy de forma controlada.

**Alcance:**

- Desplegar React y API .NET.
- Ejecutar corte de tráfico y monitorear métricas, errores y autenticación.
- Resolver incidencias de estabilización.
- Mantener el legacy temporalmente en solo lectura si se requiere para consulta o reversión.
- Retirar infraestructura y secretos legacy después del periodo acordado.

**Criterio de finalización:**

- El tráfico productivo opera en la nueva plataforma durante el periodo de estabilización acordado.
- No existen incidencias críticas abiertas.
- Legacy está retirado o declarado explícitamente como archivo de solo lectura.
- Documentación operativa, de arquitectura y de decisiones está actualizada.

## Dependencias entre fases

```text
Fase 0 → Fase 1 → Fase 2 → Fase 3
                                  ├→ Fase 4 → Fase 5 → Fase 6
                                  └→ Fase 7
Fases 5, 6 y 7 → Fase 8 → Fase 9
```

Las fases 4 y 7 pueden iniciarse en paralelo después de disponer de identidad, autorización y modelo de datos estables, siempre que sus contratos de API no entren en conflicto.
