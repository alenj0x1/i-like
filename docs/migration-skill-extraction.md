# Extracción de flujo para una skill de migración

## Propósito

Convertir el flujo comprobado de `i-like` en una skill reutilizable para migrar aplicaciones legacy y organizar la documentación y el trabajo de agentes. Este documento es un borrador de diseño: no crea ni instala una skill, ni convierte las decisiones específicas de `i-like` en decisiones universales.

## Evidencia de origen

- Historial Git visible: 72 commits, desde `1447a5c` (2023-12-28) hasta `35c1182` (2026-07-26), sin etiquetas Git.
- Ramas: `main` conserva el legacy hasta `90c5360`; `development` contiene el proceso de migración y la fase 0 cerrada.
- Fuentes de proceso: `AGENTS.md`, `docs/tasks.md`, `docs/analisis.md`, `docs/decitions.md`, `docs/migration-plan.md`, `docs/requirements.md`, `docs/v1-scope.md` y los registros de `docs/executions/`.

## Flujo del producto legacy observado

| Etapa | Periodo | Evidencia representativa | Resultado funcional |
| --- | --- | --- | --- |
| Base web y datos | 28-12-2023 | `1fec868`, `9369648`, `ad12b00` | Express, Pug, ruta inicial y MongoDB. |
| Experiencia pública | 28-29-12-2023 | `5b42492`, `79bf00b`, `1c1122b`, `cfb0830` | Portada adaptable, login, registro y estilo de marca. |
| Identidad y sesión | 30-31-12-2023 | `1f3f949`, `48456c9`, `ab7f4a2`, `304f835`, `f04ba5a` | Usuario, contraseña, JWT, autenticación y logout. |
| Administración y sanciones | 01-05-01-2024 | `13ad9b7` a `c56c0ef` | Back-office, usuarios, sanciones y restricciones administrativas. |
| Comunidad y contenido | 07-16-01-2024 | `99c1273` a `afeb057` | Temas, espacios, redacción, posts y vistas de detalle. |
| Perfil y grafo social | 16-26-01-2024 | `eb0f452` a `218bf22` | Perfil, ajustes, privacidad, follows y configuración de espacios. |
| Correcciones | 03-2024 | `d589953` | Corrección de contraste según color configurado. |
| Operación local | 09-2024 | `7c5abd3`, `90c5360` | Docker, variables de entorno y MongoDB local. |

### Patrón deducido

El legacy creció por verticales funcionales: cada capacidad combinaba rutas, modelo, librerías, vistas, JavaScript y CSS. Es una observación útil para descubrir comportamiento, no una receta de implementación para el destino. Sus límites comprobados son la falta de pruebas automatizadas, OpenAPI, CI y separación API/cliente.

## Flujo de migración y organización observado

| Paso | Artefacto de control | Regla comprobada | Salida verificable |
| --- | --- | --- | --- |
| 1. Preparar gobernanza | `AGENTS.md` | Antes de trabajar se registra tarea y sesión. | Archivo de sesión con metadatos y tablero actualizado. |
| 2. Inventariar | `docs/analisis.md` | Se documentan hechos, riesgos y propuestas por separado. | Arquitectura, dependencias, rutas, datos, flujos y deuda conocidos. |
| 3. Planificar | `docs/migration-plan.md` | Fases ordenadas, alcance y criterio de cierre. | Dependencias y condiciones de avance explícitas. |
| 4. Validar negocio | `docs/decitions.md`, `docs/v1-scope.md` | No se asumen alcance, permisos, retención ni estrategia. | Decisiones aceptadas y exclusiones explícitas. |
| 5. Convertir a entrega | `docs/requirements.md` | Cada capacidad aprobada se expresa con fuente y aceptación. | Backlog verificable de requisitos funcionales y no funcionales. |
| 6. Ejecutar por fase | Tablero, plan y sesión | No se inicia una fase posterior sin el cierre comprobado de la actual. | Estado, evidencia, riesgos y siguiente paso actualizados. |
| 7. Tratar bloqueos | Análisis, tablero, sesión y decisiones | Se informa evidencia, impacto y alternativas; se detienen decisiones dependientes. | Bloqueo trazable o decisión confirmada. |
| 8. Validar y publicar | Sesión y Git | Se revisa alcance del diff antes de commit y se registra publicación. | Verificación, hash, rama y remoto documentados. |

## Componentes reutilizables de la skill propuesta

### Entradas mínimas

- Repositorio legacy y acceso de lectura a Git.
- Objetivo de migración, destino tecnológico o la indicación de que aún debe decidirse.
- Personas autorizadas para validar alcance, datos, seguridad y despliegue.
- Disponibilidad de datos legacy o declaración explícita de su ausencia.

### Contrato de documentación

| Archivo | Responsabilidad | Regla |
| --- | --- | --- |
| `AGENTS.md` | Normas de trabajo, continuidad, bloqueo y commits. | Debe ser específico del repositorio y no imponer decisiones de producto. |
| `docs/analisis.md` | Hechos observados, riesgos y propuestas no aprobadas. | Cada hallazgo debe citar evidencia local. |
| `docs/tasks.md` | Estado operativo y dependencias. | Registrar antes de iniciar; conservar tareas completadas. |
| `docs/migration-plan.md` | Fases, dependencias, objetivos y criterios de cierre. | Actualizar durante ejecución, sin saltar fases. |
| `docs/decitions.md` | Decisiones confirmadas. | Fecha, estado, contexto, decisión, consecuencias y alternativas. |
| `docs/requirements.md` | Requisitos con fuente, prioridad y aceptación. | Solo compromisos aprobados; marcar propuestas como tales. |
| `docs/v1-scope.md` | Expediente de aprobación de una versión. | Incluye alcance, exclusiones, permisos y riesgos. |
| `docs/executions/<fecha>/<sesion>.md` | Bitácora autosuficiente por sesión. | Metadatos, proceso, evidencias, cambios, decisiones, validaciones y continuación. |

### Algoritmo operativo sugerido

1. Detectar `AGENTS.md` y documentación existente. No sobrescribir cambios ajenos; complementar el esquema que el repositorio ya tenga.
2. Crear o retomar la bitácora de sesión y registrar la tarea como `En progreso`.
3. Capturar una línea base: rama, estado de trabajo, historial, tecnologías, ejecución, infraestructura y estructura del código.
4. Inventariar rutas/endpoints, UI, modelos, persistencia, autenticación, autorizaciones, flujos, integraciones, datos sensibles, pruebas y automatización.
5. Clasificar cada hallazgo como hecho, riesgo o propuesta. Nunca promover una propuesta a decisión sin confirmación.
6. Diseñar el plan de migración en fases por capacidades de negocio, con dependencias y criterio objetivo de salida. Ajustar las fases al dominio, no copiar las de `i-like` literalmente.
7. Identificar decisiones bloqueantes: alcance, datos, modelo destino, seguridad, autorización, retención, despliegue, reversión y criterios no funcionales.
8. Exponer cada bloqueo con evidencia, impacto y alternativas. Esperar confirmación cuando la elección cambie producto, arquitectura, datos o seguridad.
9. Tras la aprobación, registrar la decisión y derivar requisitos con criterios de aceptación trazables.
10. Ejecutar una sola fase a la vez; validar la salida con pruebas, conciliación de datos, revisión de seguridad u operación según corresponda.
11. Cerrar la tarea y la sesión con el estado real, los comandos/validaciones realizados y el siguiente paso. Antes de commit, revisar `git status` y diff; no incluir cambios ajenos.

### Guardas obligatorias

- Si no hay datos legacy reales, documentarlo como riesgo: datos sintéticos validan el proceso, no el volumen o calidad de producción.
- Si la migración es de autenticación, datos o infraestructura, no inferir políticas de seguridad, retención ni reversión.
- No anunciar una fase como completada sin la evidencia indicada por su criterio de cierre.
- No mezclar descubrimiento técnico con aprobación de negocio: la ausencia de implementación no prueba que una función deba descartarse.
- Mantener el legacy como referencia durante la migración, evitando doble escritura prolongada salvo decisión explícita.

## Borrador de activación de la skill

**Nombre sugerido:** `migration-governance`

**Descripción sugerida:**

> Organiza y ejecuta migraciones de proyectos legacy con descubrimiento verificable, fases con criterios de cierre, trazabilidad de decisiones, requisitos, riesgos, tareas y registros de sesión. Use when the user asks to migrate, modernize, replace, extract, or document a legacy application, or to establish migration governance and AGENTS.md workflows.

## Estructura propuesta

```text
migration-governance/
├── SKILL.md                 # Flujo breve y guardas operativas
├── references/
│   ├── documentation.md     # Plantillas de los documentos
│   ├── discovery.md         # Inventario y evidencias por tecnología
│   └── phase-gates.md       # Criterios de fase y validaciones
└── templates/
    ├── AGENTS.md
    ├── task-board.md
    ├── session-log.md
    ├── decision-log.md
    └── migration-plan.md
```

## Preguntas que la skill debe hacer solo cuando bloqueen

1. ¿Cuál es el destino de la migración y qué decisiones ya están aprobadas?
2. ¿Existe acceso seguro de solo lectura a datos legacy o una exportación reproducible?
3. ¿Quién puede aprobar alcance, seguridad, retención y corte?
4. ¿Qué límite de riesgo, disponibilidad y reversión exige el proyecto?

La skill debe descubrir las respuestas ya presentes en el repositorio antes de preguntar.

## Validación de este borrador

- Las etapas del legacy proceden de `git log --reverse` y de los archivos cambiados por commit.
- Las reglas de gobernanza proceden de `AGENTS.md` y de los documentos creados en los commits `c0819f4` a `35c1182`.
- La estructura sigue el principio de divulgación progresiva: el futuro `SKILL.md` debe contener el algoritmo corto; plantillas y criterios detallados irán en referencias de un nivel.

## Decisión de implementación

El 2026-07-26 se confirmó crear `migration-governance` como una skill genérica para cualquier migración, con instrucciones y plantillas en español, versionada dentro del repositorio en `.agents/skills/`. La decisión se registró en `docs/decitions.md`; la skill no impondrá la arquitectura ni el destino tecnológico de `i-like`.

## Implementación verificada

La skill se creó en `.agents/skills/migration-governance` con `SKILL.md`, metadatos de interfaz, referencias para descubrimiento, compuertas y documentación, y plantillas adaptables. El 2026-07-26 se ejecutó `quick_validate.py` con resultado satisfactorio.
