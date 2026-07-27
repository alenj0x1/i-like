# Fases, bloqueos y validación

## Diseño de fases

Definir para cada fase: objetivo, alcance, dependencias, decisiones requeridas, riesgos, salida verificable y responsable de aprobación. Organizar por capacidades de negocio, no por capas técnicas aisladas.

## Compuertas comunes

| Fase | Salida mínima verificable |
| --- | --- |
| Descubrimiento | Inventario, riesgos de datos y alcance con exclusiones aprobados. |
| Fundaciones | Entornos ejecutables, contrato básico, seguridad inicial, pruebas y observabilidad verificadas. |
| Datos | Modelo destino aprobado, transformación repetible y conciliación documentada. |
| Vertical funcional | Flujo completo, autorización, pruebas y criterios de aceptación cumplidos. |
| Corte | Reconciliación, recuperación, monitoreo y reversión aprobados. |

## Bloqueos

Al detectar un bloqueo, registrar: evidencia, impacto, alcance afectado, alternativas, responsable de decidir y siguiente acción. No continuar decisiones dependientes. Cuando se resuelva, registrar la decisión confirmada y actualizar plan, tablero y bitácora.
