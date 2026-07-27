---
name: migration-governance
description: Organiza y ejecuta migraciones de aplicaciones legacy con descubrimiento verificable, fases con criterios de cierre, decisiones trazables, requisitos, riesgos, tareas y registros de sesión. Usar cuando se pida migrar, modernizar, reemplazar, extraer o documentar un sistema legacy, o establecer la gobernanza y documentación de una migración.
---

# Gobernanza de migraciones

## Inicio

1. Leer `AGENTS.md` y la documentación existente antes de actuar. Respetar las convenciones del repositorio; no reemplazar documentos o cambios ajenos.
2. Crear o retomar una bitácora de sesión y registrar la tarea como `En progreso` antes de investigar o modificar.
3. Capturar una línea base: rama, estado de Git, historial, estructura, tecnologías, comandos de ejecución, infraestructura y automatización.
4. Si el repositorio no tiene documentación de gobernanza, usar las plantillas de `templates/` como punto de partida y adaptarlas al proyecto. No copiar decisiones de otro proyecto.

## Descubrimiento

Inventariar comportamiento y operación antes de diseñar el destino. Consultar [references/discovery.md](references/discovery.md) para el inventario y la evidencia requerida.

Clasificar cada resultado como hecho, riesgo, propuesta o decisión confirmada. No convertir una propuesta o la ausencia de una función en una decisión de alcance.

## Planificación y decisiones

Crear un plan por capacidades de negocio completas, con dependencias y criterios de finalización objetivos. Una fase solo puede iniciar al verificar el criterio de cierre de la fase anterior, salvo una excepción aprobada y registrada.

Identificar temprano decisiones bloqueantes: alcance, destino técnico, acceso y calidad de datos, autenticación, autorización, retención, seguridad, despliegue, reversión y objetivos no funcionales. Antes de preguntar, buscar sus respuestas en el repositorio.

Si una decisión es necesaria, explicar evidencia, impacto y alternativas; detener el trabajo dependiente hasta obtener confirmación. Registrar únicamente decisiones confirmadas. Consultar [references/phase-gates.md](references/phase-gates.md) para compuertas y validaciones.

## Ejecución y cierre

1. Derivar requisitos trazables con fuente y criterios de aceptación desde el alcance aprobado.
2. Ejecutar una sola fase a la vez y actualizar tablero, plan, análisis y bitácora cuando cambie el estado.
3. Validar con pruebas, conciliación de datos, revisión de seguridad u operación según el riesgo de la fase.
4. Antes de publicar, revisar `git status` y el diff; excluir cambios ajenos. Registrar verificación, commit, rama, destino y resultado de la publicación.

Para estructura y contenido de los documentos, consultar [references/documentation.md](references/documentation.md).

## Guardas

- Tratar la ausencia de datos legacy reales como riesgo; los datos sintéticos validan el proceso, no el volumen ni la calidad de producción.
- No inferir políticas de seguridad, retención, corte o reversión.
- Mantener el legacy como referencia mientras sea necesario y evitar doble escritura prolongada sin decisión explícita.
- No declarar una fase completada sin evidencia de su criterio de cierre.
- No crear ni publicar cambios fuera del alcance autorizado.
