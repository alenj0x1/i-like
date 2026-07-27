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

## Registro de ejecuciones por sesión

- Cada archivo en `docs/executions/<DD-MM-AAAA>/` corresponde a una sesión individual de un agente; la carpeta agrupa las sesiones por fecha local. El archivo debe usar un nombre descriptivo en minúsculas y con guiones (por ejemplo, `inventario-legacy.md`).
- Al iniciar una sesión, cada agente debe localizar el archivo que corresponda a esa misma sesión. Si no existe, debe crearlo antes de realizar trabajo; si corresponde a una sesión previa retomada, debe editar y continuar el archivo existente.
- Todo archivo de sesión debe iniciar con metadatos: fecha, agente, título o tema, estado, objetivo, alcance, tareas relacionadas y referencias a sesiones previas cuando aplique. Los metadatos deben permitir identificar el trabajo sin leer el resto del documento.
- Actualiza ese archivo durante la sesión. Debe registrar el objetivo y alcance, proceso realizado, hallazgos, problemas o bloqueos, detalle de la implementación, archivos o cambios efectuados, decisiones y alternativas, soluciones aplicadas, verificaciones y trabajo pendiente.
- Registra únicamente hechos comprobados. Distingue claramente las decisiones confirmadas de las propuestas que requieran aprobación del usuario.
- No sobrescribas ni elimines registros de otras sesiones o agentes. Si una sesión retoma trabajo previo, crea su propio archivo y enlaza o referencia el registro anterior cuando sea útil.
- Antes de finalizar la sesión, deja el registro actualizado con el estado real del trabajo, incluidos bloqueos y próximos pasos.
- Cada registro debe ser autosuficiente para que cualquier otro agente pueda continuar el trabajo sin depender de la conversación previa: debe indicar el contexto, estado alcanzado, evidencia, archivos relevantes, decisiones, bloqueos, próximos pasos accionables y cualquier instrucción necesaria para la continuación.

## Convenciones de commits y descripciones

- Antes de crear un commit, verifica el alcance con `git status` y el diff; no incluyas cambios ajenos a la tarea o sesión actual sin autorización explícita.
- Usa mensajes de commit claros, concisos y en imperativo, con el formato `tipo: descripción` (por ejemplo, `docs: registrar reglas de sesiones de agentes`). Los tipos admitidos son `feat`, `fix`, `docs`, `refactor`, `test`, `build`, `ci` y `chore`.
- La descripción debe explicar el resultado o propósito del cambio, no solo la acción realizada; evita mensajes genéricos como `cambios`, `actualización` o `fix`.
- Cuando se cree una descripción de pull request o entrega, incluye: qué cambió, por qué, impacto para usuario o sistema, decisiones relevantes, validaciones realizadas y bloqueos o trabajo pendiente. Debe permitir revisión y continuidad sin depender de la conversación.
- Registra en el archivo de ejecución de la sesión el hash del commit, la rama, el destino de publicación y el resultado de la subida; si no se puede publicar, documenta la causa y el siguiente paso.

## Convenciones

- Redacta la documentación en español.
- Conserva los documentos en Markdown.
- Antes de editar, respeta cualquier cambio existente del usuario y evita sobrescribir secciones no relacionadas.
