# Tablero de trabajo

Este documento es el tablero de trabajo vivo del proyecto. Permite mantener continuidad entre sesiones y agentes.

## Convenciones

- Estados válidos: `Pendiente`, `En progreso`, `Bloqueada`, `Completada`.
- No se eliminan tareas completadas; se conserva su historial y se actualiza el estado.
- Cada tarea debe indicar, cuando aplique, responsable, fecha, dependencia, bloqueo, resultado y siguiente paso.
- Actualizar el tablero antes de iniciar trabajo, durante la ejecución cuando cambie el estado y al cerrar una tarea.

## Tareas

| ID | Estado | Tarea | Dependencias / bloqueo | Resultado o siguiente paso |
| --- | --- | --- | --- | --- |
| T-001 | Pendiente | Ejecutar Fase 0: descubrimiento y congelación de alcance de la migración. | Requiere completar y validar T-004 a T-010. | Fase desglosada el 2026-07-26; pendiente de revisión y autorización para iniciar. |
| T-002 | Completada | Crear rama `development` y versionar la documentación de migración. | Ninguna. | Completada el 2026-07-26: rama creada y documentación confirmada en el commit `046ccf5`. |
| T-003 | Completada | Publicar la rama `development` en el remoto. | Requiere remoto Git configurado y acceso de publicación. | Completada el 2026-07-26: `development` publicada en `origin` y configurada para seguir `origin/development`. |
| T-004 | Pendiente | Inventariar rutas, vistas, scripts, modelos y dependencias del legacy, indicando su función y ubicación. | Ninguna. | Producir inventario técnico verificable para contrastarlo con los flujos de negocio. |
| T-005 | Pendiente | Mapear los flujos legacy de likes, favoritos, compartidos, comentarios, soporte y reportes; clasificar cada uno como conservar, corregir, descartar o incompleto. | Requiere inventario de T-004 y validación de negocio. | Obtener catálogo de flujos y discrepancias funcionales para decisión de alcance. |
| T-006 | Pendiente | Documentar actores, roles actuales y reglas de autorización observadas; preparar matriz de permisos y propiedad por recurso para aprobación. | Requiere T-004 y validación de negocio. | Matriz propuesta que cubra creación, lectura, edición, moderación y borrado. |
| T-007 | Pendiente | Definir con negocio las políticas de borrado, retención y visibilidad aplicables a usuarios, contenido, relaciones y reportes. | Requiere T-006 y decisión de negocio. | Políticas aprobables que resuelvan borrado lógico/físico, responsables y excepciones. |
| T-008 | Pendiente | Perfilar los datos legacy: colecciones o tablas, volumen, campos, relaciones, duplicados, registros inválidos y referencias huérfanas. | Requiere acceso de solo lectura a los datos legacy o exportación representativa. | Inventario de datos y riesgos iniciales de migración documentados. |
| T-009 | Pendiente | Elaborar catálogo de requisitos funcionales y no funcionales de la primera versión migrada, con fuente, prioridad y criterio de aceptación. | Requiere resultados de T-005 a T-008 y validación de negocio. | Base trazable para contratos API, pruebas y planificación de fases posteriores. |
| T-010 | Pendiente | Consolidar y someter a aprobación el alcance de la primera versión, las exclusiones explícitas, la matriz de permisos y los riesgos de datos. | Requiere completar T-004 a T-009 y aprobación de negocio. | Cerrar Fase 0 solo tras evidencia de aprobación de sus cuatro criterios de finalización. |
| T-011 | Completada | Establecer el registro de ejecuciones por sesión de agente. | Ninguna. | Completada el 2026-07-26: creada la estructura inicial y añadida la regla obligatoria en `AGENTS.md`. |
| T-012 | Completada | Precisar la creación, continuación y metadatos de los registros de sesión. | Ninguna. | Completada el 2026-07-26: `AGENTS.md` exige crear o retomar el archivo correspondiente y define sus metadatos mínimos. |
| T-013 | Completada | Precisar que los registros son individuales por sesión y deben permitir la continuidad entre agentes. | Ninguna. | Completada el 2026-07-26: `AGENTS.md` exige un archivo por sesión y registros autosuficientes para su continuación. |
| T-014 | En progreso | Establecer y publicar las convenciones de commits y descripciones. | Ninguna; se publicará mediante Git directo en `origin/development`. | Convención añadida a `AGENTS.md`; pendiente de crear el commit y confirmar la subida. |

## Historial de tareas

Las tareas completadas permanecen en la tabla principal con estado `Completada`. Agregar aquí únicamente notas cronológicas relevantes cuando faciliten la continuidad.

- 2026-07-26: Fase 0 desglosada en T-004 a T-010 para revisión; no se ha iniciado su ejecución ni se han realizado cambios de código.
- 2026-07-26: Se estableció `docs/executions/<DD-MM-AAAA>/` para registros separados por sesión y agente.
- 2026-07-26: Se precisó la regla de creación o continuación de archivos de sesión y sus metadatos obligatorios.
- 2026-07-26: Se estableció que cada archivo representa una sesión individual y debe permitir la continuación por otro agente.
- 2026-07-26: Se añadieron convenciones de commits y descripciones; publicación en curso mediante Git directo.
