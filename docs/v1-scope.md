# Expediente de aprobación — primera versión migrada

## Propósito

Consolidar la evidencia de la fase 0 para aprobar el alcance de la primera versión migrada. La fuente detallada de requisitos es `docs/requirements.md`; este documento resume lo que se entregará, excluirá y condiciona el inicio de la fase 1.

## Alcance incluido

- Consulta pública de perfiles, temas, espacios y publicaciones.
- Registro, inicio/cierre de sesión y gestión de perfil.
- Creación y administración por propiedad de espacios y publicaciones.
- Seguimiento entre perfiles, con operaciones idempotentes y sin duplicados.
- Likes en publicaciones.
- Comentarios en publicaciones, con borrado propio y moderación autorizada.
- Reportes de contenido o cuentas, con revisión, toma y resolución trazables.
- Roles separados: usuario, propietario de espacio, moderador y administrador.
- Moderación local del propietario dentro de su espacio y moderación global por reportes.
- Borrado lógico recuperable por 30 días, anonimización de contenido de cuentas eliminadas y retención de evidencia por 12 meses.

## Exclusiones explícitas

- Favoritos.
- Compartidos.
- Sistema interno de soporte/tickets.
- Notificaciones de likes, comentarios o reportes.
- Metas cuantificadas de rendimiento, capacidad y disponibilidad: se definirán al inicio de la fase 1, antes de construir verticales funcionales.

## Permisos aprobados

| Actor | Facultades principales |
| --- | --- |
| Visitante | Consulta de contenido público. |
| Usuario | Perfil propio, espacios y posts propios, follows, likes, comentarios y reportes. |
| Propietario de espacio | Facultades de usuario y moderación de posts/comentarios de terceros dentro de su espacio. |
| Moderador | Consulta, toma y resolución trazable de cualquier reporte pendiente; moderación según el reporte y su ámbito. |
| Administrador | Gestión global de roles, usuarios, temas y configuración; facultades de moderación global. |

## Riesgos y condiciones de migración

| Riesgo | Evidencia | Impacto | Mitigación prevista |
| --- | --- | --- | --- |
| Datos legacy reales no disponibles | T-008 solo usó datos sintéticos. | No se conocen volumen ni calidad reales antes del corte. | Obtener una fuente real antes de la migración final y repetir el perfilado. |
| Duplicados y huérfanos | Perfil sintético reprodujo duplicados de follows/likes/arrays y referencias huérfanas. | Riesgo de fallos o pérdida de relaciones durante ETL. | Validaciones, reporte de excepciones y reconciliación en fase 2. |
| Autorización legacy insuficiente | Usuarios autenticados pueden operar recursos ajenos; `mod` no es operativo. | Riesgo de acceso indebido. | Aplicar autorización por rol, propiedad y ámbito desde fase 1. |
| Datos sensibles | `password_hint` existe en texto plano en el legacy. | Exposición o migración indebida de información sensible. | No migrar `password_hint`; conservar solo hashes compatibles o exigir restablecimiento. |
| Infraestructura legacy local | Compose original no inyectaba entorno ni persistía MongoDB. | Entornos no reproducibles. | Configuración local corregida; definir despliegue objetivo en fase 1. |

## Criterios de cierre de fase 0

- [x] Alcance de primera versión documentado.
- [x] Exclusiones explícitas documentadas.
- [x] Matriz de roles y permisos aprobada.
- [x] Inventario de datos y riesgos documentado, con la limitación explícita de que el perfilado fue sintético.
- [x] Aprobación final del usuario para cerrar fase 0 e iniciar fase 1 (2026-07-26).
