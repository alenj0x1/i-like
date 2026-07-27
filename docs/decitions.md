# Registro de decisiones

Este documento registra decisiones confirmadas sobre arquitectura, patrones, dependencias, tecnologías e implementación.

## Formato

### YYYY-MM-DD — Título

- **Estado:** Propuesta | Aceptada | Reemplazada | Rechazada
- **Contexto:**
- **Decisión:**
- **Consecuencias:**
- **Alternativas consideradas:**

## Decisiones

### 2026-07-26 — Alcance y ubicación de la skill de gobernanza de migraciones

- **Estado:** Aceptada
- **Contexto:** El análisis histórico produjo un borrador de skill reutilizable, pero dejaba por definir su especialización, idioma y ubicación. El usuario confirmó estas opciones para permitir su implementación.
- **Decisión:** Crear `migration-governance` como una skill genérica aplicable a cualquier proyecto de migración, con instrucciones y plantillas en español, versionada en `.agents/skills/` dentro de este repositorio.
- **Consecuencias:** La skill describirá un proceso adaptable y no impondrá un stack, una arquitectura ni un modelo de datos de `i-like`. Podrá copiarse o instalarse manualmente desde el repositorio en otros entornos.
- **Alternativas consideradas:** Especializarla en monolitos web hacia API + SPA; redactar las plantillas en inglés o bilingües; instalarla directamente en el directorio global de Codex.

### 2026-07-26 — Prioridad funcional de la primera versión migrada

- **Estado:** Aceptada
- **Contexto:** Durante T-005 de la fase 0, el alcance de likes, favoritos, compartidos, comentarios, soporte y reportes requería orientación de negocio. El usuario confirmó que la primera versión debe priorizar comunidad y conversación.
- **Decisión:** La definición de alcance de la primera versión favorecerá las capacidades que habiliten comunidad y conversación. La inclusión y el comportamiento concreto de cada función se documentarán como requisitos verificables antes de construirlos.
- **Consecuencias:** Comentarios, interacción social y mecanismos de moderación deben evaluarse primero. No se infiere todavía el alcance detallado ni se aprueba una implementación específica para cada función.
- **Alternativas consideradas:** Priorizar solo publicación básica; priorizar soporte interno; replicar sin cambios todas las estructuras del legacy.

### 2026-07-26 — Alcance de interacciones para la primera versión migrada

- **Estado:** Aceptada
- **Contexto:** El legacy contiene estructuras incompletas para likes, favoritos, compartidos, comentarios, soporte y reportes. Se confirmó que la primera versión prioriza comunidad y conversación.
- **Decisión:** Incluir likes, comentarios y reportes en la primera versión. Posponer favoritos, compartidos y soporte para una versión posterior. Corregir la moderación para introducir un rol de moderador funcional y separado del administrador.
- **Consecuencias:** La primera versión debe definir modelos, API, interfaz, autorización y pruebas para likes, comentarios y reportes. La matriz de permisos debe diferenciar al administrador del moderador. Las estructuras legacy de favoritos, compartidos y soporte no se migrarán como capacidades activas en esta versión.
- **Alternativas consideradas:** Incluir todas las funciones desde el inicio; limitar la primera versión a publicación sin interacción; omitir reportes y delegar toda moderación al administrador.

### 2026-07-26 — Roles, propiedad y visibilidad de la primera versión

- **Estado:** Aceptada
- **Contexto:** El legacy define `mod`, pero su acceso está bloqueado por un middleware exclusivo para `admin`; tampoco aplica autorización por propiedad a espacios. La primera versión requiere comentarios y reportes con moderación operativa.
- **Decisión:** Separar administrador, moderador, propietario de espacio y usuario. El propietario puede moderar posts y comentarios de terceros únicamente dentro de su espacio. Los moderadores pueden revisar todos los reportes pendientes y deben dejar trazabilidad de su toma y resolución. Perfiles, temas, espacios y posts serán públicos para visitantes; las acciones mutantes exigirán sesión.
- **Consecuencias:** La API debe aplicar autorización por recurso y ámbito, registrar asignación y resolución de reportes, y distinguir privilegios globales de administración respecto de moderación y propiedad local.
- **Alternativas consideradas:** Moderación global exclusiva; asignación previa obligatoria de reportes; contenido comunitario solo visible para usuarios autenticados.

### 2026-07-26 — Borrado, retención y anonimización

- **Estado:** Aceptada
- **Contexto:** La primera versión incorpora publicaciones, comentarios y reportes; el legacy no tiene políticas consistentes de borrado ni retención.
- **Decisión:** Aplicar borrado lógico con una ventana de recuperación de 30 días a cuentas, posts, comentarios y espacios. Al eliminar una cuenta, anonimizar y conservar sus posts y comentarios, salvo contenido retirado por moderación o borrado expresamente por el autor. Eliminar físicamente likes y follows asociados. Conservar reportes cerrados y registros de auditoría durante 12 meses; los reportes abiertos deben resolverse o cerrarse explícitamente antes de su purga.
- **Consecuencias:** El modelo destino requiere estados de eliminación, fechas de retención, anonimización de autor y auditoría de moderación. Las consultas públicas deben ocultar recursos eliminados y mostrar autor anonimizado donde corresponda.
- **Alternativas consideradas:** Eliminación física inmediata; conservar todo el contenido sin anonimizar; eliminar todo el contenido de una cuenta tras 30 días.

### 2026-07-26 — Entorno local: MongoDB en Docker y servidor con Yarn

- **Estado:** Aceptada
- **Contexto:** El compose anterior iniciaba MongoDB y el servidor, pero no inyectaba las variables de entorno al servidor ni persistía los datos de MongoDB. Se confirmó la necesidad de ejecutar MongoDB con Docker y la aplicación localmente mediante Yarn.
- **Decisión:** `docker-compose.yml` administrará únicamente MongoDB, expondrá el puerto 27017 y persistirá `/data/db` en el volumen nombrado `mongodb_data`. El servidor se ejecutará fuera de Docker mediante Yarn y se conectará a `mongodb://localhost:27017/test` con un `.env` local ignorado por Git.
- **Consecuencias:** El entorno local inicializa y conserva datos entre recreaciones de contenedor. Las credenciales y secretos de desarrollo viven solo en `.env`; deben sustituirse por valores seguros fuera del entorno local.
- **Alternativas consideradas:** Mantener el servidor en Compose y corregir la inyección de variables; ejecutar MongoDB directamente en el host; no persistir datos de desarrollo.

### 2026-07-26 — Datos sintéticos para perfilado de migración

- **Estado:** Aceptada
- **Contexto:** No existe acceso a la base legacy ni una exportación importable. T-008 requiere datos para comprobar volumen, relaciones, duplicados y huérfanos.
- **Decisión:** Crear un seeding local idempotente de datos sintéticos, claramente identificados con el prefijo `seed_`, que contenga relaciones válidas y anomalías representativas. No se tratarán sus métricas como evidencia de producción.
- **Consecuencias:** Permite validar el proceso y las consultas de perfilado. El perfilado de datos históricos reales permanece como riesgo abierto para la migración final.
- **Alternativas consideradas:** Mantener T-008 bloqueada hasta conseguir datos legacy; usar una base externa; inferir la calidad de datos sin ejecutar consultas.

### 2026-07-26 — Aprobación del catálogo inicial de requisitos

- **Estado:** Aceptada
- **Contexto:** T-009 consolidó los requisitos derivados del legacy y de las decisiones funcionales, de autorización, retención y datos de la fase 0.
- **Decisión:** Aprobar `docs/requirements.md` como catálogo inicial de la primera versión. Las notificaciones quedan fuera de alcance. Las metas cuantificadas de rendimiento, capacidad y disponibilidad se definirán al iniciar la fase 1.
- **Consecuencias:** Los requisitos obligatorios del catálogo son la base para contratos API, implementación y pruebas. Cualquier capacidad nueva o cambio de alcance debe actualizar el catálogo antes de construirse.
- **Alternativas consideradas:** Incluir notificaciones en la primera versión; fijar métricas sin datos de uso; mantener el catálogo solo como propuesta.

### 2026-07-26 — Cierre de la fase 0 y alcance de la primera versión

- **Estado:** Aceptada
- **Contexto:** Se completaron el inventario del legacy, la clasificación funcional, matriz de permisos, políticas de retención, perfilado sintético y catálogo de requisitos. El usuario aprobó el expediente consolidado `docs/v1-scope.md`.
- **Decisión:** Cerrar la fase 0 y usar el alcance, exclusiones, permisos y riesgos documentados como línea base para iniciar la fase 1.
- **Consecuencias:** La fase 1 puede comenzar con fundaciones React + .NET, contrato API, autenticación, pruebas y observabilidad. El riesgo de no contar con datos legacy reales permanece abierto y debe reevaluarse antes de la migración final.
- **Alternativas consideradas:** Mantener la fase 0 abierta hasta obtener datos históricos reales; iniciar fase 1 sin un alcance consolidado; ampliar el alcance con funciones excluidas.
