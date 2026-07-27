# Instrucciones para agentes

## Documentación de descubrimiento

- Mantén actualizado `docs/analisis.md` cada vez que descubras información nueva y verificable sobre dependencias, arquitectura, infraestructura, modelo de datos, flujos funcionales, endpoints, seguridad, deuda técnica o casos de uso.
- El documento debe reflejar el estado comprobado del repositorio. Distingue con claridad entre hechos observados, riesgos y recomendaciones.
- No sustituyas hallazgos anteriores válidos sin dejar una explicación cuando el cambio tenga impacto en la estrategia de migración.

## Registro de decisiones

- Cuando tomes una decisión sobre arquitectura, patrón, dependencia, tecnología, persistencia, autenticación, despliegue o estrategia de migración, agrega una entrada en `docs/decitions.md` antes de finalizar la tarea.
- Usa el formato: fecha, estado, contexto, decisión, consecuencias y alternativas consideradas.
- No registres como decisión una hipótesis o recomendación que todavía requiera aprobación del usuario; márcala como propuesta en `docs/analisis.md` hasta que sea confirmada.

## Ejecución del plan de migración

- `docs/migration-plan.md` es un documento vivo. Actualízalo durante la ejecución de la migración para reflejar el avance, cambios de alcance, hallazgos, dependencias y criterios de finalización alcanzados.
- Ejecuta las fases en el orden definido. No inicies ni declares completada una fase posterior hasta que el criterio de finalización de la fase actual se haya alcanzado y verificado.
- Si surge cualquier problema, bloqueo, desviación, riesgo nuevo o percance que impida cumplir el plan o sus criterios de finalización, informa inmediatamente al usuario con evidencia concreta y el impacto. Detén las decisiones que dependan de ese asunto hasta recibir dirección.
- Cuando el problema requiera una decisión sobre arquitectura, patrón, dependencia, tecnología, alcance, datos o estrategia, registra la decisión confirmada en `docs/decitions.md`.

## Tablero de trabajo

- `docs/tasks.md` es el tablero de trabajo vivo y la fuente de continuidad entre sesiones y agentes.
- Antes de iniciar una tarea, regístrala o actualízala en `docs/tasks.md` con estado `Pendiente`, `En progreso`, `Bloqueada` o `Completada`.
- Mantén el tablero actualizado durante la ejecución: registra bloqueos, dependencias, resultados relevantes y el siguiente paso cuando ayude a retomar el trabajo.
- Nunca borres una tarea completada. Conserva su historial y cambia únicamente su estado a `Completada`, incluyendo la fecha y evidencia o resultado de finalización.
- Al finalizar una sesión o tarea, asegúrate de que el estado del tablero represente con precisión el trabajo realizado y el trabajo restante.

## Convenciones

- Redacta la documentación en español.
- Conserva los documentos en Markdown.
- Antes de editar, respeta cualquier cambio existente del usuario y evita sobrescribir secciones no relacionadas.
