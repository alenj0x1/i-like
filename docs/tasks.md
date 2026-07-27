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
| T-001 | Pendiente | Ejecutar Fase 0: descubrimiento y congelación de alcance de la migración. | Requiere validación funcional y decisiones de negocio. | Confirmar alcance, matriz de roles y funcionalidades incompletas. |
| T-002 | Completada | Crear rama `development` y versionar la documentación de migración. | Ninguna. | Completada el 2026-07-26: rama creada y documentación confirmada en el commit `046ccf5`. |
| T-003 | En progreso | Publicar la rama `development` en el remoto. | Requiere remoto Git configurado y acceso de publicación. | Verificar remoto y ejecutar `git push -u origin development`. |

## Historial de tareas

Las tareas completadas permanecen en la tabla principal con estado `Completada`. Agregar aquí únicamente notas cronológicas relevantes cuando faciliten la continuidad.
