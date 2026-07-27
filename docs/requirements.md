# Catálogo de requisitos — primera versión migrada

## Estado y trazabilidad

Este catálogo consolida hechos observados y decisiones aprobadas de la fase 0. `Obligatorio` corresponde al alcance confirmado; `Propuesto` requiere aprobación antes de convertirse en compromiso de entrega.

## Requisitos funcionales

| ID | Prioridad | Estado | Requisito | Fuente | Criterio de aceptación |
| --- | --- | --- | --- | --- | --- |
| RF-01 | Obligatorio | Confirmado | Un visitante puede consultar perfiles, temas, espacios y posts públicos. | T-006 | Sin sesión se visualizan esos recursos; las operaciones mutantes devuelven una respuesta de autenticación requerida. |
| RF-02 | Obligatorio | Confirmado | Un usuario puede registrarse, iniciar/cerrar sesión y gestionar su perfil. | Legacy y T-004 | Registro, login, logout y edición de nombre, usuario, biografía, avatar, banner, color, privacidad y contraseña funcionan desde la nueva interfaz. |
| RF-03 | Obligatorio | Confirmado | Un usuario puede crear espacios y administrar únicamente los propios. | T-006 | Un propietario puede editar o transferir su espacio; otro usuario recibe acceso denegado. |
| RF-04 | Obligatorio | Confirmado | Un usuario puede crear posts en espacios y administrar únicamente los propios. | Legacy y T-006 | La creación exige sesión; edición y borrado de posts ajenos se rechazan salvo facultades de moderación o administración. |
| RF-05 | Obligatorio | Confirmado | Un usuario puede seguir y dejar de seguir perfiles. | Legacy y T-004 | Follow/unfollow es idempotente, impide seguirse a sí mismo y no genera relaciones duplicadas. |
| RF-06 | Obligatorio | Confirmado | Un usuario puede dar y retirar likes de publicaciones. | T-005 | La acción es idempotente; no puede duplicar likes y el contador se mantiene consistente. |
| RF-07 | Obligatorio | Confirmado | Un usuario puede crear y borrar sus comentarios en publicaciones. | T-005 | Los comentarios se asocian a post y autor; un usuario no puede borrar comentarios de terceros fuera de sus facultades. |
| RF-08 | Obligatorio | Confirmado | Un usuario puede reportar contenido o cuentas. | T-005 | El reporte registra denunciante, recurso, motivo, estado y fechas; se confirma al usuario sin exponer datos internos. |
| RF-09 | Obligatorio | Confirmado | Un moderador revisa cualquier reporte pendiente, lo toma y lo resuelve con trazabilidad. | T-006 | Se registra moderador, toma, resolución y decisión; el listado de pendientes es accesible para moderadores. |
| RF-10 | Obligatorio | Confirmado | Un propietario puede moderar posts y comentarios de terceros en su espacio. | T-006 | La acción queda limitada al espacio propio y queda registrada. |
| RF-11 | Obligatorio | Confirmado | Un administrador gestiona roles, usuarios, temas y configuración global. | T-006 | Las acciones administrativas se deniegan para usuario, propietario y moderador cuando exceden su ámbito. |
| RF-12 | Obligatorio | Confirmado | La eliminación aplica recuperación de 30 días, anonimización y retención según T-007. | T-007 | Recursos eliminados se ocultan; el contenido conservado muestra autor anonimizado y puede restaurarse dentro de 30 días. |
| RF-13 | Fuera de alcance | Confirmado | Favoritos, compartidos y soporte interno no se habilitan en la primera versión. | T-005 | No hay rutas ni acciones activas para esas capacidades y se documentan como excluidas. |

## Requisitos no funcionales

| ID | Prioridad | Estado | Requisito | Fuente | Criterio de aceptación |
| --- | --- | --- | --- | --- |
| RNF-01 | Obligatorio | Confirmado | Autorización por rol, recurso y ámbito. | T-006 y riesgos T-004 | Pruebas cubren acceso permitido y denegado para usuario, propietario, moderador y administrador. |
| RNF-02 | Obligatorio | Confirmado | Auditoría de moderación y administración sensible. | T-006 y T-007 | Cada toma/resolución de reporte y moderación registra actor, fecha, recurso y decisión. |
| RNF-03 | Obligatorio | Confirmado | Retención y anonimización coherentes. | T-007 | Procesos verificables aplican 30 días de recuperación y 12 meses de retención de evidencia. |
| RNF-04 | Obligatorio | Confirmado | Integridad de relaciones y operaciones idempotentes. | T-008 | Restricciones e índices evitan follows/likes duplicados y las migraciones identifican referencias huérfanas. |
| RNF-05 | Obligatorio | Confirmado | Protección de credenciales y datos sensibles. | Riesgos T-004 | Contraseñas usan hash; `password_hint` no se migra; secretos no se versionan. |
| RNF-06 | Obligatorio | Confirmado | API documentada y pruebas automatizadas de flujos críticos. | Plan de migración | OpenAPI y pruebas cubren autenticación, autorización, publicación, comentarios, likes y reportes. |
| RNF-07 | Diferido a fase 1 | Confirmado | Objetivos cuantificados de rendimiento, disponibilidad y capacidad. | Decisión T-009 | Definir p95, concurrencia, volumen y disponibilidad antes de construir los verticales funcionales. |
| RNF-08 | Fuera de alcance | Confirmado | Notificaciones para comentarios, likes y reportes. | Decisión T-009 | No se implementan canales ni preferencias de notificación en la primera versión. |

## Riesgo de trazabilidad de datos

El perfilado de T-008 se ejecutó sobre datos sintéticos debido a la ausencia de una fuente legacy. Sus hallazgos validan las consultas y el tratamiento requerido para duplicados y huérfanos, pero los conteos de producción, calidad real y esfuerzo de limpieza deben confirmarse antes de la migración final.
