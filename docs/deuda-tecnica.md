# Deuda técnica

| ID | Deuda | Impacto | Prioridad | Estado | Work Item |
|---|---|---|---|---|---|
| DT-01 | Cada ruta repite `try/catch` y respuesta 500: sin manejo centralizado de errores | Mantenibilidad / inconsistencia | Media | **Resuelta** (PR-14) | AB#31 |
| DT-02 | El listado devuelve todos los incidentes, sin paginación | Rendimiento al crecer los datos | Media | **Resuelta** (PR-15) | AB#32 |
| DT-03 | Sin autenticación: `usuario` y `autor` son texto libre | Seguridad / integridad de la bitácora | Alta | Abierta | (futuro) |
| DT-04 | CORS abierto a cualquier origen (`cors()` sin lista blanca) | Seguridad | Media | Abierta | (futuro) |
| DT-05 | Esquema SQL aplicado por scripts, sin herramienta de migraciones versionadas | Evolución del esquema | Media | Abierta | (futuro) |
| DT-06 | Sin `package-lock.json` versionado: instalaciones no reproducibles | Reproducibilidad del build | Media | Abierta | (futuro) |
| DT-07 | Despliegue de release simulado (copia de artefacto) en lugar de infraestructura real | Realismo del release | Baja | Abierta | (futuro) |

Las deudas DT-01 y DT-02 se resolvieron mediante ramas `refactor/*` trazables a su Work Item.
