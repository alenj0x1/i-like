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
| T-001 | Completada | Ejecutar Fase 0: descubrimiento y congelación de alcance de la migración. | Requiere completar y validar T-004 a T-010. | Completada el 2026-07-26: alcance, exclusiones, permisos y riesgos consolidados y aprobados en `docs/v1-scope.md`. |
| T-002 | Completada | Crear rama `development` y versionar la documentación de migración. | Ninguna. | Completada el 2026-07-26: rama creada y documentación confirmada en el commit `046ccf5`. |
| T-003 | Completada | Publicar la rama `development` en el remoto. | Requiere remoto Git configurado y acceso de publicación. | Completada el 2026-07-26: `development` publicada en `origin` y configurada para seguir `origin/development`. |
| T-004 | Completada | Inventariar rutas, vistas, scripts, modelos y dependencias del legacy, indicando su función y ubicación. | Ninguna. | Completada el 2026-07-26: inventario estático verificable incorporado en `docs/analisis.md`. |
| T-005 | Completada | Mapear los flujos legacy de likes, favoritos, compartidos, comentarios, soporte y reportes; clasificar cada uno como conservar, corregir, descartar o incompleto. | Requiere inventario de T-004 y validación de negocio. | Completada el 2026-07-26: incluidos likes, comentarios y reportes; pospuestos favoritos, compartidos y soporte; moderación funcional aprobada. |
| T-006 | Completada | Documentar actores, roles actuales y reglas de autorización observadas; preparar matriz de permisos y propiedad por recurso para aprobación. | Requiere T-004 y validación de negocio. | Completada el 2026-07-26: aprobada matriz con moderación por espacio, moderadores globales y lectura pública. |
| T-007 | Completada | Definir con negocio las políticas de borrado, retención y visibilidad aplicables a usuarios, contenido, relaciones y reportes. | Requiere T-006 y decisión de negocio. | Completada el 2026-07-26: recuperación de 30 días, anonimización, purga de relaciones y retención de auditoría aprobadas. |
| T-008 | Completada | Perfilar los datos legacy: colecciones o tablas, volumen, campos, relaciones, duplicados, registros inválidos y referencias huérfanas. | Datos sintéticos aprobados; no hay acceso a datos legacy reales. | Completada el 2026-07-26: perfilado sintético validó conteos, duplicados y referencias huérfanas; datos reales siguen siendo un riesgo abierto. |
| T-009 | Completada | Elaborar catálogo de requisitos funcionales y no funcionales de la primera versión migrada, con fuente, prioridad y criterio de aceptación. | Requiere resultados de T-005 a T-008 y validación de negocio. | Completada el 2026-07-26: catálogo inicial aprobado; notificaciones excluidas y métricas cuantificadas diferidas a fase 1. |
| T-010 | Completada | Consolidar y someter a aprobación el alcance de la primera versión, las exclusiones explícitas, la matriz de permisos y los riesgos de datos. | Requiere completar T-004 a T-009 y aprobación de negocio. | Completada el 2026-07-26: expediente `docs/v1-scope.md` aprobado por el usuario. |
| T-011 | Completada | Establecer el registro de ejecuciones por sesión de agente. | Ninguna. | Completada el 2026-07-26: creada la estructura inicial y añadida la regla obligatoria en `AGENTS.md`. |
| T-012 | Completada | Precisar la creación, continuación y metadatos de los registros de sesión. | Ninguna. | Completada el 2026-07-26: `AGENTS.md` exige crear o retomar el archivo correspondiente y define sus metadatos mínimos. |
| T-013 | Completada | Precisar que los registros son individuales por sesión y deben permitir la continuidad entre agentes. | Ninguna. | Completada el 2026-07-26: `AGENTS.md` exige un archivo por sesión y registros autosuficientes para su continuación. |
| T-014 | Completada | Establecer y publicar las convenciones de commits y descripciones. | Ninguna. | Completada el 2026-07-26: convenciones publicadas en `origin/development` mediante el commit `9c8e3c6`. |
| T-015 | Completada | Establecer el protocolo de comunicación ante bloqueos y decisiones. | Ninguna. | Completada el 2026-07-26: `AGENTS.md` exige contexto, evidencia, impacto, ejemplos y alternativas antes de pedir dirección. |
| T-016 | Completada | Configurar el entorno local con MongoDB en Docker y servidor ejecutado con Yarn. | Requiere Docker, Yarn y `.env` local. | Completada el 2026-07-26: MongoDB persiste en Docker; `yarn dev` conecta y crea el administrador inicial. |
| T-017 | Completada | Reconstruir el flujo histórico del proyecto y extraer un proceso reutilizable para una skill de migración. | Requirió revisar commits, documentación y configuración actuales. | Completada el 2026-07-26: flujo histórico, método de gobernanza, guardas, contrato documental y borrador de skill registrados en `docs/migration-skill-extraction.md`. |
| T-018 | Completada | Implementar la skill instalable derivada de `docs/migration-skill-extraction.md`. | Decisiones confirmadas el 2026-07-26: alcance genérico, español y ubicación dentro del repositorio. | Completada el 2026-07-26: creada `.agents/skills/migration-governance` con flujo, referencias, plantillas y validación oficial satisfactoria. |

## Historial de tareas

Las tareas completadas permanecen en la tabla principal con estado `Completada`. Agregar aquí únicamente notas cronológicas relevantes cuando faciliten la continuidad.

- 2026-07-26: Fase 0 desglosada en T-004 a T-010 para revisión; no se ha iniciado su ejecución ni se han realizado cambios de código.
- 2026-07-26: Se estableció `docs/executions/<DD-MM-AAAA>/` para registros separados por sesión y agente.
- 2026-07-26: Se precisó la regla de creación o continuación de archivos de sesión y sus metadatos obligatorios.
- 2026-07-26: Se estableció que cada archivo representa una sesión individual y debe permitir la continuación por otro agente.
- 2026-07-26: Se añadieron convenciones de commits y descripciones; publicadas en `origin/development` mediante `9c8e3c6`.
- 2026-07-26: T-004 completada con inventario estático del legacy; T-005 bloqueada hasta contar con validación de negocio sobre los flujos incompletos.
- 2026-07-26: Se incorporó el protocolo de explicación y discusión ante bloqueos o decisiones en `AGENTS.md`.
- 2026-07-26: T-005 completada: se aprobó incluir likes, comentarios y reportes, posponer favoritos, compartidos y soporte, y habilitar moderación separada de administración.
- 2026-07-26: T-006 completada: se aprobó propiedad con moderación local, moderación global de reportes y consulta pública de contenido comunitario.
- 2026-07-26: T-007 completada: se aprobaron borrado lógico recuperable, anonimización de contenido y retención de evidencia de moderación.
- 2026-07-26: T-008 bloqueada: no hay acceso de solo lectura ni exportación de datos legacy para ejecutar perfilado empírico.
- 2026-07-26: Se verificó que Docker Compose crea una instancia MongoDB vacía; la falta de inyección de variables impide inicializar datos de aplicación y no desbloquea T-008.
- 2026-07-26: Se inició T-016 para separar MongoDB en Docker del servidor local ejecutado con Yarn.
- 2026-07-26: T-016 completada: verificados MongoDB en Docker y servidor local con Yarn, incluida la creación del administrador inicial.
- 2026-07-26: T-008 se reanudó con datos sintéticos aprobados, al no disponer de base ni exportación legacy.
- 2026-07-26: T-008 completada con un perfilado sintético reproducible; T-009 iniciada para consolidar requisitos de la primera versión.
- 2026-07-26: T-009 completada: catálogo inicial aprobado, notificaciones excluidas y objetivos cuantificados de rendimiento diferidos a fase 1; T-010 iniciada.
- 2026-07-26: T-010 y T-001 completadas: el usuario aprobó el expediente de alcance y cerró la fase 0.
- 2026-07-26: T-018 bloqueada: la implementación de la skill requiere confirmar si será genérica o especializada, el idioma de las plantillas y el directorio de instalación.
- 2026-07-26: T-018 reanudada: el usuario confirmó una skill genérica para migraciones, en español y dentro del repositorio.
- 2026-07-26: T-018 completada: `migration-governance` creada en `.agents/skills/`; `quick_validate.py` confirmó que la skill es válida.
