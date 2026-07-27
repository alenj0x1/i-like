# Descubrimiento verificable

## Línea base

Registrar rama, estado de Git, historial relevante, estructura de directorios, dependencias, versiones, comandos de desarrollo, pruebas, CI, contenedores, variables de entorno y servicios externos.

## Inventario mínimo

| Área | Evidencia a localizar |
| --- | --- |
| Interfaz | Rutas, pantallas, formularios, scripts cliente y flujos visibles. |
| API | Endpoints, métodos, validación, respuestas, errores e integraciones. |
| Dominio y datos | Entidades, colecciones o tablas, campos, relaciones, índices, duplicados y huérfanos. |
| Seguridad | Identidad, sesión, secretos, autorización por rol o recurso, entradas sensibles y auditoría. |
| Operación | Despliegue, infraestructura, copias, observabilidad, límites, CI y pruebas. |

Relacionar cada hallazgo con rutas de archivo, salida de comandos, commits o consultas reproducibles. Distinguir siempre hechos, riesgos y propuestas.

## Datos legacy

Confirmar si existe acceso seguro de solo lectura o una exportación reproducible. Perfilar conteos, nulidad, duplicados, valores inválidos y referencias huérfanas. Si no existen datos reales, documentar la limitación y la diferencia entre una prueba sintética y evidencia de producción.
